"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

export default function EventFeedbackPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [rating, setRating] = useState<number>(0)
  const [comments, setComments] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEventAndFeedback() {
      setLoading(true)
      // Fetch event details
      const { data: eventData } = await supabase.from("events").select("*").eq("id", params.id).single()
      setEvent(eventData)
      // Check if user already submitted feedback
      if (user?.id) {
        const { data: feedbackData } = await supabase
          .from("event_feedback")
          .select("id")
          .eq("event_id", params.id)
          .eq("user_id", user.id)
          .single()
        if (feedbackData) setAlreadySubmitted(true)
      }
      setLoading(false)
    }
    fetchEventAndFeedback()
  }, [params.id, user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !event) return
    // Prevent duplicate
    const { data: existing } = await supabase
      .from("event_feedback")
      .select("id")
      .eq("event_id", event.id)
      .eq("user_id", user.id)
      .single()
    if (existing) {
      setAlreadySubmitted(true)
      return
    }
    const { error } = await supabase.from("event_feedback").insert({
      event_id: event.id,
      user_id: user.id,
      rating,
      comments,
    })
    if (!error) {
      setSubmitted(true)
    }
  }

  if (loading) return <div className="py-12 text-center">Loading...</div>
  if (!user) return <div className="py-12 text-center">Please log in to submit feedback.</div>
  if (!event) return <div className="py-12 text-center">Event not found.</div>
  if (alreadySubmitted || submitted) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for your feedback!</h2>
        <p>Your feedback helps us improve future events.</p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 bg-red-600 text-white text-center py-3 rounded">Feedback for {event.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Rating</label>
          <div className="flex gap-2 w-full justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`text-5xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} transition-colors duration-150`}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                style={{ width: '20%' }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-medium">Comments (optional)</label>
          <Textarea
            value={comments}
            onChange={e => setComments(e.target.value)}
            rows={4}
            placeholder="Share your thoughts about the event..."
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={rating === 0}>Submit Feedback</Button>
      </form>
    </div>
  )
} 