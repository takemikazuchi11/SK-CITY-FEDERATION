"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@/components/ui/separator"
import CommentList from "@/components/comment-list"
import { getAnnouncementById, likeAnnouncement, createComment, type Announcement, hasUserLikedAnnouncement, toggleAnnouncementLike } from "@/lib/supabase"
import type { Database } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Use generated Supabase types for poll data
type PollOption = Database["public"]["Tables"]["poll_options"]["Row"];
type PollVote = Database["public"]["Tables"]["poll_votes"]["Row"];
type PollAnnouncement = Database["public"]["Tables"]["poll_announcements"]["Row"];

// Debug: Show poll options directly by fetching them independently
function PollOptionsDebug({ pollAnnouncementId }: { pollAnnouncementId: string }) {
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    async function fetchOptions() {
      if (!pollAnnouncementId) return;
      const { data, error } = await supabase
        .from("poll_options")
        .select("*")
        .eq("poll_id", pollAnnouncementId);
      setOptions(data || []);
    }
    fetchOptions();
  }, [pollAnnouncementId]);
  return (
    <div className="mt-4 p-2 border border-dashed border-green-400 bg-green-50 rounded">
      <div className="font-bold text-green-700 mb-1">[DEBUG] Poll Options for poll_id: {pollAnnouncementId}</div>
      {options.length > 0 ? (
        <ul>
          {options.map(opt => (
            <li key={opt.id}>{opt.option_text}</li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 italic">No poll options found for this poll_id.</div>
      )}
    </div>
  );
}

export default function AnnouncementDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const id = params.id as string

  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [pollData, setPollData] = useState<null | { poll: PollAnnouncement; options: PollOption[]; votes: PollVote[]; userVote: PollVote | null }>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState<{ id: string, first_name: string, last_name: string }[]>([]);
  const [pollVoters, setPollVoters] = useState<Record<string, { id: string, first_name: string, last_name: string }[]>>({});

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        setLoadingAnnouncement(true)
        const data = await getAnnouncementById(id)
        // Fix: Ensure required fields are never null
        const safeAnnouncement = {
          ...data,
          created_at: data.created_at ?? "",
          likes: data.likes ?? 0,
          user_id: data.user_id ?? "",
          author_photo_url: data.author_photo_url ?? undefined
        };
        setAnnouncement(safeAnnouncement)
        setError(null)
      } catch (err) {
        console.error("Error fetching announcement:", err)
        setError("Failed to load announcement. It may have been deleted or you don't have permission to view it.")
      } finally {
        setLoadingAnnouncement(false)
      }
    }
    fetchAnnouncement()
  }, [id])

  useEffect(() => {
    async function checkLiked() {
      if (user && announcement) {
        const liked = await hasUserLikedAnnouncement(announcement.id, user.id)
        setHasLiked(liked)
      }
    }
    checkLiked()
  }, [user, announcement])

  useEffect(() => {
    async function fetchLikeCount() {
      const { count, error } = await supabase
        .from("announcement_likes")
        .select("*", { count: "exact", head: true })
        .eq("announcement_id", id);
      if (!error) setLikeCount(count || 0);
    }
    if (id) fetchLikeCount();
  }, [id, hasLiked]);

  useEffect(() => {
    async function fetchLikeUsers() {
      const { data, error } = await supabase
        .from("announcement_likes")
        .select("user_id, users(first_name, last_name)")
        .eq("announcement_id", id);
      if (!error && data) {
        setLikeUsers(
          data
            .filter((row: any) => row.users)
            .map((row: any) => ({
              id: row.user_id,
              first_name: row.users.first_name,
              last_name: row.users.last_name,
            }))
        );
      }
    }
    if (id) fetchLikeUsers();
  }, [id, hasLiked, likeCount]);

  useEffect(() => {
    async function fetchPoll() {
      // Step 1: Fetch poll by announcement_id (no join)
      const { data: polls, error: pollError } = await supabase
        .from("poll_announcements")
        .select("*")
        .eq("announcement_id", id);
      const poll = Array.isArray(polls) && polls.length > 0 ? polls[0] : null;
      if (poll) {
        // Step 2: Fetch options and votes by poll_id
        const { data: options, error: optionsError } = await supabase
          .from("poll_options")
          .select("*")
          .eq("poll_id", poll.id);
        const { data: votes, error: votesError } = await supabase
          .from("poll_votes")
          .select("*")
          .in("poll_option_id", (options || []).map((o: any) => o.id));
        let userVote: PollVote | null = null;
        if (user && options && options.length > 0) {
          const { data: userVoteData } = await supabase
            .from("poll_votes")
            .select("*")
            .in("poll_option_id", options.map((o: any) => o.id))
            .eq("user_id", user.id)
            .single();
          userVote = userVoteData as PollVote | null;
        }
        setPollData({
          poll: poll as PollAnnouncement,
          options: (options || []) as PollOption[],
          votes: (votes || []) as PollVote[],
          userVote,
        });
      } else {
        setPollData(null);
      }
    }
    fetchPoll();
  }, [id, user]);

  useEffect(() => {
    async function fetchPollVoters() {
      if (!pollData) return;
      const votersByOption: Record<string, { id: string, first_name: string, last_name: string }[]> = {};
      for (const opt of pollData.options) {
        const { data, error } = await supabase
          .from("poll_votes")
          .select("user_id, users(first_name, last_name)")
          .eq("poll_option_id", opt.id);
        if (!error && data) {
          votersByOption[opt.id] = data
            .filter((row: any) => row.users)
            .map((row: any) => ({
              id: row.user_id,
              first_name: row.users.first_name,
              last_name: row.users.last_name,
            }));
        } else {
          votersByOption[opt.id] = [];
        }
      }
      setPollVoters(votersByOption);
    }
    fetchPollVoters();
  }, [pollData]);

  async function handleVote(pollOptionId: string) {
    if (!user) return;
    // Remove previous vote if exists
    if (pollData && pollData.userVote) {
      await supabase.from("poll_votes").delete().eq("id", pollData.userVote.id);
    }
    await supabase.from("poll_votes").insert({ poll_option_id: pollOptionId, user_id: user.id });
    // Refetch poll data
    // Step 1: Fetch poll by announcement_id (no join)
    const { data: polls } = await supabase
      .from("poll_announcements")
      .select("*")
      .eq("announcement_id", id);
    const poll = Array.isArray(polls) && polls.length > 0 ? polls[0] : null;
    if (poll) {
      // Step 2: Fetch options and votes by poll_id
      const { data: options } = await supabase
        .from("poll_options")
        .select("*")
        .eq("poll_id", poll.id);
      const { data: votes } = await supabase
        .from("poll_votes")
        .select("*")
        .in("poll_option_id", (options || []).map((o: any) => o.id));
      let userVote: PollVote | null = null;
      if (user && options && options.length > 0) {
        const { data: userVoteData } = await supabase
          .from("poll_votes")
          .select("*")
          .in("poll_option_id", options.map((o: any) => o.id))
          .eq("user_id", user.id)
          .single();
        userVote = userVoteData as PollVote | null;
      }
      setPollData({
        poll: poll as PollAnnouncement,
        options: (options || []) as PollOption[],
        votes: (votes || []) as PollVote[],
        userVote,
      });
    }
  }

  const handleLike = async () => {
    if (!announcement || !user) return
    try {
      const nowLiked = await toggleAnnouncementLike(announcement.id, user.id)
      setHasLiked(nowLiked)
      setAnnouncement((prev) =>
        prev
          ? { ...prev, likes: prev.likes + (nowLiked ? 1 : -1) }
          : null
      )
    } catch (err) {
      console.error("Error liking announcement:", err)
      toast({
        title: "Error",
        description: "Failed to like the announcement. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment || !user) {
      toast({
        title: "Missing fields",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Simplify the comment data - remove user_photo_url field
      // This is to avoid errors if the field doesn't exist in the database
      await createComment({
        announcement_id: id,
        author: `${user.first_name} ${user.last_name}`,
        author_role: user.user_role,
        content: comment,
        user_id: user.id,
      })

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      })

      // Reset form and trigger comment list refresh
      setComment("")
      setRefreshComments((prev) => prev + 1)
    } catch (err) {
      console.error("Error posting comment:", err)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !announcement) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="flex items-center text-sm hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="p-6 text-center">
          <p className="text-destructive mb-4">{error || "Announcement not found"}</p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-sm hover:underline text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{announcement.title}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <Avatar className="h-6 w-6 mr-2">
                  {/* 2. Use photo_url for AvatarImage */}
                  <AvatarImage src={announcement.author_photo_url || "/placeholder.svg?height=32&width=32"} alt={announcement.author} />
                  <AvatarFallback>{announcement.author.charAt(0)}</AvatarFallback>
                </Avatar>
                {announcement.author} {/* Only show author name, no role */}
                {/* Remove author_role display */}
                <span className="mx-2">•</span>{formatDistanceToNow(new Date(announcement.created_at))}
              </CardDescription>
            </div>
            <Badge variant={announcement.category === "important" ? "destructive" : "secondary"}>
              {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{announcement.content}</p>
          {/* POLL AREA - Modern poll bar chart UI */}
          {pollData ? (
            <div className="mt-8 p-6 rounded-lg bg-white border shadow-sm">
              <div className="text-lg font-semibold mb-4">{pollData.poll.question}</div>
              <div className="space-y-3">
                {pollData.options.map((opt) => {
                  const voteCount = pollData.votes.filter((v) => v.poll_option_id === opt.id).length;
                  const totalVotes = pollData.votes.length;
                  const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                  const userVotedFor = pollData.userVote && pollData.userVote.poll_option_id === opt.id;
                  return (
                    <TooltipProvider key={opt.id} delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`relative flex items-center p-2 rounded-lg border transition-colors cursor-pointer select-none ${userVotedFor ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-100 hover:border-blue-400 hover:bg-blue-100'}`}
                            style={{ boxShadow: userVotedFor ? '0 0 0 2px #2563eb' : undefined }}
                            onClick={() => handleVote(opt.id)}
                            aria-pressed={!!userVotedFor}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleVote(opt.id); }}
                          >
                            <div className="flex-1">
                              <div className={`font-medium mb-1 ${userVotedFor ? 'text-blue-700' : 'text-gray-900'}`}>{opt.option_text}</div>
                              <div className="w-full bg-gray-200 rounded h-3 relative">
                                <div className={`h-3 rounded ${userVotedFor ? 'bg-blue-500' : 'bg-blue-300'}`} style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                            <div className="ml-4 text-right min-w-[60px]">
                              <div className={`font-semibold ${userVotedFor ? 'text-blue-700' : 'text-gray-700'}`}>{percent}%</div>
                              <div className="text-xs text-gray-500">{voteCount} vote{voteCount !== 1 ? 's' : ''}</div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          {pollVoters[opt.id] && pollVoters[opt.id].length > 0 ? (
                            <div className="text-sm">
                              <div className="font-semibold mb-1">Voted by:</div>
                              <ul>
                                {pollVoters[opt.id].map((u) => (
                                  <li key={u.id}>{u.first_name} {u.last_name}</li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <span>No votes yet</span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                {pollData.votes.length.toLocaleString()} vote{pollData.votes.length !== 1 ? 's' : ''}
              </div>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-between">
          {user ? (
            <div className="flex w-full justify-between items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={hasLiked ? "text-blue-600" : "text-muted-foreground"}
                      onClick={handleLike}
                      aria-pressed={hasLiked}
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      {likeCount} {hasLiked ? "Liked" : "Like"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    {likeUsers.length === 0 ? (
                      <span>No likes yet</span>
                    ) : (
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Liked by:</div>
                        <ul>
                          {likeUsers.map((u) => (
                            <li key={u.id}>{u.first_name} {u.last_name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={() => setShowCommentForm((prev) => !prev)}
              >
                {showCommentForm ? "Cancel" : "Add Comment"}
              </Button>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Log in to like or comment</span>
          )}
        </CardFooter>
      </Card>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-red-600 text-white px-12 py-3 text-xl font-bold text-center shadow-md mx-auto inline-block">
            Comments & Feedback
          </div>
        </div>

        <Card className="mb-8" id="comment-form">
          <CardContent className="pt-4 pb-2">
            {user ? (
              showCommentForm ? (
                <form onSubmit={handleSubmitComment}>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photo_url || "/placeholder.svg?height=40&width=40"}
                          alt={`${user.first_name} ${user.last_name}`}
                        />
                        <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.user_role}</p>
                      </div>
                    </div>
                    <Textarea
                      id="comment"
                      placeholder="Add your comment or feedback..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      className="text-sm min-h-[60px]"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" disabled={isSubmitting} className="px-4 py-1 text-sm">
                        {isSubmitting ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : null
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Please create an account to comment on the announcement.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <div className="text-sm">
          <CommentList announcementId={id} refreshTrigger={refreshComments} />
        </div>
      </div>
    </div>
  )
}

