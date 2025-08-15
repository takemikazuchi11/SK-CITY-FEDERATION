import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "RESEND_API_KEY not configured",
          message: "Please set RESEND_API_KEY in your environment variables"
        },
        { status: 400 }
      )
    }

    // Test sending a simple email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to: "test@example.com", // This will fail but we can test the connection
      subject: "Test Email from Resend",
      html: "<p>This is a test email to verify Resend integration.</p>",
    })

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: "Resend API key is valid but there was an error sending email"
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Resend integration is working correctly!",
      data: data,
      config: {
        apiKeyConfigured: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL || "Not configured"
      }
    })

  } catch (error) {
    console.error("Error testing Resend:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to test Resend integration"
      },
      { status: 500 }
    )
  }
}
