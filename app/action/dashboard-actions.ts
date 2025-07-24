"use server"

import { supabase } from "@/lib/supabase"

export async function getEventParticipationData() {
  try {
    // Fetch top 5 events
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id, title, capacity")
      .order("date", { ascending: false })
      .limit(5)

    if (eventError) throw eventError

    // Get participant counts for each event
    const participationData = await Promise.all(
      eventData.map(async (event) => {
        const { count, error: countError } = await supabase
          .from("event_participants")
          .select("*", { count: "exact", head: true })
          .eq("event_id", event.id)

        if (countError) throw countError

        return {
          name: event.title,
          participants: count || 0,
          capacity: event.capacity || 100,
        }
      }),
    )

    return { success: true, data: participationData }
  } catch (error) {
    console.error("Error fetching event participation data:", error)
    return { success: false, error: "Failed to fetch event participation data" }
  }
}

