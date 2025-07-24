"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { createAnnouncement } from "@/lib/supabase"
import { sendEmailNotification } from "@/app/action/email"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Switch } from "@/components/ui/switch"
import { EmailNotificationStatus } from "@/components/email-notification-status"
import { AdminOnly } from "@/components/role-based-ui"
import { UserSelectionList } from "@/components/admin/user-selection-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useLoading } from "@/lib/loading-context";

export default function CreateAnnouncement() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAdmin, loading } = useAuth()
  const { setLoading } = useLoading();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)
  const [notificationMode, setNotificationMode] = useState<"all" | "selected">("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isEmailSectionOpen, setIsEmailSectionOpen] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<{
    status: "idle" | "sending" | "success" | "error"
    message?: string
    recipients?: string[]
    failed?: string[]
  }>({ status: "idle" })

  useEffect(() => {
    // Redirect if not admin
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create announcements",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [user, isAdmin, loading, router, toast])

  // Add a useEffect to handle redirection after successful email sending
  useEffect(() => {
    if (notificationStatus.status === "success") {
      // Set a short timeout to allow the user to see the success message
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard")
      }, 3000) // Redirect after 3 seconds

      return () => clearTimeout(redirectTimer)
    }
  }, [notificationStatus.status, router])

  // Remove the local loading fallback
  // Only render the form if user, isAdmin, and not loading
  if (!user || !isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const newAnnouncement = await createAnnouncement({
        title,
        content,
        author: `${user.first_name} ${user.last_name}`,
        author_role: user.user_role,
        category,
        user_id: user.id,
      })

      toast({
        title: "Announcement created",
        description: "Your announcement has been published successfully",
      })

      // If not sending notification, redirect immediately
      if (!sendNotification) {
        router.push("/dashboard")
        return
      }

      // Send notification if enabled
      setNotificationStatus({ status: "sending" })

      // Determine which emails to send to based on the notification mode
      const emailsToSend = notificationMode === "selected" ? selectedUsers : undefined

      const result = await sendEmailNotification(newAnnouncement, emailsToSend)

      setNotificationStatus({
        status: result.success ? "success" : "error",
        message: result.message,
        recipients: result.recipients,
        failed: [],
      })

      if (!result.success) {
        toast({
          title: "Notification error",
          description: result.message,
          variant: "destructive",
        })
        // Even if email sending fails, redirect after a delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }

      // Note: We don't redirect here anymore - the useEffect will handle it
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <AdminOnly>
      <div className="container mx-auto py-8 px-4">
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline text-blue-600 font-semibold" onClick={() => setLoading(true)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter announcement details"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <Collapsible
                open={isEmailSectionOpen}
                onOpenChange={setIsEmailSectionOpen}
                className="border rounded-md p-4"
              >
                <div className="flex items-center space-x-2">
                  <Switch id="send-notification" checked={sendNotification} onCheckedChange={setSendNotification} />
                  <Label htmlFor="send-notification" className="flex items-center cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    Send email notification
                  </Label>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      {isEmailSectionOpen ? "Hide Options" : "Show Options"}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4">
                  {sendNotification && (
                    <Tabs
                      defaultValue="all"
                      className="w-full"
                      onValueChange={(value) => setNotificationMode(value as "all" | "selected")}
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="selected">Select Users</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all">
                        <div className="text-sm text-muted-foreground">
                          Email notification will be sent to all registered users.
                        </div>
                      </TabsContent>

                      <TabsContent value="selected">
                        <UserSelectionList selectedUsers={selectedUsers} onSelectionChange={setSelectedUsers} />
                      </TabsContent>
                    </Tabs>
                  )}
                </CollapsibleContent>
              </Collapsible>

              <EmailNotificationStatus
                status={notificationStatus.status}
                message={notificationStatus.message}
                recipients={notificationStatus.recipients}
                failed={notificationStatus.failed}
              />

              {notificationStatus.status === "success" && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Redirecting to dashboard in 3 seconds...
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => { setLoading(true); router.push("/dashboard"); }}
                disabled={isSubmitting || notificationStatus.status === "sending"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  isSubmitting ||
                  notificationStatus.status === "sending" ||
                  notificationStatus.status === "success" ||
                  (sendNotification && notificationMode === "selected" && selectedUsers.length === 0)
                }
              >
                {isSubmitting || notificationStatus.status === "sending" ? "Publishing..." : "Publish Announcement"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminOnly>
  )
}

