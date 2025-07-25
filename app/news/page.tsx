"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Search, SlidersHorizontal, Tag, Users, ArrowLeft } from "lucide-react"
import { getPublishedNews, type NewsArticle } from "@/lib/news-service"
import DashboardNavbar from "@/components/dashboard/Navbar"

export default function AllNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchNews() {
      try {
        const newsData = await getPublishedNews() // Get all published news
        setNews(newsData)
        setFilteredNews(newsData)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(newsData.map((article) => article.category)))
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    // Apply filters and search
    applyFiltersAndSearch()
  }, [news, searchQuery, selectedCategory])

  const applyFiltersAndSearch = () => {
    let result = [...news]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((article) => article.category === selectedCategory)
    }

    setFilteredNews(result)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFiltersAndSearch()
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedCategory("all")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
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

      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 text-white px-12 py-3 text-3xl font-bold text-center shadow-md mx-auto inline-block">
            News
          </div>
        </div>

        {/* Search and Filter Section - Same as Events Page */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:ml-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </form>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <Tag className="h-4 w-4 mr-1" /> Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category.replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button variant="outline" onClick={handleReset} className="mr-2 bg-transparent">
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
              </div>
            </div>
          )}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No news articles found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back later for updates"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/news/${article.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
                    {article.featured_image_url && (
                      <div className="aspect-video relative">
                        <img
                          src={article.featured_image_url || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize shadow ${CATEGORY_COLORS[article.category] || 'bg-gray-300 text-gray-800'}`}>
                          {article.category.replace("-", " ")}
                        </span>
                        <div className="flex items-center text-sm text-red-600 font-semibold">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      </div>

                      <h3 className="font-semibold text-blue-700 mb-3 line-clamp-2 leading-tight">{article.title}</h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {article.excerpt || article.content.substring(0, 150) + "..."}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mt-auto">
                        <User className="h-3 w-3 mr-1" />
                        {article.author}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!loading && (
          <div className="mt-6 text-sm text-gray-500 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              Showing {filteredNews.length} of {news.length} articles
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
