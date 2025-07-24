import { supabase } from "./supabase"
import { format, subDays, parseISO, isAfter, addDays, isBefore } from "date-fns"

export interface Notification {
  id: string
  user_id: string
  title: string
  content: string
  type: "event" | "announcement" | "recommendation"
  reference_id?: string
  created_at: string
  read: boolean
  image_url?: string
  action_url?: string
  metadata?: Record<string, any> // For storing additional information
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    // Get notifications from the database
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Filter out system notifications and old announcements
    const sevenDaysAgo = subDays(new Date(), 7)
    const filteredNotifications = (data || []).filter((notification) => {
      // Skip system notifications
      if (
        notification.title === "RECOMMENDATION_TRACKER" ||
        notification.type.includes("_tracker")
      ) {
        return false
      }
      // Filter out old announcements
      if (notification.type === "announcement") {
        const notificationDate = new Date(notification.created_at)
        if (isAfter(sevenDaysAgo, notificationDate)) {
          return false
        }
      }
      return true
    })
    return filteredNotifications
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    // Get all notifications
    const notifications = await getUserNotifications(userId)

    // Count unread notifications
    return notifications.filter((n) => !n.read).length
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }
}

/**
 * Create a notification for a user
 */
export async function createNotification(
  notification: Omit<Notification, "id" | "created_at">,
): Promise<Notification | null> {
  try {
    const { data, error } = await supabase.from("notifications").insert([notification]).select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

/**
 * Get user creation date
 */
export async function getUserCreationDate(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.from("users").select("created_at").eq("id", userId).single()

    if (error) throw error
    return data?.created_at || null
  } catch (error) {
    console.error("Error fetching user creation date:", error)
    return null
  }
}

/**
 * Check if a notification for a specific reference already exists
 * This helps prevent duplicate notifications
 */
async function notificationExists(userId: string, referenceId: string, type: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("reference_id", referenceId)
      .eq("type", type)

    if (error) throw error
    return (count || 0) > 0
  } catch (error) {
    console.error(`Error checking if notification exists:`, error)
    return false
  }
}

/**
 * Generate event notifications for today's events
 */
export async function generateTodayEventNotifications(userId: string): Promise<number> {
  try {
    // Get user creation date
    const userCreationDate = await getUserCreationDate(userId)
    if (!userCreationDate) return 0

    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), "yyyy-MM-dd")

    // First, get all events the user is registered for
    const { data: registrations, error: regError } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", userId)

    if (regError) throw regError

    if (!registrations || registrations.length === 0) {
      return 0 // No registrations found
    }

    // Get the event IDs the user is registered for
    const eventIds = registrations.map((reg) => reg.event_id)

    // Now fetch the actual events that are happening today
    // Only include events created after the user joined
    const { data: todayEvents, error: eventsError } = await supabase
      .from("events")
      .select("id, title, description, date, time, location, image, created_at")
      .in("id", eventIds)
      .eq("date", today)
      .gt("created_at", userCreationDate) // Only events created after user joined

    if (eventsError) throw eventsError

    let createdCount = 0

    // Create notifications for today's events
    for (const event of todayEvents || []) {
      // Skip if notification already exists to prevent duplicates
      const exists = await notificationExists(userId, event.id, "event")
      if (exists) {
        console.log(`Skipping duplicate event notification for event ${event.id}`)
        continue
      }

      // Create the notification
      const notification = {
        user_id: userId,
        title: "Event Reminder",
        content: `Your registered event "${event.title}" is happening today at ${event.time || "scheduled time"} in ${event.location || "the specified location"}.`,
        type: "event" as const,
        reference_id: event.id,
        read: false,
        image_url: event.image,
        action_url: `/dashboard/events/${event.id}`,
      }

      const created = await createNotification(notification)
      if (created) createdCount++
    }

    return createdCount
  } catch (error) {
    console.error("Error generating today event notifications:", error)
    return 0
  }
}

/**
 * Generate notifications for new announcements
 */
