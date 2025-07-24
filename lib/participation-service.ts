import { supabase } from "./supabase"

/**
 * Gets the most popular events based on participant count
 * @param limit Number of events to return
 * @returns Array of events with their participant counts
 */
export async function getPopularEvents(limit = 5) {
  try {
    console.log("Fetching popular events with limit:", limit)

    // First check if event_participants table exists
    const { data: tableCheck, error: tableCheckError } = await supabase.from("event_participants").select("id").limit(1)

    // If table doesn't exist or has an error, log and return mock data
    if (tableCheckError) {
      console.error("event_participants table not accessible:", tableCheckError.message)
      return getMockPopularEvents(limit)
    }

    // Get all events first
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, title")
      .order("date", { ascending: false })
      .limit(50) // Get a reasonable number of events to check

    if (eventsError) {
      console.error("Error fetching events:", eventsError)
      return getMockPopularEvents(limit)
    }

    console.log(`Found ${events.length} events to check for participants`)

    // For each event, count participants
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        // Use count aggregation to get participant count
        const { count, error: countError } = await supabase
          .from("event_participants")
          .select("*", { count: "exact", head: true })
          .eq("event_id", event.id)

        if (countError) {
          console.error(`Error counting participants for event ${event.id}:`, countError)
          return { eventId: event.id, title: event.title, participantCount: 0 }
        }

        console.log(`Event "${event.title}" (${event.id}) has ${count} participants`)

        return {
          eventId: event.id,
          title: event.title,
          participantCount: count || 0,
        }
      }),
    )

    // Sort by participant count (highest first) and limit
    const sortedEvents = eventsWithCounts.sort((a, b) => b.participantCount - a.participantCount).slice(0, limit)

    console.log("Sorted events by participant count:", sortedEvents)

    return sortedEvents
  } catch (error) {
    console.error("Error in getPopularEvents:", error)
    return getMockPopularEvents(limit)
  }
}

/**
 * Provides mock data for popular events when the real data can't be accessed
 */
function getMockPopularEvents(limit = 5) {
  console.log("Using mock popular events data")
  const mockEvents = [
    { eventId: "mock1", title: "Basketball Tournament", participantCount: 45 },
    { eventId: "mock2", title: "Tree Planting Activity", participantCount: 38 },
    { eventId: "mock3", title: "Youth Leadership Workshop", participantCount: 32 },
    { eventId: "mock4", title: "Community Clean-up Drive", participantCount: 27 },
    { eventId: "mock5", title: "Cultural Dance Competition", participantCount: 24 },
    { eventId: "mock6", title: "Career Guidance Seminar", participantCount: 20 },
    { eventId: "mock7", title: "Art Exhibition", participantCount: 18 },
    { eventId: "mock8", title: "Coding Bootcamp", participantCount: 15 },
  ]

  return mockEvents.slice(0, limit)
}

/**
 * Gets participation statistics across different event categories
 * @returns Object with participation statistics
 */
