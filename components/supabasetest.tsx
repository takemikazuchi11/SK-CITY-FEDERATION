"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>("Testing connection...")

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from("barangays").select("*").limit(1)

        if (error) {
          throw error
        }

        setStatus(`Connection successful! Found ${data.length} barangay(s)`)
        console.log("Test data:", data)
      } catch (error) {
        setStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`)
        console.error("Connection test error:", error)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-2">Supabase Connection Test</h3>
      <p className={status.includes("successful") ? "text-green-600" : "text-red-600"}>{status}</p>
    </div>
  )
}

