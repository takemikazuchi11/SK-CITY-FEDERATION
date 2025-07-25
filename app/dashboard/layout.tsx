"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"
import Footer from "@/components/Footer"
import DashboardNavbar from "@/components/dashboard/Navbar"
import { useAuth } from "@/lib/auth-context"
import { generateAllNotifications } from "@/lib/notification-service"
import Image from "next/image"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [hasAttemptedNotifications, setHasAttemptedNotifications] = useState(false)

  useEffect(() => {
    // Only attempt to generate notifications if user is authenticated
    // But don't block rendering or redirect if not authenticated
    if (user && !hasAttemptedNotifications) {
      const checkForNotifications = async () => {
        try {
          await generateAllNotifications(user.id)
        } catch (error) {
          console.error("Error generating notifications:", error)
        }
        setHasAttemptedNotifications(true)
      }

      checkForNotifications()
    }
  }, [user, hasAttemptedNotifications])

  // Show loading state only briefly
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // Always render the dashboard layout, regardless of authentication status
  return (
    <div lang="en" className="scroll-smooth bg-white text-gray-700">
      <DashboardNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster />
    </div>
  )
}
