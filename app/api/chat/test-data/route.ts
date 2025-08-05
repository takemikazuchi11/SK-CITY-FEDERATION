import { NextResponse } from "next/server"
import { getUpcomingEvents, getEventsByMonth } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const testMonth = searchParams.get("month")
    const testYear = searchParams.get("year")

    // Get current date
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1

    // Test upcoming events
    const upcomingEvents = await getUpcomingEvents(10)
    
    // Test all events in database
    const { data: allEvents, error: allEventsError } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false })
      .limit(20)

    let monthEvents = []
    if (testMonth && testYear) {
      monthEvents = await getEventsByMonth(parseInt(testYear), parseInt(testMonth))
    } else {
      // Test current month
      monthEvents = await getEventsByMonth(currentYear, currentMonth)
    }

    return NextResponse.json({
      success: true,
      currentDate: today.toISOString(),
      upcomingEvents: {
        count: upcomingEvents.length,
        events: upcomingEvents.map(e => ({ title: e.title, date: e.date, location: e.location }))
      },
      allEvents: {
        count: allEvents?.length || 0,
        error: allEventsError?.message
      },
      monthEvents: {
        month: testMonth || currentMonth,
        year: testYear || currentYear,
        count: monthEvents.length,
        events: monthEvents.map(e => ({ title: e.title, date: e.date, location: e.location }))
      },
      message: "Data fetch test completed successfully"
    })

  } catch (error) {
    console.error("Error in data test:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      success: false
    }, { status: 500 })
  }
} 