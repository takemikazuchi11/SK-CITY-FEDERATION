"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, Star } from "lucide-react"
import placeholder from "@/public/banner-sk.jpeg"
import {createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function KatipunanNgKabataanPage() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [kkRegistrationCount, setKkRegistrationCount] = useState(0)
  const supabase = createClientComponentClient()

  // Sample KK group names for the carousel
  const kkGroups = [
    "Kabataang Maka-Kalikasan",
    "Samahan ng Mag-aaral",
    "Kabataang Lider ng Barangay",
    "Sining at Kultura Kabataan",
    "Kabataang Atleta",
    "Kabataang Negosyante",
    "Kabataang Tagapagtaguyod ng Edukasyon",
    "Kabataang Boluntaryo sa Kalusugan",
    "Kabataang Maka-Agham at Teknolohiya",
    "Kabataang Tagapagtanggol ng Karapatan",
    "Kabataang Maka-Diyos",
    "Kabataang Manunulat",
    "Kabataang Tagapagsulong ng Kapayapaan",
  ]

  // Animation effect for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (kkGroups.length * 20))
    }, 50)
    return () => clearInterval(interval)
  }, [kkGroups.length])

  // Fetch KK registration count
  useEffect(() => {
    async function fetchKkRegistrationCount() {
      try {
        const { count, error } = await supabase.from("kk_registrations").select("*", { count: "exact", head: true })

        if (error) {
          console.error("Error fetching KK registration count:", error)
          return
        }

        setKkRegistrationCount(count || 0)
      } catch (error) {
        console.error("Error fetching KK registration count:", error)
      }
    }

    fetchKkRegistrationCount()
  }, [supabase])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-blue-900/80">
          <Image
            src={placeholder || "/placeholder.svg?height=400&width=1200"}
            alt="Katipunan ng Kabataan Background"
            fill
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4 mb-4">
            Katipunan ng Kabataan (KK)
          </h1>
          <p className="text-xl text-white text-center px-4">The Foundation of Youth Empowerment</p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Content and Registration */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">About Katipunan ng Kabataan</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                  The Katipunan ng Kabataan (KK) serves as the foundation of youth governance in the Philippines,
                  established under Republic Act 10742 or the Sangguniang Kabataan Reform Act of 2015. It is composed of
                  all Filipino citizens residing in each barangay for at least six months, who are 15 to 30 years old,
                  and are duly registered in the list of the Commission on Elections (COMELEC) and/or the records of the
                  Sangguniang Kabataan.
                </p>

                <p className="mb-6 text-gray-800 leading-relaxed">
                  As a general assembly, the KK is responsible for electing the Sangguniang Kabataan (SK) officials, who
                  then represent the youth in local governance. The KK also serves as a platform for youth
                  participation, enabling young people to voice their concerns, propose solutions, and actively
                  contribute to community development.
                </p>

                <p className="mb-6 text-gray-800 leading-relaxed">
                  Through regular assemblies and consultations, the KK ensures that youth perspectives are considered in
                  local decision-making processes. It also provides opportunities for leadership development, civic
                  engagement, and community service, empowering young people to become agents of positive change.
                </p>
              </div>

              {/* Hyperlink replacing the interactive button */}
              <div className="mt-8">
                <Link
                  href="/dashboard/programs/kk/register"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto transition-all duration-300 transform hover:scale-105 shadow"
                >
                  Join Katipunan ng Kabataan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Carousel */}
          <div className="lg:w-2/5">
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">KK Active Groups</h2>

              {/* Carousel Container */}
              <div className="relative h-[400px] overflow-hidden rounded-lg border border-blue-200 bg-white">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white z-10"></div>

                {/* Scrolling Groups */}
                <div
                  className="absolute w-full transition-transform duration-1000 ease-linear"
                  style={{ transform: `translateY(-${scrollPosition}px)` }}
                >
                  {/* Duplicate the groups to create a seamless loop */}
                  {[...kkGroups, ...kkGroups, ...kkGroups].map((group, index) => (
                    <div key={index} className="py-4 px-6 border-b border-blue-100 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rotate-45 bg-blue-500 mr-3"></div>
                        <span className="font-medium text-gray-800">{group}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info Card - Updated to show dynamic count */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Be Part of the Movement</h3>
                <p className="text-gray-700">
                  The Katipunan ng Kabataan is the foundation of youth governance in the Philippines. Join us in shaping
                  policies, implementing programs, and creating positive change in our communities.
                </p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">Active Chapters: 15</span>
                  <span className="text-blue-600 font-medium">
                    Members: {kkRegistrationCount > 0 ? kkRegistrationCount : "..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Impact Statistics - Updated with requested changes */}
        <div className="mt-12 bg-blue-800 text-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">KK Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-700/50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{kkRegistrationCount > 0 ? kkRegistrationCount : "..."}</div>
              <div className="text-lg">KK Registered</div>
            </div>
            <div className="text-center p-4 bg-blue-700/50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Star className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">42</div>
              <div className="text-lg">Community Projects</div>
            </div>
            <div className="text-center p-4 bg-blue-700/50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">62</div>
              <div className="text-lg">Barangay</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
