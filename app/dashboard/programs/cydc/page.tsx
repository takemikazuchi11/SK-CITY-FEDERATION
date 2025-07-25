"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import placeholder from "@/public/cydc.jpg"

export default function KatipunanKabataanPage() {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Sample CYDC group names for the carousel
  const cydcGroups = [
"Aletheians Debate Society",
"Anak ng Teatro",                   
"City College of Calapan- Student Parliament",          
"ALA-GAD Advocates",
"Oriental Mindoro Youth Leaders CCC",
"Division Federated Supreme Secondary Learner Government - Calapan City",
"ORIENTAL MINDORO NATIONAL HIGH SCHOOL - SSLG",
"Rotaract Club of Calapan",
"Scinatics Organization - CCC",
  ]

  // Animation effect for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (cydcGroups.length * 20))
    }, 50)
    return () => clearInterval(interval)
  }, [cydcGroups.length])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-blue-900/80">
          <Image
            src={placeholder || "/placeholder.svg?height=400&width=1200"}
            alt="City Youth Development Council Background"
            fill
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4 mb-4">
            City Youth Development Council (CYDC)
          </h1>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Content and Registration */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">About CYDC</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                  The CYDC's primary responsibilities include assisting in the formulation of the Local Youth
                  Development Plan (LYDP), recommending policies and projects for youth welfare, and ensuring
                  transparency and accountability in the implementation of SK initiatives. It also plays a crucial role
                  in assessing and accrediting youth organizations, helping them gain official recognition and access to
                  government programs.
                </p>

                <p className="mb-6 text-gray-800 leading-relaxed">
                  As a policy and advisory body, the LYDC provides technical guidance to SK officials, ensuring that
                  youth programs are inclusive, impactful, and aligned with national priorities such as the Philippine
                  Youth Development Plan (PYDP) 2023-2028.
                </p>

                <p className="mb-6 text-gray-800 leading-relaxed">
                  To facilitate youth organization participation, the SK City Federation of Calapan has introduced an
                  LYDC Application Portal, allowing organizations to easily apply for membership and collaborate with
                  local youth councils. This initiative enhances youth representation and ensures that all sectors of
                  the youth community have a voice in governance.
                </p>
              </div>

              {/* Hyperlink replacing the interactive button */}
              <div className="mt-8">
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeY8ei_FKG14aiSCIBl1Nq8r-eHwSiyHSKZc_88CH5LNY7hEA/viewform?usp=header" // Placeholder URL to be configured later
                  className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto transition-all duration-300 transform hover:scale-105 shadow"
                >
                  Register Your Group Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Carousel */}
          <div className="lg:w-2/5">
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">CYDC Active Groups</h2>

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
                  {[...cydcGroups, ...cydcGroups, ...cydcGroups].map((group, index) => (
                    <div key={index} className="py-4 px-6 border-b border-blue-100 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-3"></div>
                        <span className="font-medium text-gray-800">{group}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Join the Movement</h3>
                <p className="text-gray-700">
                  Become part of Calapan's vibrant youth development network. CYDC groups collaborate on community
                  projects, leadership development, and policy advocacy initiatives.
                </p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">Active Groups: 13</span>
                  <span className="text-blue-600 font-medium">Members: 450+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Impact Statistics */}
        <div className="mt-12 bg-blue-800 text-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">CYDC Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-700/50 rounded-lg">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-lg">Community Projects</div>
            </div>
            <div className="text-center p-4 bg-blue-700/50 rounded-lg">
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-lg">Youth Engaged</div>
            </div>
            <div className="text-center p-4 bg-blue-700/50 rounded-lg">
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-lg">Policy Recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
