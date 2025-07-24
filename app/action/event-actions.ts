"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { registerUserForEvent } from "@/lib/supabase"

export async function registerForEvent(eventId: string, userId: string) {
  try {
    // Use the notification-enabled registration function
    const result = await registerUserForEvent(eventId, userId)
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to register for event",
        alreadyRegistered: result.message?.includes("Already registered") || false,
      }
    }
    return {
      success: true,
      message: "Successfully registered for event",
      registration: result.data,
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error.message || "Failed to register for event",
      error: error.toString(),
    }
  }
}

export async function cancelEventRegistration(eventId: string, userId: string) {
  try {
    // Delete the registration
    const { error } = await supabase.from("event_participants").delete().eq("event_id", eventId).eq("user_id", userId)

    if (error) {
      throw new Error(`Error canceling registration: ${error.message}`)
    }

    // Update event counts in cache
    revalidatePath("/user/events")
    revalidatePath(`/user/events/${eventId}`)
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Successfully canceled event registration",
    }
  } catch (error: any) {
    console.error("Cancellation error:", error)
    return {
      success: false,
      message: error.message || "Failed to cancel registration",
      error: error.toString(),
    }
  }
}

export async function checkEventRegistration(eventId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("event_participants")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows returned
      throw new Error(`Error checking registration: ${error.message}`)
    }

    return {
      isRegistered: !!data,
      registrationData: data || null,
    }
  } catch (error: any) {
    console.error("Check registration error:", error)
    return {
      isRegistered: false,
      error: error.toString(),
    }
  }
}

// Add a function to get user's registered events
export async function getUserRegisteredEvents(userId: string) {
  try {
    // Get all event registrations for the user with event details
    const { data, error } = await supabase
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
          image
        )
      `)
      .eq("user_id", userId)
      .order("registration_date", { ascending: false })

    if (error) {
      console.error("Error fetching user registered events:", error)
      return {
        success: false,
        message: "Failed to fetch registered events",
        data: [],
      }
    }

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    console.error("Error in getUserRegisteredEvents:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch registered events",
      error: error instanceof Error ? error.toString() : "Unknown error",
      data: [],
    }
  }
}

