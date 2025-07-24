"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { updateUser, supabase } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  user_role: string
  barangay?: string
}

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated: () => void
}

export function EditUserModal({ user, isOpen, onClose, onUserUpdated }: EditUserModalProps) {
  const [formData, setFormData] = useState<{
    first_name: string
    last_name: string
    email: string
    user_role: string
    barangay: string
  }>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    user_role: user?.user_role || "user",
    barangay: user?.barangay || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [barangays, setBarangays] = useState<string[]>([])
  const [showBarangayWarning, setShowBarangayWarning] = useState(false)

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_role: user.user_role,
        barangay: user.barangay || "",
      })
    }
  }, [user])

  // Fetch barangays for dropdown
  useEffect(() => {
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
        toast.error("Failed to load barangays")
      }
    }

    fetchBarangays()
  }, [])

  // Show warning when moderator role is selected but no barangay is assigned
  useEffect(() => {
    if (formData.user_role === "moderator" && !formData.barangay) {
      setShowBarangayWarning(true)
    } else {
      setShowBarangayWarning(false)
    }
  }, [formData.user_role, formData.barangay])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, user_role: value }))
  }

  const handleBarangayChange = (value: string) => {
    setFormData((prev) => ({ ...prev, barangay: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      setIsSubmitting(true)

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address")
        return
      }

      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        toast.error("First name and last name are required")
        return
      }

      // Validate that moderators have a barangay assigned
      if (formData.user_role === "moderator" && !formData.barangay) {
        toast.error("Moderators must have a barangay assigned")
        return
      }

      // Update user in database
      await updateUser(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        user_role: formData.user_role,
        barangay: formData.barangay,
      })

      toast.success("User updated successfully")
      onUserUpdated()
      onClose()
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user_role" className="text-right">
                Role
              </Label>
              <Select value={formData.user_role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barangay" className="text-right">
                Barangay
              </Label>
              <Select value={formData.barangay} onValueChange={handleBarangayChange}>
                <SelectTrigger
                  className={`col-span-3 ${formData.user_role === "moderator" && !formData.barangay ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select barangay" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {barangays.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showBarangayWarning && (
              <Alert variant="destructive" className="col-span-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Moderators must have a barangay assigned to manage barangay-specific content.
                </AlertDescription>
              </Alert>
            )}

            {formData.user_role === "moderator" && formData.barangay && (
              <Alert className="col-span-4">
                <AlertDescription>
                  This user will be able to edit information for <strong>{formData.barangay}</strong> barangay only.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
