"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function deleteUserAccount(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("deleteUserAccount server action called with userId:", userId)
    
    if (!userId) {
      console.log("No user ID provided")
      return { success: false, error: "User ID is required" }
    }

    // Delete user from database
    console.log("Attempting to delete user from database with ID:", userId)
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)

    if (deleteError) {
      console.error("Error deleting user account:", deleteError)
      return { success: false, error: `Failed to delete account: ${deleteError.message}` }
    }

    console.log("User successfully deleted from database")

    // Clear the user cookie
    try {
      cookieStore.delete("user")
      console.log("User cookie cleared")
    } catch (cookieError) {
      console.warn("Could not clear user cookie:", cookieError)
      // Don't fail the operation if cookie clearing fails
    }

    revalidatePath("/")
    console.log("Account deletion completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteUserAccount:", error)
    return { 
      success: false, 
      error: `An unexpected error occurred while deleting your account: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

export async function deleteUserAccountAndRedirect(): Promise<never> {
  const result = await deleteUserAccount()
  
  if (result.success) {
    // Redirect to login page after successful deletion
    redirect("/login?message=account-deleted")
  } else {
    // Redirect to account page with error message
    redirect("/dashboard/account?error=" + encodeURIComponent(result.error || "Failed to delete account"))
  }
}
