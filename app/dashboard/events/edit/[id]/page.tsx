"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast"
import { AdminOnly } from "@/components/role-based-ui"
import { createNotification } from "@/lib/notification-service"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Update the Event interface to include the logo field
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
  capacity: string
  logo?: string
  category?: string
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const router = useRouter()
  // Add a new state for logo preview
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent((prev) => ({ ...prev!, [name]: value }))
  }

  // Add a function to handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        // You would typically upload this to storage and get a URL
        // For now, we'll just update the event with the file name
        setEvent((prev) => ({ ...prev!, logo: file.name }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    // Fetch the original event for comparison
    const { data: originalEvent, error: fetchError } = await supabase.from("events").select("date, time, location, title").eq("id", event.id).single()
    if (fetchError) {
      console.error("Error fetching original event for update notification:", fetchError)
    }

    const { error } = await supabase.from("events").update(event).eq("id", event.id)

    if (error) {
      console.error("Error updating event:", error)
      toast.error("Failed to update event")
    } else {
      // If date, time, or location changed, notify registered users
      if (originalEvent && (originalEvent.date !== event.date || originalEvent.time !== event.time || originalEvent.location !== event.location)) {
        // Get all registered users
        const { data: participants, error: partError } = await supabase
          .from("event_participants")
          .select("user_id")
          .eq("event_id", event.id)
          .eq("status", "confirmed")
        if (!partError && participants && participants.length > 0) {
          for (const participant of participants) {
            await createNotification({
              user_id: participant.user_id,
              title: "Event Updated",
              content: `Update: ${event.title} has changed. New date/time/location: ${event.date} ${event.time} at ${event.location}. Please check the event details.`,
              type: "event",
              reference_id: event.id,
              read: false,
              action_url: `/dashboard/events/${event.id}`,
            })
          }
        }
      }
      toast.success("Event edited successfully")
      setTimeout(() => {
        router.push(`/dashboard/events/${event.id}`)
      }, 2000) // Redirect after 2 seconds
    }
  }

  if (!event) return <div>Loading...</div>

  return (
    <AdminOnly>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input type="text" name="title" id="title" value={event.title} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea name="description" id="description" value={event.description} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input type="date" name="date" id="date" value={event.date} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <Input type="time" name="time" id="time" value={event.time} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Input type="text" name="location" id="location" value={event.location} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
              Organizer
            </label>
            <Input
              type="text"
              name="organizer"
              id="organizer"
              value={event.organizer}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity Limit
            </label>
            <Input
              type="number"
              name="capacity"
              id="capacity"
              min="1"
              value={event.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">
              Details
            </label>
            <Textarea name="details" id="details" value={event.details} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <Input type="text" name="image" id="image" value={event.image} onChange={handleChange} />
          </div>
          {/* Add this new field to the form, after the image URL field */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Event Logo
            </label>
            <div className="flex items-center gap-4 mt-1">
              {(logoPreview || event.logo) && (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-600">
                  <img
                    src={logoPreview || (event.logo ? `/logos/${event.logo}` : "/placeholder.svg")}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                name="logo"
                id="logo"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Upload a logo for your event (recommended size: 64x64px)</p>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Select value={event.category || ""} onValueChange={value => setEvent((prev) => ({ ...prev!, category: value }))}>
              <SelectTrigger id="category" name="category">
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Governance & Public Service">Governance & Public Service</SelectItem>
                <SelectItem value="Employment, Livelihood & Economic Empowerment">Employment, Livelihood & Economic Empowerment</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Culture & Arts">Culture & Arts</SelectItem>
                <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                <SelectItem value="Social Inclusion and Equity">Social Inclusion and Equity</SelectItem>
                <SelectItem value="Disaster Risk Reduction, Resiliency & Public Safety">Disaster Risk Reduction, Resiliency & Public Safety</SelectItem>
                <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
                <SelectItem value="Environment, Agriculture & Sustainability">Environment, Agriculture & Sustainability</SelectItem>
                <SelectItem value="Global Mobility, Technology & Innovation">Global Mobility, Technology & Innovation</SelectItem>
                <SelectItem value="Peacebuilding and Security">Peacebuilding and Security</SelectItem>
                <SelectItem value="Active Citizenship">Active Citizenship</SelectItem>
                <SelectItem value="Community Events">Community Events</SelectItem>
                <SelectItem value="Infrastructure & Development">Infrastructure & Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-4">
            <Link href={`/dashboard/events/${event.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Update Event</Button>
          </div>
        </form>
      </div>
    </AdminOnly>
  )
}

