"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLoading } from "@/lib/loading-context"

interface NavItem {
  title: string
  href: string
  children?: NavItem[]
}

interface DropdownNavProps {
  items: NavItem[]
  variant?: "admin" | "user"
}

export function DropdownNav({ items, variant = "user" }: DropdownNavProps) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { setLoading } = useLoading();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdown])

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const bgColor = variant === "admin" ? "bg-blue-600" : "bg-blue-600"
  const hoverBgColor = variant === "admin" ? "hover:bg-blue-700" : "hover:bg-blue-700"
  const dropdownBgColor = variant === "admin" ? "bg-white" : "bg-white"

  // Create ref callback
  const setDropdownRef = useCallback((element: HTMLDivElement | null, title: string) => {
    dropdownRefs.current[title] = element
  }, [])

  return (
    <nav className={`${bgColor} text-white sticky top-0 z-50 w-full`}>
      <div className="container mx-auto px-4 flex justify-center">
        <div className="flex items-center justify-between h-16 w-full max-w-5xl">
          <div className="flex items-center">
            <Link href={variant === "admin" ? "/dashboard" : "/dashboard"} className="font-bold text-xl">
              {/* Removed text as requested */}
            </Link>
          </div>

          {/* Desktop Navigation - centered */}
          <div className="hidden md:flex items-center space-x-1">
            {items.map((item) => (
              <div key={item.title} className="relative" ref={(el) => setDropdownRef(el, item.title)}>
                {item.children ? (
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                      hoverBgColor,
                      openDropdown === item.title ? "bg-blue-700" : "",
                    )}
                    aria-expanded={openDropdown === item.title}
                  >
                    {item.title}
                    <ChevronDown
                      className={cn(
                        "ml-1 h-4 w-4 transition-transform",
                        openDropdown === item.title ? "rotate-180" : "",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      hoverBgColor,
                      isActive(item.href) ? "bg-blue-700" : "",
                    )}
                    onClick={() => setLoading(true)}
                  >
                    {item.title}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && openDropdown === item.title && (
                  <div
                    className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg ${dropdownBgColor} ring-1 ring-black ring-opacity-5 z-50`}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                            isActive(child.href) ? "bg-gray-100 font-medium" : "",
                          )}
                          role="menuitem"
                          onClick={() => {
                            setLoading(true);
                            setOpenDropdown(null);
                          }}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex justify-end px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                    >
                      {item.title}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", openDropdown === item.title ? "rotate-180" : "")}
                      />
                    </button>
                    {openDropdown === item.title && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className={cn(
                              "block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800",
                              isActive(child.href) ? "bg-blue-800" : "",
                            )}
                            onClick={() => {
                              setLoading(true);
                              setOpenDropdown(null);
                            }}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800",
                      isActive(item.href) ? "bg-blue-800" : "",
                    )}
                    onClick={() => setLoading(true)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

