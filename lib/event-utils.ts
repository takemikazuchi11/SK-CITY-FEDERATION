import { supabase } from "./supabase"

/**
 * Gets the current participant count for an event
 * @param eventId The ID of the event
 * @returns The number of participants registered for the event
 */
export async function getEventParticipantCount(eventId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)

    if (error) {
      console.error(`Error getting participant count for event ${eventId}:`, error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error(`Error in getEventParticipantCount for event ${eventId}:`, error)
    return 0
  }
}

/**
 * Gets all participants for an event with their user details
 * @param eventId The ID of the event
 * @returns Array of participants with user details
 */
export async function getEventParticipants(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        user_id,
        registration_date,
        status,
        users (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("event_id", eventId)
      .order("registration_date", { ascending: false })

    if (error) {
      console.error(`Error getting participants for event ${eventId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Error in getEventParticipants for event ${eventId}:`, error)
    return []
  }
}

/**
 * Gets the total number of users registered in the system
 * @returns The total number of users
 */
export async function getTotalUserCount(): Promise<number> {
  try {
    const { count, error } = await supabase.from("users").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Error getting total user count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getTotalUserCount:", error)
    return 0
  }
}

/**
 * Gets the total number of events in the system
 * @returns The total number of events
 */
export async function getTotalEventCount(): Promise<number> {
  try {
    const { count, error } = await supabase.from("events").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Error getting total event count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getTotalEventCount:", error)
    return 0
  }
}

