"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ScrollArea } from "@/components/ui/scroll-area"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  user_role: string
}

interface UserSelectionListProps {
  selectedUsers: string[]
  onSelectionChange: (selectedEmails: string[]) => void
}

export function UserSelectionList({ selectedUsers, onSelectionChange }: UserSelectionListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectAll, setSelectAll] = useState(false)
  const usersPerPage = 10

  // Fetch users from the database
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, user_role")
          .order("first_name", { ascending: true })

        if (error) throw error
        setUsers(data || [])
        setFilteredUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchQuery, users])

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      onSelectionChange(filteredUsers.map((user) => user.email))
    } else if (selectedUsers.length === filteredUsers.length) {
      // If all were selected and "Select All" was unchecked
      onSelectionChange([])
    }
  }, [selectAll, filteredUsers])

  // Update selectAll state when individual selections change
  useEffect(() => {
    if (filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length) {
      setSelectAll(true)
    } else if (selectAll) {
      setSelectAll(false)
    }
  }, [selectedUsers, filteredUsers.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
  }

  const handleUserSelect = (email: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUsers, email])
    } else {
      onSelectionChange(selectedUsers.filter((e) => e !== email))
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select Recipients</h3>
        <div className="text-sm text-muted-foreground">
          {selectedUsers.length} of {filteredUsers.length} selected
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="border rounded-md">
        <div className="border-b px-4 py-2 flex items-center">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            aria-label="Select all users"
          />
          <Label htmlFor="select-all" className="ml-2 cursor-pointer flex-1">
            Select All
          </Label>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : currentUsers.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground">No users found</div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {currentUsers.map((user) => (
                <div key={user.id} className="px-4 py-2 flex items-center hover:bg-muted/50">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.email)}
                    onCheckedChange={(checked) => handleUserSelect(user.email, checked === true)}
                    aria-label={`Select ${user.first_name} ${user.last_name}`}
                  />
                  <Label htmlFor={`user-${user.id}`} className="ml-2 cursor-pointer flex-1">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