export async function getUserParticipationData() {
  try {
    console.log("Fetching user participation data")

    // First check if event_participants table exists
    const { data: tableCheck, error: tableCheckError } = await supabase.from("event_participants").select("id").limit(1)

    // If table doesn't exist, return mock data
    if (tableCheckError) {
      console.error("event_participants table not accessible:", tableCheckError.message)
      return getMockParticipationData()
    }

    // Get total participant count
    const { count: totalCount, error: countError } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error getting total participant count:", countError)
      return getMockParticipationData()
    }

    console.log(`Total participant count: ${totalCount}`)

    // Get all events with their details
    const { data: events, error: eventsError } = await supabase.from("events").select("id, title, description")

    if (eventsError) {
      console.error("Error fetching events for categorization:", eventsError)
      return getMockParticipationData()
    }

    // Categorize events based on keywords in title/description
    const categories = {
      Sports: ["basketball", "volleyball", "sports", "tournament", "athletic", "fitness", "game"],
      Environment: ["tree", "planting", "clean", "environment", "eco", "green", "nature"],
      Education: ["workshop", "seminar", "training", "education", "learning", "school", "academic"],
      "Arts & Culture": ["art", "dance", "music", "cultural", "creative", "exhibition", "performance"],
      "Community Service": ["community", "service", "volunteer", "charity", "donation", "help"],
      Technology: ["tech", "coding", "digital", "computer", "programming", "software"],
    }

    // Count participants for each event and categorize
    const eventCategories: Record<string, number> = {}

    for (const event of events) {
      // Get participant count for this event
      const { count: eventCount, error: eventCountError } = await supabase
        .from("event_participants")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)

      if (eventCountError) {
        console.error(`Error counting participants for event ${event.id}:`, eventCountError)
        continue
      }

      // Determine category
      let eventCategory = "Other"
      const searchText = `${event.title} ${event.description}`.toLowerCase()

      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some((keyword) => searchText.includes(keyword))) {
          eventCategory = category
          break
        }
      }

      // Add to category count
      eventCategories[eventCategory] = (eventCategories[eventCategory] || 0) + (eventCount || 0)

      console.log(`Event "${event.title}" (${event.id}) has ${eventCount} participants, category: ${eventCategory}`)
    }

    // Format the results
    const formattedCategories = Object.entries(eventCategories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    console.log("Event categories with participant counts:", formattedCategories)

    return {
      totalParticipants: totalCount || 0,
      eventCategories: formattedCategories,
    }
  } catch (error) {
    console.error("Error in getUserParticipationData:", error)
    return getMockParticipationData()
  }
}

/**
 * Provides mock participation data when the real data can't be accessed
 */
function getMockParticipationData() {
  console.log("Using mock participation data")
  return {
    totalParticipants: 199,
    eventCategories: [
      { category: "Sports", count: 65 },
      { category: "Environment", count: 48 },
      { category: "Education", count: 35 },
      { category: "Community Service", count: 25 },
      { category: "Arts & Culture", count: 18 },
      { category: "Technology", count: 8 },
    ],
  }
}

/**
 * Gets detailed information about a specific event including participant count
 * @param eventId The ID of the event to get details for
 * @returns Event details with participant count
 */
export async function getEventWithParticipantCount(eventId: string) {
  try {
    console.log(`Fetching details for event ID: ${eventId}`)

    // Get event details
    const { data: event, error: eventError } = await supabase.from("events").select("*").eq("id", eventId).single()

    if (eventError) {
      console.error(`Error fetching event ${eventId}:`, eventError)
      return null
    }

    // Get participant count
    const { count: participantCount, error: countError } = await supabase
      .from("event_participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)

    if (countError) {
      console.error(`Error counting participants for event ${eventId}:`, countError)
      return { ...event, participantCount: 0 }
    }

    console.log(`Event "${event.title}" has ${participantCount} participants`)

    return {
      ...event,
      participantCount: participantCount || 0,
    }
  } catch (error) {
    console.error(`Error in getEventWithParticipantCount for event ${eventId}:`, error)
    return null
  }
}

/**
 * Gets personalized event recommendations based on user's participation history
 * @param userId The ID of the user to get recommendations for
 * @param limit Number of recommendations to return
 * @returns Array of recommended events
 */
export async function getPersonalizedEventRecommendations(userId: string, limit = 3) {
  try {
    console.log(`Fetching personalized recommendations for user ${userId}`)

    // Check if event_participants table exists
    const { data: tableCheck, error: tableCheckError } = await supabase.from("event_participants").select("id").limit(1)

    // If table doesn't exist, return mock recommendations
    if (tableCheckError) {
      console.error("event_participants table not accessible:", tableCheckError.message)
      return getMockRecommendations(limit)
    }

    // Get user's participation history
    const { data: userParticipation, error: participationError } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", userId)

    if (participationError) {
      console.error(`Error fetching participation history for user ${userId}:`, participationError)
      return getMockRecommendations(limit)
    }

    // If user hasn't participated in any events, return popular events
    if (!userParticipation || userParticipation.length === 0) {
      console.log(`User ${userId} has no participation history, returning popular events`)
      const popularEvents = await getPopularEvents(limit)
      return popularEvents.map((event) => ({
        id: event.eventId,
        title: event.title,
        description: "Popular event you might be interested in",
        date: new Date().toISOString().split("T")[0], // Today's date as fallback
        time: "10:00",
        location: "Various locations",
        image: "/placeholder.svg?height=160&width=320",
        similarity: "Popular event",
      }))
    }

    // Get the event IDs the user has participated in
    const participatedEventIds = userParticipation.map((p) => p.event_id)
    console.log(`User ${userId} has participated in ${participatedEventIds.length} events`)

    // Get details of events the user has participated in to analyze interests
    const { data: participatedEvents, error: eventsError } = await supabase
      .from("events")
      .select("id, title, description, date, time, location")
      .in("id", participatedEventIds)

    if (eventsError) {
      console.error(`Error fetching participated events for user ${userId}:`, eventsError)
      return getMockRecommendations(limit)
    }

    // Extract keywords from events the user has participated in
    const userInterests = extractKeywords(participatedEvents)
    console.log(`Extracted interests for user ${userId}:`, userInterests)

    // Get all upcoming events that the user hasn't participated in
    const today = new Date().toISOString().split("T")[0]
    const { data: upcomingEvents, error: upcomingError } = await supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .not("id", "in", `(${participatedEventIds.join(",")})`)
      .order("date", { ascending: true })

    if (upcomingError) {
      console.error(`Error fetching upcoming events:`, upcomingError)
      return getMockRecommendations(limit)
    }

    if (!upcomingEvents || upcomingEvents.length === 0) {
      console.log(`No upcoming events found, returning mock recommendations`)
      return getMockRecommendations(limit)
    }

    // Score each upcoming event based on similarity to user interests
    const scoredEvents = upcomingEvents.map((event) => {
      const eventKeywords = extractKeywordsFromEvent(event)
      const similarityScore = calculateSimilarity(userInterests, eventKeywords)

      return {
        ...event,
        similarityScore,
        similarity: getSimilarityReason(event, userInterests),
      }
    })

    // Sort by similarity score and return top recommendations
    const recommendations = scoredEvents.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit)

    console.log(`Generated ${recommendations.length} personalized recommendations for user ${userId}`)
    return recommendations
  } catch (error) {
    console.error(`Error in getPersonalizedEventRecommendations for user ${userId}:`, error)
    return getMockRecommendations(limit)
  }
}