export async function generateAnnouncementNotifications(userId: string): Promise<number> {
  try {
    // Get user creation date to avoid notifying about announcements before user joined
    const userCreationDate = await getUserCreationDate(userId)
    if (!userCreationDate) return 0

    // Get the timestamp of the last announcement notification
    const { data: lastNotif, error: lastError } = await supabase
      .from("notifications")
      .select("created_at")
      .eq("user_id", userId)
      .eq("type", "announcement")
      .order("created_at", { ascending: false })
      .limit(1)

    // Use either the last notification date or user creation date, whichever is later
    let lastTimestamp = userCreationDate
    if (lastNotif && lastNotif.length > 0) {
      const lastNotifDate = lastNotif[0].created_at
      if (isAfter(parseISO(lastNotifDate), parseISO(userCreationDate))) {
        lastTimestamp = lastNotifDate
      }
    }

    // Calculate the cutoff date (7 days ago)
    const sevenDaysAgo = subDays(new Date(), 7).toISOString()

    // Get announcements created after the last notification or user creation
    // AND created within the last 7 days
    const { data: announcements, error: annError } = await supabase
      .from("announcements")
      .select("*")
      .gt("created_at", lastTimestamp)
      .gte("created_at", sevenDaysAgo) // Only include announcements from the last 7 days
      .order("created_at", { ascending: false })

    if (annError) throw annError

    let createdCount = 0

    // Create notifications for new announcements
    for (const announcement of announcements || []) {
      // Skip if notification already exists to prevent duplicates
      const exists = await notificationExists(userId, announcement.id, "announcement")
      if (exists) {
        console.log(`Skipping duplicate announcement notification for announcement ${announcement.id}`)
        continue
      }

      const notification = {
        user_id: userId,
        title: "New Announcement",
        content: `${announcement.title}: ${announcement.content.substring(0, 100)}${announcement.content.length > 100 ? "..." : ""}`,
        type: "announcement" as const,
        reference_id: announcement.id,
        read: false,
        action_url: `/dashboard/announcement/${announcement.id}`,
      }

      const created = await createNotification(notification)
      if (created) createdCount++
    }

    return createdCount
  } catch (error) {
    console.error("Error generating announcement notifications:", error)
    return 0
  }
}

/**
 * Check if recommendations should be generated
 */
export async function shouldGenerateRecommendations(userId: string): Promise<boolean> {
  try {
    // Look for a recommendation tracker notification
    const { data, error } = await supabase
      .from("notifications")
      .select("created_at, metadata")
      .eq("user_id", userId)
      .eq("type", "recommendation_tracker")
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) throw error

    // If we have a record, check if it's less than 5 days old
    if (data && data.length > 0) {
      // If there's a deletion date in metadata, use that instead
      if (data[0].metadata?.recommendations_deleted_at) {
        const deletionDate = new Date(data[0].metadata.recommendations_deleted_at)
        // If recommendations were deleted less than 5 days ago, don't regenerate
        const fiveDaysAfterDeletion = addDays(deletionDate, 5)
        if (new Date() < fiveDaysAfterDeletion) {
          console.log("Recommendations were deleted less than 5 days ago, not regenerating yet")
          return false
        }
        // If it's been more than 5 days since deletion, we can regenerate
        return true
      }

      // Otherwise use the creation date
      const lastDate = new Date(data[0].created_at)
      const fiveDaysAgo = subDays(new Date(), 5)
      if (lastDate > fiveDaysAgo) {
        // It's been less than 5 days since the last recommendation generation
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error checking if recommendations should be generated:", error)
    // Default to not generating if there's an error
    return false
  }
}

/**
 * Update the recommendation tracker
 */
export async function updateRecommendationTracker(userId: string, wasDeleted = false): Promise<boolean> {
  try {
    // Create a tracker notification
    const tracker = {
      user_id: userId,
      title: "RECOMMENDATION_TRACKER",
      content: "This is a system notification to track recommendation generation and deletion.",
      type: "recommendation_tracker" as any,
      read: true, // Hidden from UI
      metadata: {
        generation_date: new Date().toISOString(),
        recommendations_deleted_at: wasDeleted ? new Date().toISOString() : null,
      },
    }

    const { error } = await supabase.from("notifications").insert([tracker])

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error updating recommendation tracker:", error)
    return false
  }
}

/**
 * Get previously recommended event IDs to avoid duplicates
 */
async function getPreviouslyRecommendedEventIds(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("reference_id")
      .eq("user_id", userId)
      .eq("type", "recommendation")
      .not("reference_id", "is", null)
      .not("title", "eq", "RECOMMENDATION_TRACKER")

    if (error) throw error
    return (data || []).map((item) => item.reference_id).filter(Boolean)
  } catch (error) {
    console.error("Error getting previously recommended events:", error)
    return []
  }
}

