import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { isDatePast } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLoading } from "@/lib/loading-context"

interface EventListingCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    time?: string
    location?: string
    image?: string
    category?: string
    participant_count?: number
  }
}

export function EventListingCard({ event }: EventListingCardProps) {
  const isPastEvent = isDatePast(event.date)
  const { setLoading } = useLoading();

  // Format the category for display
  const formatCategory = (category?: string) => {
    if (!category || category === "all") return null
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Get badge color based on category
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "sports":
        return "bg-blue-500"
      case "education":
        return "bg-purple-500"
      case "environment":
        return "bg-green-500"
      case "arts":
        return "bg-pink-500"
      case "community":
        return "bg-yellow-500"
      case "technology":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Link href={`/dashboard/events/${event.id}`} className="block h-full transition-transform hover:scale-[1.02]" onClick={() => setLoading(true)}>
      <Card className="h-full overflow-hidden">
        <div className="relative h-48 w-full">
          <img
            src={event.image || "/placeholder.svg?height=192&width=384"}
            alt={`${event.title} event`}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            <Badge variant={isPastEvent ? "secondary" : "default"}>{isPastEvent ? "Past" : "Upcoming"}</Badge>

            {formatCategory(event.category) && (
              <Badge className={`${getCategoryColor(event.category)} text-white`}>
                {formatCategory(event.category)}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-blue-600">
              <Calendar className="h-4 w-4 mr-2" />
              <p className="font-medium">{format(new Date(event.date), "MMMM d, yyyy")}</p>
            </div>

            {event.time && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <p className="text-sm">{event.time}</p>
              </div>
            )}

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <p className="text-sm">{event.location}</p>
              </div>
            )}

            {event.participant_count !== undefined && (
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <p className="text-sm">{event.participant_count} participants</p>
              </div>
            )}
          </div>

          <p className="text-slate-600 line-clamp-2 mb-4">{event.description}</p>

          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
