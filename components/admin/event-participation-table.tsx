"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, ChevronLeft, ChevronRight, Users, Calendar, AlertCircle, Eye, Printer } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EventParticipantsModal } from "./event-participants-modal"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

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
  const tableRef = useRef<HTMLDivElement | null>(null)

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

  const handleExportPDF = async () => {
    if (!tableRef.current) {
      toast.error("Table is not ready to export")
      return
    }

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`event_participation_${format(new Date(), "yyyy-MM-dd")}.pdf`)
      toast.success("Event participation PDF exported successfully")
    } catch (error) {
      console.error("Error exporting event participation PDF:", error)
      toast.error("Failed to export event participation PDF")
    }
  }

  const handlePrintTable = () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error("Please allow popups to print the table")
        return
      }

      // Get current filters for the print header
      const filterInfo = []
      if (searchQuery) filterInfo.push(`Search: "${searchQuery}"`)

      // Create the print content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>SK Federation - Event Participation Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
            .subtitle { font-size: 16px; color: #6b7280; margin-bottom: 20px; }
            .filters { margin-bottom: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 5px; }
            .filters span { margin-right: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #1e3a8a; color: white; font-weight: bold; }
            .fill-rate { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .fill-rate-high { background-color: #10b981; color: white; }
            .fill-rate-medium { background-color: #f59e0b; color: white; }
            .fill-rate-low { background-color: #ef4444; color: white; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">SK Federation - Event Participation Report</div>
            <div class="subtitle">Sangguniang Kabataan Lungsod ng Calapan</div>
          </div>

          ${filterInfo.length > 0 ? `
            <div class="filters">
              <strong>Applied Filters:</strong><br>
              ${filterInfo.map(filter => `<span>• ${filter}</span>`).join('<br>')}
            </div>
          ` : ''}

          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Participants</th>
                <th>Capacity</th>
                <th>Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              ${events.map((event) => {
                const fillRate = Math.round((event.participant_count / event.capacity) * 100)
                let fillRateClass = 'fill-rate-low'
                if (fillRate >= 80) fillRateClass = 'fill-rate-high'
                else if (fillRate >= 50) fillRateClass = 'fill-rate-medium'
                
                return `
                  <tr>
                    <td>${event.title}</td>
                    <td>${format(new Date(event.date), "MMM d, yyyy")}</td>
                    <td>${event.location}</td>
                    <td>${event.participant_count}</td>
                    <td>${event.capacity}</td>
                    <td>
                      <span class="fill-rate ${fillRateClass}">${fillRate}%</span>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Total Events: ${events.length}</p>
            <p>This report was generated from the SK Federation Event Participation System</p>
          </div>
        </body>
        </html>
      `

      // Write content to the new window
      printWindow.document.write(printContent)
      printWindow.document.close()

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print()
        // Close the window after a short delay to ensure print dialog opens
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }, 100)

      toast.success("Opening print preview...")
    } catch (error) {
      console.error("Error printing table:", error)
      toast.error("Failed to print table")
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

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handlePrintTable} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div ref={tableRef} className="rounded-md border">
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
