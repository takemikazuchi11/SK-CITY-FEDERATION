"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Globe, 
  Users, 
  FileText, 
  Calendar, 
  Bell, 
  Shield, 
  Database, 
  Code, 
  Palette,
  Award,
  Heart,
  Megaphone,
  CalendarDays,
  ClipboardList,
  Newspaper,
  Target,
  BookOpen,
  Info,
  Settings,
  FolderOpen,
  Phone
} from "lucide-react"

export default function AboutWebsitePage() {
  const [activeTab, setActiveTab] = useState<'features' | 'credits'>('features')

  const websiteFeatures = [
    {
      category: "Announcement",
      features: [
        "Create and manage announcements",
        "Schedule announcement display duration",
        "Categorize announcements by type",
        "Real-time notification system"
      ],
      icon: Megaphone,
      color: "bg-blue-600"
    },
    {
      category: "Events",
      features: [
        "Event creation and management",
        "Event registration system",
        "Event calendar and scheduling",
        "Participant management and tracking"
      ],
      icon: CalendarDays,
      color: "bg-blue-600"
    },
    {
      category: "SKCF Disclosure Board",
      features: [
        "Financial transparency tools",
        "Document disclosure management",
        "Quarterly report displays",
        "Compliance monitoring"
      ],
      icon: ClipboardList,
      color: "bg-blue-600"
    },
    {
      category: "News",
      features: [
        "News article creation and publishing",
        "News categorization and filtering",
        "Featured news management",
        "News archive and search"
      ],
      icon: Newspaper,
      color: "bg-blue-600"
    },
    {
      category: "Programs",
      features: [
        "SK program management",
        "CYDC program coordination",
        "Katipunan Kabataan programs",
        "Program registration and tracking"
      ],
      icon: Target,
      color: "bg-blue-600"
    },
    {
      category: "Legislative Archives",
      features: [
        "Ordinance management system",
        "Resolution tracking and storage",
        "Document version control",
        "Legislative history search"
      ],
      icon: BookOpen,
      color: "bg-blue-600"
    },
    {
      category: "About Pages",
      features: [
        "SK history and information",
        "Federation officers directory",
        "Barangay SK officials",
        "Vision, mission, and values"
      ],
      icon: Info,
      color: "bg-blue-600"
    },
    {
      category: "Process",
      features: [
        "BIR filing procedures",
        "COA reporting tools",
        "ETPS and EFPS management",
        "Fidelity bonding processes"
      ],
      icon: Settings,
      color: "bg-blue-600"
    },
    {
      category: "Resources",
      features: [
        "File upload and management",
        "Resource categorization",
        "Document library access",
        "Resource sharing and distribution"
      ],
      icon: FolderOpen,
      color: "bg-blue-600"
    },
    {
      category: "Contact Information",
      features: [
        "Contact form management",
        "User inquiry tracking",
        "Support ticket system",
        "Communication logs"
      ],
      icon: Phone,
      color: "bg-blue-600"
    }
  ]

  const contributors = [
    // Group 1: Deo, Lynard, and Carla
    {
      name: "Hon. Deo P. Lopez",
      role: "SKCF President",
      description: "Project sponsor and visionary leader who initiated the development of this comprehensive SK management system.",
      icon: Award,
      color: "bg-blue-100 text-blue-800",
      group: 1
    },
    {
      name: "Hon. John Lynard A. Viesca",
      role: "SKCF Treasurer",
      description: "Provided financial oversight and guidance for the project development and implementation.",
      icon: Award,
      color: "bg-green-100 text-green-800",
      group: 1
    },
    {
      name: "Carla Amor R. Dela Roca",
      role: "Member",
      description: "Contributed to project requirements and user experience feedback during development.",
      icon: Users,
      color: "bg-purple-100 text-purple-800",
      group: 1
    },
    // Group 2: Melanie and Sophia
    {
      name: "Melanie A. Viesca",
      role: "Staff",
      description: "Provided administrative support and coordination throughout the project development phase.",
      icon: Users,
      color: "bg-pink-100 text-pink-800",
      group: 2
    },
    {
      name: "Sophia Nicole E. Martinez",
      role: "Staff",
      description: "Assisted with project coordination and user testing during the development process.",
      icon: Users,
      color: "bg-indigo-100 text-indigo-800",
      group: 2
    },
    // Group 3: Rose, Justin, and Charles
    {
      name: "Rose Ericka M. Leynes",
      role: "Developer - Frontend Specialist",
      description: "Focused on user experience and interface design. Contributed to creating intuitive and responsive user interfaces that enhance user engagement.",
      icon: Palette,
      color: "bg-orange-100 text-orange-800",
      group: 3
    },
    {
      name: "Justin A. Goyena",
      role: "Lead Developer / Full Stack Developer",
      description: "Primary architect and developer of the entire website. Responsible for system design, database architecture, backend development, frontend implementation, and overall project coordination.",
      icon: Code,
      color: "bg-red-100 text-red-800",
      group: 3
    },
    {
      name: "Charles Masangkay",
      role: "Developer - Backend Developer",
      description: "Specialized in database management and API development. Ensured robust backend infrastructure and efficient data handling systems.",
      icon: Database,
      color: "bg-teal-100 text-teal-800",
      group: 3
    }
  ]

  // Group contributors by their group number
  const groupedContributors = contributors.reduce((acc, contributor) => {
    if (!acc[contributor.group]) {
      acc[contributor.group] = []
    }
    acc[contributor.group].push(contributor)
    return acc
  }, {} as Record<number, typeof contributors>)

  const groupTitles: Record<number, string> = {
    1: "Leadership & Members",
    2: "Administrative Staff",
    3: "Development Team"
  }

  return (
    <div className="w-full">
             {/* Hero Section */}
       <div className="relative h-[300px] md:h-[400px]">
         <div 
           className="w-full h-full"
           style={{
             backgroundImage: `url('/banner-about.webp')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }}
         />
         <div className="absolute inset-0 bg-blue-900/80"></div>
         <div className="absolute inset-0 flex items-center justify-center">
           <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">About Our Website</h1>
         </div>
       </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'features'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Features & Functions
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'credits'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Development Team
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            {/* Title with Red Rectangle Background */}
            <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-center">Website Features & Functions</h2>
              <p className="text-center mt-2 text-red-100">
                Our platform offers a comprehensive suite of tools designed to modernize and streamline 
                SK operations and youth development programs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {websiteFeatures.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className={`${category.color} rounded-t-lg`}>
                      <CardTitle className="flex items-center text-xl text-white">
                        <IconComponent className="h-6 w-6 mr-3 text-white" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-3">
                        {category.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Built with Passion</h3>
                <p className="text-lg text-gray-600">
                  This website was developed with the goal of empowering youth leaders and improving 
                  the efficiency of SK operations across all barangays.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Development Team & Contributors</h2>
              <p className="text-lg text-gray-600">
                Meet the dedicated team behind the development and implementation of this comprehensive 
                SK management platform.
              </p>
            </div>

            {/* Grouped Contributors */}
            <div className="space-y-12">
              {Object.entries(groupedContributors).map(([groupKey, groupContributors]) => {
                const group = parseInt(groupKey)
                return (
                  <div key={group} className="space-y-6">
                    <h4 className="text-2xl font-bold text-gray-800 text-center border-b-2 border-blue-200 pb-2">
                      {groupTitles[group]}
                    </h4>
                                         <div className={`grid gap-6 ${
                       groupContributors.length === 2 
                         ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                         : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                     }`}>
                       {groupContributors.map((contributor, index) => {
                         const IconComponent = contributor.icon
                         return (
                           <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                             <CardHeader className="text-center pb-4">
                               <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                 <IconComponent className="h-8 w-8 text-gray-600" />
                               </div>
                               <CardTitle className="text-lg font-semibold text-gray-900 mb-3">
                                 {contributor.name}
                               </CardTitle>
                               <Badge className={`${contributor.color} font-medium text-center w-full justify-center`}>
                                 {contributor.role}
                               </Badge>
                             </CardHeader>
                             <CardContent>
                               <p className="text-gray-600 text-sm leading-relaxed text-center">
                                 {contributor.description}
                               </p>
                             </CardContent>
                           </Card>
                         )
                       })}
                     </div>
                  </div>
                )
              })}
            </div>

            <Separator className="my-8" />

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Special Recognition</h3>
                <p className="text-lg text-gray-600 mb-4">
                  We extend our deepest gratitude to all the contributors, stakeholders, and users 
                  who have supported this project from conception to implementation.
                </p>
                <p className="text-md text-gray-500">
                  This platform represents a collaborative effort to modernize youth leadership 
                  and create a more connected, efficient, and transparent SK community.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
