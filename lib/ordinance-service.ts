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

/**
 * Update an ordinance by its ID
 * @param id The ordinance number to update
 * @param updates The fields to update
 * @returns The updated ordinance object
 */
export async function updateOrdinance(id: string, updates: Partial<Ordinance>) {
  try {
    const { data, error } = await supabase
      .from("ordinance")
      .update(updates)
      .eq("ordinance_no", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating ordinance:", error)
      throw error
    }

    return data as Ordinance
  } catch (error) {
    console.error(`Exception in updateOrdinance for ID ${id}:`, error)
    throw error
  }
}

/**
 * Update a resolution by its ID
 * @param id The resolution number to update
 * @param updates The fields to update
 * @returns The updated resolution object
 */
export async function updateResolution(id: string, updates: Partial<Resolution>) {
  try {
    const { data, error } = await supabase
      .from("resolution")
      .update(updates)
      .eq("resolution_no", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating resolution:", error)
      throw error
    }

    return data as Resolution
  } catch (error) {
    console.error(`Exception in updateResolution for ID ${id}:`, error)
    throw error
  }
}

/**
 * Delete an ordinance by its ID
 * @param id The ordinance number to delete
 * @returns Success status
 */
export async function deleteOrdinance(id: string) {
  try {
    const { error } = await supabase
      .from("ordinance")
      .delete()
      .eq("ordinance_no", id)

    if (error) {
      console.error("Error deleting ordinance:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error(`Exception in deleteOrdinance for ID ${id}:`, error)
    throw error
  }
}

/**
 * Delete a resolution by its ID
 * @param id The resolution number to delete
 * @returns Success status
 */
export async function deleteResolution(id: string) {
  try {
    const { error } = await supabase
      .from("resolution")
      .delete()
      .eq("resolution_no", id)

    if (error) {
      console.error("Error deleting resolution:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error(`Exception in deleteResolution for ID ${id}:`, error)
    throw error
  }
}

/**
 * Create a new ordinance
 * @param ordinanceData The ordinance data to create
 * @returns The created ordinance object
 */
export async function createOrdinance(ordinanceData: Omit<Ordinance, "id" | "created_at">) {
  try {
    const { data, error } = await supabase
      .from("ordinance")
      .insert(ordinanceData)
      .select()
      .single()

    if (error) {
      console.error("Error creating ordinance:", error)
      throw error
    }

    return data as Ordinance
  } catch (error) {
    console.error("Exception in createOrdinance:", error)
    throw error
  }
}

/**
 * Create a new resolution
 * @param resolutionData The resolution data to create
 * @returns The created resolution object
 */
export async function createResolution(resolutionData: Omit<Resolution, "id" | "created_at">) {
  try {
    const { data, error } = await supabase
      .from("resolution")
      .insert(resolutionData)
      .select()
      .single()

    if (error) {
      console.error("Error creating resolution:", error)
      throw error
    }

    return data as Resolution
  } catch (error) {
    console.error("Exception in createResolution:", error)
    throw error
  }
}
