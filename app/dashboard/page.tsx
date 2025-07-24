"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Chatbot } from "@/components/chatbot"
import AnnouncementList from "@/components/announcement-list"
import { ImageCarousel } from "@/components/image-carousel"
import { AdminOnly } from "@/components/role-based-ui"
import { getUpcomingEventsByProximity } from "@/lib/data-service"
import { isDateUpcoming, sortEventsByProximity } from "@/lib/date-utils"
import { EventCard } from "@/components/event-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DisclosureBoard from "@/components/disclosure-board"
import LegislativeArchives from "@/components/legislative-archives"
import NewsSection from "@/components/news-section"

// Import carousel images
import banner1 from "@/public/banner1.jpg"
import banner2 from "@/public/SK-Logo.jpg"
import banner3 from "@/public/banner3.jpg"
import banner4 from "@/public/banner-sk.jpeg"

import cydc from "@/public/cydc.jpg"

// Carousel images
const carouselImages = [
  {
    src: banner1,
    alt: "Youth engagement programs",
  },
  {
    src: banner2,
    alt: "Community outreach initiatives",
  },
  {
    src: banner3,
    alt: "Educational workshops",
  },
  {
    src: banner4,
    alt: "Leadership development",
  },
]

// PYDP hexagon images
const pydpIcons = [
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/active_citizenship.png",
    alt: "Active Citizenship",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/economic_empowerment.png",
    alt: "Economic Empowerment",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/education.png",
    alt: "Education",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/environment.png",
    alt: "Environment",
  },
]

const pydpIconsRow2 = [
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/global_mobility.png",
    alt: "Global Mobility",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/governance.png",
    alt: "Governance",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/health.png",
    alt: "Health",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/peace_building_and_security.png",
    alt: "Peace Building and Security",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/social_inclusion_and_equity.png",
    alt: "Social Inclusion and Equity",
  },
  {
    src: "https://nyc-sk.com/assets/img/pydp-logos/agriculture.png",
    alt: "Agriculture",
  },
]

