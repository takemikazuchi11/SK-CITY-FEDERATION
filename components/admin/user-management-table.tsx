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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, UserX, UserCog, Mail, Download, ChevronLeft, ChevronRight, Filter, Trash2, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"
import { EditUserModal } from "./edit-user-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  user_role: string
  barangay?: string | null
  created_at?: string | null
}

export function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [barangayFilter, setBarangayFilter] = useState<string>("all")
  const [barangays, setBarangays] = useState<string[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [tableKey, setTableKey] = useState(0)
  const usersPerPage = 10

  useEffect(() => {
    fetchUsers()
    fetchBarangays()
  }, [currentPage, searchQuery, roleFilter, barangayFilter])

  // Cleanup effect to prevent aria-hidden issues
  useEffect(() => {
    return () => {
      // Ensure modals are closed when component unmounts
      setDeleteModalOpen(false)
      setUserToDelete(null)
      setIsDeleting(false)
      setIsEditModalOpen(false)
      setEditingUser(null)
    }
  }, [])

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

  const fetchUsers = async () => {
    try {
      setIsLoading(true)

      // Calculate pagination
      const from = (currentPage - 1) * usersPerPage
      const to = from + usersPerPage - 1

      // Build query
      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("created_at", { ascending: false })

      // Add search filter if provided
      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
        )
      }

      // Add role filter if not "all"
      if (roleFilter !== "all") {
        query = query.eq("user_role", roleFilter)
      }

      // Add barangay filter if not "all"
      if (barangayFilter !== "all") {
        query = query.eq("barangay", barangayFilter)
      }

      const { data, count, error } = await query

      if (error) throw error

      setUsers(data || [])

      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / usersPerPage))
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchUsers()
  }

  const handleExportCSV = () => {
    try {
      // Convert users to CSV
      const headers = ["ID", "First Name", "Last Name", "Email", "Role", "Barangay", "Registration Date"]
      const csvRows = [
        headers.join(","),
        ...users.map((user) =>
          [
            user.id,
            `"${user.first_name}"`,
            `"${user.last_name}"`,
            user.email,
            user.user_role,
            `"${user.barangay || ""}"`,
            format(new Date(user.created_at || ""), "yyyy-MM-dd"),
          ].join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `users_export_${format(new Date(), "yyyy-MM-dd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Users exported successfully")
    } catch (error) {
      console.error("Error exporting users:", error)
      toast.error("Failed to export users")
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
      if (roleFilter !== "all") filterInfo.push(`Role: ${roleFilter}`)
      if (barangayFilter !== "all") filterInfo.push(`Barangay: ${barangayFilter}`)
      if (searchQuery) filterInfo.push(`Search: "${searchQuery}"`)

             // Create the print content
       const printContent = `
         <!DOCTYPE html>
         <html>
         <head>
           <title>SK Federation - User Management Report</title>
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
             .role-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
             .role-admin { background-color: #1e3a8a; color: white; }
             .role-moderator { background-color: #dc2626; color: white; }
             .role-user { background-color: #6b7280; color: white; }
             .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
             @media print { body { margin: 0; } .no-print { display: none; } }
           </style>
         </head>
         <body>
           <div class="header">
             <div class="title">SK Federation - User Management Report</div>
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Barangay</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((user) => `
                <tr>
                  <td>${user.first_name} ${user.last_name}</td>
                  <td>${user.email}</td>
                  <td>
                    <span class="role-badge role-${user.user_role}">${user.user_role}</span>
                  </td>
                  <td>${user.barangay || "—"}</td>
                  <td>${format(new Date(user.created_at || ""), "MMM d, yyyy")}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Total Users: ${users.length}</p>
            <p>This report was generated from the SK Federation User Management System</p>
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

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setUserToDelete(null)
    setIsDeleting(false)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      // First, delete related records to avoid foreign key constraint violations
      const userId = userToDelete.id

      // Delete user's comments
      const { error: commentsError } = await supabase
        .from("comments")
        .delete()
        .eq("user_id", userId)

      if (commentsError) {
        console.error("Error deleting user comments:", commentsError)
        // Continue anyway, might not have comments
      }

      // Delete user's event feedback
      const { error: feedbackError } = await supabase
        .from("event_feedback")
        .delete()
        .eq("user_id", userId)

      if (feedbackError) {
        console.error("Error deleting user feedback:", feedbackError)
        // Continue anyway, might not have feedback
      }

      // Delete user's event participations
      const { error: participationError } = await supabase
        .from("event_participants")
        .delete()
        .eq("user_id", userId)

      if (participationError) {
        console.error("Error deleting user participations:", participationError)
        // Continue anyway, might not have participations
      }

      // Delete user's KK registrations
      const { error: kkError } = await supabase
        .from("kk_registrations")
        .delete()
        .eq("user_id", userId)

      if (kkError) {
        console.error("Error deleting user KK registrations:", kkError)
        // Continue anyway, might not have KK registrations
      }

      // Now delete the user from users table
      const { error: dbError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId)

      if (dbError) {
        console.error("Error deleting user from database:", dbError)
        toast.error("Failed to delete user data")
        return
      }

      toast.success(`Successfully deleted ${userToDelete.first_name} ${userToDelete.last_name}'s account and all related data`)
      
      // Close modal and refresh data
      closeDeleteModal()
      setTableKey(prev => prev + 1)
      await fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "moderator":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleSendEmail = (user: User) => {
    // Create email content with user information
    const subject = encodeURIComponent(`Message from SK Federation Admin`)
    const body = encodeURIComponent(`Dear ${user.first_name} ${user.last_name},

I hope this message finds you well. This is a message from the SK Federation administration team.

Best regards,
SK Federation Admin Team`)

    // Try to open Gmail first, fallback to Outlook
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}&su=${subject}&body=${body}`
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${user.email}&subject=${subject}&body=${body}`

    // Open Gmail in a new tab
    const gmailWindow = window.open(gmailUrl, '_blank')
    
    // If Gmail fails to open, try Outlook
    if (!gmailWindow || gmailWindow.closed) {
      window.open(outlookUrl, '_blank')
    }

    // Show success message
    toast.success(`Opening email client for ${user.first_name} ${user.last_name}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
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
          <Button variant="outline" onClick={handlePrintTable} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table key={tableKey}>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.user_role)}>{user.user_role}</Badge>
                  </TableCell>
                  <TableCell>{user.barangay || "—"}</TableCell>
                  <TableCell>{format(new Date(user.created_at || ""), "MMM d, yyyy")}</TableCell>
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
                          onClick={() => handleEditUser(user)}
                        >
                          <UserCog className="h-4 w-4" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleSendEmail(user)}
                        >
                          <Mail className="h-4 w-4" />
                          <span>Send Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-red-600 cursor-pointer"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Account</span>
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

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUserUpdated={fetchUsers}
      />

      {/* Delete User Modal */}
      <Dialog 
        open={deleteModalOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // Ensure proper cleanup when dialog closes
            setDeleteModalOpen(false)
            setUserToDelete(null)
            setIsDeleting(false)
          } else {
            setDeleteModalOpen(true)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}'s account? 
              This action cannot be undone and will permanently remove all their data from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteModalOpen(false)
                setUserToDelete(null)
                setIsDeleting(false)
              }} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
