import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, MessageSquare, UserPlus, CalendarCheck, ClipboardList } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalUsers: number
    newUsersThisMonth: number
    totalEvents: number
    upcomingEvents: number
    totalAnnouncements: number
    totalParticipants: number
    totalKKRegistrations: number // Added this new stat
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: "+12% from last month",
      trend: "up",
    },
    {
      title: "New Users",
      value: stats.newUsersThisMonth,
      description: "This month",
      icon: <UserPlus className="h-5 w-5 text-green-500" />,
      change: "+5% from last month",
      trend: "up",
    },
    {
      title: "KK Registrations",
      value: stats.totalKKRegistrations,
      description: "Total registrations",
      icon: <ClipboardList className="h-5 w-5 text-purple-500" />,
      change: "Growing steadily",
      trend: "up",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      description: "All time",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      change: "+3 new this month",
      trend: "up",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      description: "Scheduled",
      icon: <CalendarCheck className="h-5 w-5 text-orange-500" />,
      change: "Next event in 3 days",
      trend: "neutral",
    },
    {
      title: "Announcements",
      value: stats.totalAnnouncements,
      description: "Published",
      icon: <MessageSquare className="h-5 w-5 text-red-500" />,
      change: "+2 this week",
      trend: "up",
    },
    {
      title: "Event Participants",
      value: stats.totalParticipants,
      description: "Total registrations",
      icon: <TrendingUp className="h-5 w-5 text-indigo-500" />,
      change: "+15% from last month",
      trend: "up",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <div
              className={`mt-2 text-xs ${
                stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"
              }`}
            >
              {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
