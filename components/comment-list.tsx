"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getCommentsByAnnouncementId, type Comment, hasUserLikedComment, toggleCommentLike } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

interface CommentListProps {
  announcementId: string
  refreshTrigger?: number
}

export default function CommentList({ announcementId, refreshTrigger = 0 }: CommentListProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [userLiked, setUserLiked] = useState<{ [commentId: string]: boolean }>({})

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true)
        // Fetch comments with join to users table for photo_url
        const { data, error } = await supabase
          .from("comments")
          .select("*, users:users!comments_user_id_fkey(photo_url)")
          .eq("announcement_id", announcementId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setComments(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching comments:", err)
        setError("Failed to load comments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [announcementId, refreshTrigger])

  useEffect(() => {
    async function fetchUserLikes() {
      if (user && comments.length > 0) {
        const likes: { [commentId: string]: boolean } = {}
        for (const comment of comments) {
          likes[comment.id] = await hasUserLikedComment(comment.id, user.id)
        }
        setUserLiked(likes)
      }
    }
    fetchUserLikes()
  }, [user, comments])

  const handleLike = async (id: string) => {
    if (!user) return
    try {
      const nowLiked = await toggleCommentLike(id, user.id)
      setUserLiked((prev) => ({ ...prev, [id]: nowLiked }))
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id
            ? { ...comment, likes: comment.likes + (nowLiked ? 1 : -1) }
            : comment
        )
      )
    } catch (err) {
      console.error("Error liking comment:", err)
      toast({
        title: "Error",
        description: "Failed to like the comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  // Use the comment's user's photo_url if available
  const getUserPhotoUrl = (comment: any) => {
    return comment.users?.photo_url || "/placeholder.svg?height=40&width=40";
  }

  return (
    <div className="space-y-4">
      {(showAll ? comments : comments.slice(0, 5)).map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={getUserPhotoUrl(comment)} alt={comment.author} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{comment.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at))}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Flag className="h-4 w-4" />
                    <span className="sr-only">Report</span>
                  </Button>
                </div>
                <p className="mt-2">{comment.content}</p>
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${userLiked[comment.id] ? "text-blue-600" : "text-muted-foreground"}`}
                    onClick={() => handleLike(comment.id)}
                    aria-pressed={userLiked[comment.id]}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {comments.length > 5 && !showAll && (
        <div className="flex justify-center mt-2">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            View more comment
          </Button>
        </div>
      )}
    </div>
  )
}

