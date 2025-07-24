"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Lightbulb, Target, CheckSquare, ChevronDown, ChevronRight } from "lucide-react"
import banner from "@/public/vmgo-pic.jpg"
import banner2 from "@/public/banner-about.webp"

export default function AboutPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["vision"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const sections = [
    {
      id: "vision",
      title: "Vision",
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      content:
        "A dynamic and empowered youth sector in Calapan City, committed to progressive leadership, community development, and sustainable change.",
    },
    {
      id: "mission",
      title: "Mission",
      icon: <Lightbulb className="h-5 w-5 text-orange-600" />,
      content:
        "To unite and empower the youth of Calapan City through inclusive programs, innovative projects, and participatory governance, fostering leadership, social responsibility, and holistic development.",
    },
    {
      id: "goals",
      title: "Goals",
      icon: <Target className="h-5 w-5 text-green-600" />,
      content: (
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Youth Empowerment</strong> – Develop programs that enhance leadership, skills, and participation in
            governance.
          </li>
          <li>
            <strong>Community Engagement</strong> – Promote volunteerism, social welfare, and environmental
            sustainability.
          </li>
          <li>
            <strong>Education & Skills Development</strong> – Provide access to learning opportunities, scholarships,
            and career readiness programs.
          </li>
          <li>
            <strong>Health & Well-being</strong> – Advocate for mental health, sports, and wellness initiatives.
          </li>
          <li>
            <strong>Good Governance & Transparency</strong> – Uphold accountability, ethical leadership, and active
            youth representation.
          </li>
        </ul>
      ),
    },
    {
      id: "objectives",
      title: "Objectives",
      icon: <CheckSquare className="h-5 w-5 text-purple-600" />,
      content: (
        <ul className="space-y-2 text-gray-700">
          <li>To create and implement youth-led initiatives aligned with local and national development plans.</li>
          <li>
            To foster collaboration between SK officials, government agencies, and private organizations for community
            growth.
          </li>
          <li>To establish platforms for youth participation in decision-making and civic engagement.</li>
          <li>To ensure transparency and accountability in all SK programs and financial transactions.</li>
          <li>To promote sustainable and innovative projects that address youth concerns and aspirations.</li>
        </ul>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-blue-900/80">
          <Image
            src={banner2 || "/placeholder.svg"}
            alt="SK Background"
            fill
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Vision, Mission, Goals & Objectives
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section) => (
            <Card key={section.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {section.icon}
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 text-gray-700 leading-relaxed">
                      {typeof section.content === "string" ? <p>{section.content}</p> : section.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-[300px] md:h-[400px]">
              <Image src={banner || "/placeholder.svg"} alt="SK Youth in Action" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-blue-900/70 text-white p-4">
                <p className="text-sm">Sangguniang Kabataan youth members during a community engagement activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
