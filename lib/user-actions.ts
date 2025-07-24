"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateUserProfile({
  userId,
  first_name,
  last_name,
  email,
  phone,
  photo_url,
}: {
  userId: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  photo_url?: string
}) {
  try {
    // Validate inputs
    if (!userId || !first_name || !last_name || !email) {
      return {
        success: false,
        message: "Missing required fields",
      }
    }

    // Check if email is already taken by another user
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is what we want
      console.error("Error checking existing user:", checkError)
      return {
        success: false,
        message: "Error checking email availability",
      }
    }

    if (existingUser) {
      return {
        success: false,
        message: "Email is already in use by another account",
      }
    }

    // Update user profile - Fix: Add proper error handling and debugging
    console.log("Updating user profile with data:", { userId, first_name, last_name, email, phone, photo_url })

    const { data, error } = await supabase
      .from("users")
      .update({
        first_name,
        last_name,
        email,
        phone,
        photo_url,
      })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("Error updating user profile:", error)
      return {
        success: false,
        message: "Failed to update profile: " + error.message,
      }
    }

    if (!data || data.length === 0) {
      console.error("No data returned after update")
      return {
        success: false,
        message: "Failed to update profile: No data returned",
      }
    }

    console.log("Profile updated successfully:", data[0])

    // Update the user in localStorage to reflect changes immediately
    try {
      // This is a client-side operation, so it will only work in browser context
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          const updatedUser = {
            ...user,
            first_name,
            last_name,
            email,
            phone,
            photo_url,
          }
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      }
    } catch (e) {
      console.error("Error updating local storage:", e)
      // Continue even if local storage update fails
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/account")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return {
      success: false,
      message: error instanceof Error ? `An error occurred: ${error.message}` : "An unexpected error occurred",
    }
  }
}

// Fix the getUserEvents function to properly handle errors and provide better debugging

export async function getUserEvents(userId: string) {
  try {
    if (!userId) {
      console.error("getUserEvents called without userId")
      return {
        success: false,
        message: "User ID is required",
        data: [],
      }
    }

    console.log(`Fetching events for user ID: ${userId}`)

    // Get all event registrations for the user
    const { data: registrations, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        event_id,
        registration_date,
        status,
        events (
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
      console.error("Error fetching user events:", error)
      return {
        success: false,
        message: `Failed to fetch your events: ${error.message}`,
        data: [],
      }
    }

    if (!registrations || registrations.length === 0) {
      console.log("No events found for user")
      return {
        success: true,
        data: [],
      }
    }

    console.log(`Found ${registrations.length} events for user`)

    // Transform the data without certificate functionality
    const eventsData = registrations.map((reg) => ({
      ...reg,
      event: {
        ...reg.events,
      },
    }))

    return {
      success: true,
      data: eventsData,
    }
  } catch (error) {
    console.error("Error in getUserEvents:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      data: [],
    }
  }
}

