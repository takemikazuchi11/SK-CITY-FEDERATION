import { NextResponse } from "next/server"
import { getUpcomingEvents, getLatestAnnouncements, searchEvents, searchAnnouncements } from "@/lib/data-service"
import { getPopularEvents, getUserParticipationData } from "@/lib/participation-service"
import type { Database } from "@/types/supabase"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
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

      // Get basic data
      const [upcomingEvents, latestAnnouncements] = await Promise.all([getUpcomingEvents(5), getLatestAnnouncements(3)])

      contextData.upcomingEvents = upcomingEvents
      contextData.latestAnnouncements = latestAnnouncements

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

    if (contextData.upcomingEvents.length > 0) {
      contextString += "Upcoming Events:\n"
      contextData.upcomingEvents.forEach((event, index) => {
        contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${event.description}\n`
      })
      contextString += "\n"
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
        contextString += `${index + 1}. "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}. ${event.description}\n`
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
   - When suggesting new events, make them creative but relevant to the SK Federation's mission and past successful events`

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

