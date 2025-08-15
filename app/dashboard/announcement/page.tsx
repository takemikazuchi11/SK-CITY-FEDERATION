"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Plus, Search } from "lucide-react"
import { PermissionGuard } from "@/components/role-based-ui"
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/supabase";

type Announcement = {
  id: string
  title: string
  content: string
  created_at: string
  author: string
  author_role: string
  category: string
  likes: number
  user_id: string
  image_url?: string
  audience?: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        // Filter announcements based on audience and user role
        let filtered = (data || []).filter(a => {
          // If announcement is for everyone, show it to all users
          if (!a.audience || a.audience === 'everyone') {
            return true;
          }
          
          // If announcement is for SK Chairpersons only, show it only to admin and moderator roles
          if (a.audience === 'sk_chairpersons') {
            return user?.user_role === 'admin' || user?.user_role === 'moderator';
          }
          
          return true;
        }).map(a => ({
          ...a,
          created_at: a.created_at ?? '',
          likes: a.likes ?? 0,
          user_id: a.user_id ?? '',
        }));
        
        setAnnouncements(filtered)
        setFilteredAnnouncements(filtered)
      } catch (error) {
        console.error("Error fetching announcements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [user])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAnnouncements(announcements)
    } else {
      const filtered = announcements.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredAnnouncements(filtered)
    }
  }, [searchQuery, announcements])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Open edit page with pre-populated data
  const handleEditClick = (announcement: Announcement) => {
    // If poll, redirect to create-poll, else to create
    const isPoll = announcement.category === "poll";
    const basePath = isPoll ? "/dashboard/announcement/create-poll" : "/dashboard/announcement/create";
    // Pass id and data as query params
    const params = new URLSearchParams({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      ...(announcement.audience ? { audience: announcement.audience } : {})
    });
    router.push(`${basePath}?${params.toString()}`);
  };

  // Delete announcement
  const handleDelete = async () => {
    if (!announcementToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement(announcementToDelete);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete));
      setFilteredAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete));
      setDeleteDialogOpen(false);
    } catch (err) {
      alert("Failed to delete announcement. Please try again.");
    } finally {
      setIsDeleting(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="bg-red-600 text-white px-12 py-3 text-3xl font-bold text-center shadow-md mb-3" style={{display: 'inline-block'}}>
            Announcements
          </div>
          <p className="text-gray-500 mt-1">Stay updated with the latest polls and announcements</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search announcements..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <PermissionGuard permission="create:announcement">
            <Link href="/dashboard/announcement/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </Link>
          </PermissionGuard>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Announcements</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No announcements found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="h-full hover:shadow-md transition-shadow relative">
                  {announcement.image_url && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={announcement.image_url || "/placeholder.svg?height=192&width=384"}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                        <CardDescription>{formatDate(announcement.created_at)}</CardDescription>
                      </div>
                      {announcement.audience === 'sk_chairpersons' && (
                        <div className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          SK Only
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-gray-600">{announcement.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/dashboard/announcement/${announcement.id}`} className="w-full">
                      <Button variant="outline" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        Read More
                      </Button>
                    </Link>
                  </CardFooter>
                  {/* Admin controls */}
                  {user && (user.user_role === "admin" || user.user_role === "moderator") && (
                    <div className="absolute right-4 top-4 flex gap-2 z-10">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(announcement)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => { setAnnouncementToDelete(announcement.id); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No recent announcements found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.slice(0, 6).map((announcement) => (
                <Link href={`/dashboard/announcement/${announcement.id}`} key={announcement.id}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    {announcement.image_url && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={announcement.image_url || "/placeholder.svg?height=192&width=384"}
                          alt={announcement.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                          <CardDescription>{formatDate(announcement.created_at)}</CardDescription>
                        </div>
                        {announcement.audience === 'sk_chairpersons' && (
                          <div className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                            SK Only
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-gray-600">{announcement.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Delete Announcement Dialog */}
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
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-white">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

