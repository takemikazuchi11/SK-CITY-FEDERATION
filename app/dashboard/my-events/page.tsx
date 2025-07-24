"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { getUserEvents } from "@/lib/user-actions"
import { cancelEventRegistration } from "@/app/action/event-actions"
import { Calendar, MapPin, Clock, X, Loader2, AlertCircle, ThumbsUp } from "lucide-react"
import { format } from "date-fns"
import { getPersonalizedEventRecommendations } from "@/lib/participation-service"
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

interface UserEvent {
  id: string
  event_id: string
  registration_date: string
  status: string
  event: {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    image?: string
  }
}

interface RecommendedEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image?: string
  similarity: string
}

export default function MyEventsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<UserEvent[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<RecommendedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchUserEvents()
      fetchRecommendedEvents()
    }
  }, [user, loading, router])

  // Update the fetchUserEvents function to provide better error handling
  const fetchUserEvents = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching events for user:", user.id)
      const result = await getUserEvents(user.id)

      if (result.success) {
        console.log("Successfully fetched events:", result.data?.length || 0)
        setEvents(
          (result.data || []).map((item: any) => ({
            id: item.id,
            event_id: item.event_id,
            registration_date: item.registration_date,
            status: item.status,
            event: {
              id: item.event.id,
              title: item.event.title,
              description: item.event.description,
              date: item.event.date,
              time: item.event.time,
              location: item.event.location,
              image: item.event.image,
            },
          }))
        )
      } else {
        console.error("Error from getUserEvents:", result.message)
        setError(result.message || "Failed to fetch your events")
      }
    } catch (error) {
      console.error("Exception in fetchUserEvents:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Add function to fetch recommended events
  const fetchRecommendedEvents = async () => {
    if (!user) return

    setIsLoadingRecommendations(true)

    try {
      console.log("Fetching recommended events for user:", user.id)
      const recommendations = await getPersonalizedEventRecommendations(user.id, 3)
      setRecommendedEvents(recommendations)
    } catch (error) {
      console.error("Error fetching recommended events:", error)
      // Don't set an error state here, just log it
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const handleCancelRegistration = async () => {
    if (!user || !selectedEventId) return

    setIsCancelling(true)

    try {
      const result = await cancelEventRegistration(selectedEventId, user.id)

      if (result.success) {
        toast.success("Event registration cancelled successfully")
        // Remove the cancelled event from the list
        setEvents(events.filter((event) => event.event_id !== selectedEventId))
        // Refresh recommendations after cancellation
        fetchRecommendedEvents()
      } else {
        toast.error(result.message || "Failed to cancel registration")
      }
    } catch (error) {
      console.error("Error cancelling registration:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsCancelling(false)
      setCancelDialogOpen(false)
      setSelectedEventId(null)
    }
  }

  const openCancelDialog = (eventId: string) => {
    setSelectedEventId(eventId)
    setCancelDialogOpen(true)
  }

  // Filter events into upcoming and past
  const currentDate = new Date()
  const upcomingEvents = events.filter((event) => new Date(event.event.date) >= currentDate)
  const pastEvents = events.filter((event) => new Date(event.event.date) < currentDate)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  // Render the recommendations section
  const renderRecommendations = () => {
    if (isLoadingRecommendations) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )
    }

    if (recommendedEvents.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No recommendations available at this time.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {recommendedEvents.map((event) => (
          <Card key={event.id} className="h-full flex flex-col">
            <div className="relative h-40 w-full">
              <img
                src={event.image || "/placeholder.svg?height=160&width=320"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="bg-black text-white">
                  Recommended
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription>{event.similarity}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                variant="default"
                className="w-full"
                onClick={() => window.open(`/dashboard/events/${event.id}`, "_blank")}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
          <span>Loading your events...</span>
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't registered for any events yet. Browse upcoming events and join the ones that interest you.
            </p>
            <Button onClick={() => router.push("/dashboard/events")}>Browse Events</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Upcoming Events</h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                      You don't have any upcoming events. Browse events and register for ones that interest you.
                    </p>
                    <Button onClick={() => router.push("/dashboard/events")}>Browse Events</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((userEvent) => (
                    <EventCard
                      key={userEvent.id}
                      userEvent={userEvent}
                      onCancel={() => openCancelDialog(userEvent.event_id)}
                      showCancelOption={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Past Events</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      You haven't attended any events yet. Once you participate in events, they'll appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((userEvent) => (
                    <EventCard key={userEvent.id} userEvent={userEvent} onCancel={() => {}} showCancelOption={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* You May Also Like Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">You may also like</h2>

            {isLoadingRecommendations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : recommendedEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ThumbsUp className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Recommendations</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    We don't have any recommendations for you at this time. Check back after participating in more
                    events.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedEvents.map((event) => (
                  <Card key={event.id} className="h-full flex flex-col">
                    <div className="relative h-40 w-full">
                      <img
                        src={event.image || "/placeholder.svg?height=160&width=320"}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="default">Recommended</Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>{event.similarity}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => window.open(`/dashboard/events/${event.id}`, "_blank")}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Cancel Registration Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Event Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration for this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRegistration}
              disabled={isCancelling}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Registration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Keep the EventCard component the same
interface EventCardProps {
  userEvent: UserEvent
  onCancel: () => void
  showCancelOption: boolean
}

function EventCard({ userEvent, onCancel, showCancelOption }: EventCardProps) {
  const event = userEvent.event
  const isPastEvent = new Date(event.date) < new Date()

  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-40 w-full">
        <img
          src={event.image || "/placeholder.svg?height=160&width=320"}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isPastEvent ? "secondary" : "default"}>{isPastEvent ? "Completed" : "Upcoming"}</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription>Registered on {format(new Date(userEvent.registration_date), "MMM d, yyyy")}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.location}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          {showCancelOption && (
            <Button variant="outline" className="flex-1 text-red-500 hover:text-red-700" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}

          <Button
            variant="default"
            className="flex-1"
            onClick={() => window.open(`/dashboard/events/${event.id}`, "_blank")}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
