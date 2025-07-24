"use client"

import { FederationOrgChart } from "@/components/admin/federation-org-chart"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { hasPermission } from "@/lib/role-based-access"

export default function FederationOfficersPage() {
  const { user } = useAuth()
  const canEditOfficials = user && hasPermission(user, "edit:federation_officials")

  // This effect can be used for analytics or logging
  useEffect(() => {
    if (canEditOfficials) {
      console.log("User has permission to edit federation officials")
    }
  }, [canEditOfficials])

  return (
    <div className="min-h-screen bg-white">
      <FederationOrgChart />
    </div>
  )
}

