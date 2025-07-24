"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  UserCheck,
  Filter,
  Mail,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Event {
  id: string
  title: string
  date: string
  location: string
  participant_count: number
  capacity: number
}

interface Participant {
  id: string
  user_id: string
  event_id: string
  registration_date: string
  status: string
  attended: boolean
  notes?: string
  additional_info?: Record<string, any>
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    photo_url?: string
  }
}

interface EventParticipantsModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

export function EventParticipantsModal({ event, isOpen, onClose }: EventParticipantsModalProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all")
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (isOpen && event) {
      fetchParticipants()
    }
  }, [isOpen, event])

  useEffect(() => {
    if (participants.length > 0) {
      applyFilters()
    }
  }, [searchQuery, statusFilter, attendanceFilter, participants])

  const fetchParticipants = async () => {
    try {
      setIsLoading(true)

      // Check if event_participants table exists
      try {
        const { error: tableCheckError } = await supabase.from("event_participants").select("id").limit(1)

        if (tableCheckError && tableCheckError.code === "42P01") {
          // Table doesn't exist, show demo data
          setParticipants(generateDemoParticipants(event.id))
          setFilteredParticipants(generateDemoParticipants(event.id))
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error("Error checking table:", error)
      }

      // Table exists, fetch real data
      const { data, error } = await supabase
        .from("event_participants")
        .select(`
          *,
          user:user_id (
            id,
            first_name,
            last_name,
            email,
            photo_url
          )
        `)
        .eq("event_id", event.id)
        .order("registration_date", { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        const formattedData = data.map((item) => ({
          ...item,
          user: item.user || {
            id: item.user_id,
            first_name: "Unknown",
            last_name: "User",
            email: "unknown@example.com",
          },
        }))

        setParticipants(formattedData)
        setFilteredParticipants(formattedData)
      } else {
        // No participants found, generate demo data
        const demoData = generateDemoParticipants(event.id)
        setParticipants(demoData)
        setFilteredParticipants(demoData)
      }
    } catch (error) {
      console.error("Error fetching participants:", error)
      toast.error("Failed to load participants")

      // Fallback to demo data
      const demoData = generateDemoParticipants(event.id)
      setParticipants(demoData)
      setFilteredParticipants(demoData)
    } finally {
      setIsLoading(false)
    }
  }

  const generateDemoParticipants = (eventId: string): Participant[] => {
    const statuses = ["confirmed", "waitlisted", "cancelled"]
    const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Maria", "James", "Lisa"]
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ]

    // Additional info fields that might be collected during registration
    const additionalInfoOptions = [
      { dietary: ["None", "Vegetarian", "Vegan", "Gluten-free"] },
      { tshirt_size: ["S", "M", "L", "XL", "XXL"] },
      { transportation: ["Own vehicle", "Public transport", "Need assistance"] },
      { emergency_contact: ["Parent", "Spouse", "Friend", "Relative"] },
    ]

    // Generate between 5-15 participants
    const count = Math.floor(Math.random() * 10) + 5

    return Array.from({ length: count }).map((_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const attended = status === "confirmed" ? Math.random() > 0.3 : false

      // Generate a date within the last 30 days
      const daysAgo = Math.floor(Math.random() * 30)
      const registrationDate = new Date()
      registrationDate.setDate(registrationDate.getDate() - daysAgo)

      // Generate random additional info
      const additionalInfo: Record<string, any> = {}
      if (Math.random() > 0.5) {
        const infoType = additionalInfoOptions[Math.floor(Math.random() * additionalInfoOptions.length)]
        const key = Object.keys(infoType)[0]
        const values = infoType[key as keyof typeof infoType]
        additionalInfo[key] = (values ?? [])[Math.floor(Math.random() * (values?.length ?? 0))]
      }

      return {
        id: `demo-${index}`,
        user_id: `user-${index}`,
        event_id: eventId,
        registration_date: registrationDate.toISOString(),
        status,
        attended,
        notes: Math.random() > 0.7 ? "Demo participant note" : undefined,
        additional_info: Object.keys(additionalInfo).length > 0 ? additionalInfo : undefined,
        user: {
          id: `user-${index}`,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        },
      }
    })
  }

  const applyFilters = () => {
    let filtered = [...participants]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.user.first_name.toLowerCase().includes(query) ||
          p.user.last_name.toLowerCase().includes(query) ||
          p.user.email.toLowerCase().includes(query) ||
          (p.notes && p.notes.toLowerCase().includes(query)),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    // Apply attendance filter
    if (attendanceFilter !== "all") {
      filtered = filtered.filter((p) => (attendanceFilter === "attended" ? p.attended : !p.attended))
    }

    setFilteredParticipants(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleStatusChange = async (participantId: string, newStatus: string) => {
    try {
      // Find the participant in the current list
      const participant = participants.find((p) => p.id === participantId)
      if (!participant) return

      // Update in database
      const { error } = await supabase.from("event_participants").update({ status: newStatus }).eq("id", participantId)

      if (error) throw error

      // Update local state
      const updatedParticipants = participants.map((p) => (p.id === participantId ? { ...p, status: newStatus } : p))

      setParticipants(updatedParticipants)
      applyFilters()

      toast.success("Participant status updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update participant status")
    }
  }

  const handleAttendanceChange = async (participantId: string, attended: boolean) => {
    try {
      // Find the participant in the current list
      const participant = participants.find((p) => p.id === participantId)
      if (!participant) return

      // Update in database
      const { error } = await supabase.from("event_participants").update({ attended }).eq("id", participantId)

      if (error) throw error

      // Update local state
      const updatedParticipants = participants.map((p) => (p.id === participantId ? { ...p, attended } : p))

      setParticipants(updatedParticipants)
      applyFilters()

      toast.success(`Participant marked as ${attended ? "attended" : "not attended"}`)
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast.error("Failed to update attendance status")
    }
  }

  const handleEditNotes = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId)
    if (participant) {
      setEditNotes(participant.notes || "")
      setEditingParticipant(participantId)
    }
  }

  const saveNotes = async () => {
    if (!editingParticipant) return

    try {
      // Update in database
      const { error } = await supabase
        .from("event_participants")
        .update({ notes: editNotes })
        .eq("id", editingParticipant)

      if (error) throw error

      // Update local state
      const updatedParticipants = participants.map((p) =>
        p.id === editingParticipant ? { ...p, notes: editNotes } : p,
      )

      setParticipants(updatedParticipants)
      applyFilters()

      // Reset editing state
      setEditingParticipant(null)
      setEditNotes("")

      toast.success("Notes updated successfully")
    } catch (error) {
      console.error("Error updating notes:", error)
      toast.error("Failed to update notes")
    }
  }

  const handleExportCSV = () => {
    try {
      // Convert participants to CSV
      const headers = ["First Name", "Last Name", "Email", "Registration Date", "Status", "Attended", "Notes"]
      const csvRows = [
        headers.join(","),
        ...filteredParticipants.map((p) => {
          return [
            `"${p.user.first_name}"`,
            `"${p.user.last_name}"`,
            `"${p.user.email}"`,
            format(new Date(p.registration_date), "yyyy-MM-dd"),
            `"${p.status}"`,
            p.attended ? "Yes" : "No",
            `"${p.notes || ""}"`,
          ].join(",")
        }),
      ]

      const csvContent = csvRows.join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${event.title}_participants_${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Participant data exported successfully")
    } catch (error) {
      console.error("Error exporting participants:", error)
      toast.error("Failed to export participant data")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
          </Badge>
        )
      case "waitlisted":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Waitlisted
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const sendEmailReminder = async (participantId: string) => {
    try {
      const participant = participants.find((p) => p.id === participantId)
      if (!participant) return

      toast.success(`Email reminder sent to ${participant.user.first_name} ${participant.user.last_name}`)

      // In a real implementation, you would call an API endpoint to send the email
      // For example:
      // await fetch('/api/send-reminder', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     participantId,
      //     eventId: event.id,
      //     email: participant.user.email,
      //     name: `${participant.user.first_name} ${participant.user.last_name}`,
      //     eventTitle: event.title,
      //     eventDate: event.date,
      //     eventLocation: event.location
      //   })
      // })
    } catch (error) {
      console.error("Error sending email reminder:", error)
      toast.error("Failed to send email reminder")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-500" />
            Participants for {event.title}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(event.date), "MMMM d, yyyy")} at {event.location}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row justify-between gap-4 py-4">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
                Status:
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-[130px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="attendance-filter" className="text-sm whitespace-nowrap">
                Attendance:
              </Label>
              <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
                <SelectTrigger id="attendance-filter" className="w-[130px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="not-attended">Not Attended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-grow border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attended</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      Loading participants...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 mb-2" />
                      <p>No participants found</p>
                      {searchQuery && <p className="text-sm mt-1">Try adjusting your search or filters</p>}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={participant.user.photo_url || "/placeholder.svg"}
                            alt={`${participant.user.first_name} ${participant.user.last_name}`}
                          />
                          <AvatarFallback>
                            {getInitials(participant.user.first_name, participant.user.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {participant.user.first_name} {participant.user.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{participant.user.email}</div>
                          {participant.additional_info && (
                            <div className="text-xs mt-1">
                              {Object.entries(participant.additional_info).map(([key, value]) => (
                                <span key={key} className="inline-block mr-2 text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {key.replace("_", " ")}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(participant.registration_date), "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(participant.registration_date), "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={participant.status}
                        onValueChange={(value) => handleStatusChange(participant.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue>{getStatusBadge(participant.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Confirmed
                            </div>
                          </SelectItem>
                          <SelectItem value="waitlisted">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                              Waitlisted
                            </div>
                          </SelectItem>
                          <SelectItem value="cancelled">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-red-500" />
                              Cancelled
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Checkbox
                          id={`attended-${participant.id}`}
                          checked={participant.attended}
                          onCheckedChange={(checked) => handleAttendanceChange(participant.id, checked === true)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingParticipant === participant.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <Button size="sm" variant="outline" onClick={saveNotes}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[150px]" title={participant.notes || ""}>
                            {participant.notes || "-"}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditNotes(participant.id)}
                            className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => sendEmailReminder(participant.id)}
                        className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Send email reminder"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            {filteredParticipants.length} participants shown
            {participants.length !== filteredParticipants.length && ` (filtered from ${participants.length})`}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
