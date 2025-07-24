"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { DropdownNav } from "@/components/dropdown-nav"
import { getUnreadNotificationsCount } from "@/lib/notification-service"
import { useEffect } from "react"

// Define navigation items with role-based visibility
const commonNavItems = [
  {
    title: "Home",
    href: "/dashboard",
  },
  {
    title: "About",
    href: "#",
    children: [
      { title: "Vision, Mission, and Core Values", href: "/dashboard/about" },
      { title: "SK History", href: "/dashboard/about/history" },
      { title: "SK Federation Officers", href: "/dashboard/about/officers" },
      { title: "Barangay SK Officials", href: "/dashboard/about/barangays" },
    ],
  },
  {
    title: "Programs",
    href: "#",
    children: [
      { title: "Sangguniang Kabataan (SK)", href: "/dashboard/programs" },
      { title: "CYDC", href: "/dashboard/cydc" },
      { title: "Katipunan Kabataan", href: "/dashboard/kk" },
      { title: "Events", href: "/dashboard/programs/events" },
    ],
  },
  {
    title: "Process",
    href: "#",
    children: [
      { title: "EFPS", href: "/dashboard/process/efps" },
      { title: "Annual Budget", href: "/dashboard/process/budget" },
      { title: "Fidelity Bonding", href: "https://www.treasury.gov.ph/?page_id=3474" },
      { title: "Quarterly Full Disclosure Board", href: "/dashboard/process/disclosure" },
    ],
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
  },
  {
    title: "Contact Us",
    href: "/dashboard/contact",
  },
]

// Admin-specific navigation items - removed the Dashboard button as requested
const adminNavItems = [
  // Dashboard button removed
]

export default function DashboardNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, isAdmin } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      if (user?.id) {
        const count = await getUnreadNotificationsCount(user.id)
        setUnreadCount(count)
      }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 60000)
    return () => clearInterval(interval)
  }, [user?.id])

  // Combine common items with admin-specific items if user is admin
  interface NavItem {
    title: string
    href: string
    children?: NavItem[]
  }

  const commonNavItems: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
    },
    {
      title: "About",
      href: "#",
      children: [
        { title: "Vision, Mission, and Core Values", href: "/dashboard/about" },
        { title: "SK History", href: "/dashboard/about/history" },
        { title: "SK Federation Officers", href: "/dashboard/about/officers" },
        { title: "Barangay SK Officials", href: "/dashboard/about/barangays" },
      ],
    },
    {
      title: "Programs",
      href: "#",
      children: [
      
        { title: "CYDC", href: "/dashboard/programs/cydc" },
        { title: "Katipunan ng Kabataan", href: "/dashboard/programs/kk" },
        { title: "Events", href: "/dashboard/programs/events" },
      ],
    },
    {
      title: "Process",
      href: "#",
      children: [
        { title: "BIR Filing", href: "/dashboard/process/bir-filing" },
        { title: "COA Report", href: "/dashboard/process/coa-report" },
        { title: "ETPS", href: "/dashboard/process/etps" },
        { title: "EFPS", href: "/dashboard/process/efps" },
        { title: "Fidelity Bonding", href: "/dashboard/process/fidelity-bonding" },
        { title: "Quarterly Full Disclosure Board", href: "/dashboard/process/disclosure" },
        { title: "COA Handbook", href: "/dashboard/process/coa-hb" },
      ],
    },
    {
      title: "Resources",
      href: "/dashboard/resources",
    },
    {
      title: "Contact Us",
      href: "/dashboard/contact",
    },
  ]

  const adminNavItems: NavItem[] = [
    // Dashboard button removed
  ]

  const navItems: NavItem[] = isAdmin ? [...adminNavItems, ...commonNavItems] : commonNavItems

  return (
    <>
      <DropdownNav items={navItems} variant={isAdmin ? "admin" : "user"} />

      {/* Profile Button - positioned to not obscure navbar content */}
      <div className="fixed top-3 right-6 z-50">
        {user ? (
          <Button
            variant="ghost"
            className="rounded-full p-0 h-10 w-10 overflow-hidden bg-white/20 hover:bg-white/30 relative"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Avatar>
              <AvatarImage
                src={user?.photo_url || "/placeholder.svg?height=40&width=40"}
                alt={`${user?.first_name || ""} ${user?.last_name || ""}`}
              />
              <AvatarFallback>
                {user?.first_name?.charAt(0) || ""}
                {user?.last_name?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="font-semibold px-4 py-2 text-blue-700 border-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = "/login"}
          >
            Login / Sign Up
          </Button>
        )}
        {user && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow z-20">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

