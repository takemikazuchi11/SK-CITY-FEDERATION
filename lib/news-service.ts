import { createClient } from "@supabase/supabase-js"
import { supabase } from "./supabase"

// Create a public (no auth) Supabase client for public reads
const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface NewsArticle {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  author: string
  author_id: string
  category: string
  status: "draft" | "published" | "archived"
  featured_image_url?: string
  published_at: string
  created_at: string
  updated_at: string
}

export interface CreateNewsData {
  title: string
  content: string
  excerpt?: string
  author: string
  author_id: string
  category: string
  status: "draft" | "published" | "archived"
  featured_image_url?: string
}

export interface UpdateNewsData {
  title?: string
  content?: string
  excerpt?: string
  author?: string
  category?: string
  status?: "draft" | "published" | "archived"
  featured_image_url?: string
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Get all published news articles
export async function getPublishedNews(limit?: number): Promise<NewsArticle[]> {
  try {
    let query = supabase.from("news").select("*").eq("status", "published").order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching published news:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getPublishedNews:", error)
    throw error
  }
}

// Get news article by slug
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await publicSupabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null
      }
      console.error("Error fetching news by slug:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in getNewsBySlug:", error)
    throw error
  }
}

// Create new news article
export async function createNews(newsData: CreateNewsData): Promise<NewsArticle> {
  try {
    const slug = generateSlug(newsData.title)
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("news")
      .insert({
        ...newsData,
        slug,
        published_at: newsData.status === "published" ? now : null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating news:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in createNews:", error)
    throw error
  }
}

// Update news article
export async function updateNews(id: number, newsData: UpdateNewsData): Promise<NewsArticle> {
  try {
    const updateData: any = {
      ...newsData,
      updated_at: new Date().toISOString(),
    }

    // Generate new slug if title is being updated
    if (newsData.title) {
      updateData.slug = generateSlug(newsData.title)
    }

    // Set published_at if status is being changed to published
    if (newsData.status === "published") {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating news:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in updateNews:", error)
    throw error
  }
}

// Delete news article
export async function deleteNews(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      console.error("Error deleting news:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in deleteNews:", error)
    throw error
  }
}

// Search news articles
export async function searchNews(query: string, category?: string): Promise<NewsArticle[]> {
  try {
    let supabaseQuery = supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    // Apply category filter
    if (category && category !== "all") {
      supabaseQuery = supabaseQuery.eq("category", category)
    }

    // Apply search filter
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,content.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`,
      )
    }

    const { data, error } = await supabaseQuery

    if (error) {
      console.error("Error searching news:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in searchNews:", error)
    throw error
  }
}

// Get all news articles (including drafts) for admin
export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all news:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllNews:", error)
    throw error
  }
}

// Get news by ID
export async function getNewsById(id: number): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null
      }
      console.error("Error fetching news by ID:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in getNewsById:", error)
    throw error
  }
}
    