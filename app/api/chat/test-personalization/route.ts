import { NextResponse } from "next/server"
import { getUserAnalytics, getPersonalizedEventRecommendations } from "@/lib/user-analytics"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required",
        example: "/api/chat/test-personalization?userId=your-user-id"
      })
    }

    // Test user analytics
    const analytics = await getUserAnalytics(userId)
    const recommendations = await getPersonalizedEventRecommendations(userId, 5)

    return NextResponse.json({
      success: true,
      userId,
      analytics,
      recommendations,
      message: "Personalization test completed successfully"
    })

  } catch (error) {
    console.error("Error in personalization test:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      success: false
    }, { status: 500 })
  }
} 