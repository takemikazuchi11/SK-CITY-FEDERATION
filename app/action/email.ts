"use server"

import type { Announcement } from "@/lib/supabase"
import { sendAnnouncementNotification, simulateSendAnnouncementNotification } from "@/lib/email"

export async function sendEmailNotification(announcement: Announcement, selectedEmails?: string[]) {
  try {
    // Check if we should use real email sending or simulation
    // Use real emails if SENDGRID_API_KEY is set, otherwise simulate
    const useRealEmails = !!process.env.SENDGRID_API_KEY

    console.log(`Using ${useRealEmails ? "real" : "simulated"} email sending`)
    console.log(`Sending to ${selectedEmails ? selectedEmails.length : "all"} recipients`)

    const result = useRealEmails
      ? await sendAnnouncementNotification(announcement, selectedEmails)
      : await simulateSendAnnouncementNotification(announcement, selectedEmails)

    return result
  } catch (error) {
    console.error("Error in email notification:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send notification",
      recipients: [],
    }
  }
}

