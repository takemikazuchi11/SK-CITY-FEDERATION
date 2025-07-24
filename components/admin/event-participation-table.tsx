"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, ChevronLeft, ChevronRight, Users, Calendar, AlertCircle, Eye } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EventParticipantsModal } from "./event-participants-modal"

interface Event {
  id: string
  title: string
  date: string
  location: string
  participant_count: number
  capacity: number
}

export function EventParticipationTable() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tableExists, setTableExists] = useState(true)
  const eventsPerPage = 10
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)

  useEffect(() => {
    // Check if event_participants table exists
    const checkTable = async () => {
      try {
        const { error } = await supabase.from("event_participants").select("id").limit(1)

        if (error && error.code === "42P01") {
          // Table doesn't exist
          setTableExists(false)
        }
      } catch (error) {
        console.error("Error checking table:", error)
        setTableExists(false)
      }
    }

    checkTable()
    fetchEvents()
  }, [currentPage, searchQuery])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)

      // Calculate pagination
      const from = (currentPage - 1) * eventsPerPage
      const to = from + eventsPerPage - 1

      // Get events
      const {
        data: eventData,
        error: eventError,
        count,
      } = await supabase
        .from("events")
        .select("*", { count: "exact" })
        .ilike("title", searchQuery ? `%${searchQuery}%` : "%")
        .range(from, to)
        .order("date", { ascending: false })

      if (eventError) throw eventError

      let formattedEvents: Event[] = []

      if (tableExists) {
        // Try to get participant counts
        try {
          formattedEvents = await Promise.all(
            (eventData || []).map(async (event) => {
              try {
                const { count: participantCount } = await supabase
                  .from("event_participants")
                  .select("*", { count: "exact", head: true })
                  .eq("event_id", event.id)

                return {
                  id: event.id,
                  title: event.title,
                  date: event.date,
                  location: event.location,
                  participant_count: participantCount || 0,
                  capacity: event.capacity || 100,
                }
              } catch (err) {
                return {
                  id: event.id,
                  title: event.title,
                  date: event.date,
                  location: event.location,
                  participant_count: 0,
                  capacity: event.capacity || 100,
                }
              }
            }),
          )
        } catch (error) {
          console.error("Error getting participant counts:", error)
          // Fall back to basic event data
          formattedEvents = (eventData || []).map((event) => ({
            id: event.id,
            title: event.title,
            date: event.date,
            location: event.location,
            participant_count: 0,
            capacity: event.capacity || 100,
          }))
        }
      } else {
        // Table doesn't exist, use random data for demonstration
        formattedEvents = (eventData || []).map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          participant_count: Math.floor(Math.random() * ((event.capacity || 100) * 0.8)), // Random participants
          capacity: event.capacity || 100,
        }))
      }

      setEvents(formattedEvents)

      // Calculate total pages
      if (count) {
        setTotalPages(Math.ceil(count / eventsPerPage))
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Failed to load events")

      // Set empty events array
      setEvents([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchEvents()
  }

  const handleExportCSV = () => {
    try {
      // Convert events to CSV
      const headers = ["ID", "Event Title", "Date", "Location", "Participants", "Capacity", "Fill Rate (%)"]
      const csvRows = [
        headers.join(","),
        ...events.map((event) => {
          const fillRate = Math.round((event.participant_count / event.capacity) * 100)
          return [
            event.id,
            `"${event.title}"`,
            format(new Date(event.date), "yyyy-MM-dd"),
            `"${event.location}"`,
            event.participant_count,
            event.capacity,
            fillRate,
          ].join(",")
        }),
      ]

      const csvContent = csvRows.join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `event_participation_${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Event data exported successfully")
    } catch (error) {
      console.error("Error exporting events:", error)
      toast.error("Failed to export event data")
    }
  }

  const handleViewParticipants = (event: Event) => {
    setSelectedEvent(event)
    setShowParticipantsModal(true)
  }

  return (
    <div className="space-y-4">
      {!tableExists && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing event_participants table</AlertTitle>
          <AlertDescription>
            The event_participants table doesn't exist in your database. Showing simulated participation data for
            demonstration purposes.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Fill Rate</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading events...
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const fillRate = Math.round((event.participant_count / event.capacity) * 100)
                return (
                  <TableRow key={event.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {event.title}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        {event.participant_count}
                      </div>
                    </TableCell>
                    <TableCell>{event.capacity}</TableCell>
                    <TableCell>
                      <div className="w-full flex items-center gap-2">
                        <Progress value={fillRate} className="h-2" />
                        <span className="text-xs font-medium">{fillRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewParticipants(event)}
                        className="flex items-center gap-1 opacity-70 hover:opacity-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {selectedEvent && (
        <EventParticipantsModal
          event={selectedEvent}
          isOpen={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
        />
      )}
    </div>
  )
}
