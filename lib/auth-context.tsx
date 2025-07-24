"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

export type User = {
  id: string
  email: string
  user_role: string
  first_name: string
  last_name: string
  barangay?: string
  phone?: string
  photo_url?: string
  created_at?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/dashboard", "/news", "/news/"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem("user")

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          localStorage.removeItem("user")
        }
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  // Redirect based on auth status and role
  useEffect(() => {
    if (loading) return

    // Check if the current path is a public route or starts with a public route
    const isPublicRoute =
      PUBLIC_ROUTES.some(
        (route) => pathname === route || (route !== "/" && pathname.startsWith(route))
      ) ||
      pathname.startsWith("/news");

    // If not logged in and trying to access protected routes
    if (!user && !isPublicRoute) {
      router.push("/login")
      return
    }

    // Redirect old routes to new dashboard structure
    if (user) {
      // Redirect from old admin routes to new dashboard
      if (pathname.startsWith("/admin")) {
        const newPath = pathname.replace("/admin", "/dashboard")
        router.push(newPath)
        return
      }

      // Redirect from old user routes to new dashboard
      if (pathname.startsWith("/user")) {
        const newPath = pathname.replace("/user", "/dashboard")
        router.push(newPath)
        return
      }
    }
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would hash passwords and use proper auth
      // This is simplified for demo purposes
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single()

      if (error || !data) {
        return { success: false, error: "Invalid email or password" }
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        user_role: data.user_role,
        first_name: data.first_name,
        last_name: data.last_name,
        barangay: data.barangay,
        phone: data.phone,
        photo_url: data.photo_url,
        created_at: data.created_at,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.user_role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
