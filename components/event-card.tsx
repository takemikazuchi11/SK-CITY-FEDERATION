import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { formatEventDate } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"
import { isDatePast } from "@/lib/utils"
import { useLoading } from "@/lib/loading-context"

interface EventCardProps {
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

export function EventCard({ event }: EventCardProps) {
  const isPastEvent = isDatePast(event.date)
  const { setLoading } = useLoading();

  // Format the category for display
  const formatCategory = (category?: string) => {
    if (!category || category === "all") return null
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Category color mapping (should match events page)
  const CATEGORY_COLORS: Record<string, string> = {
    "Governance & Public Service": "bg-indigo-600",
    "Employment, Livelihood & Economic Empowerment": "bg-green-600",
    "Education": "bg-yellow-500",
    "Culture & Arts": "bg-pink-500",
    "Health & Wellness": "bg-gray-500",
    "Social Inclusion and Equity": "bg-purple-600",
    "Disaster Risk Reduction, Resiliency & Public Safety": "bg-orange-600",
    "Sports & Recreation": "bg-teal-600",
    "Environment, Agriculture & Sustainability": "bg-lime-600",
    "Global Mobility, Technology & Innovation": "bg-cyan-600",
    "Peacebuilding and Security": "bg-indigo-600",
    "Active Citizenship": "bg-fuchsia-600",
    "Community Events": "bg-gray-600",
    "Infrastructure & Development": "bg-amber-700",
  }

  return (
    <Link href={`/dashboard/events/${event.id}`} className="transition-transform hover:scale-[1.02]" onClick={() => setLoading(true)}>
      <Card className="h-full overflow-hidden">
        <div className="relative h-48 w-full">
          <img
            src={event.image || "/placeholder.svg?height=192&width=384"}
            alt={`${event.title} event`}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            <Badge variant={isPastEvent ? "secondary" : "default"}>{isPastEvent ? "Past" : "Upcoming"}</Badge>

            {event.category && (
              <Badge className={`${CATEGORY_COLORS[event.category] || 'bg-gray-500'} text-white`}>
                {event.category}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="mb-2 text-xl font-bold text-slate-800">{event.title}</h3>
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-blue-600">
              <Calendar className="h-4 w-4 mr-2" />
              <p className="font-medium">{formatEventDate(event.date)}</p>
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
          <p className="text-slate-600 line-clamp-2">{event.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
