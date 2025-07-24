"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowLeft, Clock, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast"
import { EventRegistrationButton } from "@/components/event-registration-button"
import { AdminOnly } from "@/components/role-based-ui"
import { useAuth } from "@/lib/auth-context"
import { createNotification } from "@/lib/notification-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Event {
  id: string
  title: string
  description: string
  image: string
  date: string
  time: string
  location: string
  organizer: string
  details: string
  capacity?: number
  logo?: string
  category?: string
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [])

  async function fetchEvent() {
    const { data, error } = await supabase.from("events").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching event:", error)
      return
    }

    setEvent(data)
  }

  const handleEdit = () => {
    router.push(`/dashboard/events/edit/${params.id}`)
  }

  const handleCancel = async () => {
    if (!event) return
    // Notify all registered users before deleting
    const { data: participants, error: partError } = await supabase
      .from("event_participants")
      .select("user_id")
      .eq("event_id", event.id)
      .eq("status", "confirmed")
    if (!partError && participants && participants.length > 0) {
      for (const participant of participants) {
        await createNotification({
          user_id: participant.user_id,
          title: "Event Cancelled",
          content: `We’re sorry, but ${event.title} scheduled for ${event.date} has been cancelled.`,
          type: "event",
          reference_id: event.id,
          read: false,
          action_url: `/dashboard/events/${event.id}`,
        })
      }
    }
    // Delete the event from the database
    const { error } = await supabase.from("events").delete().eq("id", event.id)
    if (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to cancel event")
    } else {
      toast.success("Event cancelled and users notified")
      router.push("/dashboard/events")
    }
  }

  // Helper to format date/time for Google Calendar (YYYYMMDDTHHmmssZ)
  function getGoogleCalendarUrl(event: Event) {
    // Assume event.date is YYYY-MM-DD and event.time is HH:mm (24h)
    const startDateTime = new Date(`${event.date}T${event.time}`)
    // Default to 2 hours duration
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000)
    const pad = (n: number) => n.toString().padStart(2, '0')
    const format = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
    const start = format(startDateTime)
    const end = format(endDateTime)
    const url = new URL('https://calendar.google.com/calendar/render')
    url.searchParams.set('action', 'TEMPLATE')
    url.searchParams.set('text', event.title)
    url.searchParams.set('dates', `${start}/${end}`)
    url.searchParams.set('details', event.description)
    url.searchParams.set('location', event.location)
    return url.toString()
  }

  if (!event) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard/events" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 px-4 md:px-8">
          <div className="relative h-[300px] md:h-[400px] w-full mb-6 rounded-lg overflow-hidden">
            <Image src={event.image || "/placeholder.svg"} alt={`${event.title} event`} fill className="object-cover" />
          </div>

          <h1 className="text-3xl font-bold text-blue-700 mb-4">{event.title}</h1>

          <p className="text-slate-600 mb-6">{event.description}</p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Event Details</h2>
            <p className="text-slate-600 whitespace-pre-line">{event.details}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-slate-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-slate-800">Date</h3>
                  <p className="text-slate-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-slate-800">Time</h3>
                  <p className="text-slate-600">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-slate-800">Location</h3>
                  <p className="text-slate-600">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-5 w-5 text-slate-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-slate-800">Organizer</h3>
                  <p className="text-slate-600">{event.organizer}</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="h-5 w-5 mt-0.5 mr-3 inline-block" />
                <div>
                  <h3 className="font-medium text-slate-800">Category</h3>
                  <p className="text-blue-700 font-semibold">{event.category || '—'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-5 w-5 text-slate-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-slate-800">Capacity</h3>
                  <p className="text-slate-600">{event.capacity || "Unlimited"}</p>
                </div>
              </div>

              {event.logo && (
                <div className="flex items-start mt-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-600 mr-3">
                    <img
                      src={`/logos/${event.logo}`}
                      alt={`${event.title} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">Event Logo</h3>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <EventRegistrationButton eventId={event.id} eventDate={event.date} className="w-full" feedbackButtonColor="blue" endedButtonColor="red" />
              <a
                href={getGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  Add to Calendar
                </Button>
              </a>

              <AdminOnly>
                <Button onClick={handleEdit} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  <Edit className="mr-2 h-4 w-4" /> Edit Event
                </Button>
                <Button onClick={() => setIsCancelDialogOpen(true)} className="w-full bg-red-600 text-white hover:bg-red-700" variant="destructive">
                  Cancel Event
                </Button>
                <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this event? This action cannot be undone and all registered users will be notified.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>No, go back</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">Yes, Cancel Event</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AdminOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
