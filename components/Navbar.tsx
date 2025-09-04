"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import AuthButtons from "./AuthButtons"
import { useLoading } from "@/lib/loading-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Process", href: "/process" },
  { name: "Resources", href: "/resources" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { setLoading } = useLoading()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    // For other pages, match exact path or paths that start with href + "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="fixed top-0 w-full bg-blue-600 text-white z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl" onClick={() => setLoading(true)}>
              Logo
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 ease-in-out",
                    isActive(item.href) ? "bg-blue-700 font-semibold" : ""
                  )}
                  onClick={() => setLoading(true)}
                >
                  {item.name}
                </Link>
              ))}
              <AuthButtons />
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-150 ease-in-out",
                  isActive(item.href) ? "bg-blue-700 font-semibold" : ""
                )}
                onClick={() => setLoading(true)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

