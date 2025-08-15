import type { NextApiRequest, NextApiResponse } from "next"
import { Resend } from "resend"
import { getAllUsersEmails } from "@/lib/supabase" // Function to fetch all user emails

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { title, content, author } = req.body

  if (!title || !content || !author) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // 2. Get all users
    const users = (await getAllUsersEmails()) || [] // Fetch all user emails

    if (!users.length) {
      console.error("No users found to send emails.")
      return res.status(400).json({ error: "No recipients found" })
    }

    console.log(
      "Sending emails to:",
      users.map((user) => user.email || "Unknown Email"),
    )

    let emailErrors = 0

    // 3. Send email to each user using Resend
    for (const user of users) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
          to: user.email,
          subject: `New Announcement: ${title}`,
          html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">${title}</h1>
                <p style="white-space: pre-line; color: #555;">${content}</p>
                <p style="color: #777; font-style: italic;">Posted by ${author}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
              </div>
            `,
        })
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError)
        emailErrors++
      }
    }

    console.log(`Email sending completed. Success: ${users.length - emailErrors}, Failed: ${emailErrors}`)

    // Return the announcement with email status
    return res.status(200).json({
      emailStatus: emailErrors === 0 ? "all_sent" : emailErrors === users.length ? "none_sent" : "partial_sent",
      emailErrors,
    })
  } catch (error) {
    console.error("Error sending announcement emails:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