/**
 * Generate random event recommendations (3 events every 5 days)
 */
export async function generateRecommendedEventNotifications(userId: string): Promise<number> {
  try {
    // Get user creation date to avoid recommending events before user joined
    const userCreationDate = await getUserCreationDate(userId)
    if (!userCreationDate) return 0

    // Check if we should generate recommendations
    const shouldGenerate = await shouldGenerateRecommendations(userId)
    if (!shouldGenerate) {
      return 0
    }

    // Get events the user is already registered for to avoid recommending them
    const { data: userRegistrations, error: regError } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", userId)

    if (regError) throw regError

    // Get the IDs of events the user is already registered for
    const registeredEventIds = userRegistrations?.map((reg) => reg.event_id) || []

    // Get previously recommended event IDs to avoid duplicates
    const previouslyRecommendedIds = await getPreviouslyRecommendedEventIds(userId)

    // Get all deleted event IDs for this user
    // Remove all deletion marker related functions and usages throughout the file
    // Remove all filtering and error messages related to deletion markers
    // In getUserNotifications, just return all notifications for the user, filtered for system notifications and old announcements, but do not check deletion markers

    // Combine registered, previously recommended, and deleted IDs to exclude
    const excludeEventIds = [
      ...new Set([...registeredEventIds, ...previouslyRecommendedIds]),
    ]

    // Get today's date
    const today = format(new Date(), "yyyy-MM-dd")

    // Get random upcoming events (that the user is not registered for and hasn't been recommended before)
    // Only consider events created after the user joined
    const { data: upcomingEvents, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .gte("date", today) // Only future events
      .gt("created_at", userCreationDate) // Only events created after user joined
      .not("id", "in", excludeEventIds.length > 0 ? `(${excludeEventIds.join(",")})` : "(0)")
      .order("created_at", { ascending: false }) // Get newer events first

    if (eventsError) throw eventsError

    // Shuffle the events and take the first 3
    const shuffledEvents = upcomingEvents ? [...upcomingEvents].sort(() => Math.random() - 0.5).slice(0, 3) : []

    let createdCount = 0

    // Create notifications for recommended events
    for (const event of shuffledEvents) {
      // Skip if recommendation already exists to prevent duplicates
      const exists = await notificationExists(userId, event.id, "recommendation")
      if (exists) {
        console.log(`Skipping duplicate recommendation for event ${event.id}`)
        continue
      }

      const notification = {
        user_id: userId,
        title: "Recommended Event",
        content: `We think you might be interested in "${event.title}" on ${format(new Date(event.date), "MMM d, yyyy")}.`,
        type: "recommendation" as const,
        reference_id: event.id,
        read: false,
        image_url: event.image,
        action_url: `/dashboard/events/${event.id}`,
      }

      const created = await createNotification(notification)
      if (created) createdCount++
    }

    // If we created any recommendations, update the tracker
    if (createdCount > 0) {
      await updateRecommendationTracker(userId)
    }

    return createdCount
  } catch (error) {
    console.error("Error generating recommended event notifications:", error)
    return 0
  }
}

/**
 * Generate all types of notifications for a user
 */
export async function generateAllNotifications(userId: string): Promise<number> {
  const todayCount = await generateTodayEventNotifications(userId)
  const announcementCount = await generateAnnouncementNotifications(userId)
  const recommendedCount = await generateRecommendedEventNotifications(userId)

  return todayCount + announcementCount + recommendedCount
}

/**
 * Delete a single notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    // First get the notification details
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notificationId)
      .single()

    if (fetchError) throw fetchError

    // Then delete the notification
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting notification:", error)
    return false
  }
}

/**
 * Delete multiple notifications
 */
export async function deleteMultipleNotifications(notificationIds: string[]): Promise<boolean> {
  try {
    // First get the notifications details
    const { data: notifications, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .in("id", notificationIds)

    if (fetchError) throw fetchError

    // Then delete the notifications
    const { error } = await supabase.from("notifications").delete().in("id", notificationIds)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting multiple notifications:", error)
    return false
  }
}

/**
 * Delete all notifications for a user
 */
export async function deleteAllNotifications(userId: string): Promise<boolean> {
  try {
    // First, get all notifications to process them
    const { data: notifications, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .not("title", "eq", "RECOMMENDATION_TRACKER")

    if (fetchError) throw fetchError

    // Then delete the notifications
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId)
      .not("title", "eq", "RECOMMENDATION_TRACKER")

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting all notifications:", error)
    return false
  }
}

/**
 * Delete all notifications of a specific type for a user
 */
export async function deleteNotificationsByType(userId: string, type: string): Promise<boolean> {
  try {
    // First, get all notifications of this type to process them
    const { data: notifications, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type)
      .not("title", "eq", "RECOMMENDATION_TRACKER")

    if (fetchError) throw fetchError

    // Then delete the notifications
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId)
      .eq("type", type)
      .not("title", "eq", "RECOMMENDATION_TRACKER")

    if (error) throw error
    return true
  } catch (error) {
    console.error(`Error deleting ${type} notifications:`, error)
    return false
  }
}

/**
 * Check if an announcement is expired (older than 7 days)
 */
export function isAnnouncementExpired(createdAt: string): boolean {
  const announcementDate = new Date(createdAt)
  const sevenDaysAgo = subDays(new Date(), 7)
  return isBefore(announcementDate, sevenDaysAgo)
}

export async function sendEventRemindersForTomorrow() {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yyyy = tomorrow.getFullYear()
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const dd = String(tomorrow.getDate()).padStart(2, '0')
    const tomorrowStr = `${yyyy}-${mm}-${dd}`

    // Get all events happening tomorrow
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, title, time")
      .eq("date", tomorrowStr)

    if (eventsError) throw eventsError
    if (!events || events.length === 0) return 0

    let reminderCount = 0
    for (const event of events) {
      // Get all registered users for this event
      const { data: participants, error: partError } = await supabase
        .from("event_participants")
        .select("user_id")
        .eq("event_id", event.id)
        .eq("status", "confirmed")

      if (partError) continue
      if (!participants || participants.length === 0) continue

      for (const participant of participants) {
        await createNotification({
          user_id: participant.user_id,
          title: "Event Reminder",
          content: `Reminder: ${event.title} is happening tomorrow${event.time ? ` at ${event.time}` : ""}. Don’t forget to attend!`,
          type: "event",
          reference_id: event.id,
          read: false,
          action_url: `/dashboard/events/${event.id}`,
        })
        reminderCount++
      }
    }
    return reminderCount
  } catch (error) {
    console.error("Error sending event reminders for tomorrow:", error)
    return 0
  }
}

export async function sendEventFeedbackRequests() {
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yyyy = yesterday.getFullYear()
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0')
    const dd = String(yesterday.getDate()).padStart(2, '0')
    const yesterdayStr = `${yyyy}-${mm}-${dd}`

    // Get all events that ended yesterday
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, title")
      .eq("date", yesterdayStr)

    if (eventsError) throw eventsError
    if (!events || events.length === 0) return 0

    let feedbackCount = 0
    for (const event of events) {
      // Get all registered users for this event
      const { data: participants, error: partError } = await supabase
        .from("event_participants")
        .select("user_id")
        .eq("event_id", event.id)
        .eq("status", "confirmed")

      if (partError) continue
      if (!participants || participants.length === 0) continue

      for (const participant of participants) {
        await createNotification({
          user_id: participant.user_id,
          title: `Thank You for Attending ${event.title}!`,
          content: `Please share your feedback about the event.`,
          type: "event",
          reference_id: event.id,
          read: false,
          action_url: `/dashboard/events/${event.id}/feedback`,
        })
        feedbackCount++
      }
    }
    return feedbackCount
  } catch (error) {
    console.error("Error sending event feedback requests:", error)
    return 0
  }
}