// Program carousel items
const programItems = [
  {
    title: "City Youth Development Council (CYDC)",
    description:
      "The CYDC is a multi-sectoral advisory body that supports youth participation in local governance, ensuring programs align with development plans.",
    image: cydc,
    bgColor: "from-blue-900 to-blue-700",
    link: "/dashboard/programs/cydc",
  },
  {
    title: "Katipunan Kabataan (KK)",
    description:
      "Katipunan ng Kabataan is the general assembly of youth in each barangay, composed of all citizens aged 15-30 residing in the barangay for at least 6 months.",
    image: cydc,
    bgColor: "from-blue-800 to-blue-600",
    link: "/dashboard/programs/kk",
  },
  {
    title: "Sangguniang Kabataan (SK)",
    description:
      "The Sangguniang Kabataan is the governing body elected by the Katipunan Kabataan that plans and executes programs for youth development in the barangay.",
    image: cydc,
    bgColor: "from-blue-900 to-blue-700",
    link: "/dashboard/programs/sk",
  },
]

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [upcomingEvents, setUpcomingEvents] = React.useState<
    { id: string; title: string; description: string; image?: string; date: string; time: string; location: string }[]
  >([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentProgramIndex, setCurrentProgramIndex] = React.useState(0)

  // Function to handle program carousel navigation
  const nextProgram = () => {
    setCurrentProgramIndex((prevIndex) => (prevIndex === programItems.length - 1 ? 0 : prevIndex + 1))
  }

  const prevProgram = () => {
    setCurrentProgramIndex((prevIndex) => (prevIndex === 0 ? programItems.length - 1 : prevIndex - 1))
  }

  // Auto-transition effect for the program carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextProgram()
    }, 5000) // Transition every 5 seconds

    return () => clearInterval(interval) // Clean up on unmount
  }, [])

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      // Move the router.push to useEffect to avoid the "Cannot update during rendering" error
      router.push("/dashboard")
    }
  }, [user, loading, router])

  React.useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true)
      try {
        // Get the current date for comparison
        const currentDate = new Date().toISOString().split("T")[0]
        console.log(`Current date: ${currentDate}`)

        // Fetch 3 upcoming events (we'll display 2, but fetch an extra in case we need a fallback)
        const events = await getUpcomingEventsByProximity(3)

        // Filter out past events on the client side as well
        const filteredEvents = events.filter((event) => isDateUpcoming(event.date))

        // Sort by proximity to current date (closest first)
        const sortedEvents = sortEventsByProximity(filteredEvents)

        setUpcomingEvents(sortedEvents)

        // Log the events that were fetched
        console.log("Fetched and filtered events:", sortedEvents)
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()

    // Set up an interval to refresh the events every hour
    // This ensures the featured events stay current without requiring a page refresh
    const intervalId = setInterval(
      () => {
        console.log("Refreshing events due to interval")
        fetchEvents()
      },
      60 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      {/* Hero Section with Carousel */}
      <section>
        <ImageCarousel images={carouselImages} />
      </section>

      {/* Welcome Section - Now below the carousel */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to <span className="text-red-600">SK City Federation</span>
          </motion.h1>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block h-1 w-24 rounded bg-blue-200 mb-6"></span>
          </motion.div>
          <motion.p
            className="mx-auto max-w-2xl text-xl md:text-2xl text-gray-700 font-medium tracking-wide mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Sulong Kabataang Calapeño
          </motion.p>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <AnnouncementList />
          </motion.div>
        </div>
      </section>

      {/* Latest News Section - Now using the new NewsSection component */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <NewsSection />
      </motion.div>

      {/* Events Section - Redesigned to show two featured events */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mx-auto inline-block">
                Upcoming Events
              </div>
            </div>
            {/* Only keep event cards, remove section title */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Featured Events Sidebar */}
              <div className="md:col-span-1">
                <div className="rounded-lg bg-white p-6 shadow-md h-full">
                  <h3 className="mb-2 text-xl font-bold">Featured Events</h3>
                  <p className="mb-4 text-gray-700">
                    Discover our upcoming events and activities. Join us in making a difference in our community.
                  </p>
                  <Link href="/dashboard/events" className="font-medium text-blue-600 hover:underline">
                    View events calendar →
                  </Link>
                </div>
              </div>

              {/* Event Cards - Now showing two events side by side in the remaining space */}
              <div className="md:col-span-2">
                {isLoading ? (
                  <div className="flex justify-center items-center h-56">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No upcoming events</h3>
                    <p className="text-gray-500">Check back soon for new events!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {upcomingEvents.slice(0, 2).map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {user && (
              <AdminOnly>
                <div className="mt-12 flex justify-center space-x-4">
                  <Link href="/dashboard/events/create">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">Create New Event</Button>
                  </Link>
                </div>
              </AdminOnly>
            )}
          </motion.div>
        </div>
      </section>

      {/* Programs Carousel Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mx-auto inline-block">
                Our Programs
              </div>
            </div>
            {/* Only keep carousel, remove section title */}
            <div className="relative w-full">
              {/* Carousel Navigation Buttons */}
              <button
                onClick={prevProgram}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                aria-label="Previous program"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextProgram}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                aria-label="Next program"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Carousel Content */}
              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentProgramIndex * 100}%)` }}
                >
                  {programItems.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                      <div className={`relative h-96 overflow-hidden`}>
                        {/* Background Image with Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.bgColor}`}>
                          <img
                            src={typeof item.image === "string" ? item.image : item.image?.src || cydc.src}
                            alt={item.title}
                            className="h-full w-full object-cover mix-blend-overlay opacity-80"
                          />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-start justify-center p-12 text-white">
                          <div className="max-w-2xl">
                            <h3 className="mb-4 text-3xl font-bold">{item.title}</h3>
                            <p className="mb-6 text-lg">{item.description}</p>
                            <Link href={item.link}>
                              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2 font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="mt-6 flex justify-center space-x-2">
                {programItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProgramIndex(index)}
                    className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                      currentProgramIndex === index ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Disclosure Board Section */}
      <DisclosureBoard />

      {/* Legislative Archives Section */}
      <LegislativeArchives />

      {/* PYDP Section - Exact match to nyc-sk.com */}
      <section className="mt-16 w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Row One - Logo and First Row of Icons */}
          <div className="flex flex-col lg:flex-row">
            {/* Logo and Title Column */}
            <div className="mb-8 w-full p-0 lg:mb-0 lg:w-1/3">
              <div className="flex flex-col items-center justify-center md:flex-row lg:items-start">
                <img
                  src="https://nyc-sk.com/assets/img/pydp-logos/pydp_logo.png"
                  alt="PYDP Logo"
                  className="h-auto w-24 md:w-32"
                />
                <div className="mt-4 text-center md:mt-0 md:text-left">
                  <h3 className="mb-0 text-2xl font-bold leading-tight text-black">
                    Philippine <br />
                    Youth <br />
                    Development <br />
                    Plan <br />
                  </h3>
                  <p className="mb-0 text-sm font-light text-black/80">Programs, Projects, and Activities</p>
                </div>
              </div>
            </div>

            {/* First Row of Icons */}
            <div className="w-full lg:w-2/3">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {pydpIcons.map((icon, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden transition-all duration-300 hover:scale-105">
                      <img
                        src={icon.src || "/placeholder.svg"}
                        alt={icon.alt}
                        className="h-auto w-full transition-all duration-300 group-hover:blur-sm"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white font-semibold text-sm text-center px-2 bg-black/50 rounded-md py-1">
                          {icon.alt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row Two - Second Row of Icons */}
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {pydpIconsRow2.map((icon, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden transition-all duration-300 hover:scale-105">
                    <img
                      src={icon.src || "/placeholder.svg"}
                      alt={icon.alt}
                      className="h-auto w-full transition-all duration-300 group-hover:blur-sm"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-semibold text-sm text-center px-2 bg-black/50 rounded-md py-1">
                        {icon.alt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  )
}
