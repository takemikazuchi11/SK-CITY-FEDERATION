"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { supabase } from "@/lib/supabase"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { AdminOnly } from "@/components/role-based-ui"
import "./calendar.css"
import Image from "next/image"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

interface Event {
  id: string
  title: string
  description: string
  image: string
  date: string
  time: string
  location: string
  organizer: string
  start: Date // For calendar
  end: Date // For calendar
  category?: string // Added for category
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  "Governance & Public Service": "bg-blue-600",
  "Employment, Livelihood & Economic Empowerment": "bg-green-600",
  "Education": "bg-yellow-500",
  "Culture & Arts": "bg-pink-500",
  "Health & Wellness": "bg-red-500",
  "Social Inclusion and Equity": "bg-purple-600",
  "Disaster Risk Reduction, Resiliency & Public Safety": "bg-orange-600",
  "Sports & Recreation": "bg-teal-600",
  "Environment, Agriculture & Sustainability": "bg-lime-600",
  "Global Mobility, Technology & Innovation": "bg-cyan-600",
  "Peacebuilding and Security": "bg-indigo-600",
  "Active Citizenship": "bg-fuchsia-600",
  "Community Events": "bg-gray-600",
  "Infrastructure & Development": "bg-amber-700",
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState("month")
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase.from("events").select("*")

    if (error) {
      console.error("Error fetching events:", error)
      return
    }

    // Transform the data for the calendar
    const formattedEvents = data.map((event) => {
      const eventDate = new Date(event.date)
      const [hours, minutes] = event.time.split(":").map(Number)

      const startDate = new Date(eventDate)
      startDate.setHours(hours || 0, minutes || 0)

      const endDate = new Date(startDate)
      endDate.setHours(startDate.getHours() + 2) // Default 2 hour duration

      return {
        ...event,
        start: startDate,
        end: endDate,
      }
    })

    // Filter out past events when displaying in the calendar
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day

    // Log for debugging
    console.log(`Today's date for filtering: ${today.toISOString()}`)

    setEvents(formattedEvents)
  }

  const handleEventClick = (event: Event) => {
    router.push(`/dashboard/events/${event.id}`)
  }

  // Navigation handlers
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    const newDate = new Date(date)

    if (action === "PREV") {
      if (view === "month") {
        newDate.setMonth(date.getMonth() - 1)
      } else if (view === "week") {
        newDate.setDate(date.getDate() - 7)
      } else if (view === "day") {
        newDate.setDate(date.getDate() - 1)
      }
    } else if (action === "NEXT") {
      if (view === "month") {
        newDate.setMonth(date.getMonth() + 1)
      } else if (view === "week") {
        newDate.setDate(date.getDate() + 7)
      } else if (view === "day") {
        newDate.setDate(date.getDate() + 1)
      }
    } else if (action === "TODAY") {
      return setDate(new Date())
    }

    setDate(newDate)
  }

  // Custom event component with tooltip
  const EventComponent = ({ event }: { event: Event }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-full w-full p-1 overflow-hidden cursor-pointer" onClick={() => handleEventClick(event)}>
            <div className="text-xs font-semibold truncate">{event.title}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="p-2 max-w-xs">
            <h3 className="font-bold">{event.title}</h3>
            <p className="text-xs mt-1">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p className="text-xs">{event.location}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-red-600 text-white px-12 py-3 text-3xl font-bold text-center shadow-md mx-auto inline-block">
          Event Calendar
        </div>
      </div>

      {/* Logo placeholders section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-600">
            <Image src={SK || "/placeholder.svg"} alt="Logo 1" width={64} height={64} className="object-cover" />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-600">
            <Image src={CALAP || "/placeholder.svg"} alt="Logo 3" width={64} height={64} className="object-cover" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <AdminOnly>
          <Link href="/dashboard/events/create">
            <Button className="bg-slate-900 text-white hover:bg-slate-800">Create New Event</Button>
          </Link>
        </AdminOnly>
        <Link href="/dashboard">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {/* Custom toolbar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Button variant="outline" onClick={() => handleNavigate("PREV")} className="mr-2">
              Previous
            </Button>
            <Button variant="outline" onClick={() => handleNavigate("TODAY")}>
              Today
            </Button>
            <Button variant="outline" onClick={() => handleNavigate("NEXT")} className="ml-2">
              Next
            </Button>
          </div>
          <div>
            <span className="text-lg font-semibold">{moment(date).format("MMMM YYYY")}</span>
          </div>
          <div className="flex">
            <Button variant="ghost" onClick={() => setView("month")} className={view === "month" ? "bg-slate-200" : ""}>
              Month
            </Button>
            <Button variant="ghost" onClick={() => setView("week")} className={view === "week" ? "bg-slate-200" : ""}>
              Week
            </Button>
            <Button variant="ghost" onClick={() => setView("day")} className={view === "day" ? "bg-slate-200" : ""}>
              Day
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8 relative overflow-hidden">
        {/* Legend above the month/year */}
        <div className="flex items-center justify-center space-x-8 mb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-3 rounded bg-blue-600"></span>
            <span className="text-blue-700 font-semibold">Upcoming Event</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-3 rounded bg-red-600"></span>
            <span className="text-red-600 font-semibold">Already Happened</span>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Image src={SK} alt="SK Logo" width={600} height={600} className="opacity-10" style={{zIndex:0}} />
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, position: 'relative', zIndex: 1 }}
          date={date}
          view={view as any}
          onNavigate={(date) => setDate(date)}
          onView={(view) => setView(view)}
          components={{
            event: (props: any) => {
              const today = new Date();
              today.setHours(0,0,0,0);
              const isPast = props.event.end < today;
              const bg = isPast ? 'bg-red-600 text-white' : 'bg-blue-600 text-white';
              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`h-full w-full p-1 overflow-hidden cursor-pointer rounded ${bg}`} style={{border: 'none', boxShadow: 'none'}} onClick={() => handleEventClick(props.event)}>
                        <div className="text-xs font-semibold truncate">{props.event.title}</div>
                        {props.event.category && (
                          <div className={`text-[10px] font-medium mt-0.5 truncate px-2 py-0.5 rounded-full text-white shadow ${CATEGORY_COLORS[props.event.category] || 'bg-gray-400'}`}>{props.event.category}</div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="p-2 max-w-xs">
                        <h3 className="font-bold">{props.event.title}</h3>
                        <p className="text-xs mt-1">
                          {new Date(props.event.date).toLocaleDateString()} at {props.event.time}
                        </p>
                        <p className="text-xs">{props.event.location}</p>
                        {props.event.category && (
                          <p className={`text-xs mt-1 font-semibold inline-block px-2 py-0.5 rounded-full text-white shadow ${CATEGORY_COLORS[props.event.category] || 'bg-gray-400'}`}>{props.event.category}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            },
            toolbar: () => null,
          }}
          onSelectEvent={handleEventClick}
          popup={false}
          views={["month", "week", "day"]}
          eventPropGetter={(event, start, end, isSelected) => {
            // Remove all borders from events
            return {
              style: {
                border: 'none',
                boxShadow: 'none',
              },
            };
          }}
          dayPropGetter={(date) => {
            // Light blue for today, no green
            const today = new Date();
            today.setHours(0,0,0,0);
            const isToday = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
            return isToday
              ? { style: { background: 'rgba(59,130,246,0.08)' } } // Tailwind blue-600 at 8% opacity
              : {};
          }}
        />
      </div>
    </div>
  )
}

