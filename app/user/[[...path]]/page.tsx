"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function UserRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Convert old user path to new dashboard path
    if (pathname) {
      const newPath = pathname.replace("/user", "/dashboard")
      router.push(newPath)
    } else {
      router.push("/dashboard")
    }
  }, [pathname, router])

  return null;
}

