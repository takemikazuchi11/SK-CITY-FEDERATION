"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getFederationOfficials, updateFederationOfficial } from "@/lib/data-service"
import { Loader2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PermissionGuard } from "@/components/role-based-ui"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"
import SPC from "@/public/SPC.jpg"

interface Official {
  id: number
  name: string
  position: string
  photo_url?: string
}

export function FederationOrgChart() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photo_url: "",
  })

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchOfficials = async () => {
    try {
      setIsLoading(true)
      const data = await getFederationOfficials()
      setOfficials(data)
    } catch (err) {
      console.error("Error fetching officials:", err)
      setError("Failed to load federation officials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (official: Official) => {
    setEditingOfficial(official)
    setFormData({
      name: official.name,
      position: official.position,
      photo_url: official.photo_url || "",
    })
    setIsEditModalOpen(true)
  }

  const handleSave = async () => {
    if (!editingOfficial) return

    try {
      await updateFederationOfficial(editingOfficial.id, {
        name: formData.name,
        position: formData.position,
        photo_url: formData.photo_url,
      })

      // Update local state
      setOfficials(
        officials.map((official) => (official.id === editingOfficial.id ? { ...official, ...formData } : official)),
      )

      toast.success("Official information updated successfully")
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating official:", error)
      toast.error("Failed to update official information")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Group officials by position
  const president = officials.find((o) => o.position === "President")
  const vicePresident = officials.find((o) => o.position === "Vice President")
  const secretary = officials.find((o) => o.position === "Secretary")
  const treasurer = officials.find((o) => o.position === "Treasurer")
  const auditor = officials.find((o) => o.position === "Auditor")
  const sergeantAtArms = officials.find((o) => o.position === "Sergeant at Arms")
  const pro = officials.find((o) => o.position === "Public Relations Officer")

  // Filter committee chairpersons (board members)
  const committeeChairpersons = officials.filter((o) => o.position.startsWith("Chairperson, Committee on"))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative bg-white min-h-screen"
      style={{
        backgroundImage: "url(/SK-Logo.jpg)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay for opacity control */}
      <div className="absolute inset-0 bg-white" style={{ opacity: 0.85 }} />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Top logos */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="w-24 h-24 rounded-full bg-white p-2 border-2 border-blue-600">
              <Image src={SK || "/placeholder.svg"} alt="Logo 1" width={100} height={100} className="rounded-full" />
            </div>
            <div className="w-24 h-24 rounded-full bg-white p-2 border-2 border-blue-600">
              <Image src={SPC || "/placeholder.svg"} alt="Logo 2" width={100} height={100} className="rounded-full" />
            </div>
            <div className="w-24 h-24 rounded-full bg-white p-2 border-2 border-blue-600">
              <Image src={CALAP || "/placeholder.svg"} alt="Logo 3" width={200} height={200} className="rounded-full" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-12 border-2 border-white-600 py-4 rounded-lg">
            <h1 className="text-4xl font-bold text-black mb-2">SANGGUNIANG KABATAAN CITY FEDERATION</h1>
            <h2 className="text-2xl font-semibold text-black mb-4">CITY OF CALAPAN FEDERATION OFFICERS</h2>
          </div>

          {/* Organizational Chart */}
          <div className="max-w-5xl mx-auto">
            {/* President */}
            <div className="flex justify-center mb-8">
              <OfficialCard
                official={president || { id: 0, name: "Position Vacant", position: "President" }}
                size="large"
                onEdit={handleEdit}
              />
            </div>

            {/* Vertical connector line */}
            <div className="w-0.5 h-8 bg-blue-600 mx-auto mb-8 border-l-2 border-blue-600"></div>

            {/* Vice President, Secretary, Treasurer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <OfficialCard
                official={secretary || { id: 0, name: "Position Vacant", position: "Secretary" }}
                onEdit={handleEdit}
              />
              <OfficialCard
                official={vicePresident || { id: 0, name: "Position Vacant", position: "Vice President" }}
                onEdit={handleEdit}
              />
              <OfficialCard
                official={treasurer || { id: 0, name: "Position Vacant", position: "Treasurer" }}
                onEdit={handleEdit}
              />
            </div>

            {/* Vertical connector line */}
            <div className="w-0.5 h-8 bg-blue-600 mx-auto mb-8 border-l-2 border-blue-600"></div>

            {/* Auditor, Sergeant at Arms, PRO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <OfficialCard
                official={auditor || { id: 0, name: "Position Vacant", position: "Auditor" }}
                onEdit={handleEdit}
              />
              <OfficialCard
                official={sergeantAtArms || { id: 0, name: "Position Vacant", position: "Sergeant at Arms" }}
                onEdit={handleEdit}
              />
              <OfficialCard
                official={pro || { id: 0, name: "Position Vacant", position: "Public Relations Officer" }}
                onEdit={handleEdit}
              />
            </div>

            {/* Vertical connector line */}
            <div className="w-0.5 h-8 bg-blue-600 mx-auto mb-8 border-l-2 border-blue-600"></div>

            {/* Board Members / Committee Chairpersons */}
            <div className="mb-8">
              <div className="bg-white py-2 px-4 text-center mb-8 border-2 border-blue-600">
                <h3 className="text-xl font-bold text-blue-900">BOARD OF DIRECTORS</h3>
              </div>

              {/* First row of committee chairpersons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {committeeChairpersons.slice(0, 5).map((chairperson, index) => (
                  <OfficialCard
                    key={chairperson.id || `chairperson-${index}`}
                    official={chairperson}
                    size="small"
                    onEdit={handleEdit}
                    fixedHeight={true}
                  />
                ))}

                {/* Fill with empty positions if less than 5 */}
                {Array.from({ length: Math.max(0, 5 - Math.min(committeeChairpersons.length, 5)) }).map((_, index) => (
                  <OfficialCard
                    key={`empty-chairperson-1-${index}`}
                    official={{
                      id: 0,
                      name: "Position Vacant",
                      position: "Chairperson, Committee",
                    }}
                    size="small"
                    onEdit={handleEdit}
                    fixedHeight={true}
                  />
                ))}
              </div>

              {/* Second row of committee chairpersons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {committeeChairpersons.slice(5, 10).map((chairperson, index) => (
                  <OfficialCard
                    key={chairperson.id || `chairperson-${index + 5}`}
                    official={chairperson}
                    size="small"
                    onEdit={handleEdit}
                    fixedHeight={true}
                  />
                ))}

                {/* Fill with empty positions if less than 5 */}
                {Array.from({ length: Math.max(0, 5 - Math.max(0, committeeChairpersons.length - 5)) }).map(
                  (_, index) => (
                    <OfficialCard
                      key={`empty-chairperson-2-${index}`}
                      official={{
                        id: 0,
                        name: "Position Vacant",
                        position: "Chairperson, Committee",
                      }}
                      size="small"
                      onEdit={handleEdit}
                      fixedHeight={true}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Official Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Official Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo_url" className="text-right">
                Photo URL
              </Label>
              <Input
                id="photo_url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            {formData.photo_url && (
              <div className="flex justify-center mt-2">
                <div className="relative h-40 w-40 border rounded-lg overflow-hidden border-blue-600">
                  <Image
                    src={formData.photo_url || "/placeholder.svg"}
                    alt="Official preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=160&width=160"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface OfficialCardProps {
  official: Official
  size?: "small" | "medium" | "large"
  onEdit: (official: Official) => void
  fixedHeight?: boolean
}

function OfficialCard({ official, size = "medium", onEdit, fixedHeight = false }: OfficialCardProps) {
  const sizeClasses = {
    small: {
      container: "w-full",
      image: "h-32 w-32",
      name: "text-sm",
      position: "text-xs",
      button: "h-6 w-6",
      infoHeight: fixedHeight ? "h-24" : "",
    },
    medium: {
      container: "w-full",
      image: "h-40 w-40",
      name: "text-base",
      position: "text-sm",
      button: "h-8 w-8",
      infoHeight: "",
    },
    large: {
      container: "w-64",
      image: "h-48 w-48",
      name: "text-lg",
      position: "text-base",
      button: "h-8 w-8",
      infoHeight: "",
    },
  }

  const classes = sizeClasses[size]

  // Format position for display - for committee chairpersons, show only the committee name
  const displayPosition = official.position.startsWith("Chairperson, Committee on")
    ? official.position.replace("Chairperson, ", "").trim()
    : official.position

  return (
    <div className={`${classes.container} flex flex-col items-center group relative`}>
      <div className="bg-white p-2 rounded-lg shadow-lg mb-2 overflow-hidden relative border-2 border-blue-600">
        <div className={`${classes.image} relative overflow-hidden`}>
          {official.photo_url ? (
            <Image
              src={official.photo_url || "/placeholder.svg"}
              alt={official.name}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=200"
              }}
            />
          ) : (
            <Image src="/placeholder.svg?height=200&width=200" alt={official.name} fill className="object-cover" />
          )}
        </div>

        {/* Edit button - appears on hover, with permission guard */}
        {official.id !== 0 && (
          <PermissionGuard permission="edit:federation_officials">
            <Button
              variant="outline"
              size="icon"
              className={`${classes.button} absolute top-2 right-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity border border-blue-600`}
              onClick={() => onEdit(official)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </PermissionGuard>
        )}
      </div>
      <div
        className={`bg-white py-2 px-4 rounded-lg shadow-lg text-center w-full border-2 border-blue-600 ${classes.infoHeight} flex flex-col justify-center`}
      >
        <h3 className={`${classes.name} font-bold text-blue-900`}>
          {official.id !== 0 ? ` ${official.name}` : official.name}
        </h3>
        <p className={`${classes.position} text-blue-700 line-clamp-2`}>{displayPosition}</p>
      </div>
    </div>
  )
}
