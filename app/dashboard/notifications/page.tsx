"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Calendar, Megaphone, ThumbsUp, CheckCheck, Loader2, AlertCircle, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  generateAllNotifications,
  deleteMultipleNotifications,
  deleteAllNotifications,
  deleteNotificationsByType,
  type Notification,
} from "@/lib/notification-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteMode, setDeleteMode] = useState<"selected" | "all" | "type" | null>(null)
  const [deleteType, setDeleteType] = useState<string | null>(null)

  // Get the active tab from URL query params or default to "all"
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(
    tabParam === "events" || tabParam === "announcements" || tabParam === "recommendations" ? tabParam : "all",
  )

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchNotifications()
    }
  }, [user, loading, router])

  // Update URL when tab changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)
    if (activeTab === "all") {
      newParams.delete("tab")
    } else {
      newParams.set("tab", activeTab)
    }
    router.replace(`/dashboard/notifications?${newParams.toString()}`, { scroll: false })
  }, [activeTab, router, searchParams])

  const fetchNotifications = async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      // Generate notifications
      await generateAllNotifications(user.id)

      // Then fetch all notifications
      const notifs = await getUserNotifications(user.id)
      setNotifications(notifs)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (selectMode) {
      toggleNotificationSelection(notification.id)
      return
    }

    if (!notification.read) {
      // Mark as read
      const success = await markNotificationAsRead(notification.id)

      if (success) {
        // Update local state
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
      }
    }

    // Navigate to the action URL if available
    if (notification.action_url) {
      router.push(notification.action_url)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return

    const success = await markAllNotificationsAsRead(user.id)

    if (success) {
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
      router.refresh() // Refresh the page to update notification badge
    } else {
      toast.error("Failed to mark notifications as read")
    }
  }

  const handleRefresh = async () => {
    setIsGenerating(true)
    try {
      if (user?.id) {
        await generateAllNotifications(user.id)
        await fetchNotifications()
        toast.success("Notifications refreshed")
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error)
      toast.error("Failed to refresh notifications")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    if (selectMode) {
      // Clear selections when exiting select mode
      setSelectedNotifications(new Set())
    }
  }

  const toggleNotificationSelection = (id: string) => {
    const newSelected = new Set(selectedNotifications)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedNotifications(newSelected)
  }

  const handleSelectAll = () => {
    // Get notifications of the current tab
    const currentTabNotifications = getFilteredNotifications()

    if (selectedNotifications.size === currentTabNotifications.length) {
      // If all are selected, deselect all
      setSelectedNotifications(new Set())
    } else {
      // Otherwise, select all in the current tab
      setSelectedNotifications(new Set(currentTabNotifications.map((n) => n.id)))
    }
  }

  const confirmDelete = (mode: "selected" | "all" | "type", type?: string) => {
    setDeleteMode(mode)
    if (type) {
      setDeleteType(type)
    }
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      let success = false

      if (deleteMode === "all") {
        success = await deleteAllNotifications(user.id)
        if (success) {
          setNotifications([])
          toast.success("All notifications deleted")
        }
      } else if (deleteMode === "type" && deleteType) {
        success = await deleteNotificationsByType(user.id, deleteType)
        if (success) {
          setNotifications((prev) => prev.filter((n) => n.type !== deleteType))
          toast.success(`All ${deleteType} notifications deleted`)
        }
      } else if (deleteMode === "selected" && selectedNotifications.size > 0) {
        const selectedIds = Array.from(selectedNotifications)
        success = await deleteMultipleNotifications(selectedIds)
        if (success) {
          setNotifications((prev) => prev.filter((n) => !selectedNotifications.has(n.id)))
          setSelectedNotifications(new Set())
          toast.success(`${selectedIds.length} notification${selectedIds.length !== 1 ? "s" : ""} deleted`)
        }
      }

      if (!success) {
        toast.error("Failed to delete notifications")
      }
    } catch (error) {
      console.error("Error deleting notifications:", error)
      toast.error("An error occurred while deleting notifications")
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setSelectMode(false)
      setDeleteType(null)
    }
  }

  // Filter notifications by type based on active tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "events":
        return notifications.filter((n) => n.type === "event")
      case "announcements":
        return notifications.filter((n) => n.type === "announcement")
      case "recommendations":
        return notifications.filter((n) => n.type === "recommendation")
      default:
        return notifications
    }
  }

  const filteredNotifications = getFilteredNotifications()

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Count notifications by type
  const eventNotifications = notifications.filter((n) => n.type === "event")
  const announcementNotifications = notifications.filter((n) => n.type === "announcement")
  const recommendationNotifications = notifications.filter((n) => n.type === "recommendation")

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your events and announcements</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectMode ? (
            <>
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedNotifications.size === filteredNotifications.length ? "Deselect All" : "Select All"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete("selected")}
                disabled={selectedNotifications.size === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
              <Button variant="secondary" onClick={toggleSelectMode}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button variant="outline" onClick={toggleSelectMode} disabled={filteredNotifications.length === 0}>
                <Checkbox className="mr-2 h-4 w-4" />
                Select
              </Button>
              {activeTab !== "all" && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    confirmDelete(
                      "type",
                      activeTab === "events"
                        ? "event"
                        : activeTab === "announcements"
                          ? "announcement"
                          : "recommendation",
                    )
                  }
                  disabled={filteredNotifications.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Button>
              )}
              <Button variant="destructive" onClick={() => confirmDelete("all")} disabled={notifications.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
              <Button variant="default" onClick={handleRefresh} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            You have <span className="font-bold">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}.
          </p>
        </div>
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
          <span>Loading notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You don't have any notifications yet. They'll appear here when you receive updates about your events,
              announcements, or recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({eventNotifications.length})</TabsTrigger>
            <TabsTrigger value="announcements">Announcements ({announcementNotifications.length})</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations ({recommendationNotifications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    selectMode={selectMode}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No event notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    selectMode={selectMode}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="announcements">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No announcement notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    selectMode={selectMode}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recommendation notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    selectMode={selectMode}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteMode === "all"
                ? "Are you sure you want to delete all notifications? This action cannot be undone and these items will be permanently hidden."
                : deleteMode === "type" && deleteType
                  ? `Are you sure you want to delete all ${deleteType === "event" ? "event" : deleteType === "announcement" ? "announcement" : "recommendation"} notifications? This action cannot be undone and these items will be permanently hidden.`
                  : `Are you sure you want to delete ${selectedNotifications.size} selected notification${selectedNotifications.size !== 1 ? "s" : ""}? This action cannot be undone and these items will be permanently hidden.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface NotificationCardProps {
  notification: Notification
  onClick: () => void
  selectMode: boolean
  isSelected: boolean
}

function NotificationCard({ notification, onClick, selectMode, isSelected }: NotificationCardProps) {
  // Determine icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "announcement":
        return <Megaphone className="h-5 w-5 text-red-500" />
      case "recommendation":
        return <ThumbsUp className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Determine badge color based on notification type
  const getBadgeVariant = () => {
    switch (notification.type) {
      case "event":
        return "default"
      case "announcement":
        return "destructive"
      case "recommendation":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Format the notification type for display
  const getTypeLabel = () => {
    switch (notification.type) {
      case "event":
        return "Event"
      case "announcement":
        return "Announcement"
      case "recommendation":
        return "Recommendation"
      default:
        return notification.type
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
        !notification.read ? "border-l-4 border-l-blue-500" : ""
      } ${isSelected ? "bg-blue-50 border-blue-300" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex gap-4">
        {selectMode && (
          <div className="flex-shrink-0 mt-1">
            <Checkbox checked={isSelected} className="pointer-events-none" />
          </div>
        )}

        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h3 className="font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <Badge variant={getBadgeVariant()} className="whitespace-nowrap">
                {getTypeLabel()}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {notification.image_url && (
            <div className="mt-3">
              <img
                src={notification.image_url || "/placeholder.svg"}
                alt={notification.title}
                className="h-24 w-full object-cover rounded-md"
              />
            </div>
          )}

          {notification.action_url && (
            <div className="mt-3">
              <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                View details →
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
