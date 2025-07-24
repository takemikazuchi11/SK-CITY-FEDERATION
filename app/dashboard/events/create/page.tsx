"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import toast, { Toaster } from "react-hot-toast"
import { AdminOnly } from "@/components/role-based-ui"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function CreateEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    details: "",
    image: "",
    capacity: "100",
    category: "",
  })

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.from("events").insert([formData])

    if (error) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event. Please try again.")
    } else {
      toast.success("Successfully Created Event")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000) // Redirect after 2 seconds
    }
  }

  return (
    <AdminOnly>
      <div className="container mx-auto px-4 py-8">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date</Label>
                    <div className="relative">
                      <Input id="date" name="date" value={formData.date} onChange={handleChange} type="date" required />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Event Time</Label>
                    <Input id="time" name="time" value={formData.time} onChange={handleChange} type="time" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Event Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter event location"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer">Event Organizer</Label>
                  <Input
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Enter event organizer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity Limit</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Maximum number of participants"
                    required
                  />
                  <p className="text-sm text-gray-500">Maximum number of participants allowed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange} required>
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

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a short description of your event"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Event Details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Provide detailed information about your event"
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL for your event"
                  />
                  <p className="text-sm text-gray-500">Enter a URL for the event image</p>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                    Create Event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminOnly>
  )
}

