import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { createNotification } from "./notification-service"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

// Types for our database tables
export type Announcement = {
  id: string
  title: string
  content: string
  author: string
  author_role: string
  category: string
  created_at: string
  likes: number
  user_id: string
  author_photo_url?: string // Add this field
}

export type Comment = {
  id: string
  announcement_id: string
  author: string
  author_role: string
  content: string
  created_at: string
  likes: number
  user_id?: string
  // Make user_photo_url optional
  user_photo_url?: string
}

export type User = {
  id: string
  email: string
  password: string
  user_role: string
  first_name: string
  last_name: string
  barangay?: string
  created_at: string
}

export type EventParticipant = {
  id: string
  event_id: string
  user_id: string
  registration_date: string
  status: string
  attended: boolean
  notes?: string
  created_at: string
}

// Function to check if Supabase connection is working
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("announcements").select("count", { count: "exact", head: true })
    if (error) throw error
    return { connected: true, error: null }
  } catch (error) {
    console.error("Supabase connection error:", error)
    return { connected: false, error }
  }
}

// User API
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) throw error
  return data
}

// Add this function to the existing supabase.ts file

export async function updateUser(
  userId: string,
  updates: {
    first_name?: string
    last_name?: string
    email?: string
    user_role?: string
    barangay?: string
  },
) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select()

  if (error) throw error
  return data[0]
}

// Announcements API
export async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })

  if (error) throw error
  // Map nulls to defaults for type safety
  return (data ?? []).map((a) => ({
    ...a,
    created_at: a.created_at ?? "",
    likes: a.likes ?? 0,
    user_id: a.user_id ?? ""
  }))
}

export async function getAnnouncementById(id: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select("*, users:users!announcements_user_id_fkey(photo_url)")
    .eq("id", id)
    .single()

  if (error) throw error
  // Map author_photo_url from users.photo_url
  return {
    ...data,
    author_photo_url: data.users?.photo_url || null,
  }
}

export async function createAnnouncement(announcement: Omit<Announcement, "id" | "created_at" | "likes">) {
  const { data, error } = await supabase
    .from("announcements")
    .insert([{ ...announcement, likes: 0 }])
    .select()

  if (error) throw error
  return data[0]
}

export async function likeAnnouncement(id: string) {
  const { data, error } = await supabase.rpc("increment_announcement_likes", { announcement_id: id })

  if (error) throw error
  return data
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcements").delete().eq("id", id)

  if (error) throw error
  return true
}

// Comments API
export async function getCommentsByAnnouncementId(announcementId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("announcement_id", announcementId)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Ensure each comment has a user_photo_url property
  return data.map((comment) => ({
    ...comment,
    user_photo_url: comment.user_photo_url || null,
  }))
}

export async function createComment(comment: Omit<Comment, "id" | "created_at" | "likes">) {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ ...comment, likes: 0 }])
    .select()

  if (error) throw error
  return data[0]
}

export async function likeComment(id: string) {
  const { data, error } = await supabase.rpc("increment_comment_likes", { comment_id: id })

  if (error) throw error
  return data
}

export async function getAllUsersEmails(): Promise<{ email: string }[]> {
  const { data, error } = await supabase
    .from("users") // Ensure this matches your table name
    .select("email") // Ensure "email" column exists

  if (error) {
    console.error("Error fetching users from Supabase:", error)
    return []
  }

  // Ensure data is an array and contains valid emails
  if (!Array.isArray(data)) {
    console.warn("Unexpected data format from Supabase:", data)
    return []
  }

  // Filter out invalid emails
  return data.filter((user) => user.email).map((user) => ({ email: user.email }))
}

// Event Participants API
export async function getEventParticipants(eventId: string) {
  const { data, error } = await supabase
    .from("event_participants")
    .select(`
      *,
      users (id, first_name, last_name, email, barangay)
    `)
    .eq("event_id", eventId)
    .order("registration_date", { ascending: false })

  if (error) throw error
  return data
}

export async function getParticipantCount(eventId: string) {
  const { count, error } = await supabase
    .from("event_participants")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)

  if (error) throw error
  return count || 0
}

export async function checkUserRegistration(eventId: string, userId: string) {
  const { data, error } = await supabase
    .from("event_participants")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") throw error // PGRST116 means no rows returned
  return !!data // Return true if data exists, false otherwise
}

export async function registerUserForEvent(eventId: string, userId: string) {
  // Check if already registered
  const isRegistered = await checkUserRegistration(eventId, userId)
  if (isRegistered) {
    return { success: false, message: "Already registered for this event" }
  }

  // Register user
  const { data, error } = await supabase
    .from("event_participants")
    .insert([
      {
        event_id: eventId,
        user_id: userId,
        status: "confirmed",
      },
    ])
    .select()

  if (error) throw error

  // Fetch event details for notification
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("title, date")
    .eq("id", eventId)
    .single()

  if (!eventError && eventData) {
    await createNotification({
      user_id: userId,
      title: "Event Registration Confirmed",
      content: `You have successfully registered for ${eventData.title} on ${eventData.date}. See you there!`,
      type: "event",
      reference_id: eventId,
      read: false,
      action_url: `/dashboard/events/${eventId}`,
    })
  }

  return { success: true, data: data[0] }
}

