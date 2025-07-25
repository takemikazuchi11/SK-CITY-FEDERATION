"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Calendar, User, Edit, Trash2, Facebook, Twitter, Instagram, MessageCircle, Link2 } from "lucide-react"
import { getNewsBySlug, updateNews, deleteNews, type NewsArticle } from "@/lib/news-service"
import { useAuth } from "@/lib/auth-context"
import { AdminOnly } from "@/components/role-based-ui"
import { toast } from "sonner"
import DashboardNavbar from "@/components/dashboard/Navbar"
import { use } from "react"
import { usePathname } from "next/navigation"
import { Tooltip } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewsArticlePageProps {
  params: {
    slug: string
  }
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = params
  const router = useRouter()
  const { user } = useAuth()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
    featured_image_url: "",
  })

  useEffect(() => {
    async function fetchArticle() {
      try {
        const articleData = await getNewsBySlug(slug)
        console.log('Fetched article:', articleData)
        if (!articleData) {
          notFound()
        }
        setArticle(articleData)
        setFormData({
          title: articleData.title,
          content: articleData.content,
          excerpt: articleData.excerpt || "",
          category: articleData.category,
          author: articleData.author,
          featured_image_url: articleData.featured_image_url || "",
        })
      } catch (error) {
        console.error("Error fetching article:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!article) return

    try {
      await updateNews(article.id, {
        ...formData,
        status: "published", // Always published
      })
      toast.success("News article updated successfully!")
      setEditDialogOpen(false)
      // Refresh the article data
      const updatedArticle = await getNewsBySlug(slug)
      if (updatedArticle) {
        setArticle(updatedArticle)
      }
    } catch (error) {
      console.error("Error updating news:", error)
      toast.error("Failed to update news article")
    }
  }

  const handleDelete = async () => {
    if (!article) return

    try {
      await deleteNews(article.id)
      toast.success("News article deleted successfully!")
      router.push("/news")
    } catch (error) {
      console.error("Error deleting news:", error)
      toast.error("Failed to delete news article")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Social share URLs
  const pathname = typeof window !== 'undefined' ? window.location.href : '';
  const shareUrl = pathname;
  const shareTitle = article ? encodeURIComponent(article.title) : '';
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`;
  const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=YOUR_FB_APP_ID`;
  const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`;
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  // Add category options (should match add news form)
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
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      {/* Back to Home Button */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="mb-8">
                <img
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="capitalize">
                  {article.category.replace("-", " ")}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.published_at)}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <User className="h-4 w-4 mr-2" />
                <span>By {article.author}</span>
              </div>

              {article.excerpt && <p className="text-xl text-gray-600 leading-relaxed mb-8">{article.excerpt}</p>}
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Published on {formatDate(article.published_at)}
                  {article.updated_at !== article.created_at && (
                    <span> • Updated on {formatDate(article.updated_at)}</span>
                  )}
                </div>
                <Link href="/news">
                  <Button variant="outline">View More Articles</Button>
                </Link>
              </div>
            </footer>
          </div>

          {/* Sidebar - Social Share and Admin Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this News</h3>
              <div className="flex flex-col space-y-3 mb-4">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="flex items-center space-x-2 hover:bg-blue-50 rounded px-2 py-1">
                  <Facebook className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-gray-800">Facebook</span>
                </a>
                <a href={xUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="flex items-center space-x-2 hover:bg-blue-50 rounded px-2 py-1">
                  <Twitter className="h-6 w-6 text-black" />
                  <span className="font-medium text-gray-800">X</span>
                </a>
                <a href={messengerUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Messenger" className="flex items-center space-x-2 hover:bg-blue-50 rounded px-2 py-1">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                  <span className="font-medium text-gray-800">Messenger</span>
                </a>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Instagram" className="flex items-center space-x-2 hover:bg-pink-50 rounded px-2 py-1">
                  <Instagram className="h-6 w-6 text-pink-500" />
                  <span className="font-medium text-gray-800">Instagram</span>
                </a>
                <button onClick={copyLink} aria-label="Copy Link" className="flex items-center space-x-2 hover:bg-gray-100 rounded px-2 py-1">
                  <Link2 className="h-6 w-6 text-gray-500" />
                  <span className="font-medium text-gray-800">Copy Link</span>
                </button>
              </div>
              {/* Admin Actions - Same style as Event page */}
              {user && (
                <AdminOnly>
                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={() => setEditDialogOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Article
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Article
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{article.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </AdminOnly>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="edit-category">
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
                <Label htmlFor="edit-author">Author *</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the article"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article content here..."
                rows={8}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-featured_image_url">Featured Image URL</Label>
              <Input
                id="edit-featured_image_url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Article</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
