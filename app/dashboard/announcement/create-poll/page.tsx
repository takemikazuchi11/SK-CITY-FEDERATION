"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { AdminOnly } from "@/components/role-based-ui"
import { useLoading } from "@/lib/loading-context";

export default function CreatePollAnnouncement() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAdmin, loading } = useAuth()
  const [form, setForm] = useState({ title: 'POLL ANNOUNCEMENT', content: "", pollQuestion: "", pollOptions: ["", ""] })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setLoading } = useLoading();

  // Remove the local loading fallback
  // Only render the form if user, isAdmin, and not loading
  if (!user || !isAdmin) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePollOptionChange = (idx: number, value: string) => {
    setForm(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.map((opt, i) => (i === idx ? value : opt))
    }))
  }

  const addPollOption = () => {
    setForm(prev => ({ ...prev, pollOptions: [...prev.pollOptions, ""] }))
  }

  const removePollOption = (idx: number) => {
    setForm(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content || !form.pollQuestion || form.pollOptions.filter(opt => opt.trim() !== "").length < 2) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and provide at least 2 poll options.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsSubmitting(true)
      // 1. Create announcement
      const { data: announcementData, error: announcementError } = await supabase
        .from("announcements")
        .insert([{ title: form.title, content: form.content, author: `${user.first_name} ${user.last_name}`, author_role: user.user_role, category: "poll", user_id: user.id, likes: 0 }])
        .select()
      if (announcementError) throw announcementError
      const announcement = announcementData[0]
      // 2. Create poll_announcements and poll_options
      const { data: pollData, error: pollError } = await supabase
        .from("poll_announcements")
        .insert([{ announcement_id: announcement.id, question: form.pollQuestion }])
        .select()
      if (pollError) throw pollError
      const poll = pollData[0]
      const pollOptionsToInsert = form.pollOptions.filter(opt => opt.trim() !== "").map(option_text => ({ poll_id: poll.id, option_text }))
      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(pollOptionsToInsert)
      if (optionsError) throw optionsError
      toast({
        title: "Poll announcement created",
        description: "Your poll has been published successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating poll announcement:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create poll announcement. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <AdminOnly>
      <div className="container mx-auto py-8 px-4">
       
        <Link href="/dashboard" className="flex items-center text-sm mb-6 hover:underline text-blue-600 font-semibold" onClick={() => setLoading(true)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Poll Announcement</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Description *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Enter poll description"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poll-question">Poll Question *</Label>
                <Input
                  id="poll-question"
                  name="pollQuestion"
                  value={form.pollQuestion}
                  onChange={handleChange}
                  placeholder="Enter poll question"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Poll Options *</Label>
                {form.pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={opt}
                      onChange={e => handlePollOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      required
                    />
                    {form.pollOptions.length > 2 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removePollOption(idx)}>-</Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addPollOption}>Add Option</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => { setLoading(true); router.push("/dashboard"); }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || form.pollOptions.filter(opt => opt.trim() !== "").length < 2}
              >
                {isSubmitting ? "Publishing..." : "Publish Poll Announcement"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminOnly>
  )
} 