"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type ContactInfo = {
  id?: number
  name: string
  fullName: string
  category: string
  phone?: string
  email?: string
  address: string
  hours?: string
  description: string
}

async function checkAdminPermission(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")
    
    if (!userCookie) {
      return false
    }

    const user = JSON.parse(userCookie.value)
    return user.user_role === "admin"
  } catch (error) {
    console.error("Error checking admin permission:", error)
    return false
  }
}

export async function getContacts(): Promise<ContactInfo[]> {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("category")
      .order("name")

    if (error) {
      console.error("Error fetching contacts:", error)
      throw new Error("Failed to fetch contacts")
    }

    // Map 'fullname' (from db) to 'fullName' (in code)
    return (data || []).map((c: any) => ({ 
      ...c, 
      fullName: c.fullName ?? c.fullname ?? "" 
    }))
  } catch (error) {
    console.error("Error in getContacts:", error)
    throw error
  }
}

export async function addContact(contact: Omit<ContactInfo, "id">): Promise<{ success: boolean; data?: ContactInfo; error?: string }> {
  try {
    // Check admin permission
    const isAdmin = await checkAdminPermission()
    if (!isAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    const { data, error } = await supabase
      .from("contacts")
      .insert([contact])
      .select()

    if (error) {
      console.error("Error adding contact:", error)
      return { success: false, error: "Failed to add contact" }
    }

    revalidatePath("/dashboard/contact")
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in addContact:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateContact(contact: ContactInfo): Promise<{ success: boolean; data?: ContactInfo; error?: string }> {
  try {
    // Check admin permission
    const isAdmin = await checkAdminPermission()
    if (!isAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    if (!contact.id) {
      return { success: false, error: "Missing contact id" }
    }

    const { id, ...updates } = contact
    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating contact:", error)
      return { success: false, error: "Failed to update contact" }
    }

    revalidatePath("/dashboard/contact")
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in updateContact:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteContact(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Check admin permission
    const isAdmin = await checkAdminPermission()
    if (!isAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" }
    }

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting contact:", error)
      return { success: false, error: "Failed to delete contact" }
    }

    revalidatePath("/dashboard/contact")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteContact:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
