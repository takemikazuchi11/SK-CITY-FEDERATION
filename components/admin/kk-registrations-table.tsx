"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MoreHorizontal,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KKRegistration {
  id: string
  first_name: string
  middle_name: string | null
  last_name: string
  birth_date: string
  gender: string
  email: string
  phone: string
  address: string
  barangay: string
  residency_length: string
  education_level: string
  school_or_work: string | null
  reason_for_joining: string
  is_registered_voter: boolean
  has_previous_sk_involvement: boolean
  previous_sk_involvement: string | null
  terms_agreed: boolean
  data_privacy_consent: boolean
  status: string
  created_at: string
}

export function KKRegistrationsTable() {
  const [registrations, setRegistrations] = useState<KKRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRegistration, setSelectedRegistration] = useState<KKRegistration | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [barangayFilter, setBarangayFilter] = useState<string>("all")
  const [barangays, setBarangays] = useState<string[]>([])
  const registrationsPerPage = 10

  useEffect(() => {
    fetchRegistrations()
    fetchBarangays()
  }, [currentPage, searchQuery, statusFilter, barangayFilter])

  const fetchBarangays = async () => {
    try {
      const { data, error } = await supabase.from("barangays").select("name").order("name")

      if (error) throw error

      if (data) {
        const barangayNames = data.map((b) => b.name)
        setBarangays(barangayNames)
      }
    } catch (error) {
      console.error("Error fetching barangays:", error)
    }
  }

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true)

      // Calculate pagination
      const from = (currentPage - 1) * registrationsPerPage
      const to = from + registrationsPerPage - 1

      // Build query
      let query = supabase
        .from("kk_registrations")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("created_at", { ascending: false })

      // Add search filter if provided
      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
        )
      }

      // Add status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      // Add barangay filter if not "all"
      if (barangayFilter !== "all") {
        query = query.eq("barangay", barangayFilter)
      }

      const { data, count, error } = await query

      if (error) throw error

      setRegistrations(data || [])

      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / registrationsPerPage))
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast.error("Failed to load registrations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchRegistrations()
  }

  const handleExportCSV = () => {
    try {
      // Convert registrations to CSV
      const headers = [
        "ID",
        "First Name",
        "Middle Name",
        "Last Name",
        "Birth Date",
        "Gender",
        "Email",
        "Phone",
        "Address",
        "Barangay",
        "Residency Length",
        "Education Level",
        "School/Work",
        "Reason for Joining",
        "Registered Voter",
        "Previous SK Involvement",
        "Previous SK Details",
        "Status",
        "Registration Date",
      ]

      const csvRows = [
        headers.join(","),
        ...registrations.map((reg) =>
          [
            reg.id,
            `"${reg.first_name}"`,
            `"${reg.middle_name || ""}"`,
            `"${reg.last_name}"`,
            format(new Date(reg.birth_date), "yyyy-MM-dd"),
            reg.gender,
            reg.email,
            reg.phone,
            `"${reg.address}"`,
            `"${reg.barangay}"`,
            reg.residency_length,
            `"${reg.education_level}"`,
            `"${reg.school_or_work || ""}"`,
            `"${reg.reason_for_joining.replace(/"/g, '""')}"`,
            reg.is_registered_voter ? "Yes" : "No",
            reg.has_previous_sk_involvement ? "Yes" : "No",
            `"${reg.previous_sk_involvement || ""}"`,
            reg.status,
            format(new Date(reg.created_at), "yyyy-MM-dd HH:mm:ss"),
          ].join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `kk_registrations_${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Registrations exported successfully")
    } catch (error) {
      console.error("Error exporting registrations:", error)
      toast.error("Failed to export registrations")
    }
  }

  const handleViewDetails = (registration: KKRegistration) => {
    setSelectedRegistration(registration)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("kk_registrations").update({ status: newStatus }).eq("id", id)

      if (error) throw error

      toast.success(`Registration status updated to ${newStatus}`)
      fetchRegistrations()

      // Update the selected registration if it's currently being viewed
      if (selectedRegistration && selectedRegistration.id === id) {
        setSelectedRegistration({
          ...selectedRegistration,
          status: newStatus,
        })
      }
    } catch (error) {
      console.error("Error updating registration status:", error)
      toast.error("Failed to update registration status")
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search registrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={barangayFilter} onValueChange={setBarangayFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by barangay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Barangays</SelectItem>
              {barangays.map((barangay) => (
                <SelectItem key={barangay} value={barangay}>
                  {barangay}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading registrations...
                </TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No registrations found
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((registration) => {
                // Calculate age
                const birthDate = new Date(registration.birth_date)
                const today = new Date()
                let age = today.getFullYear() - birthDate.getFullYear()
                const monthDiff = today.getMonth() - birthDate.getMonth()
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--
                }

                return (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.first_name}{" "}
                      {registration.middle_name ? registration.middle_name.charAt(0) + ". " : ""}
                      {registration.last_name}
                    </TableCell>
                    <TableCell>{registration.barangay}</TableCell>
                    <TableCell>{age} years</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs">{registration.email}</span>
                        <span className="text-xs text-muted-foreground">{registration.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(registration.status)}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(registration.created_at), "MMM d, yyyy")}</TableCell>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Registration Details</DialogTitle>
                                <DialogDescription>
                                  Viewing complete registration information for {registration.first_name}{" "}
                                  {registration.last_name}
                                </DialogDescription>
                              </DialogHeader>

                              <Tabs defaultValue="personal" className="mt-4">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                  <TabsTrigger value="residence">Residence</TabsTrigger>
                                  <TabsTrigger value="additional">Additional Info</TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="space-y-4 mt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                                      <p>
                                        {registration.first_name} {registration.middle_name || ""}{" "}
                                        {registration.last_name}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Birth Date</h4>
                                      <p>
                                        {format(new Date(registration.birth_date), "MMMM d, yyyy")} ({age} years old)
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                                      <p>
                                        {registration.gender.charAt(0).toUpperCase() + registration.gender.slice(1)}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                      <p>{registration.email}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                                      <p>{registration.phone}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Education Level</h4>
                                      <p>{registration.education_level}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">School/Work</h4>
                                      <p>{registration.school_or_work || "Not provided"}</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="residence" className="space-y-4 mt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">Complete Address</h4>
                                      <p>{registration.address}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Barangay</h4>
                                      <p>{registration.barangay}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Length of Residency</h4>
                                      <p>
                                        {registration.residency_length === "6MonthsOrMore"
                                          ? "6 months or more"
                                          : "Less than 6 months"}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Registered Voter</h4>
                                      <p>{registration.is_registered_voter ? "Yes" : "No"}</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="additional" className="space-y-4 mt-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Reason for Joining</h4>
                                    <p className="mt-1 whitespace-pre-wrap">{registration.reason_for_joining}</p>
                                  </div>

                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Previous SK Involvement
                                    </h4>
                                    <p>{registration.has_previous_sk_involvement ? "Yes" : "No"}</p>
                                    {registration.has_previous_sk_involvement &&
                                      registration.previous_sk_involvement && (
                                        <div className="mt-1">
                                          <h5 className="text-xs font-medium text-muted-foreground">Details:</h5>
                                          <p className="whitespace-pre-wrap">{registration.previous_sk_involvement}</p>
                                        </div>
                                      )}
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Terms Agreed</h4>
                                      <p>{registration.terms_agreed ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Data Privacy Consent
                                      </h4>
                                      <p>{registration.data_privacy_consent ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Registration Date</h4>
                                      <p>{format(new Date(registration.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                      <Badge variant={getStatusBadgeVariant(registration.status)} className="mt-1">
                                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>

                              <DialogFooter className="mt-6 flex justify-between items-center">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(registration.id, "approved")}
                                    disabled={registration.status === "approved"}
                                    className="flex items-center gap-1"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(registration.id, "rejected")}
                                    disabled={registration.status === "rejected"}
                                    className="flex items-center gap-1"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                                <DialogClose asChild>
                                  <Button variant="secondary">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(registration.id, "approved")}
                            disabled={registration.status === "approved"}
                            className="flex items-center gap-2 text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(registration.id, "rejected")}
                            disabled={registration.status === "rejected"}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
    </div>
  )
}