export async function cancelRegistration(eventId: string, userId: string) {
  const { error } = await supabase.from("event_participants").delete().eq("event_id", eventId).eq("user_id", userId)

  if (error) throw error
  return { success: true }
}

// FOR RESOURCES FILE ******************************************************************

export interface ResourceFile {
  id: number
  title: string
  type: string
  url: string
  folder_id: number
  created_at?: string
}

export interface ResourceFolder {
  id: number
  name: string
  files?: ResourceFile[]
  resource_files?: ResourceFile[] // Add this to match Supabase's return structure
}

// Database helper functions
export async function getFolders() {
  const { data, error } = await supabase.from("resource_folders").select("*").order("name")

  if (error) throw error
  return data as ResourceFolder[]
}

export async function getFiles(folderId?: number) {
  const query = supabase.from("resource_files").select("*").order("title")

  if (folderId) {
    query.eq("folder_id", folderId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as ResourceFile[]
}

// Fix the getFoldersWithFiles function to properly handle the data structure
export async function getFoldersWithFiles() {
  const { data, error } = await supabase
    .from("resource_folders")
    .select(`
      id,
      name,
      resource_files (
        id, 
        title, 
        type, 
        url
      )
    `)
    .order("name")

  if (error) {
    console.error("Supabase query error:", error)
    throw error
  }

  // Transform the data to match our expected structure
  const transformedData = data.map((folder: any) => ({
    id: folder.id,
    name: folder.name,
    files: folder.resource_files || [],
  }))

  console.log("Raw data from Supabase:", JSON.stringify(data, null, 2))

  console.log("Transformed data:", JSON.stringify(transformedData, null, 2))

  return transformedData as ResourceFolder[]
}

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage.from("resources").upload(path, file, {
    cacheControl: "3600",
    upsert: true, // Changed to true to overwrite if file exists
  })

  if (error) {
    console.error("Storage upload error:", error)
    throw error
  }
  return data
}

// Improved addFile function with better error handling and debugging
export async function addFile(fileData: Omit<ResourceFile, "id" | "created_at">) {
  console.log("Adding file to database with data:", fileData)

  // Validate the data before insertion
  if (!fileData.title || !fileData.url || !fileData.folder_id) {
    throw new Error("Missing required file data fields")
  }

  // Insert the file record
  const { data, error } = await supabase
    .from("resource_files")
    .insert([fileData]) // Wrap in array to ensure proper format
    .select()

  if (error) {
    console.error("Database insert error:", error)
    throw error
  }

  if (!data || data.length === 0) {
    throw new Error("No data returned after insert")
  }

  console.log("File added to database successfully:", data[0])
  return data[0]
}

export async function deleteFile(id: number) {
  // First get the file URL to delete from storage
  const { data: file, error: fetchError } = await supabase.from("resource_files").select("url").eq("id", id).single()

  if (fetchError) throw fetchError

  // Extract the path from the URL
  const url = new URL(file.url)
  const path = url.pathname.split("/").pop()

  if (path) {
    // Delete from storage
    const { error: storageError } = await supabase.storage.from("resources").remove([path])

    if (storageError) throw storageError
  }

  // Then delete the database record
  const { error } = await supabase.from("resource_files").delete().eq("id", id)

  if (error) throw error
  return true
}

// BARANGAY RESOURCES ******************************************************************

// Define the Barangay type
export interface Barangay {
  id: number
  name: string
  created_at?: string
}

// Function to get all barangays from the database
export async function getBarangays() {
  try {
    const { data, error } = await supabase.from("barangays").select("*").order("name")

    if (error) throw error
    return data as Barangay[]
  } catch (error) {
    console.error("Error fetching barangays:", error)
    throw error
  }
}

// Updated BarangayResourceFile interface to use barangay_id instead of barangay name
export interface BarangayResourceFile {
  id: number
  title: string
  type: string
  url: string
  barangay_id: number
  barangay_name?: string // For display purposes only
  month: string
  file_name: string
  file_path: string
  uploaded_by_user_id?: string
  upload_timestamp?: string
}

// Function to get resources for a specific barangay and month
export async function getBarangayResources(barangayId: number, month?: string) {
  const query = supabase
    .from("barangay_resources")
    .select(`
      *,
      barangays (name)
    `)
    .eq("barangay_id", barangayId)
    .order("file_name")

  if (month) {
    query.eq("month", month)
  }

  const { data, error } = await query
  if (error) throw error

  // Transform the data to include the barangay name
  return data.map((resource) => ({
    ...resource,
    barangay_name: resource.barangays?.name,
  })) as BarangayResourceFile[]
}

// Updated function to upload a barangay resource with proper error handling
export async function uploadBarangayResource({
  file,
  fileName,
  title,
  barangayId,
  month,
  userId,
}: {
  file: File
  fileName: string
  title: string
  barangayId: number
  month: string
  userId: string // Make this required instead of optional
}) {
  try {
    // Step 1: Upload file to storage
    console.log(`Uploading file to barangay_resources/${fileName}`)
    const filePath = `barangay_resources/${fileName}`

    const { error: uploadError } = await supabase.storage.from("resources").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      throw new Error(`File upload failed: ${uploadError.message}`)
    }

    // Step 2: Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("resources").getPublicUrl(filePath)

    if (!publicUrl) {
      throw new Error("Failed to get public URL for uploaded file")
    }

    // Step 3: Determine file type
    const fileExt = file.name.split(".").pop()?.toUpperCase() || "UNKNOWN"

    // Step 4: Insert record into barangay_resources table
    const { data, error: insertError } = await supabase
      .from("barangay_resources")
      .insert([
        {
          barangay_id: barangayId,
          month,
          file_name: title,
          file_path: filePath,
          title,
          type: fileExt,
          url: publicUrl,
          uploaded_by_user_id: userId, // Always provide a user ID
        },
      ])
      .select()

    if (insertError) {
      console.error("Database insert error:", insertError)
      // Try to clean up the uploaded file if database insert fails
      await supabase.storage.from("resources").remove([filePath])
      throw new Error(`Database record creation failed: ${insertError.message}`)
    }

    console.log("Barangay resource added successfully:", data)
    return data[0]
  } catch (error) {
    console.error("Error in uploadBarangayResource:", error)
    throw error
  }
}

