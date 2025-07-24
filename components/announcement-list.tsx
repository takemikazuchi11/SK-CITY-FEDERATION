"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, PlusCircle } from "lucide-react"
import { getAnnouncements, deleteAnnouncement, type Announcement } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "../lib/auth-context"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLoading } from "@/lib/loading-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [localLoading, setLocalLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = useAuth() // Destructure both values from useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter();
  const { setLoading } = useLoading();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", content: "" });
  const [isPoll, setIsPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]); // Start with 2 options

  // Add poll voting/results logic
  type PollOption = Database["public"]["Tables"]["poll_options"]["Row"];
  type PollVote = Database["public"]["Tables"]["poll_votes"]["Row"];
  type PollAnnouncement = Database["public"]["Tables"]["poll_announcements"]["Row"];
  interface PollData {
    poll: PollAnnouncement;
    options: PollOption[];
    votes: PollVote[];
    userVote: PollVote | null;
  }
  const [polls, setPolls] = useState<{ [announcementId: string]: PollData }>({});
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLocalLoading(true)
        const data = await getAnnouncements()
        setAnnouncements(data.slice(0, 3)) // Take the 3 most recent announcements
        setError(null)
      } catch (err) {
        console.error("Error fetching announcements:", err)
        setError("Failed to load announcements. Please try again later.")
      } finally {
        setLocalLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  useEffect(() => {
    async function fetchPolls() {
      const pollMap: { [key: string]: PollData } = {};
      for (const ann of announcements) {
        // Fetch poll for this announcement
        const { data: pollData } = await supabase
          .from("poll_announcements")
          .select("*, poll_options(*), poll_votes(*)")
          .eq("announcement_id", ann.id)
          .single();
        if (
          pollData &&
          Array.isArray(pollData.poll_options) &&
          Array.isArray(pollData.poll_votes)
        ) {
          // Get user vote
          let userVote: PollVote | null = null;
          if (user) {
            const pollOptionIds = (pollData.poll_options as PollOption[])
              .map((o) => o.id)
              .filter((id): id is string => !!id);
            if (pollOptionIds.length > 0) {
              const { data: userVoteData } = await supabase
                .from("poll_votes")
                .select("*")
                .in("poll_option_id", pollOptionIds)
                .eq("user_id", user.id)
                .single();
              userVote = userVoteData as PollVote | null;
            }
          }
          pollMap[ann.id] = {
            poll: pollData as PollAnnouncement,
            options: Array.isArray(pollData.poll_options) ? pollData.poll_options as PollOption[] : [],
            votes: Array.isArray(pollData.poll_votes) ? pollData.poll_votes as PollVote[] : [],
            userVote,
          };
        }
      }
      setPolls(pollMap);
    }
    if (announcements.length > 0) fetchPolls();
  }, [announcements, user]);

  async function handleVote(pollOptionId: string, announcementId: string) {
    if (!user) return;
    await supabase.from("poll_votes").insert({ poll_option_id: pollOptionId, user_id: user.id });
    // Refetch poll data for this announcement
    const { data: pollData } = await supabase
      .from("poll_announcements")
      .select("*, poll_options(*), poll_votes(*)")
      .eq("announcement_id", announcementId)
      .single();
    let userVote: PollVote | null = null;
    let pollOptions: PollOption[] = [];
    let pollVotes: PollVote[] = [];
    if (pollData && pollData.id && typeof pollData.question === "string") {
      pollOptions = Array.isArray(pollData.poll_options) ? pollData.poll_options as PollOption[] : [];
      pollVotes = Array.isArray(pollData.poll_votes) ? pollData.poll_votes as PollVote[] : [];
      if (user) {
        const { data: userVoteData } = await supabase
          .from("poll_votes")
          .select("*")
          .in("poll_option_id", pollOptions.map((o) => o.id))
          .eq("user_id", user.id)
          .single();
        userVote = userVoteData as PollVote | null;
      }
      setPolls((prev) => ({
        ...prev,
        [announcementId]: {
          poll: pollData as PollAnnouncement,
          options: pollOptions,
          votes: pollVotes,
          userVote,
        },
      }));
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling
    setAnnouncementToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!announcementToDelete) return

    try {
      setIsDeleting(true)
      await deleteAnnouncement(announcementToDelete)

      // Update the local state to remove the deleted announcement
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete))

      toast({
        title: "Announcement deleted",
        description: "The announcement has been successfully deleted.",
      })
    } catch (err) {
      console.error("Error deleting announcement:", err)
      toast({
        title: "Error",
        description: "Failed to delete the announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setAnnouncementToDelete(null)
    }
  }

  const handleEditClick = (announcement: Announcement) => {
    setAnnouncementToEdit(announcement);
    setEditForm({ title: announcement.title, content: announcement.content });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementToEdit) return;
    setIsEditing(true);
    try {
      // Update announcement in DB
      const updated = { ...announcementToEdit, ...editForm };
      const { data, error } = await supabase
        .from("announcements")
        .update({ title: editForm.title, content: editForm.content })
        .eq("id", announcementToEdit.id)
        .select();
      if (error) throw error;
      // Update local state
      setAnnouncements((prev) => prev.map((a) => (a.id === announcementToEdit.id ? { ...a, ...editForm } : a)));
      setEditDialogOpen(false);
      setAnnouncementToEdit(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update announcement.", variant: "destructive" });
    } finally {
      setIsEditing(false);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handlePollOptionChange = (idx: number, value: string) => {
    setPollOptions((prev) => prev.map((opt, i) => (i === idx ? value : opt)));
  };

  const addPollOption = () => {
    setPollOptions((prev) => [...prev, ""]);
  };

  const removePollOption = (idx: number) => {
    setPollOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      // 1. Create announcement
      const { data: announcementData, error: announcementError } = await supabase
        .from("announcements")
        .insert([{ title: createForm.title, content: createForm.content, author: "", author_role: "", category: "", likes: 0, user_id: user?.id ?? "" }])
        .select();
      if (announcementError) throw announcementError;
      const announcement = announcementData[0] as Announcement;
      // 2. If poll, create poll_announcements and poll_options
      if (isPoll) {
        const { data: pollData, error: pollError } = await supabase
          .from("poll_announcements")
          .insert([{ announcement_id: announcement.id, question: pollQuestion }])
          .select();
        if (pollError) throw pollError;
        const poll = pollData[0];
        // Insert poll options
        const pollOptionsToInsert = pollOptions.filter((opt) => opt.trim() !== "").map((option_text) => ({ poll_id: poll.id, option_text }));
        if (pollOptionsToInsert.length < 2) throw new Error("At least 2 poll options required");
        const { error: optionsError } = await supabase
          .from("poll_options")
          .insert(pollOptionsToInsert);
        if (optionsError) throw optionsError;
      }
      // 3. Update local state
      setAnnouncements((prev) => [
        {
          ...announcement,
          created_at: announcement.created_at ?? "",
          likes: announcement.likes ?? 0,
          user_id: announcement.user_id ?? ""
        },
        ...prev
      ]);
      setCreateDialogOpen(false);
      setCreateForm({ title: "", content: "" });
      setIsPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create announcement.", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  if (localLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-12">Latest Announcements</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="relative">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
                <Skeleton className="h-4 w-1/4 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mb-12 inline-block">
          Latest Announcements
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {announcements.map((announcement) => {
          const pollData = polls[announcement.id];
          return (
            <Card key={announcement.id} className="relative h-full flex transition-all hover:shadow-lg bg-blue-50 text-black rounded-md border border-blue-100 p-0 overflow-hidden group">
                {/* Thicker Blue Accent Bar */}
                <div className="w-4 bg-blue-700 group-hover:bg-blue-800 transition-colors duration-200" />
                <div className="flex-1 flex flex-col justify-between p-6">
                <Link href={`/dashboard/announcement/${announcement.id}`} onClick={() => setLoading(true)}>
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-2xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-200">{announcement.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="line-clamp-3 text-gray-700 mb-4">{announcement.content}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(announcement.created_at), "M/d/yyyy")}
                    </p>
                  </CardContent>
                </Link>
                {isAdmin && (
                  <div className="absolute right-4 top-4 flex gap-2 z-10">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(announcement)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleDeleteClick(e, announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                )}
                {pollData ? (
                  <div className="mt-4">
                    <div className="font-semibold mb-2">{pollData.poll.question}</div>
                    {!pollData.userVote ? (
                      <div className="flex flex-col gap-2">
                        {pollData.options.map((opt) => (
                          <Button key={opt.id} variant="outline" onClick={() => handleVote(opt.id!, announcement.id)}>{opt.option_text}</Button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2">
                        {pollData.options.map((opt) => {
                          const voteCount = pollData.votes.filter((v) => v.poll_option_id === opt.id).length;
                          const totalVotes = pollData.votes.length;
                          const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                          return (
                            <div key={opt.id} className="mb-2">
                              <div className="flex justify-between text-sm">
                                <span>{opt.option_text}</span>
                                <span>{voteCount} vote{voteCount !== 1 ? "s" : ""} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded h-2 mt-1">
                                <div className="bg-blue-600 h-2 rounded" style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="text-xs text-gray-500 mt-2">You have voted.</div>
                      </div>
                    )}
                  </div>
                ) : null}
                </div>
              </Card>
          );
        })}
      </div>
      {isAdmin && (
        <div className="flex justify-center mt-8 gap-2">
          <Button className="bg-black hover:bg-neutral-800 text-white" size="lg" onClick={() => { setLoading(true); router.push("/dashboard/announcement/create"); }}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Announcement
            </Button>
          <Button className="bg-black hover:bg-neutral-800 text-white" size="lg" onClick={() => { setLoading(true); router.push("/dashboard/announcement/create-poll"); }}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Poll Announcement
          </Button>
        </div>
      )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the announcement and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Edit Announcement Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              placeholder="Title"
              required
            />
            <Textarea
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              placeholder="Content"
              rows={4}
              required
            />
            <DialogFooter>
              <Button type="submit" disabled={isEditing}>{isEditing ? "Saving..." : "Save Changes"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Create Announcement Modal */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <Input
              name="title"
              value={createForm.title}
              onChange={handleCreateChange}
              placeholder="Title"
              required
            />
            <Textarea
              name="content"
              value={createForm.content}
              onChange={handleCreateChange}
              placeholder="Content"
              rows={4}
              required
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPoll" checked={isPoll} onChange={e => setIsPoll(e.target.checked)} />
              <label htmlFor="isPoll">Poll Announcement</label>
            </div>
            {isPoll && (
              <div className="space-y-2 border rounded p-3">
                <Input
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  placeholder="Poll Question"
                  required
                />
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        value={opt}
                        onChange={e => handlePollOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        required
                      />
                      {pollOptions.length > 2 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removePollOption(idx)}>-</Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPollOption}>Add Option</Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isCreating}>{isCreating ? "Creating..." : "Create"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

