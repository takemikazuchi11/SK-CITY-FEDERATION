"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getBarangayById, getBarangayOfficials, updateSKOfficial, createSKOfficial } from "@/lib/data-service"
import { User, Phone, Mail, Users, AlertCircle, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { BarangayHistory } from "./barangay-history"
import { useAuth } from "@/lib/auth-context"
import { canEditBarangay } from "@/lib/role-based-access"

interface SKOfficial {
  id: number
  full_name: string
  position: string
  position_order: number
  phone: string
  email: string
  photo_url?: string
  barangay_id: number
  description?: string
}

interface Barangay {
  id: number
  name: string
  phone?: string | null
  page?: string | null
  email?: string | null
  logo_url?: string | null
}

interface SKOrgChartProps {
  barangayId: number | null
}

export function SKOrgChart({ barangayId }: SKOrgChartProps) {
  const [officials, setOfficials] = useState<SKOfficial[]>([])
  const [barangay, setBarangay] = useState<Barangay | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingOfficial, setEditingOfficial] = useState<SKOfficial | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    photo_url: "",
    description: "",
  })
  const POSITION_OPTIONS = [
    { label: "Chairperson", value: "Chairperson", order: 1 },
    { label: "Secretary", value: "Secretary", order: 2 },
    { label: "Treasurer", value: "Treasurer", order: 3 },
    { label: "Member", value: "Member", order: 4 },
  ]
  const [addFormData, setAddFormData] = useState({
    full_name: "",
    position: "Chairperson",
    position_order: 1,
    phone: "",
    email: "",
    photo_url: "",
    description: "",
  })
  const { user } = useAuth()

  // Add state for add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleEdit = (official: SKOfficial) => {
    setEditingOfficial(official)
    setFormData({
      full_name: official.full_name,
      phone: official.phone,
      email: official.email,
      photo_url: official.photo_url || "",
      description: official.description || "",
    })
    setIsEditModalOpen(true)
  }

  const handleSave = async () => {
    if (!editingOfficial) return

    try {
      await updateSKOfficial(editingOfficial.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        photo_url: formData.photo_url,
        description: formData.description,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!barangayId) return

      setIsLoading(true)
      setError(null)
      setDebug(null)

      try {
        // Fetch barangay data first
        const barangayData = await getBarangayById(barangayId)

        if (barangayData) {
          setBarangay(barangayData)
          setDebug((prev) => `${prev || ""}Barangay found: ${barangayData.name}\n`)

          // Then fetch officials data
          const officialsData = await getBarangayOfficials(barangayId)
          setDebug((prev) => `${prev || ""}Officials found: ${officialsData?.length || 0}\n`)

          if (officialsData && officialsData.length > 0) {
            setOfficials(officialsData)
            setDebug((prev) => `${prev || ""}Officials positions: ${officialsData.map((o) => o.position).join(", ")}\n`)
          } else {
            setOfficials([])
            setDebug((prev) => `${prev || ""}No officials found for this barangay\n`)
          }
        } else {
          setError("Barangay not found")
          setOfficials([])
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(`Failed to load barangay information: ${err instanceof Error ? err.message : "Unknown error"}`)
        setOfficials([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [barangayId])

  if (!barangayId) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Barangay Selected</h3>
        <p className="mt-2 text-sm text-gray-500">Search for a barangay above to view its SK organizational chart</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  if (!barangay) {
    return null
  }

  // Check if the current user can edit this barangay
  const canEdit = canEditBarangay(user, barangay.name)

  // Group officials by position
  const chairperson = officials.find((o) => o.position === "SK Chairperson" || o.position === "Chairperson")
  const secretary = officials.find((o) => o.position === "SK Secretary" || o.position === "Secretary")
  const treasurer = officials.find((o) => o.position === "SK Treasurer" || o.position === "Treasurer")
  const members = officials.filter((o) => o.position === "SK Member" || o.position === "Member")

  const chairpersonFilled = officials.some(o => o.position === "SK Chairperson" || o.position === "Chairperson")
  const secretaryFilled = officials.some(o => o.position === "SK Secretary" || o.position === "Secretary")
  const treasurerFilled = officials.some(o => o.position === "SK Treasurer" || o.position === "Treasurer")
  const memberCount = officials.filter(o => o.position === "SK Member" || o.position === "Member").length

  return (
    <>
      {/* Add the BarangayHistory component before the org chart */}
      <BarangayHistory barangayId={barangayId} barangayName={barangay?.name || ""} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-700 text-white p-4 text-center">
          <h2 className="text-xl font-bold">Barangay {barangay.name}</h2>
          <p className="text-blue-100">{barangay.name} - SK Organizational Chart</p>
        </div>

        <div className="p-6">
          {/* Add Information Button if no officials and canEdit */}
          {officials.length < 9 && (
            <div className="mb-6 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="text-black border-blue-600 hover:bg-blue-50"
              >
                Add SK Official Information
              </Button>
            </div>
          )}
          {/* Org Chart Structure */}
          <div className="flex flex-col items-center">
            {/* Chairperson Section */}
            <div className="w-full mb-8">
              <div className="bg-[#0a192f] text-white p-3 text-center mb-0">
                <h3 className="font-bold">OFFICE OF THE SK CHAIRPERSON</h3>
              </div>
              {chairperson ? (
                <OfficialCard official={chairperson} onEdit={handleEdit} canEdit={canEdit} />
              ) : (
                <div className="p-4 border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">No SK Chairperson data available</p>
                </div>
              )}
            </div>

            {/* Secretary Section */}
            <div className="w-full mb-8">
              <div className="bg-[#0a192f] text-white p-3 text-center mb-0">
                <h3 className="font-bold">OFFICE OF THE SK SECRETARY</h3>
              </div>
              {secretary ? (
                <OfficialCard official={secretary} onEdit={handleEdit} canEdit={canEdit} />
              ) : (
                <div className="p-4 border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">No SK Secretary data available</p>
                </div>
              )}
            </div>

            {/* Treasurer Section */}
            <div className="w-full mb-8">
              <div className="bg-[#0a192f] text-white p-3 text-center mb-0">
                <h3 className="font-bold">OFFICE OF THE SK TREASURER</h3>
              </div>
              {treasurer ? (
                <OfficialCard official={treasurer} onEdit={handleEdit} canEdit={canEdit} />
              ) : (
                <div className="p-4 border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">No SK Treasurer data available</p>
                </div>
              )}
            </div>

            {/* SK Members Section */}
            {members.length > 0 && (
              <div className="w-full">
                <div className="bg-[#0a192f] text-white p-3 text-center mb-0">
                  <h3 className="font-bold">SK MEMBERS</h3>
                </div>
                <div className="grid grid-cols-1 gap-0">
                  {members.map((member) => (
                    <OfficialCard key={member.id} official={member} onEdit={handleEdit} canEdit={canEdit} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Official Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit SK Official Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Committee
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Official Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add SK Official Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={addFormData.full_name}
                onChange={e => setAddFormData(f => ({ ...f, full_name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <select
                id="position"
                name="position"
                value={addFormData.position}
                onChange={e => {
                  const value = e.target.value
                  const option = POSITION_OPTIONS.find(opt => opt.value === value)
                  setAddFormData(f => ({ ...f, position: value, position_order: option ? option.order : 4 }))
                }}
                className="col-span-3 border rounded px-2 py-1"
              >
                {POSITION_OPTIONS.map(opt => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={
                      (opt.value === "Chairperson" && chairpersonFilled) ||
                      (opt.value === "Secretary" && secretaryFilled) ||
                      (opt.value === "Treasurer" && treasurerFilled) ||
                      (opt.value === "Member" && memberCount >= 6)
                    }
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={addFormData.phone}
                onChange={e => setAddFormData(f => ({ ...f, phone: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={addFormData.email}
                onChange={e => setAddFormData(f => ({ ...f, email: e.target.value }))}
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
                value={addFormData.photo_url}
                onChange={e => setAddFormData(f => ({ ...f, photo_url: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={addFormData.description}
                onChange={e => setAddFormData(f => ({ ...f, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await createSKOfficial({
                    full_name: addFormData.full_name,
                    position: addFormData.position,
                    position_order: addFormData.position_order,
                    phone: addFormData.phone,
                    email: addFormData.email,
                    photo_url: addFormData.photo_url,
                    barangay_id: barangayId!,
                    description: addFormData.description,
                  })
                  setIsAddModalOpen(false)
                  setAddFormData({ full_name: "", position: "Chairperson", position_order: 1, phone: "", email: "", photo_url: "", description: "" })
                  toast.success("SK Official information added successfully!")
                  // Refresh officials list
                  const officialsData = await getBarangayOfficials(barangayId!)
                  setOfficials(officialsData)
                } catch (err) {
                  toast.error("Failed to add SK Official information")
                }
              }}
            >
              Add Official
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function OfficialCard({
  official,
  onEdit,
  canEdit,
}: { official: SKOfficial; onEdit: (official: SKOfficial) => void; canEdit: boolean }) {
  return (
    <div className="flex flex-col md:flex-row border border-gray-200 border-t-0">
      {/* Image section - 1/3 width */}
      <div className="md:w-1/3 p-6 flex justify-center items-center bg-white">
        <div className="h-56 w-56 overflow-hidden">
          {official.photo_url ? (
            <img
              src={official.photo_url || "/placeholder.svg?height=224&width=224"}
              alt={official.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <User className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Information section - 2/3 width */}
      <div className="md:w-2/3 p-8 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{official.full_name}</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {official.position.startsWith("SK ") ? official.position : `SK ${official.position}`}
            </h3>
          </div>

          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(official)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {/* Contact information */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-gray-600" />
            <span className="text-gray-800">Tel: {official.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-gray-600" />
            <span className="text-gray-800">{official.email}</span>
          </div>
        </div>

        {/* Committee information */}
        {official.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="font-medium text-gray-700 mb-1">Committee Assignment:</h4>
            <p className="text-gray-800">{official.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
