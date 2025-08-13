"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronRight, Plus, Calendar, User } from "lucide-react"
import { getPublishedNews, createNews, type NewsArticle } from "@/lib/news-service"
import { extractYouTubeId, getYouTubeThumbnailUrl } from "@/lib/youtube-utils"
import { useAuth } from "@/lib/auth-context"
import { AdminOnly } from "@/components/role-based-ui"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useLoading } from "@/lib/loading-context"

export default function NewsSection() {
  const { setLoading } = useLoading();
  const { user } = useAuth()
  const [news, setNews] = useState<NewsArticle[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
    media_type: "image" as "image" | "video",
    featured_image_url: "",
    youtube_video_id: "",
  })

  // Add the category options
  const CATEGORY_OPTIONS = [
    "Governance & Public Service",
    "Employment & Livelihood",
    "Youth & Education",
    "Culture & Arts",
    "Health & Wellness",
    "Disaster Response & Safety",
    "Sports & Recreation",
    "Environment & Agriculture",
    "Technology & Innovation",
    "Peace & Order",
    "Community Events",
    "Infrastructure & Development",
  ]

  // Add category color mapping
  const CATEGORY_COLORS: Record<string, string> = {
    "Governance & Public Service": "bg-blue-600 text-white",
    "Employment & Livelihood": "bg-green-600 text-white",
    "Youth & Education": "bg-yellow-500 text-white",
    "Culture & Arts": "bg-pink-500 text-white",
    "Health & Wellness": "bg-red-500 text-white",
    "Disaster Response & Safety": "bg-orange-600 text-white",
    "Sports & Recreation": "bg-teal-600 text-white",
    "Environment & Agriculture": "bg-lime-600 text-white",
    "Technology & Innovation": "bg-cyan-600 text-white",
    "Peace & Order": "bg-indigo-600 text-white",
    "Community Events": "bg-gray-600 text-white",
    "Infrastructure & Development": "bg-amber-700 text-white",
  };

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true);
    try {
      const newsData = await getPublishedNews(3) // Get 3 latest news
      setNews(newsData)
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      media_type: "image" as "image" | "video",
      featured_image_url: "",
      youtube_video_id: "",
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Ensure all required fields are present
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill in all required fields: title, content, and category.")
      return
    }
    try {
      // Process media fields based on media type
      const mediaData = {
        media_type: formData.media_type,
        featured_image_url: formData.media_type === "image" ? formData.featured_image_url : undefined,
        youtube_video_id: formData.media_type === "video" ? extractYouTubeId(formData.youtube_video_id) : undefined,
      }

      await createNews({
        ...formData,
        ...mediaData,
        status: "published", // Always published
        author: formData.author || user.first_name + ' ' + user.last_name || user.email || "Unknown",
        author_id: user.id,
      })
      toast.success("News article created successfully!")
      setCreateDialogOpen(false)
      resetForm()
      fetchNews()
    } catch (error: any) {
      console.error("Error creating news:", error)
      toast.error(error?.message || "Failed to create news article")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }



  if (news.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mx-auto mb-3" style={{display: 'inline-block'}}>
            Latest News
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news from the Sangguniang Kabataan City Federation.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* News Grid - Maximum 3 Cards, No Edit/Delete Icons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {news.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} onClick={() => setLoading(true)}>
                <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer h-full relative">
                  {/* Category badge at top right */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold capitalize shadow z-10 ${CATEGORY_COLORS[article.category] || 'bg-gray-300 text-gray-800'}`}>
                    {article.category.replace("-", " ")}
                  </span>
                                     {(article.featured_image_url || article.youtube_video_id) && (
                     <div className="aspect-[16/10] relative">
                                               {article.media_type === "video" && article.youtube_video_id ? (
                          <div className="w-full h-full relative">
                            <img
                              src={getYouTubeThumbnailUrl(article.youtube_video_id, 'maxresdefault')}
                              alt={`${article.title} video thumbnail`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to medium quality if maxresdefault doesn't exist
                                const target = e.target as HTMLImageElement;
                                if (article.youtube_video_id) {
                                  target.src = getYouTubeThumbnailUrl(article.youtube_video_id, 'hqdefault');
                                }
                              }}
                            />
                            {/* Play button overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                         <img
                           src={article.featured_image_url || "/placeholder.svg"}
                           alt={article.title}
                           className="w-full h-full object-cover"
                         />
                       )}
                     </div>
                   )}
                  <CardContent className="p-4">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.published_at)}
                    </div>

                    <h4 className="font-semibold text-blue-800 mb-2 text-base line-clamp-2">{article.title}</h4>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {article.excerpt || article.content.substring(0, 100) + "..."}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      {article.author}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* See More News Link */}
          <div className="text-right mb-8">
            <Link href="/news" className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center">
              See More News <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Add News Button */}
          {user && (
            <AdminOnly>
              <div className="flex justify-center mt-8">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black hover:bg-neutral-800 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add News Article
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create News Article</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter article title"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                            required
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="author">Author *</Label>
                          <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            placeholder="Enter author name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          placeholder="Brief summary of the article"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Write your article content here..."
                          rows={8}
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Media Type</Label>
                          <div className="flex space-x-4 mt-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="media_type"
                                value="image"
                                checked={formData.media_type === "image"}
                                onChange={(e) => setFormData({ ...formData, media_type: e.target.value as "image" | "video" })}
                                className="text-blue-600"
                              />
                              <span>Featured Image</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="media_type"
                                value="video"
                                checked={formData.media_type === "video"}
                                onChange={(e) => setFormData({ ...formData, media_type: e.target.value as "image" | "video" })}
                                className="text-blue-600"
                              />
                              <span>YouTube Video</span>
                            </label>
                          </div>
                        </div>

                        {formData.media_type === "image" ? (
                          <div>
                            <Label htmlFor="featured_image_url">Featured Image URL</Label>
                            <Input
                              id="featured_image_url"
                              value={formData.featured_image_url}
                              onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                              placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Enter the URL of the image you want to display
                            </p>
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="youtube_video_id">YouTube Video</Label>
                            <Input
                              id="youtube_video_id"
                              value={formData.youtube_video_id}
                              onChange={(e) => setFormData({ ...formData, youtube_video_id: e.target.value })}
                              placeholder="Enter YouTube video ID or full URL"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Enter YouTube video ID (e.g., "dQw4w9WgXcQ") or full URL. The video will be embedded and playable on the news page.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCreateDialogOpen(false)
                            resetForm()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Article</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </AdminOnly>
          )}
        </div>
      </div>
    </section>
  )
}