// Function to delete a barangay resource
export async function deleteBarangayResource(id: number) {
  try {
    // First get the file path to delete from storage
    const { data: resource, error: fetchError } = await supabase
      .from("barangay_resources")
      .select("file_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching resource for deletion:", fetchError)
      throw fetchError
    }

    if (resource && resource.file_path) {
      // Delete from storage
      const { error: storageError } = await supabase.storage.from("resources").remove([resource.file_path])

      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Then delete the database record
    const { error } = await supabase.from("barangay_resources").delete().eq("id", id)

    if (error) {
      console.error("Error deleting resource record:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error in deleteBarangayResource:", error)
    throw error
  }
}

// Function to get all barangay resources grouped by barangay and month
export async function getAllBarangayResources() {
  try {
    const { data, error } = await supabase
      .from("barangay_resources")
      .select(`
        *,
        barangays (id, name)
      `)
      .order("month")
      .order("file_name")

    if (error) throw error

    // Group by barangay and then by month
    const groupedResources: Record<number, Record<string, BarangayResourceFile[]>> = {}

    data.forEach((resource: any) => {
      const barangayId = resource.barangay_id
      const barangayName = resource.barangays?.name || "Unknown"

      if (!groupedResources[barangayId]) {
        groupedResources[barangayId] = {}
      }

      if (!groupedResources[barangayId][resource.month]) {
        groupedResources[barangayId][resource.month] = []
      }

      groupedResources[barangayId][resource.month].push({
        ...resource,
        barangay_name: barangayName,
      })
    })

    return {
      resources: groupedResources,
      barangayMapping: data.reduce((acc: Record<number, string>, resource: any) => {
        if (resource.barangays?.name) {
          acc[resource.barangay_id] = resource.barangays.name
        }
        return acc
      }, {}),
    }
  } catch (error) {
    console.error("Error fetching all barangay resources:", error)
    throw error
  }
}

// Add this interface for moderator action logs
export interface ModeratorActionLog {
  id?: number
  user_id: string
  action_type: "upload" | "delete" | "edit" | "view"
  resource_type: "general" | "barangay"
  barangay_id?: number
  barangay_name?: string
  resource_name: string
  folder_name?: string
  month?: string
  details: string
  timestamp?: string
}

// Function to log moderator actions
export async function logModeratorAction(action: Omit<ModeratorActionLog, "id" | "timestamp">) {
  try {
    const { data, error } = await supabase.from("moderator_action_logs").insert([action]).select()

    if (error) {
      console.error("Error logging moderator action:", error)
      // Don't throw error to prevent disrupting the main flow
      return null
    }

    return data[0]
  } catch (error) {
    console.error("Exception logging moderator action:", error)
    return null
  }
}

// Function to get moderator action logs
export async function getModeratorActionLogs(filters?: {
  user_id?: string
  barangay_id?: number
  action_type?: string
  resource_type?: string
  from_date?: string
  to_date?: string
}) {
  try {
    let query = supabase
      .from("moderator_action_logs")
      .select(`
        *,
        users (id, first_name, last_name, email, user_role, barangay)
      `)
      .order("timestamp", { ascending: false })

    // Apply filters if provided
    if (filters) {
      if (filters.user_id) query = query.eq("user_id", filters.user_id)
      if (filters.barangay_id) query = query.eq("barangay_id", filters.barangay_id)
      if (filters.action_type) query = query.eq("action_type", filters.action_type)
      if (filters.resource_type) query = query.eq("resource_type", filters.resource_type)
      if (filters.from_date) query = query.gte("timestamp", filters.from_date)
      if (filters.to_date) query = query.lte("timestamp", filters.to_date)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching moderator action logs:", error)
    throw error
  }
}

// OTHER FOLDERS (City Government Files, SKCF Files) **********************************

export interface OtherFolderFile {
  id: number
  title: string
  type: string
  url: string
  folder_id: number
  created_at?: string
}

export interface OtherFolder {
  id: number
  name: string
  files?: OtherFolderFile[]
  other_folder_files?: OtherFolderFile[]
}

// Fetch all other folders with their files
export async function getOtherFoldersWithFiles() {
  const { data, error } = await supabase
    .from('other_folders')
    .select(`
      id,
      name,
      other_folder_files (
        id,
        title,
        type,
        url,
        created_at
      )
    `)
    .order('name');

  if (error) throw error;

  return (data || []).map((folder: any) => ({
    id: folder.id,
    name: folder.name,
    files: folder.other_folder_files || [],
  }));
}

// Upload file to other_folder_files
export async function addOtherFolderFile(fileData: Omit<OtherFolderFile, "id" | "created_at">) {
  if (!fileData.title || !fileData.url || !fileData.folder_id) {
    throw new Error("Missing required file data fields");
  }
  const { data, error } = await supabase
    .from('other_folder_files')
    .insert([fileData])
    .select();
  if (error) throw error;
  return data[0];
}

// Delete file from other_folder_files
export async function deleteOtherFolderFile(id: number) {
  // First get the file URL to delete from storage
  const { data: file, error: fetchError } = await supabase.from('other_folder_files').select('url').eq('id', id).single();
  if (fetchError) throw fetchError;
  // Extract the path from the URL
  const url = new URL(file.url);
  const path = url.pathname.split("/").pop();
  if (path) {
    // Delete from storage
    const { error: storageError } = await supabase.storage.from('resources').remove([path]);
    if (storageError) throw storageError;
  }
  // Then delete the database record
  const { error } = await supabase.from('other_folder_files').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Fetch all city government folders with their files
export async function getCityGovernmentFoldersWithFiles() {
  const { data, error } = await supabase
    .from('city_government_folders')
    .select(`
      id,
      name,
      city_government_files (
        id,
        title,
        type,
        url,
        created_at
      )
    `)
    .order('name');

  if (error) throw error;

  return (data || []).map((folder: any) => ({
    id: folder.id,
    name: folder.name,
    files: folder.city_government_files || [],
  }));
}

// Fetch all SKCF folders with their files
export async function getSKCFFoldersWithFiles() {
  const { data, error } = await supabase
    .from('skcf_folders')
    .select(`
      id,
      name,
      skcf_files (
        id,
        title,
        type,
        url,
        created_at
      )
    `)
    .order('name');

  if (error) throw error;

  return (data || []).map((folder: any) => ({
    id: folder.id,
    name: folder.name,
    files: folder.skcf_files || [],
  }));
}

export async function hasUserLikedAnnouncement(announcementId: string, userId: string) {
  const { data, error } = await supabase
    .from("announcement_likes")
    .select("id")
    .eq("announcement_id", announcementId)
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}

export async function toggleAnnouncementLike(announcementId: string, userId: string) {
  const liked = await hasUserLikedAnnouncement(announcementId, userId);
  if (liked) {
    // Unlike
    const { error } = await supabase
      .from("announcement_likes")
      .delete()
      .eq("announcement_id", announcementId)
      .eq("user_id", userId);
    if (error) throw error;
    return false;
  } else {
    // Like
    const { error } = await supabase
      .from("announcement_likes")
      .insert([{ announcement_id: announcementId, user_id: userId }]);
    if (error) throw error;
    return true;
  }
}

export async function hasUserLikedComment(commentId: string, userId: string) {
  const { data, error } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}

export async function toggleCommentLike(commentId: string, userId: string) {
  const liked = await hasUserLikedComment(commentId, userId);
  if (liked) {
    // Unlike
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId);
    if (error) throw error;
    return false;
  } else {
    // Like
    const { error } = await supabase
      .from("comment_likes")
      .insert([{ comment_id: commentId, user_id: userId }]);
    if (error) throw error;
    return true;
  }
}
