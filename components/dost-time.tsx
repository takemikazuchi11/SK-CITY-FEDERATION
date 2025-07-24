"use client"

import { useState, useEffect } from "react"

async function fetchTime() {
  try {
    const response = await fetch("https://oras.pagasa.dost.gov.ph/api/v1/get_time")
    const data = await response.json()
    return data.time
  } catch (error) {
    console.error("Error fetching time from DOST:", error)
    return null
  }
}

export function DOSTTime() {
  const [time, setTime] = useState<string | null>(null)
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    const updateTime = async () => {
      const fetchedTime = await fetchTime()
      if (fetchedTime) {
        setTime(fetchedTime)
      }
      setDate(new Date())
    }

    updateTime() // Initial fetch

    const intervalId = setInterval(updateTime, 1000) // Update every second

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="bg-blue-100 rounded-md p-3 mt-4">
      <div className="text-red-600 text-2xl font-bold text-center">{time || "Loading time..."}</div>
      <div className="text-blue-800 text-sm text-center">{formatDate(date)}</div>
    </div>
  )
}
