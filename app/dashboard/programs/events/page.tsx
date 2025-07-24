"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, SlidersHorizontal, Users, Tag, ArrowUpDown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/event-card"
import { isDatePast, isDateUpcoming } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category?: string
  organizer: string
  image?: string
  participant_count?: number
}

type SortOption = "date-asc" | "date-desc" | "popularity" | "title-asc" | "title-desc"
type FilterCategory = "all" | "sports" | "education" | "environment" | "arts" | "community" | "technology"
type FilterLocation = "all" | string

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Sorting and filtering states
  const [sortOption, setSortOption] = useState<SortOption>("date-asc")
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all")
  const [filterLocation, setFilterLocation] = useState<FilterLocation>("all")
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    // Apply filters and sorting whenever the dependencies change
    applyFiltersAndSort()
  }, [events, searchQuery, sortOption, filterCategory, filterLocation])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch events from Supabase
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

      if (error) {
        throw error
      }

      if (data) {
        // Extract unique locations for the location filter
        const locations = [...new Set(data.map((event) => event.location))].filter(Boolean)
        setUniqueLocations(locations)

        // Add participant count if available, otherwise set to 0
        const eventsWithParticipants = await Promise.all(
          data.map(async (event) => {
            try {
              // Try to get participant count from event_participants table
              const { count, error: countError } = await supabase
                .from("event_participants")
                .select("*", { count: "exact", head: true })
                .eq("event_id", event.id)

              return {
                ...event,
                participant_count: count || 0,
                // Infer category from title and description if not explicitly set
                category: event.category || inferCategory(event.title, event.description),
              }
            } catch (err) {
              // If there's an error or the table doesn't exist, return event with 0 participants
              return {
                ...event,
                participant_count: 0,
                category: event.category || inferCategory(event.title, event.description),
              }
            }
          }),
        )

        setEvents(eventsWithParticipants)
        setFilteredEvents(eventsWithParticipants)
      }
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("Failed to load events. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Infer category from title and description
  const inferCategory = (title: string, description: string): FilterCategory => {
    const text = `${title} ${description}`.toLowerCase()

    if (
      text.includes("sport") ||
      text.includes("basketball") ||
      text.includes("volleyball") ||
      text.includes("tournament") ||
      text.includes("game")
    ) {
      return "sports"
    } else if (
      text.includes("workshop") ||
      text.includes("seminar") ||
      text.includes("training") ||
      text.includes("education") ||
      text.includes("learning")
    ) {
      return "education"
    } else if (
      text.includes("tree") ||
      text.includes("plant") ||
      text.includes("clean") ||
      text.includes("environment") ||
      text.includes("eco")
    ) {
      return "environment"
    } else if (
      text.includes("art") ||
      text.includes("dance") ||
      text.includes("music") ||
      text.includes("cultural") ||
      text.includes("creative")
    ) {
      return "arts"
    } else if (
      text.includes("community") ||
      text.includes("service") ||
      text.includes("volunteer") ||
      text.includes("charity")
    ) {
      return "community"
    } else if (
      text.includes("tech") ||
      text.includes("coding") ||
      text.includes("digital") ||
      text.includes("computer")
    ) {
      return "technology"
    }

    return "all"
  }

  const applyFiltersAndSort = () => {
    let result = [...events]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter((event) => event.category === filterCategory)
    }

    // Apply location filter
    if (filterLocation !== "all") {
      result = result.filter((event) => event.location === filterLocation)
    }

    // Apply sorting
    switch (sortOption) {
      case "date-asc":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "date-desc":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "popularity":
        result.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    setFilteredEvents(result)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFiltersAndSort()
  }

  const handleReset = () => {
    setSearchQuery("")
    setSortOption("date-asc")
    setFilterCategory("all")
    setFilterLocation("all")
  }

  // Separate events into upcoming and past
  const upcomingEvents = filteredEvents.filter((event) => isDateUpcoming(event.date))
  const pastEvents = filteredEvents.filter((event) => isDatePast(event.date))

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-1" /> Sort By
              </label>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Date (Earliest First)</SelectItem>
                  <SelectItem value="date-desc">Date (Latest First)</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Tag className="h-4 w-4 mr-1" /> Category
              </label>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as FilterCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="arts">Arts & Culture</SelectItem>
                  <SelectItem value="community">Community Service</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> Location
              </label>
              <Select value={filterLocation} onValueChange={(value) => setFilterLocation(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <Button variant="outline" onClick={handleReset} className="mr-2">
                Reset Filters
              </Button>
              <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
            </div>
          </div>
        )}
      </div>

      {/* Event Listings */}
      {error ? (
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchEvents}>Retry</Button>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No upcoming events found matching your criteria.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEvents.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No past events found matching your criteria.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Results Summary */}
      {!isLoading && !error && (
        <div className="mt-6 text-sm text-gray-500 flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>
            Showing {filteredEvents.length} of {events.length} events
            {filterCategory !== "all" && ` in ${filterCategory}`}
            {filterLocation !== "all" && ` at ${filterLocation}`}
          </span>
        </div>
      )}
    </div>
  )
}
