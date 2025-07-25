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

type Announcement = {
  id: string
  title: string
  content: string
  created_at: string
  created_by: string
  image_url?: string
  audience?: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        // Filter by audience for regular users
        let filtered = (data || []).map(a => ({
          ...a,
          created_by: a.created_by ?? '',
          audience: a.audience ?? 'everyone',
        }));
        if (user && user.user_role !== 'admin' && user.user_role !== 'moderator') {
          filtered = filtered.filter(a => !a.audience || a.audience === 'everyone');
        }
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
                      <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                      <CardDescription>{formatDate(announcement.created_at)}</CardDescription>
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
                      <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                      <CardDescription>{formatDate(announcement.created_at)}</CardDescription>
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
    </div>
  )
}

