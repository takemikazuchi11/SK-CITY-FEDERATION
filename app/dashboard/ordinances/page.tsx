"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrdinances, getResolutions, searchOrdinances, searchResolutions } from "@/lib/ordinance-service"

export default function OrdinancesPage({ searchParams }: { searchParams: { type?: string; q?: string } }) {
  const defaultTab = searchParams.type === "resolution" ? "resolutions" : "ordinances"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "")
  const [ordinances, setOrdinances] = useState<any[]>([])
  const [resolutions, setResolutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        if (searchQuery) {
          // If there's a search query, search both ordinances and resolutions
          const ordinanceResults = await searchOrdinances(searchQuery)
          const resolutionResults = await searchResolutions(searchQuery)

          setOrdinances(ordinanceResults)
          setResolutions(resolutionResults)
        } else {
          // Otherwise, get all ordinances and resolutions
          const ordinanceData = await getOrdinances()
          const resolutionData = await getResolutions()

          setOrdinances(ordinanceData)
          setResolutions(resolutionData)
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("Failed to load documents. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is handled by the useEffect above
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Legislative Issuances</h1>
          <p className="text-gray-600">
            Access official ordinances and resolutions passed by the Sangguniang Kabataan City Federation
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-4 md:mt-0 relative w-full md:w-64">
          <Input
            placeholder="Search..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </form>
      </div>

      {error && (
        <div className="text-center text-red-600 mb-8">
          <p>{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ordinances" className="flex-1">
            Ordinances
          </TabsTrigger>
          <TabsTrigger value="resolutions" className="flex-1">
            Resolutions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ordinances" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : ordinances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ordinances.map((ordinance) => (
                <Link href={`/dashboard/ordinances/${ordinance.ordinance_no}`} key={ordinance.id}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        Ordinance No. {ordinance.ordinance_no}
                      </CardTitle>
                      <CardDescription>{ordinance.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-2">{ordinance.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">{ordinance.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No ordinances found</h3>
              {searchQuery && (
                <p className="text-gray-500 mt-2">
                  No results match your search query. Try different keywords or browse all ordinances.
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolutions" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : resolutions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolutions.map((resolution) => (
                <Link href={`/dashboard/ordinances/resolution-${resolution.resolution_no}`} key={resolution.id}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        Resolution No. {resolution.resolution_no}
                      </CardTitle>
                      <CardDescription>{resolution.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-2">{resolution.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">{resolution.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No resolutions found</h3>
              {searchQuery && (
                <p className="text-gray-500 mt-2">
                  No results match your search query. Try different keywords or browse all resolutions.
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
