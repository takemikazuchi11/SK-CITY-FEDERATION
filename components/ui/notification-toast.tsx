"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface NotificationToastProps {
  message: string
  type: "success" | "error" | "info"
  duration?: number
  onClose: () => void
}

export function NotificationToast({ message, type = "info", duration = 3000, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for fade-out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg text-white shadow-lg transition-opacity duration-300 ${bgColor[type]} ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-4 p-1 rounded-full hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

