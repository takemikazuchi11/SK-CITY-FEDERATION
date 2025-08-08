"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Test database connection and permissions
        console.log("Testing database connection...")
        const { data: testData, error: testError } = await supabase
          .from("users")
          .select("count", { count: "exact", head: true })
        
        if (testError) {
          console.error("Database connection test failed:", testError)
        } else {
          console.log("Database connection successful, user count:", testData)
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth callback error:", error)
          setError("Authentication failed. Please try again.")
          setLoading(false)
          return
        }

        if (data.session && data.session.user.email) {
          // Get user profile from our users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("email", data.session.user.email)
            .single()

          if (userError) {
            // User doesn't exist in our table, create them
            console.log("User not found in database, creating new user")
            console.log("Session user data:", data.session.user)
            console.log("User metadata:", data.session.user.user_metadata)
            
            const firstName = data.session.user.user_metadata?.full_name?.split(" ")[0] || "User"
            const lastName = data.session.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || ""
            
            // If no full_name is provided, try to use given_name and family_name
            if (!data.session.user.user_metadata?.full_name) {
              const givenName = data.session.user.user_metadata?.given_name || "User"
              const familyName = data.session.user.user_metadata?.family_name || ""
              console.log("Using given_name and family_name:", { givenName, familyName })
            }
            
            console.log("Creating new user with data:", {
              email: data.session.user.email,
              first_name: firstName,
              last_name: lastName,
              user_role: "user",
              password: "google_oauth_user",
              photo_url: data.session.user.user_metadata?.avatar_url,
            })
            
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert([
                {
                  email: data.session.user.email,
                  first_name: firstName,
                  last_name: lastName,
                  user_role: "user",
                  password: "google_oauth_user", // Placeholder password for Google OAuth users
                  photo_url: data.session.user.user_metadata?.avatar_url,
                  phone: null, // Explicitly set phone to null since it's nullable
                  auth_provider: "google", // Track that this user signed up via Google
                }
              ])
              .select()
              .single()

            if (createError) {
              console.error("Error creating user:", createError)
              console.error("Error details:", {
                message: createError.message,
                details: createError.details,
                hint: createError.hint,
                code: createError.code
              })
              console.error("Full error object:", JSON.stringify(createError, null, 2))
              setError(`Failed to create user account: ${createError.message}. Please try again.`)
              setLoading(false)
              return
            }

            // Store user data
            const userProfile = {
              id: newUser.id,
              email: newUser.email,
              user_role: newUser.user_role,
              first_name: newUser.first_name,
              last_name: newUser.last_name,
              barangay: newUser.barangay,
              phone: newUser.phone,
              photo_url: newUser.photo_url,
              created_at: newUser.created_at,
            }

            localStorage.setItem("user", JSON.stringify(userProfile))
            
            // Trigger a custom event to notify auth context
            window.dispatchEvent(new CustomEvent("userLogin", { detail: userProfile }))
          } else {
            // User exists, store their data
            const userProfile = {
              id: userData.id,
              email: userData.email,
              user_role: userData.user_role,
              first_name: userData.first_name,
              last_name: userData.last_name,
              barangay: userData.barangay,
              phone: userData.phone,
              photo_url: userData.photo_url,
              created_at: userData.created_at,
            }

            localStorage.setItem("user", JSON.stringify(userProfile))
            
            // Trigger a custom event to notify auth context
            window.dispatchEvent(new CustomEvent("userLogin", { detail: userProfile }))
          }

          // Small delay to ensure auth context is updated
          setTimeout(() => {
            router.push("/dashboard")
          }, 200)
        } else if (!data.session?.user.email) {
          setError("No email found in session. Please try signing in again.")
          setLoading(false)
        } else {
          setError("No session found. Please try signing in again.")
          setLoading(false)
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setError("An unexpected error occurred. Please try again.")
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Signing you in...</CardTitle>
            <CardDescription>Please wait while we complete your authentication.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load the authentication page.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 