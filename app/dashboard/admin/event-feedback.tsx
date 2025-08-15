"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Search, ChevronLeft, ChevronRight, Filter, MoreHorizontal, Trash2, Mail, Printer } from "lucide-react"
import { toast } from "sonner"

const feedbackPerPage = 10

export default function EventFeedbackAdminTable() {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [events, setEvents] = useState<{ id: string; title: string }[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [feedbackToDelete, setFeedbackToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchFeedback()
  }, [searchQuery, eventFilter, ratingFilter, currentPage])

  async function fetchEvents() {
    // Get all events with feedback for filter dropdown
    const { data, error } = await supabase.from("events").select("id, title").order("title")
    if (!error && data) setEvents(data)
  }

  async function fetchFeedback() {
    setLoading(true)
    // Pagination
    const from = (currentPage - 1) * feedbackPerPage
    const to = from + feedbackPerPage - 1
    // Build query
    let query = supabase
      .from("event_feedback")
      .select(`id, rating, comments, created_at, event_id, user_id, events (title), users (first_name, last_name, email)`, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)
    // Search
    if (searchQuery) {
      query = query.or(
        `comments.ilike.%${searchQuery}%,users.first_name.ilike.%${searchQuery}%,users.last_name.ilike.%${searchQuery}%`
      )
    }
    // Event filter
    if (eventFilter !== "all") {
      query = query.eq("event_id", eventFilter)
    }
    // Rating filter
    if (ratingFilter !== "all") {
      query = query.eq("rating", Number(ratingFilter))
    }
    const { data, count, error } = await query
    if (!error) {
      setFeedback(data || [])
      setTotalPages(count ? Math.ceil(count / feedbackPerPage) : 1)
    }
    setLoading(false)
  }

  const handleDeleteFeedback = (feedbackItem: any) => {
    setFeedbackToDelete(feedbackItem)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteFeedback = async () => {
    if (!feedbackToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from("event_feedback")
        .delete()
        .eq("id", feedbackToDelete.id)

      if (error) {
        console.error("Error deleting feedback:", error)
        toast.error("Failed to delete feedback")
        return
      }

      toast.success("Feedback deleted successfully")
      fetchFeedback() // Refresh the list
    } catch (error) {
      console.error("Error deleting feedback:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setFeedbackToDelete(null)
    }
  }

  const handleSendEmail = (feedbackItem: any) => {
    const userEmail = feedbackItem.users?.email
    if (!userEmail) {
      toast.error("User email not found")
      return
    }

    // Open default email client with pre-filled content
    const subject = encodeURIComponent(`Response to your feedback for ${feedbackItem.events?.title}`)
    const body = encodeURIComponent(`Dear ${feedbackItem.users?.first_name || 'User'},

Thank you for your feedback on the event "${feedbackItem.events?.title}".

Your rating: ${feedbackItem.rating}/5
Your comments: ${feedbackItem.comments || 'No comments provided'}

We appreciate your input and will use it to improve future events.

Best regards,
SKCF Admin Team`)

    window.open(`mailto:${userEmail}?subject=${subject}&body=${body}`, '_blank')
    toast.success("Email client opened")
  }

  function handleExportCSV() {
    try {
      const headers = ["Event","User","Rating","Comments","Date"]
      const csvRows = [
        headers.join(","),
        ...feedback.map(fb => [
          `"${fb.events?.title || fb.event_id}"`,
          `"${fb.users ? `${fb.users.first_name} ${fb.users.last_name}` : fb.user_id}"`,
          `${fb.rating}`,
          `"${(fb.comments || "").replace(/"/g, '""')}"`,
          new Date(fb.created_at).toLocaleString()
        ].join(","))
      ]
      const csvContent = csvRows.join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `event_feedback_${new Date().toISOString().slice(0,10)}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      alert("Failed to export feedback")
    }
  }

  function handlePrintTable() {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error("Please allow popups to print the table")
        return
      }

      // Get current filters for the print header
      const filterInfo = []
      if (eventFilter !== "all") {
        const selectedEvent = events.find(e => e.id === eventFilter)
        if (selectedEvent) filterInfo.push(`Event: ${selectedEvent.title}`)
      }
      if (ratingFilter !== "all") filterInfo.push(`Rating: ${ratingFilter} Stars`)
      if (searchQuery) filterInfo.push(`Search: "${searchQuery}"`)

      // Create the print content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>SK Federation - Event Feedback Report</title>
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
            .rating { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .rating-5 { background-color: #10b981; color: white; }
            .rating-4 { background-color: #22c55e; color: white; }
            .rating-3 { background-color: #f59e0b; color: white; }
            .rating-2 { background-color: #f97316; color: white; }
            .rating-1 { background-color: #ef4444; color: white; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">SK Federation - Event Feedback Report</div>
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
                <th>User</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${feedback.map((fb) => `
                <tr>
                  <td>${fb.events?.title || fb.event_id}</td>
                  <td>${fb.users ? `${fb.users.first_name} ${fb.users.last_name}` : fb.user_id}</td>
                  <td>
                    <span class="rating rating-${fb.rating}">${fb.rating} Stars</span>
                  </td>
                  <td>${fb.comments || "—"}</td>
                  <td>${new Date(fb.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Total Feedback Entries: ${feedback.length}</p>
            <p>This report was generated from the SK Federation Event Feedback System</p>
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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setCurrentPage(1)
    fetchFeedback()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Feedback</CardTitle>
        <CardDescription>View and manage all event feedback submitted by users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(ev => (
                    <SelectItem key={ev.id} value={ev.id}>{ev.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[5,4,3,2,1].map(r => (
                    <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>
                  ))}
                </SelectContent>
              </Select>
                        <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrintTable} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading feedback...</TableCell>
                  </TableRow>
                ) : feedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">No feedback submitted yet.</TableCell>
                  </TableRow>
                ) : (
                  feedback.map(fb => (
                    <TableRow key={fb.id}>
                      <TableCell>{fb.events?.title || fb.event_id}</TableCell>
                      <TableCell>{fb.users ? `${fb.users.first_name} ${fb.users.last_name}` : fb.user_id}</TableCell>
                      <TableCell>
                        <Badge variant="success">{fb.rating} / 5</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={fb.comments || undefined}>
                          {fb.comments || <span className="text-gray-400">—</span>}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(fb.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleSendEmail(fb)}
                            >
                              <Mail className="h-4 w-4" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-red-600 cursor-pointer"
                              onClick={() => handleDeleteFeedback(fb)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Feedback</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">Page {currentPage} of {totalPages}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Delete Feedback Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFeedback}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Feedback"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
} 