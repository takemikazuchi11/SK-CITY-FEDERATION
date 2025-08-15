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
import { createAnnouncement, getAnnouncementById, updateAnnouncement } from "@/lib/supabase"
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
import { useSearchParams } from "next/navigation";

export default function CreateAnnouncement() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAdmin, loading } = useAuth()
  const { setLoading } = useLoading();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [displayDuration, setDisplayDuration] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)
  const [notificationMode, setNotificationMode] = useState<"all" | "selected">("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isEmailSectionOpen, setIsEmailSectionOpen] = useState(false)
  const [audience, setAudience] = useState<'everyone' | 'sk_chairpersons'>('everyone')
  const [notificationStatus, setNotificationStatus] = useState<{
    status: "idle" | "sending" | "success" | "error"
    message?: string
    recipients?: string[]
    failed?: string[]
  }>({ status: "idle" })

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  // Populate form if editing
  useEffect(() => {
    if (editId) {
      (async () => {
        const data = await getAnnouncementById(editId);
        setTitle(data.title || "");
        setContent(data.content || "");
        setCategory(data.category || "general");
        setDisplayDuration(data.display_duration);
        setAudience(data.audience || "everyone");
      })();
    }
  }, [editId]);

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

      let announcementResult;
      if (editId) {
        // Update existing
        announcementResult = await updateAnnouncement(editId, { title, content, category, display_duration: displayDuration || undefined, audience });
        toast({
          title: "Announcement updated",
          description: "Your announcement has been updated successfully",
        });
        router.push("/dashboard/announcement");
        return;
      } else {
        // Create new
        announcementResult = await createAnnouncement({
          title,
          content,
          author: `${user.first_name} ${user.last_name}`,
          author_role: user.user_role,
          category,
          user_id: user.id,
          display_duration: displayDuration || undefined,
          audience,
        });
        toast({
          title: "Announcement created",
          description: "Your announcement has been published successfully",
        });
      }

      // If not sending notification, redirect immediately
      if (!sendNotification) {
        router.push("/dashboard")
        return
      }

      // Send notification if enabled
      setNotificationStatus({ status: "sending" })

      // Determine which emails to send to based on the notification mode
      let emailsToSend: string[] | undefined;
      
      if (notificationMode === "selected") {
        emailsToSend = selectedUsers;
      } else {
        // Send to all users when not selecting specific users
        emailsToSend = undefined;
      }

      // Transform the announcement result to match the expected type
      const transformedAnnouncement = {
        ...announcementResult,
        created_at: announcementResult.created_at || "",
        likes: announcementResult.likes || 0,
        user_id: announcementResult.user_id || "",
        display_duration: announcementResult.display_duration || 30
      };
      
      const result = await sendEmailNotification(transformedAnnouncement, emailsToSend)

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
               <div className="flex items-center gap-3 mb-2">
                 <Switch
                   id="audience-switch"
                   checked={audience === 'everyone'}
                   onCheckedChange={checked => setAudience(checked ? 'everyone' : 'sk_chairpersons')}
                 />
                 <Mail className="h-5 w-5 text-muted-foreground" />
                 <Label htmlFor="audience-switch" className="cursor-pointer select-none">
                   {audience === 'everyone' ? 'Send Announcement to Everyone' : 'Send Announcement to SK Chairpersons'}
                 </Label>
               </div>
               
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
                <Label htmlFor="display-duration">Display Duration (days) - Optional</Label>
                <Input
                  id="display-duration"
                  type="number"
                  min="1"
                  max="365"
                  placeholder="30"
                  value={displayDuration || ""}
                  onChange={(e) => setDisplayDuration(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Optional: How long this announcement will be displayed on the homepage. Leave empty to display indefinitely.
                </p>
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
                
                {sendNotification && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <div className="text-amber-600 mt-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Email Limit Notice</p>
                        <p>We can only send up to 100 emails per day. Please select specific users instead of sending to all users to avoid hitting this limit.</p>
                      </div>
                    </div>
                  </div>
                )}

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
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            Email notification will be sent to all registered users.
                          </div>
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-start space-x-2">
                              <div className="text-red-600 mt-0.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="text-sm text-red-800">
                                <p className="font-medium">⚠️ Daily Limit Warning</p>
                                <p>Sending to all users may exceed our daily limit of 100 emails. Consider using "Select Users" instead to target specific recipients.</p>
                              </div>
                            </div>
                          </div>
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
                {editId
                  ? isSubmitting || notificationStatus.status === "sending"
                    ? "Saving..."
                    : "Edit Announcement"
                  : isSubmitting || notificationStatus.status === "sending"
                    ? "Publishing..."
                    : "Publish Announcement"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminOnly>
  )
}

