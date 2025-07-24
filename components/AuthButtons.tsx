"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"
import { useLoading } from "@/lib/loading-context"

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { setLoading } = useLoading();

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/profile" onClick={() => setLoading(true)}>
          <Button variant="ghost" className="text-white hover:text-blue-200">
            <UserCircle className="mr-2 h-5 w-5" />
            Profile
          </Button>
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-white hover:text-blue-200 border-white hover:border-blue-200"
        >
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" onClick={() => setLoading(true)}>
        <Button variant="ghost" className="text-white hover:text-blue-200">
          Login
        </Button>
      </Link>
      <Link href="/register" onClick={() => setLoading(true)}>
        <Button variant="outline" className="text-black hover:text-blue-200 border-white hover:border-blue-200">
          Register
        </Button>
      </Link>
    </div>
  )
}

