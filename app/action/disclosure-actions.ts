"use server"

import { supabase } from "@/lib/supabase"

export type DisclosureUrl = {
  id: number
  document_type: string
  url: string | null
  description: string | null
  updated_by: string | null
  updated_at: string
}

export async function getDisclosureUrls(): Promise<DisclosureUrl[]> {
  try {
    const { data, error } = await supabase.from("disclosure_urls").select("*").order("id")

    if (error) {
      console.error("Error fetching disclosure URLs:", error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Error in getDisclosureUrls:", error)
    throw error
  }
}

export async function updateDisclosureUrl(id: number, url: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate URL if provided
    if (url.trim() && !isValidUrl(url.trim())) {
      return { success: false, error: "Please enter a valid URL" }
    }

    // Update the URL
    const { error } = await supabase
      .from("disclosure_urls")
      .update({
        url: url.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating disclosure URL:", error)
      return { success: false, error: "Failed to update URL" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateDisclosureUrl:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function validateUrl(url: string): Promise<boolean> {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}
