"use client"

import { useState, useEffect } from "react"
import { BarangaySearch } from "@/components/admin/barangay-search"
import { SKOrgChart } from "@/components/admin/sk-org-chart"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { hasPermission } from "@/lib/role-based-access"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"
import SPC from "@/public/SPC.jpg"

export default function BarangayManagementPage() {
  const [selectedBarangayId, setSelectedBarangayId] = useState<number | null>(null)
  const { user } = useAuth()
  const canEditBarangayOfficials = user && hasPermission(user, "edit:barangay_officials")

  // This effect can be used for analytics or logging
  useEffect(() => {
    if (canEditBarangayOfficials) {
      console.log("User has permission to edit barangay officials")
    }
  }, [canEditBarangayOfficials])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 relative">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">Barangays SK officials</h1>
        <p className="text-gray-600">
          Search for a barangay to view its history and Sangguniang Kabataan organizational chart
        </p>

        {/* Logo placeholders in top-right corner */}
        <div className="absolute top-0 right-0 flex space-x-2">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SK || "/placeholder.svg"} alt="Logo 1" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SPC || "/placeholder.svg"} alt="Logo 1" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={CALAP || "/placeholder.svg"} alt="Logo 1" width={100} height={100} />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <BarangaySearch onBarangaySelect={setSelectedBarangayId} />
      </div>

      <SKOrgChart barangayId={selectedBarangayId} />
    </div>
  )
}

