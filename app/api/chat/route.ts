import { NextResponse } from "next/server"
import { getUpcomingEvents, getLatestAnnouncements, searchEvents, searchAnnouncements, getEventsByMonth } from "@/lib/data-service"
import { getPopularEvents, getUserParticipationData } from "@/lib/participation-service"
import { getUserAnalytics, getPersonalizedEventRecommendations } from "@/lib/user-analytics"
import type { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { message, userId, userRole, userName, userBarangay } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      console.error("Groq API key is missing")
      return NextResponse.json({ error: "Groq API key is missing" }, { status: 500 })
    }

    type EventRow = Database["public"]["Tables"]["events"]["Row"]
    type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"]

    // Fetch relevant data from Supabase based on the message
    const contextData: {
      upcomingEvents: EventRow[]
      latestAnnouncements: AnnouncementRow[]
      searchResults: {
        events: EventRow[]
        announcements: AnnouncementRow[]
      }
      popularEvents: {
        eventId: string
        title: string
        participantCount: number
      }[]
      participationStats: {
        totalParticipants: number
        eventCategories: {
          category: string
          count: number
        }[]
      }
      userData?: {
        registeredEvents: any[]
        participationHistory: any[]
        userPreferences: string[]
        barangayEvents: EventRow[]
        analytics?: any // Added for user analytics
        personalizedRecommendations?: any[] // Added for personalized recommendations
      }
      allEvents?: EventRow[] // Added for all events
      monthSpecificEvents?: {
        month: string;
        year: number;
        events: EventRow[];
      }
    } = {
      upcomingEvents: [],
      latestAnnouncements: [],
      searchResults: {
        events: [],
        announcements: [],
      },
      popularEvents: [],
      participationStats: {
        totalParticipants: 0,
        eventCategories: [],
      },
    }

    try {
      console.log("Processing chat message:", message)
      console.log("User context:", { userId, userRole, userName, userBarangay })

      // Get basic data
      const [upcomingEvents, latestAnnouncements] = await Promise.all([getUpcomingEvents(10), getLatestAnnouncements(5)])

      contextData.upcomingEvents = upcomingEvents
      contextData.latestAnnouncements = latestAnnouncements

      console.log(`Fetched ${upcomingEvents.length} upcoming events and ${latestAnnouncements.length} announcements`)

      // Also fetch all events for comprehensive context
      const { data: allEvents, error: allEventsError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false })
        .limit(20)

      if (!allEventsError && allEvents) {
        console.log(`Total events in database: ${allEvents.length}`)
        // Add all events to context for better AI understanding
        contextData.allEvents = allEvents
      }

      // If user is logged in, fetch user-specific data
      if (userId) {
        try {
          // Import the function to get user's registered events
          const { getUserRegisteredEvents } = await import("@/app/action/event-actions")
          
          // Get user's registered events
          const userEventsResult = await getUserRegisteredEvents(userId)
          if (userEventsResult.success) {
            contextData.userData = {
              registeredEvents: userEventsResult.data,
              participationHistory: userEventsResult.data,
              userPreferences: [],
              barangayEvents: []
            }

            // Analyze user preferences based on registered events
            const userEventTitles = userEventsResult.data.map((reg: any) => reg.events?.title?.toLowerCase() || "")
            const preferences = []
            
            if (userEventTitles.some(title => title.includes("basketball") || title.includes("sport"))) {
              preferences.push("sports")
            }
            if (userEventTitles.some(title => title.includes("environment") || title.includes("tree") || title.includes("clean"))) {
              preferences.push("environment")
            }
            if (userEventTitles.some(title => title.includes("workshop") || title.includes("training") || title.includes("education"))) {
              preferences.push("education")
            }
            if (userEventTitles.some(title => title.includes("art") || title.includes("culture") || title.includes("music"))) {
              preferences.push("arts & culture")
            }
            if (userEventTitles.some(title => title.includes("community") || title.includes("service") || title.includes("volunteer"))) {
              preferences.push("community service")
            }

            contextData.userData.userPreferences = preferences

            // Get events in user's barangay if available
            if (userBarangay) {
              const { data: barangayEvents } = await supabase
                .from("events")
                .select("*")
                .ilike("location", `%${userBarangay}%`)
                .gte("date", new Date().toISOString().split('T')[0])
                .order("date", { ascending: true })
                .limit(5)

              if (barangayEvents) {
                contextData.userData.barangayEvents = barangayEvents
              }
            }

            // Get detailed user analytics for better recommendations
            const userAnalytics = await getUserAnalytics(userId)
            if (userAnalytics) {
              // Add analytics data to userData
              contextData.userData.analytics = userAnalytics
              
              // Get personalized event recommendations
              const personalizedRecommendations = await getPersonalizedEventRecommendations(userId, 3)
              if (personalizedRecommendations.length > 0) {
                contextData.userData.personalizedRecommendations = personalizedRecommendations
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user-specific data:", error)
          // Continue without user data if there's an error
        }
      }

      // If the message contains keywords related to suggestions or recommendations
      const lowerMessage = message.toLowerCase()
      const needsEventSuggestions =
        lowerMessage.includes("suggest") ||
        lowerMessage.includes("idea") ||
        lowerMessage.includes("recommendation") ||
        lowerMessage.includes("new event") ||
        lowerMessage.includes("summer") ||
        lowerMessage.includes("activity")

      const needsParticipationData =
        lowerMessage.includes("popular") ||
        lowerMessage.includes("participation") ||
        lowerMessage.includes("registered") ||
        lowerMessage.includes("attending") ||
        lowerMessage.includes("interest") ||
        lowerMessage.includes("count") ||
        lowerMessage.includes("how many")

      // Always fetch popular events and participation data to ensure accurate responses
      console.log("Fetching popular events and participation data")
      const [popularEvents, participationData] = await Promise.all([getPopularEvents(5), getUserParticipationData()])

      contextData.popularEvents = popularEvents
      contextData.participationStats = participationData

      console.log(`Found ${popularEvents.length} popular events with participant counts`)
      console.log(`Total participants across all events: ${participationData.totalParticipants}`)

      // If the message contains keywords, search for relevant data
      if (
        lowerMessage.includes("event") ||
        lowerMessage.includes("activity") ||
        lowerMessage.includes("schedule") ||
        lowerMessage.includes("when") ||
        lowerMessage.includes("where")
      ) {
        // Extract potential search terms (remove common words)
        const searchTerms = message
          .replace(/[^\w\s]/gi, "")
          .split(" ")
          .filter(
            (word: string) =>
              word.length > 3 &&
              !["what", "when", "where", "which", "event", "events", "about", "tell", "know", "does", "will"].includes(
                word.toLowerCase(),
              ),
          )
          .join(" ")
          .trim()

        if (searchTerms) {
          const eventResults = await searchEvents(searchTerms)
          contextData.searchResults.events = eventResults
        }

        // Check for month-specific queries
        const monthKeywords = {
          "january": 1, "jan": 1,
          "february": 2, "feb": 2,
          "march": 3, "mar": 3,
          "april": 4, "apr": 4,
          "may": 5,
          "june": 6, "jun": 6,
          "july": 7, "jul": 7,
          "august": 8, "aug": 8,
          "september": 9, "sep": 9, "sept": 9,
          "october": 10, "oct": 10,
          "november": 11, "nov": 11,
          "december": 12, "dec": 12
        }

        for (const [monthName, monthNumber] of Object.entries(monthKeywords)) {
          if (lowerMessage.includes(monthName)) {
            const currentYear = new Date().getFullYear()
            const monthEvents = await getEventsByMonth(currentYear, monthNumber)
            if (monthEvents.length > 0) {
              contextData.monthSpecificEvents = {
                month: monthName,
                year: currentYear,
                events: monthEvents
              }
            }
            break
          }
        }
      }

      if (
        lowerMessage.includes("announcement") ||
        lowerMessage.includes("news") ||
        lowerMessage.includes("update") ||
        lowerMessage.includes("latest")
      ) {
        const searchTerms = message
          .replace(/[^\w\s]/gi, "")
          .split(" ")
          .filter(
            (word: string) =>
              word.length > 3 &&
              !["what", "when", "announcement", "announcements", "about", "tell", "know", "does", "will"].includes(
                word.toLowerCase(),
              ),
          )
          .join(" ")
          .trim()

        if (searchTerms) {
          const announcementResults = await searchAnnouncements(searchTerms)
          contextData.searchResults.announcements = announcementResults
        }
      }
    } catch (error) {
      console.error("Error fetching data from Supabase:", error)
      // Continue with the chat even if Supabase data fetching fails
    }

    // Create a context string from the data
    let contextString = ""

    // Add user-specific context if available
    if (contextData.userData && userId) {
      contextString += `Current User Information:\n`
      contextString += `Name: ${userName}\n`
      contextString += `Role: ${userRole}\n`
      if (userBarangay) {
        contextString += `Barangay: ${userBarangay}\n`
      }
      contextString += `\n`

      if (contextData.userData.registeredEvents.length > 0) {
        contextString += `User's Registered Events:\n`
        contextData.userData.registeredEvents.forEach((reg: any, index: number) => {
          const event = reg.events
          if (event && event.date) {
            contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. Registration status: ${reg.status}\n`
          }
        })
        contextString += `\n`
      }

      if (contextData.userData.userPreferences.length > 0) {
        contextString += `User's Event Preferences (based on past participation):\n`
        contextData.userData.userPreferences.forEach((pref: string, index: number) => {
          contextString += `${index + 1}. ${pref}\n`
        })
        contextString += `\n`
      }

      // Add detailed analytics if available
      if (contextData.userData.analytics) {
        const analytics = contextData.userData.analytics
        contextString += `User Analytics:\n`
        contextString += `Total events registered: ${analytics.totalEventsRegistered}\n`
        contextString += `Average participation rate: ${analytics.averageParticipationRate.toFixed(1)}%\n`
        if (analytics.favoriteEventCategories.length > 0) {
          contextString += `Favorite event categories: ${analytics.favoriteEventCategories.join(", ")}\n`
        }
        if (analytics.lastEventDate) {
          contextString += `Last event registration: ${new Date(analytics.lastEventDate).toLocaleDateString()}\n`
        }
        if (analytics.upcomingRegisteredEvents.length > 0) {
          contextString += `Upcoming registered events: ${analytics.upcomingRegisteredEvents.length}\n`
        }
        if (analytics.barangayParticipation) {
          contextString += `Events in user's barangay: ${analytics.barangayParticipation.eventCount}\n`
        }
        contextString += `\n`
      }

      // Add personalized recommendations if available
      if (contextData.userData.personalizedRecommendations && contextData.userData.personalizedRecommendations.length > 0) {
        contextString += `Personalized Event Recommendations:\n`
        contextData.userData.personalizedRecommendations.forEach((event: any, index: number) => {
          if (event.date) {
            contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location} (Score: ${event.score})\n`
          }
        })
        contextString += `\n`
      }

      if (contextData.userData.barangayEvents.length > 0) {
        contextString += `Upcoming Events in User's Barangay (${userBarangay}):\n`
        contextData.userData.barangayEvents.forEach((event: any, index: number) => {
          if (event.date) {
            contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${event.description}\n`
          }
        })
        contextString += `\n`
      }
    }

    if (contextData.upcomingEvents.length > 0) {
      contextString += "Upcoming Events:\n"
      contextData.upcomingEvents.forEach((event, index) => {
        if (event.date) {
          contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${event.description}\n`
        }
      })
      contextString += "\n"
    }

    // Add comprehensive event data if available
    if (contextData.allEvents && contextData.allEvents.length > 0) {
      contextString += "All Available Events in Database:\n"
      contextData.allEvents.forEach((event, index) => {
        if (event.date) {
          const eventDate = new Date(event.date)
          const isUpcoming = eventDate >= new Date()
          const status = isUpcoming ? "Upcoming" : "Past"
          contextString += `${index + 1}. "${event.title}" on ${eventDate.toLocaleDateString()} at ${event.location} (${status})\n`
        }
      })
      contextString += `\nTotal events in database: ${contextData.allEvents.length}\n`
      contextString += `Upcoming events: ${contextData.upcomingEvents.length}\n`
      contextString += `\n`
    }

    // Add month-specific events if available
    if (contextData.monthSpecificEvents) {
      const { month, year, events } = contextData.monthSpecificEvents
      contextString += `Events in ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}:\n`
      if (events.length > 0) {
        events.forEach((event, index) => {
          if (event.date) {
            contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${event.description}\n`
          }
        })
      } else {
        contextString += `No events found for ${month} ${year}\n`
      }
      contextString += `\n`
    }

    if (contextData.latestAnnouncements.length > 0) {
      contextString += "Latest Announcements:\n"
      contextData.latestAnnouncements.forEach((announcement, index) => {
        contextString += `${index + 1}. "${announcement.title}" by ${announcement.author}: ${announcement.content}\n`
      })
      contextString += "\n"
    }

    if (contextData.searchResults.events.length > 0) {
      contextString += "Relevant Events:\n"
      contextData.searchResults.events.forEach((event, index) => {
        if (event.date) {
          contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${event.description}\n`
        }
      })
      contextString += "\n"
    }

    if (contextData.searchResults.announcements.length > 0) {
      contextString += "Relevant Announcements:\n"
      contextData.searchResults.announcements.forEach((announcement, index) => {
        contextString += `${index + 1}. "${announcement.title}" by ${announcement.author}: ${announcement.content}\n`
      })
      contextString += "\n"
    }

    // Add participation data to context with EXACT numbers
    if (contextData.popularEvents.length > 0) {
      contextString += "Popular Events (by registration count):\n"
      contextData.popularEvents.forEach((event, index) => {
        contextString += `${index + 1}. "${event.title}" with exactly ${event.participantCount} registered participants\n`
      })
      contextString += "\n"
    }

    if (contextData.participationStats.eventCategories.length > 0) {
      contextString += "Event Category Popularity:\n"
      contextString += `Total participants across all events: ${contextData.participationStats.totalParticipants}\n`
      contextData.participationStats.eventCategories.forEach((category, index) => {
        contextString += `${index + 1}. ${category.category}: exactly ${category.count} participants\n`
      })
      contextString += "\n"
    }

    console.log("Sending request to Groq API with context data")
    const systemPrompt = `Make a simple response first then proceed with -> You are an intelligent assistant designed to recommend events and activities for SK Federation members by analyzing past events stored in the database while also generating new, relevant suggestions. Use the database as a reference to understand past participation, event themes, and user engagement, but do not rely solely on existing data. Instead, generate fresh and creative event ideas that align with previous events.

   You have three main functions:

   1. AI-Driven Event and Activity Suggestions:
      When asked for event ideas or suggestions, generate creative and relevant event concepts that align with SK Federation's goals. These should be fresh ideas but inspired by past successful events.

   2. Personalized Recommendations Based on Past Participation:
      When asked about recommendations based on participation data, analyze the popular events data provided and suggest similar or complementary events that might appeal to the same audience.

   3. Real-Time Program Adaptation Based on Interests:
      When discussing current interests, use the participation statistics to identify trends and suggest how to adapt programming to better serve member interests.

   IMPORTANT: When asked about popular events or participant counts, ALWAYS provide the EXACT numbers from the data provided. Do not say "the exact number is not available" - use the precise participant counts given in the context.

   PERSONALIZATION: If user information is provided, use it to give personalized recommendations. Reference their past event participation, preferences, and barangay-specific events when making suggestions.

   DATA AVAILABILITY: You have access to comprehensive event data from the database. Always provide information about ALL available events when asked, not just a limited subset. If asked about specific time periods (like August), check the complete event list and provide accurate information about what's available.

   You have access to the following data from the SK Federation database:
   ${contextString}
   
   Keeply reminded that do not use symbols **(word)** so it can be display as simple and easy to understand. 

   When answering questions about events or announcements:
   - Reference the specific data provided above
   - Make it simple as much as you can
   - ALWAYS provide exact participant counts when available
   - If asked about events or announcements not in the data, say you don't have that information
   - For event details, include the date, location, and description
   - For announcements, include the title and description.
   - If the user asks for more details about a specific event or announcement, suggest they visit the SK Federation website or contact the organizer
   - When suggesting new events, make them creative but relevant to the SK Federation's mission and past successful events
   - If user data is available, provide personalized recommendations based on their event history and preferences
   - When asked about specific months or time periods, check ALL available events and provide comprehensive information about what's available in that timeframe`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      // Check for rate limit error
      if (errorText.includes('Rate limit reached')) {
        return NextResponse.json({
          error: 'The AI is currently busy. Please slow down and try your request again in a few seconds.'
        }, { status: 429 })
      }
      console.error(`Groq API error (${response.status}):`, errorText)
      try {
        const errorJson = JSON.parse(errorText)
        return NextResponse.json(
          { error: errorJson.error?.message || `Groq API error: ${response.statusText}` },
          { status: response.status },
        )
      } catch {
        return NextResponse.json({ error: `Groq API error: ${errorText}` }, { status: response.status })
      }
    }

    const data = await response.json()
    console.log("Received response from Groq API")

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq API")
    }

    // Format the response by ensuring proper line breaks
    const formattedResponse = data.choices[0].message.content
      .replace(/\n\n+/g, "\n\n") // Replace multiple newlines with double newline
      .trim()

    return NextResponse.json({ response: formattedResponse })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate response",
      },
      { status: 500 },
    )
  }
}

