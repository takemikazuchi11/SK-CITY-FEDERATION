"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { EventParticipationTable } from "@/components/admin/event-participation-table"
import { KKRegistrationsTable } from "@/components/admin/kk-registrations-table"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AdminOnly } from "@/components/role-based-ui"
import EventFeedbackAdminTable from "./event-feedback"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartsError, setChartsError] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalAnnouncements: 0,
    totalParticipants: 0,
    totalKKRegistrations: 0, // Added this new stat
  })
  const router = useRouter()
  const { isAdmin } = useAuth()

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get total users
        const { count: totalUsers, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })

        if (usersError) throw usersError

        // Get new users this month
        const currentDate = new Date()
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const { count: newUsersThisMonth, error: newUsersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .gte("created_at", firstDayOfMonth.toISOString())

        if (newUsersError) throw newUsersError

        // Get total events
        const { count: totalEvents, error: eventsError } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })

        if (eventsError) throw eventsError

        // Get upcoming events
        const { count: upcomingEvents, error: upcomingEventsError } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("date", new Date().toISOString().split("T")[0])

        if (upcomingEventsError) throw upcomingEventsError

        // Get total announcements
        const { count: totalAnnouncements, error: announcementsError } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })

        if (announcementsError) throw announcementsError

        // Get total participants - check if table exists first
        let totalParticipants = 0
        try {
          const { count, error: participantsError } = await supabase
            .from("event_participants")
            .select("*", { count: "exact", head: true })

          if (!participantsError) {
            totalParticipants = count || 0
          }
        } catch (error) {
          console.log("event_participants table might not exist, using 0")
        }

        // Get total KK registrations
        let totalKKRegistrations = 0
        try {
          const { count, error: kkRegistrationsError } = await supabase
            .from("kk_registrations")
            .select("*", { count: "exact", head: true })

          if (!kkRegistrationsError) {
            totalKKRegistrations = count || 0
          }
        } catch (error) {
          console.log("kk_registrations table might not exist, using 0")
        }

        setStats({
          totalUsers: totalUsers || 0,
          newUsersThisMonth: newUsersThisMonth || 0,
          totalEvents: totalEvents || 0,
          upcomingEvents: upcomingEvents || 0,
          totalAnnouncements: totalAnnouncements || 0,
          totalParticipants: totalParticipants,
          totalKKRegistrations: totalKKRegistrations,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router, isAdmin])

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <AdminOnly>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <DashboardStats stats={stats} />

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="events">Event Participation</TabsTrigger>
            <TabsTrigger value="kk-registrations">KK Registrations</TabsTrigger>
            <TabsTrigger value="event-feedback">Event Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                  <CardDescription>Key metrics and visualizations for your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartsError ? (
                    <div>
                      <p className="text-red-500 mb-4 text-center">
                        Failed to load chart data. Using fallback charts instead.
                      </p>
                    </div>
                  ) : (
                    <DashboardCharts onError={() => setChartsError(true)} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Participation</CardTitle>
                <CardDescription>Track user registrations for events</CardDescription>
              </CardHeader>
              <CardContent>
                <EventParticipationTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kk-registrations">
            <Card>
              <CardHeader>
                <CardTitle>Katipunan ng Kabataan Registrations</CardTitle>
                <CardDescription>View and manage all KK registration submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <KKRegistrationsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="event-feedback">
            <EventFeedbackAdminTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminOnly>
  )
}
