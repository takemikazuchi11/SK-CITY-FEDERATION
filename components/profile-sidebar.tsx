"use client"

import { useRouter } from "next/navigation"
import { Settings, LayoutDashboard, Bell, Calendar, HelpCircle, LogOut, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useRef, useState } from "react"
import { AdminOnly } from "@/components/role-based-ui"
import { getUnreadNotificationsCount } from "@/lib/notification-service"
import { Badge } from "@/components/ui/badge"
import { UserIcon } from "lucide-react"
import { useLoading } from "@/lib/loading-context"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { setLoading } = useLoading();

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Add unreadCount state
  const [unreadCount, setUnreadCount] = useState(0)

  // Add useEffect to fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?.id) {
        const count = await getUnreadNotificationsCount(user.id)
        setUnreadCount(count)
      }
    }

    fetchUnreadCount()

    // Set up interval to check for new notifications every minute
    const intervalId = setInterval(fetchUnreadCount, 60000)

    return () => clearInterval(intervalId)
  }, [user?.id])

  // Common menu items for all users
  const commonMenuItems = [
    {
      name: "Account Settings",
      icon: Settings,
      href: "/dashboard/account",
    },
    {
      name: "My Events",
      icon: Calendar,
      href: "/dashboard/my-events",
    },
    {
      name: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Support & Help",
      icon: HelpCircle,
      href: "/dashboard/support",
    },
  ]

  // Admin-only menu items
  const adminMenuItems = [
    {
      name: "Admin Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
    },
    {
      name: "Create Announcement",
      icon: Bell,
      href: "/dashboard/announcement/create",
    },
    {
      name: "Create Poll Announcement",
      icon: Bell,
      href: "/dashboard/announcement/create-poll",
    },
    {
      name: "Create Event",
      icon: Calendar,
      href: "/dashboard/events/create",
    },
    {
      name: "Add Files SKCF",
      icon: FileText,
      href: "/dashboard/admin/disclosure-management",
    },
  ]

  // Combine menu items based on user role
  const menuItems = isAdmin ? [...adminMenuItems, ...commonMenuItems] : commonMenuItems

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {user ? (
          // Content for logged-in users
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center justify-center p-6 border-b">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage
                  src={user?.photo_url || "/placeholder.svg?height=80&width=80"}
                  alt={`${user?.first_name} ${user?.last_name}`}
                />
                <AvatarFallback>
                  {user?.first_name?.charAt(0) || ""}
                  {user?.last_name?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <AdminOnly>
                <span className="mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Administrator</span>
              </AdminOnly>
            </div>

            <div className="flex-1 overflow-auto py-4">
              <nav className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setLoading(true);
                      router.push(item.href);
                      onClose();
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          // Content for non-authenticated users
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center justify-center p-6 border-b">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback>
                  <UserIcon className="h-10 w-10 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">Welcome</h3>
              <p className="text-sm text-muted-foreground">Sign in to access your account</p>
            </div>

            <div className="flex-1 p-6">
              <div className="space-y-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setLoading(true);
                    router.push("/login");
                    onClose();
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setLoading(true);
                    router.push("/login?tab=register");
                    onClose();
                  }}
                >
                  Create Account
                </Button>
                <div className="pt-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Sign in to access events, announcements, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setLoading(true);
                  router.push("/");
                  onClose();
                }}
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Help & Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
