import { supabase } from "./supabase"

export interface Ordinance {
  id: number
  ordinance_no: string
  title: string
  description: string
  date: string
  date_enact: string
  author?: string
  sponsors?: string[]
  img?: string
  pdf?: string
  created_at?: string
}

export interface Resolution {
  id: number
  resolution_no: string
  title: string
  description: string
  date: string
  date_enact: string
  author?: string
  sponsors?: string[]
  img?: string
  pdf?: string
  created_at?: string
}

/**
 * Get all ordinances from the database
 * @param limit Optional limit for the number of ordinances to return
 * @returns Array of ordinances
 */
export async function getOrdinances(limit?: number) {
  try {
    let query = supabase
      .from("ordinance")
      .select("id, ordinance_no, title, description, date, date_enact, img, pdf, author, sponsors, created_at")
      .order("date_enact", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching ordinances:", error)
      throw error
    }

    return data as Ordinance[]
  } catch (error) {
    console.error("Exception in getOrdinances:", error)
    throw error
  }
}

/**
 * Get a specific ordinance by its ID
 * @param id The ID of the ordinance to retrieve
 * @returns The ordinance object or null if not found
 */
export async function getOrdinanceById(id: string) {
  try {
    const { data, error } = await supabase
      .from("ordinance")
      .select("id, ordinance_no, title, description, date, date_enact, img, pdf, author, sponsors, created_at")
      .eq("ordinance_no", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 means no rows returned
        return null
      }
      console.error("Error fetching ordinance by ID:", error)
      throw error
    }

    return data as Ordinance
  } catch (error) {
    console.error(`Exception in getOrdinanceById for ID ${id}:`, error)
    throw error
  }
}

/**
 * Get all resolutions from the database
 * @param limit Optional limit for the number of resolutions to return
 * @returns Array of resolutions
 */
export async function getResolutions(limit?: number) {
  try {
    let query = supabase
      .from("resolution")
      .select("id, resolution_no, title, description, date, date_enact, img, pdf, author, sponsors, created_at")
      .order("date_enact", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching resolutions:", error)
      throw error
    }

    return data as Resolution[]
  } catch (error) {
    console.error("Exception in getResolutions:", error)
    throw error
  }
}

/**
 * Get a specific resolution by its ID
 * @param id The ID of the resolution to retrieve
 * @returns The resolution object or null if not found
 */
export async function getResolutionById(id: string) {
  try {
    const { data, error } = await supabase
      .from("resolution")
      .select("id, resolution_no, title, description, date, date_enact, img, pdf, author, sponsors, created_at")
      .eq("resolution_no", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 means no rows returned
        return null
      }
      console.error("Error fetching resolution by ID:", error)
      throw error
    }

    return data as Resolution
  } catch (error) {
    console.error(`Exception in getResolutionById for ID ${id}:`, error)
    throw error
  }
}

/**
 * Search for ordinances by title or number
 * @param query The search query
 * @returns Array of matching ordinances
 */
export async function searchOrdinances(query: string) {
  try {
    const { data, error } = await supabase
      .from("ordinance")
      .select("id, ordinance_no, title, description, date, date_enact, img, pdf")
      .or(`title.ilike.%${query}%,ordinance_no.ilike.%${query}%,description.ilike.%${query}%`)
      .order("date_enact", { ascending: false })

    if (error) {
      console.error("Error searching ordinances:", error)
      throw error
    }

    return data as Ordinance[]
  } catch (error) {
    console.error(`Exception in searchOrdinances for query "${query}":`, error)
    throw error
  }
}

/**
 * Search for resolutions by title or number
 * @param query The search query
 * @returns Array of matching resolutions
 */
export async function searchResolutions(query: string) {
  try {
    const { data, error } = await supabase
      .from("resolution")
      .select("id, resolution_no, title, description, date, date_enact, img, pdf")
      .or(`title.ilike.%${query}%,resolution_no.ilike.%${query}%,description.ilike.%${query}%`)
      .order("date_enact", { ascending: false })

    if (error) {
      console.error("Error searching resolutions:", error)
      throw error
    }

    return data as Resolution[]
  } catch (error) {
    console.error(`Exception in searchResolutions for query "${query}":`, error)
    throw error
  }
}
