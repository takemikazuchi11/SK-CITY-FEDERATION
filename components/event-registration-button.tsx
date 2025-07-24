"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { registerForEvent, cancelEventRegistration, checkEventRegistration } from "@/app/action/event-actions"
import { useAuth } from "@/lib/auth-context"
import { Loader2, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

interface EventRegistrationButtonProps {
  eventId: string
  eventDate: string // Add eventDate prop
  className?: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  feedbackButtonColor?: string // e.g. 'blue'
  endedButtonColor?: string // e.g. 'red'
}

export function EventRegistrationButton({
  eventId,
  eventDate,
  className = "",
  variant = "default",
  size = "default",
  feedbackButtonColor = "blue",
  endedButtonColor = "red",
}: EventRegistrationButtonProps) {
  const { user } = useAuth()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkRegistration() {
      if (!user?.id) {
        setIsChecking(false)
        return
      }

      setIsChecking(true)
      try {
        const result = await checkEventRegistration(eventId, user.id)
        setIsRegistered(result.isRegistered)
      } catch (error) {
        console.error("Error checking registration status:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkRegistration()
  }, [eventId, user?.id])

  const handleRegistration = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to register for events")
      return
    }

    setIsLoading(true)

    try {
      if (isRegistered) {
        // Cancel registration
        const result = await cancelEventRegistration(eventId, user.id)

        if (result.success) {
          setIsRegistered(false)
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } else {
        // Register for event
        const result = await registerForEvent(eventId, user.id)

        if (result.success) {
          setIsRegistered(true)
          toast.success(result.message)
        } else if (result.alreadyRegistered) {
          setIsRegistered(true)
          toast.info(result.message)
        } else {
          toast.error(result.message)
        }
      }
    } catch (error) {
      console.error("Registration action error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if event has passed
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventDateObj = new Date(eventDate)
  const eventHasPassed = eventDateObj.getTime() < today.getTime()

  // If user is not logged in, show "Join the Event as Non-user" button
  if (!user?.id) {
    return (
      <Button className={className} variant={variant} size={size} asChild>
        <Link href={`/login?redirect=/dashboard/events/${eventId}`}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Join the Event as Non-user
        </Link>
      </Button>
    )
  }

  // If event has passed
  if (eventHasPassed) {
    if (isRegistered) {
      // Registered user: show feedback button
      return (
        <Button className={`bg-${feedbackButtonColor}-600 text-white hover:bg-${feedbackButtonColor}-700 ${className}`} variant="outline" size={size} asChild>
          <Link href={`/dashboard/events/${eventId}/feedback`}>
            Send Feedback
          </Link>
        </Button>
      )
    } else {
      // Not registered: show disabled button
      return (
        <Button className={`bg-${endedButtonColor}-600 text-white ${className}`} variant="outline" size={size} disabled>
          Event Already Ended
        </Button>
      )
    }
  }

  // For logged-in users with checking state
  if (isChecking) {
    return (
      <Button className={className} variant={variant} size={size} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking...
      </Button>
    )
  }

  // For logged-in users after checking
  return (
    <Button
      onClick={handleRegistration}
      className={className}
      variant={isRegistered ? "outline" : variant}
      size={size}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isRegistered ? "Canceling..." : "Registering..."}
        </>
      ) : isRegistered ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Registered
        </>
      ) : (
        "Register for Event"
      )}
    </Button>
  )
}