/**
 * Extract keywords from a list of events
 */
function extractKeywords(events: any[]) {
  const keywords: Record<string, number> = {}

  // Categories and their associated keywords
  const categories = {
    Sports: ["basketball", "volleyball", "sports", "tournament", "athletic", "fitness", "game"],
    Environment: ["tree", "planting", "clean", "environment", "eco", "green", "nature"],
    Education: ["workshop", "seminar", "training", "education", "learning", "school", "academic"],
    "Arts & Culture": ["art", "dance", "music", "cultural", "creative", "exhibition", "performance"],
    "Community Service": ["community", "service", "volunteer", "charity", "donation", "help"],
    Technology: ["tech", "coding", "digital", "computer", "programming", "software"],
  }

  events.forEach((event) => {
    const text = `${event.title} ${event.description}`.toLowerCase()

    // Check for category keywords
    for (const [category, categoryKeywords] of Object.entries(categories)) {
      categoryKeywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          keywords[category] = (keywords[category] || 0) + 1
          keywords[keyword] = (keywords[keyword] || 0) + 1
        }
      })
    }

    // Extract location keywords
    if (event.location) {
      const location = event.location.toLowerCase()
      keywords[location] = (keywords[location] || 0) + 1
    }
  })

  return keywords
}

/**
 * Extract keywords from a single event
 */
function extractKeywordsFromEvent(event: any) {
  const text = `${event.title} ${event.description}`.toLowerCase()
  const keywords: Record<string, number> = {}

  // Categories and their associated keywords
  const categories = {
    Sports: ["basketball", "volleyball", "sports", "tournament", "athletic", "fitness", "game"],
    Environment: ["tree", "planting", "clean", "environment", "eco", "green", "nature"],
    Education: ["workshop", "seminar", "training", "education", "learning", "school", "academic"],
    "Arts & Culture": ["art", "dance", "music", "cultural", "creative", "exhibition", "performance"],
    "Community Service": ["community", "service", "volunteer", "charity", "donation", "help"],
    Technology: ["tech", "coding", "digital", "computer", "programming", "software"],
  }

  // Check for category keywords
  for (const [category, categoryKeywords] of Object.entries(categories)) {
    categoryKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        keywords[category] = (keywords[category] || 0) + 1
        keywords[keyword] = (keywords[keyword] || 0) + 1
      }
    })
  }

  // Extract location keywords
  if (event.location) {
    const location = event.location.toLowerCase()
    keywords[location] = (keywords[location] || 0) + 1
  }

  return keywords
}

