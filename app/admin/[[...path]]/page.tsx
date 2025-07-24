"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Convert old admin path to new dashboard path
    if (pathname) {
      const newPath = pathname.replace("/admin", "/dashboard")
      router.push(newPath)
    } else {
      router.push("/dashboard")
    }
  }, [pathname, router])

  return null;
}

