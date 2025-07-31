"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Flag, Edit, Trash2, X, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getCommentsByAnnouncementId, type Comment, hasUserLikedComment, toggleCommentLike, updateComment, deleteComment } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

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
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

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
        
        // Ensure each comment has proper default values
        const processedComments = data.map((comment: any) => ({
          ...comment,
          likes: comment.likes || 0, // Ensure likes is never null
        }));
        
        setComments(processedComments)
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
        try {
          const likes: { [commentId: string]: boolean } = {}
          for (const comment of comments) {
            likes[comment.id] = await hasUserLikedComment(comment.id, user.id)
          }
          setUserLiked(likes)
        } catch (error) {
          console.error("Error fetching user likes:", error)
        }
      }
    }
    fetchUserLikes()
  }, [user, comments])

  const handleLike = async (id: string) => {
    if (!user) return
    try {
      const nowLiked = await toggleCommentLike(id, user.id)
      setUserLiked((prev) => ({ ...prev, [id]: nowLiked }))
      
      // Refetch the specific comment to get the updated likes count
      const { data: updatedComment, error } = await supabase
        .from("comments")
        .select("*, users:users!comments_user_id_fkey(photo_url)")
        .eq("id", id)
        .single();
      
      if (!error && updatedComment) {
        // Ensure the updated comment has proper default values
        const processedComment = {
          ...updatedComment,
          likes: updatedComment.likes || 0, // Ensure likes is never null
        };
        
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === id ? processedComment : comment
          )
        )
      }
    } catch (err) {
      console.error("Error liking comment:", err)
      toast({
        title: "Error",
        description: "Failed to like the comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
    setIsEditing(false) // Keep buttons enabled during editing
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent("")
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!editingComment || !editContent.trim()) return
    
    try {
      await updateComment(editingComment, editContent.trim())
      
      // Update the comment in the local state
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingComment
            ? { ...comment, content: editContent.trim() }
            : comment
        )
      )
      
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      })
      
      handleCancelEdit()
    } catch (err) {
      console.error("Error updating comment:", err)
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return
    
    try {
      setIsDeleting(commentToDelete)
      await deleteComment(commentToDelete)
      
      // Remove the comment from local state
      setComments((prev) => prev.filter((comment) => comment.id !== commentToDelete))
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      })
    } catch (err) {
      console.error("Error deleting comment:", err)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
      setCommentToDelete(null)
      setDeleteDialogOpen(false)
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
    <div className="space-y-3">
      {(showAll ? comments : comments.slice(0, 5)).map((comment) => (
        <Card key={comment.id} className="border border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserPhotoUrl(comment)} alt={comment.author} />
                <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
                              <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{comment.author}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at))}
                      </p>
                    </div>
                  <div className="flex items-center gap-1">
                    {user && comment.user_id === user.id && (
                      <>
                        {editingComment === comment.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-green-600 hover:text-green-700"
                              onClick={handleSaveEdit}
                              disabled={isEditing || !editContent.trim()}
                            >
                              <Check className="h-3 w-3" />
                              <span className="sr-only">Save</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-600 hover:text-gray-700"
                              onClick={handleCancelEdit}
                              disabled={isEditing}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-blue-600 hover:text-blue-700"
                              onClick={() => handleEdit(comment)}
                              disabled={false}
                            >
                              <Edit className="h-3 w-3" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(comment.id)}
                              disabled={isDeleting === comment.id}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        )}
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Flag className="h-3 w-3" />
                      <span className="sr-only">Report</span>
                    </Button>
                  </div>
                </div>
                {editingComment === comment.id ? (
                  <div className="mt-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[60px] text-sm"
                      placeholder="Edit your comment... (Press Enter to save, Escape to cancel)"
                    />
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>
                )}
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 text-xs ${userLiked[comment.id] ? "text-blue-600" : "text-muted-foreground"}`}
                    onClick={() => handleLike(comment.id)}
                    aria-pressed={userLiked[comment.id]}
                  >
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {Math.max(comment.likes || 0, 0)}
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

