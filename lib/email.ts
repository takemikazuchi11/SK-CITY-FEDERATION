import { Resend } from "resend"

// Initialize Resend with API key
if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not defined in environment variables")
}

const resend = new Resend(process.env.RESEND_API_KEY)

import { supabase } from "./supabase"
import type { Announcement, User } from "./supabase"

// Get all users from the database
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, user_role, password, created_at")

  if (error) throw error
  return data || []
}

// Format the email content
function formatEmailContent(announcement: Announcement) {
  return {
    subject: `${announcement.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; font-size: 24px;">${announcement.title}</h1>
        <p style="color: #666; font-size: 14px;">
          <strong>Posted by:</strong> ${announcement.author}
        </p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          ${announcement.content.replace(/\n/g, "<br>")}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated notification from the SK Federation Calapan City. Please do not reply.
        </p>
      </div>
    `,
    text: `New Announcement: ${announcement.title}

Category: ${announcement.category}
Posted by: ${announcement.author}

${announcement.content}

This is an automated notification from the Announcement Dashboard.`,
  }
}

// Send announcement notification to selected users or all users
export async function sendAnnouncementNotification(announcement: Announcement, selectedEmails?: string[]) {
  try {
    // Get all users from the database
    const users = await getAllUsers()

    if (users.length === 0) {
      console.log("No users found to send notifications to")
      return {
        success: true,
        message: "No users found to send notifications to",
        recipients: [],
      }
    }

    // Filter users based on selectedEmails if provided
    const targetUsers = selectedEmails ? users.filter((user) => selectedEmails.includes(user.email)) : users

    if (targetUsers.length === 0) {
      return {
        success: true,
        message: "No selected users to send notifications to",
        recipients: [],
      }
    }

    // Format email content
    const { subject, html, text } = formatEmailContent(announcement)

    // Send emails to target users using Resend
    const results = await Promise.allSettled(
      targetUsers.map((user) =>
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
          to: user.email,
          subject,
          html,
          text,
        })
      )
    )

    // Count successful and failed deliveries
    const successful = results.filter((r) => r.status === "fulfilled")
    const failed = results.filter((r) => r.status === "rejected")

    // Get email addresses for reporting
    const successfulEmails = successful.map((_, i) => targetUsers[i].email)
    const failedEmails = failed.map((_, i) => targetUsers[i].email)

    return {
      success: successful.length > 0,
      message: `Successfully sent ${successful.length} emails${failed.length > 0 ? `, failed to send ${failed.length} emails` : ""}`,
      recipients: successfulEmails,
      failed: failedEmails,
    }
  } catch (error) {
    console.error("Error sending notification emails:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send notification",
      recipients: [],
    }
  }
}

// For development/testing, you can use this function to simulate sending emails
export async function simulateSendAnnouncementNotification(announcement: Announcement, selectedEmails?: string[]) {
  try {
    // Get actual users from the database
    const users = await getAllUsers()

    if (users.length === 0) {
      return {
        success: true,
        message: "No users found to send notifications to",
        recipients: [],
      }
    }

    // Filter users based on selectedEmails if provided
    const targetUsers = selectedEmails ? users.filter((user) => selectedEmails.includes(user.email)) : users

    if (targetUsers.length === 0) {
      return {
        success: true,
        message: "No selected users to send notifications to",
        recipients: [],
      }
    }

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Log what would happen in a real scenario
    targetUsers.forEach((user) => {
      console.log(
        `[SIMULATED] Email would be sent to ${user.email} (${user.first_name} ${user.last_name}, ${user.user_role})`,
      )
    })

    return {
      success: true,
      message: `Simulated sending emails to ${targetUsers.length} users`,
      recipients: targetUsers.map((u) => u.email),
    }
  } catch (error) {
    console.error("Error simulating emails:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to simulate emails",
      recipients: [],
    }
  }
}

