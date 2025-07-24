"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the login page with register tab selected
    router.push("/login?tab=register")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Redirecting to registration page...</p>
    </div>
  )
}

