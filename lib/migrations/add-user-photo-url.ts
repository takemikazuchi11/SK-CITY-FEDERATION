import { supabase } from "../supabase"

export async function addUserPhotoUrlToComments() {
  try {
    // Check if the column already exists
    const { data: columns, error: checkError } = await supabase
      .from("comments")
      .select("user_photo_url")
      .limit(1)
      .maybeSingle()

    // If we can query the column without error, it exists
    if (!checkError) {
      console.log("user_photo_url column already exists in comments table")
      return true
    }

    // Add the column if it doesn't exist
    const { error } = await supabase.rpc("add_column_if_not_exists", {
      table_name: "comments",
      column_name: "user_photo_url",
      column_type: "text",
    })

    if (error) {
      console.error("Error adding user_photo_url column:", error)
      return false
    }

    console.log("Successfully added user_photo_url column to comments table")
    return true
  } catch (error) {
    console.error("Error in migration:", error)
    return false
  }
}