/**
 * Calculate similarity score between user interests and event keywords
 */
function calculateSimilarity(userInterests: Record<string, number>, eventKeywords: Record<string, number>) {
  let score = 0

  // Score based on matching keywords
  for (const [keyword, count] of Object.entries(eventKeywords)) {
    if (userInterests[keyword]) {
      score += count * userInterests[keyword]
    }
  }

  return score
}

/**
 * Generate a human-readable reason for the recommendation
 */
function getSimilarityReason(event: any, userInterests: Record<string, number>) {
  // Categories to check for matches
  const categories = ["Sports", "Environment", "Education", "Arts & Culture", "Community Service", "Technology"]

  // Check if any category matches user interests
  for (const category of categories) {
    if (userInterests[category]) {
      const text = `${event.title} ${event.description}`.toLowerCase()
      const categoryKeywords = {
        Sports: ["basketball", "volleyball", "sports", "tournament", "athletic", "fitness", "game"],
        Environment: ["tree", "planting", "clean", "environment", "eco", "green", "nature"],
        Education: ["workshop", "seminar", "training", "education", "learning", "school", "academic"],
        "Arts & Culture": ["art", "dance", "music", "cultural", "creative", "exhibition", "performance"],
        "Community Service": ["community", "service", "volunteer", "charity", "donation", "help"],
        Technology: ["tech", "coding", "digital", "computer", "programming", "software"],
      }

      // Check if event contains keywords from this category
      const matchingKeywords = categoryKeywords[category as keyof typeof categoryKeywords].filter((keyword) =>
        text.includes(keyword),
      )

      if (matchingKeywords.length > 0) {
        return `Similar to your ${category.toLowerCase()} interests`
      }
    }
  }

  // Check for location match
  if (event.location && userInterests[event.location.toLowerCase()]) {
    return `At a location you've visited before`
  }

  // Default reason
  return "Based on your interests"
}

/**
 * Provides mock recommendations when real data can't be accessed
 */
function getMockRecommendations(limit = 3) {
  console.log("Using mock recommendations data")
  const mockRecommendations = [
    {
      id: "rec1",
      title: "Youth Leadership Summit",
      description: "A three-day summit focused on developing leadership skills among young people.",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      time: "09:00",
      location: "City Convention Center",
      image: "/placeholder.svg?height=160&width=320",
      similarity: "Based on your interest in education",
    },
    {
      id: "rec2",
      title: "Community Beach Cleanup",
      description: "Join us for a day of environmental conservation and community building.",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 14 days from now
      time: "07:30",
      location: "City Beach Park",
      image: "/placeholder.svg?height=160&width=320",
      similarity: "Similar to your environmental activities",
    },
    {
      id: "rec3",
      title: "Digital Skills Workshop",
      description: "Learn essential digital skills for the modern workplace.",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 21 days from now
      time: "13:00",
      location: "City Library",
      image: "/placeholder.svg?height=160&width=320",
      similarity: "Based on your interest in technology",
    },
    {
      id: "rec4",
      title: "Basketball Tournament",
      description: "Annual basketball tournament for youth teams across the city.",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
      time: "10:00",
      location: "City Sports Complex",
      image: "/placeholder.svg?height=160&width=320",
      similarity: "Similar to your sports activities",
    },
    {
      id: "rec5",
      title: "Cultural Festival",
      description: "Celebrate the diverse cultures in our community with food, music, and performances.",
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 45 days from now
      time: "16:00",
      location: "City Plaza",
      image: "/placeholder.svg?height=160&width=320",
      similarity: "Based on your interest in arts and culture",
    },
  ]

  return mockRecommendations.slice(0, limit)
}
