import { supabase } from "./supabase"

export async function getUpcomingEvents(limit: number) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "upcoming")
    .order("date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }

  return data
}

// Update the getUpcomingEventsByProximity function to include all necessary event details
export async function getUpcomingEventsByProximity(limit = 2) {
  const today = new Date().toISOString().split("T")[0] // Get current date in YYYY-MM-DD format

  // Log the current date for debugging
  console.log(`Fetching upcoming events after ${today}`)

  const { data, error } = await supabase
    .from("events")
    .select("*") // Select all fields
    .gte("date", today) // Only get events today or in the future
    .order("date", { ascending: true }) // Sort by closest date first
    .limit(limit)

  if (error) {
    console.error("Error fetching upcoming events by proximity:", error)
    return []
  }

  // Log the events found for debugging
  console.log(`Found ${data?.length || 0} upcoming events`)

  return data || []
}

export async function getEventById(id: number) {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching event with id ${id}:`, error)
    return null
  }

  return data
}

export async function searchEvents(query: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error searching events:", error)
    return []
  }

  return data
}

// Update the existing getLatestEvents function to prioritize upcoming events
export async function getLatestEvents(limit = 2) {
  const today = new Date().toISOString().split("T")[0] // Get current date in YYYY-MM-DD format

  // First try to get upcoming events
  const { data: upcomingEvents, error: upcomingError } = await supabase
    .from("events")
    .select("*")
    .gte("date", today) // Only get events today or in the future
    .order("date", { ascending: true }) // Sort by closest date first
    .limit(limit)

  if (upcomingError) {
    console.error("Error fetching upcoming events:", upcomingError)
    return []
  }

  // If we have enough upcoming events, return them
  if (upcomingEvents && upcomingEvents.length >= limit) {
    return upcomingEvents
  }

  // If we don't have enough upcoming events, fill with recent past events
  const remainingLimit = limit - (upcomingEvents?.length || 0)

  if (remainingLimit > 0) {
    const { data: pastEvents, error: pastError } = await supabase
      .from("events")
      .select("*")
      .lt("date", today) // Get events before today
      .order("date", { ascending: false }) // Most recent past events first
      .limit(remainingLimit)

    if (pastError) {
      console.error("Error fetching past events:", pastError)
      return upcomingEvents || []
    }

    // Combine upcoming and past events
    return [...(upcomingEvents || []), ...(pastEvents || [])]
  }

  return upcomingEvents || []
}

export async function getLatestAnnouncements(limit: number) {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching latest announcements:", error)
    return []
  }

  return data
}

export async function getAnnouncementById(id: number) {
  const { data, error } = await supabase.from("announcements").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching announcement with id ${id}:`, error)
    return null
  }

  return data
}

export async function searchAnnouncements(query: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching announcements:", error)
    return []
  }

  return data
}

export async function searchBarangays(query: string) {
  const { data, error } = await supabase
    .from("barangays")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error searching barangays:", error)
    return []
  }

  return data
}

export async function getBarangayById(id: number) {
  const { data, error } = await supabase
    .from("barangays")
    .select("id, name, phone, page, email, logo_url")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching barangay with id ${id}:`, error)
    return null
  }

  return data
}

export async function getBarangayOfficials(barangayId: number) {
  // Debug log to verify the barangayId being used
  console.log(`Fetching SK officials for barangay ID: ${barangayId}`)

  // First, try with the correct position names from the database schema
  const { data, error } = await supabase
    .from("sk_officials")
    .select("*")
    .eq("barangay_id", barangayId)
    .order("position_order", { ascending: true })

  if (error) {
    console.error(`Error fetching SK officials for barangay ${barangayId}:`, error)
    return []
  }

  // If no data found, try with alternative position names
  if (!data || data.length === 0) {
    console.log(`No officials found with standard position names, trying with alternative format`)

    const { data: altData, error: altError } = await supabase
      .from("sk_officials")
      .select("*")
      .eq("barangay_id", barangayId)

    if (altError) {
      console.error(`Error in alternative fetch for SK officials:`, altError)
      return []
    }

    // Map positions to expected format if needed
    if (altData && altData.length > 0) {
      console.log(`Found ${altData.length} officials with alternative query`)
      return altData
        .map((official) => {
          // Map position names if they don't match expected format
          if (official.position === "Chairperson") {
            return { ...official, position: "SK Chairperson" }
          } else if (official.position === "Secretary") {
            return { ...official, position: "SK Secretary" }
          } else if (official.position === "Treasurer") {
            return { ...official, position: "SK Treasurer" }
          } else if (official.position === "Member") {
            return { ...official, position: "SK Member" }
          }
          return official
        })
        .sort((a, b) => a.position_order - b.position_order)
    }
  }

  console.log(`Retrieved ${data?.length || 0} SK officials for barangay ${barangayId}`)
  return data || []
}

// Add the updateSKOfficial function
export async function updateSKOfficial(
  id: number,
  updates: {
    full_name?: string
    phone?: string
    email?: string
    photo_url?: string
    description?: string
  },
) {
  const { data, error } = await supabase.from("sk_officials").update(updates).eq("id", id).select()

  if (error) {
    console.error(`Error updating SK official with id ${id}:`, error)
    throw error
  }

  return data[0]
}

// Update the getBarangayHistory function to include contact fields
export async function getBarangayHistory(barangayId: number) {
  const { data, error } = await supabase
    .from("barangays")
    .select("id, name, logo_url, history, phone, page, email")
    .eq("id", barangayId)
    .single()

  if (error) {
    console.error(`Error fetching barangay history for ID ${barangayId}:`, error)
    throw error
  }

  return data
}

// Add this function to your existing data-service.ts file

export async function getFederationOfficials() {
  const { data, error } = await supabase.from("officials").select("*").order("position", { ascending: true })

  if (error) {
    console.error("Error fetching federation officials:", error)
    throw error
  }

  return data || []
}

// Add this function to update federation officials
export async function updateFederationOfficial(
  id: number,
  updates: {
    name?: string
    position?: string
    photo_url?: string
  },
) {
  const { data, error } = await supabase.from("officials").update(updates).eq("id", id).select()

  if (error) {
    console.error(`Error updating federation official with id ${id}:`, error)
    throw error
  }

  return data[0]
}

// Add this function to update barangay information
export async function updateBarangay(
  id: number,
  updates: {
    history?: string | null
    logo_url?: string | null
    phone?: string | null
    page?: string | null
    email?: string | null
  },
) {
  const { data, error } = await supabase.from("barangays").update(updates).eq("id", id).select()

  if (error) {
    console.error(`Error updating barangay with id ${id}:`, error)
    throw error
  }

  return data[0]
}

export async function createSKOfficial(official: {
  full_name: string
  position: string
  position_order?: number
  phone?: string
  email?: string
  photo_url?: string
  barangay_id: number
  description?: string
}) {
  const { data, error } = await supabase
    .from("sk_officials")
    .insert([official])
    .select()

  if (error) {
    console.error("Error creating SK official:", error)
    throw error
  }

  return data[0]
}

