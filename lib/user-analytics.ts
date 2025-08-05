import { supabase } from "./supabase"

export interface UserAnalytics {
  userId: string
  totalEventsRegistered: number
  favoriteEventCategories: string[]
  averageParticipationRate: number
  lastEventDate: string | null
  upcomingRegisteredEvents: any[]
  barangayParticipation: {
    barangay: string
    eventCount: number
  } | null
  eventPreferences: {
    category: string
    count: number
  }[]
  recommendedEventTypes: string[]
}

export async function getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
  try {
    if (!userId) return null

    // Get all user's event registrations with event details
    const { data: registrations, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        event_id,
        registration_date,
        status,
        events:event_id (
          id,
          title,
          description,
          date,
          time,
          location,
          category
        )
      `)
      .eq("user_id", userId)
      .order("registration_date", { ascending: false })

    if (error) {
      console.error("Error fetching user analytics:", error)
      return null
    }

    if (!registrations || registrations.length === 0) {
      return {
        userId,
        totalEventsRegistered: 0,
        favoriteEventCategories: [],
        averageParticipationRate: 0,
        lastEventDate: null,
        upcomingRegisteredEvents: [],
        barangayParticipation: null,
        eventPreferences: [],
        recommendedEventTypes: []
      }
    }

    // Analyze event categories
    const categoryCounts: Record<string, number> = {}
    const eventTitles = registrations.map(reg => reg.events?.title?.toLowerCase() || "")
    
    // Categorize events based on keywords
    const categories = {
      "Sports & Athletics": ["basketball", "volleyball", "sports", "tournament", "athletic", "fitness", "game", "competition"],
      "Environment & Community": ["tree", "planting", "clean", "environment", "eco", "green", "nature", "community"],
      "Education & Training": ["workshop", "seminar", "training", "education", "learning", "school", "academic", "course"],
      "Arts & Culture": ["art", "dance", "music", "cultural", "creative", "exhibition", "performance", "festival"],
      "Community Service": ["community", "service", "volunteer", "charity", "donation", "help", "outreach"],
      "Technology": ["tech", "coding", "digital", "computer", "programming", "software", "innovation"],
      "Leadership": ["leadership", "youth", "development", "empowerment", "mentoring", "skills"]
    }

    eventTitles.forEach(title => {
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => title.includes(keyword))) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1
          break
        }
      }
    })

    // Get favorite categories (top 3)
    const favoriteEventCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    // Calculate participation rate (events registered vs total events available)
    const { count: totalEvents } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("date", new Date().toISOString().split('T')[0])

    const averageParticipationRate = totalEvents ? (registrations.length / totalEvents) * 100 : 0

    // Get last event date
    const lastEventDate = registrations.length > 0 && registrations[0].registration_date ? registrations[0].registration_date : null

    // Get upcoming registered events
    const upcomingRegisteredEvents = registrations
      .filter(reg => reg.events && reg.events.date && new Date(reg.events.date) > new Date())
      .slice(0, 5)

    // Get barangay participation
    const userBarangay = registrations.find(reg => reg.events?.location)?.events?.location
    let barangayParticipation = null
    if (userBarangay) {
      const { count: barangayEventCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .ilike("location", `%${userBarangay}%`)
        .gte("date", new Date().toISOString().split('T')[0])

      barangayParticipation = {
        barangay: userBarangay,
        eventCount: barangayEventCount || 0
      }
    }

    // Convert category counts to array format
    const eventPreferences = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }))

    // Generate recommended event types based on preferences
    const recommendedEventTypes = []
    if (favoriteEventCategories.includes("Sports & Athletics")) {
      recommendedEventTypes.push("Basketball tournaments", "Fitness challenges", "Team sports events")
    }
    if (favoriteEventCategories.includes("Environment & Community")) {
      recommendedEventTypes.push("Tree planting activities", "Clean-up drives", "Environmental workshops")
    }
    if (favoriteEventCategories.includes("Education & Training")) {
      recommendedEventTypes.push("Skill development workshops", "Leadership training", "Educational seminars")
    }
    if (favoriteEventCategories.includes("Arts & Culture")) {
      recommendedEventTypes.push("Cultural festivals", "Art workshops", "Music performances")
    }
    if (favoriteEventCategories.includes("Community Service")) {
      recommendedEventTypes.push("Volunteer programs", "Charity events", "Community outreach")
    }

    return {
      userId,
      totalEventsRegistered: registrations.length,
      favoriteEventCategories,
      averageParticipationRate,
      lastEventDate,
      upcomingRegisteredEvents,
      barangayParticipation,
      eventPreferences,
      recommendedEventTypes
    }

  } catch (error) {
    console.error("Error in getUserAnalytics:", error)
    return null
  }
}

export async function getPersonalizedEventRecommendations(userId: string, limit: number = 5): Promise<any[]> {
  try {
    const analytics = await getUserAnalytics(userId)
    if (!analytics || analytics.favoriteEventCategories.length === 0) {
      return []
    }

    // Get events similar to user's favorite categories
    const { data: recommendedEvents } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString().split('T')[0])
      .order("date", { ascending: true })
      .limit(limit)

    if (!recommendedEvents) return []

    // Filter and score events based on user preferences
    const scoredEvents = recommendedEvents.map(event => {
      let score = 0
      const eventTitle = event.title?.toLowerCase() || ""
      const eventDescription = event.description?.toLowerCase() || ""

      // Score based on favorite categories
      analytics.favoriteEventCategories.forEach(category => {
        const categoryKeywords = {
          "Sports & Athletics": ["basketball", "volleyball", "sports", "tournament", "athletic", "fitness"],
          "Environment & Community": ["tree", "planting", "clean", "environment", "eco", "green", "nature"],
          "Education & Training": ["workshop", "seminar", "training", "education", "learning"],
          "Arts & Culture": ["art", "dance", "music", "cultural", "creative", "exhibition"],
          "Community Service": ["community", "service", "volunteer", "charity", "donation"],
          "Technology": ["tech", "coding", "digital", "computer", "programming"],
          "Leadership": ["leadership", "youth", "development", "empowerment"]
        }

        const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || []
        keywords.forEach(keyword => {
          if (eventTitle.includes(keyword) || eventDescription.includes(keyword)) {
            score += 2
          }
        })
      })

      return { ...event, score }
    })

    // Return top scored events
    return scoredEvents
      .filter(event => event.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

  } catch (error) {
    console.error("Error in getPersonalizedEventRecommendations:", error)
    return []
  }
} 