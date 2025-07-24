"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateBarangay } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface Barangay {
  id: number
  name: string
  history?: string | null
  logo_url?: string | null
  phone?: string | null
  page?: string | null
  email?: string | null
}

interface EditBarangayModalProps {
  barangay: Barangay | null
  isOpen: boolean
  onClose: () => void
  onBarangayUpdated: () => void
}

export function EditBarangayModal({ barangay, isOpen, onClose, onBarangayUpdated }: EditBarangayModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<{
    history: string
    logo_url: string
    phone: string
    page: string
    email: string
  }>({
    history: barangay?.history || "",
    logo_url: barangay?.logo_url || "",
    phone: barangay?.phone || "",
    page: barangay?.page || "",
    email: barangay?.email || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when barangay changes
  useState(() => {
    if (barangay) {
      setFormData({
        history: barangay.history || "",
        logo_url: barangay.logo_url || "",
        phone: barangay.phone || "",
        page: barangay.page || "",
        email: barangay.email || "",
      })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!barangay) return

    try {
      setIsSubmitting(true)

      // Validate email format if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address")
        return
      }

      // Update barangay in database
      await updateBarangay(barangay.id, {
        history: formData.history,
        logo_url: formData.logo_url,
        phone: formData.phone,
        page: formData.page,
        email: formData.email,
      })

      toast.success("Barangay information updated successfully")
      onBarangayUpdated()
      onClose()
    } catch (error) {
      console.error("Error updating barangay:", error)
      toast.error("Failed to update barangay information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show moderator info if applicable
  const isModerator = user?.user_role === "moderator"
  const isModeratorOfThisBarangay = isModerator && user?.barangay === barangay?.name

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Barangay Information - {barangay?.name}</DialogTitle>
        </DialogHeader>

        {isModerator && (
          <Alert className={isModeratorOfThisBarangay ? "bg-blue-50" : "bg-amber-50"}>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              {isModeratorOfThisBarangay
                ? `You are a moderator for ${barangay?.name} barangay and can edit its information.`
                : `As a moderator, you can only edit information for your assigned barangay (${user?.barangay}).`}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo_url" className="text-right">
                Logo URL
              </Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                className="col-span-3"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
                placeholder="+63 123 456 7890"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                placeholder="barangay@example.com"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="page" className="text-right">
                Page Link
              </Label>
              <Input
                id="page"
                name="page"
                value={formData.page}
                onChange={handleChange}
                className="col-span-3"
                placeholder="https://facebook.com/barangay-page"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="history" className="text-right pt-2">
                History
              </Label>
              <Textarea
                id="history"
                name="history"
                value={formData.history}
                onChange={handleChange}
                className="col-span-3 min-h-[200px]"
                placeholder="Enter barangay history..."
              />
            </div>

            {formData.logo_url && (
              <div className="flex justify-center mt-2">
                <div className="relative h-40 w-40 border rounded-lg overflow-hidden border-blue-600">
                  <img
                    src={formData.logo_url || "/placeholder.svg"}
                    alt="Barangay logo preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=160&width=160"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (isModerator && !isModeratorOfThisBarangay)}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
