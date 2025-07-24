"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getBarangayHistory } from "@/lib/data-service"
import { AlertCircle, Phone, Facebook, Mail, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditBarangayModal } from "./edit-barangay-modal"
import { useAuth } from "@/lib/auth-context"
import { canEditBarangay } from "@/lib/role-based-access"

interface BarangayHistoryProps {
  barangayId: number | null
  barangayName?: string
}

interface BarangayHistoryData {
  id: number
  name: string
  logo_url: string | null
  history: string | null
  phone: string | null
  page: string | null
  email: string | null
}

export function BarangayHistory({ barangayId, barangayName }: BarangayHistoryProps) {
  const [historyData, setHistoryData] = useState<BarangayHistoryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { user } = useAuth()

  const fetchHistory = async () => {
    if (!barangayId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getBarangayHistory(barangayId)
      setHistoryData(data)
    } catch (err) {
      console.error("Error fetching barangay history:", err)
      setError("Failed to load barangay history information")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [barangayId])

  if (!barangayId || isLoading) {
    return null
  }

  if (error) {
    return (
      <div className="text-center py-6 bg-red-50 rounded-lg mb-8">
        <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!historyData || (!historyData.logo_url && !historyData.history)) {
    // Show add button if user can edit
    const canEdit = barangayName ? canEditBarangay(user, barangayName) : false
    return canEdit ? (
      <div className="mb-8 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="text-black border-blue-600 hover:bg-blue-50"
        >
          Add Information
        </Button>
        <EditBarangayModal
          barangay={{
            id: barangayId ?? "",
            name: barangayName ?? "",
            history: "",
            logo_url: "",
            phone: "",
            page: "",
            email: ""
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onBarangayUpdated={fetchHistory}
        />
      </div>
    ) : null
  }

  // Check if the current user can edit this barangay
  const canEdit = canEditBarangay(user, historyData.name)

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-b from-blue-900 to-purple-900 w-full">
      {/* Logo and Title Section */}
      <div className="relative py-16 px-4 text-center text-white w-full rounded-t-3xl">
        {canEdit && (
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-black border-white hover:bg-white/20"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Information
            </Button>
          </div>
        )}

        <h2 className="text-4xl font-bold mb-2">Barangay {historyData.name}</h2>
        <h3 className="text-2xl font-semibold mb-8">Our History</h3>

        {historyData.logo_url && (
          <div className="flex justify-center mb-4">
           <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
              <Image
                src={historyData.logo_url || "/placeholder.svg"}
                alt={`${historyData.name} Logo`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Contact Information - Directly below the logo with left-aligned icons */}
        {(historyData.phone || historyData.email || historyData.page) && (
          <div className="flex flex-col items-center mt-4 mb-6 space-y-2">
            {historyData.phone && (
              <div className="flex items-center text-white">
                <Phone className="h-5 w-5 mr-3" />
                <a href={`tel:${historyData.phone}`} className="text-sm hover:underline">
                  {historyData.phone}
                </a>
              </div>
            )}

            {historyData.email && (
              <div className="flex items-center text-white">
                <Mail className="h-5 w-5 mr-3" />
                <a href={`mailto:${historyData.email}`} className="text-sm hover:underline">
                  {historyData.email}
                </a>
              </div>
            )}

            {historyData.page && (
              <div className="flex items-center text-white">
                <Facebook className="h-5 w-5 mr-3" />
                <a
                  href={historyData.page.startsWith("http") ? historyData.page : `https://${historyData.page}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  Visit us
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Content Section */}
      <div className="bg-white p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          {historyData.history ? (
            <div className="prose prose-lg max-w-none">
              {historyData.history.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">No historical information available for this barangay.</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditBarangayModal
        barangay={historyData}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onBarangayUpdated={fetchHistory}
      />
    </div>
  )
}
