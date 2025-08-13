"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Award, BookOpen, Heart, Leaf, Shield, GraduationCap, Globe, Building, TrendingUp, Calendar, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import cydc from "@/public/cydc.jpg"

export default function SKCFOverviewPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const centersOfParticipation = [
    {
      title: "Social Inclusion and Equity",
      icon: Users,
      description: "Promotes inclusivity and ensures marginalized youth have equal opportunities to participate in societal development.",
      color: "bg-blue-500"
    },
    {
      title: "Health",
      icon: Heart,
      description: "Works on promoting physical, mental, and social health among youth, addressing mental health awareness and wellness programs.",
      color: "bg-red-500"
    },
    {
      title: "Agriculture",
      icon: Leaf,
      description: "Encourages youth involvement in agricultural programs, promoting sustainable farming practices and rural development.",
      color: "bg-green-500"
    },
    {
      title: "Peace Building and Security",
      icon: Shield,
      description: "Fosters peace among youth, addressing conflict resolution, peace education, and advocating for safety and security.",
      color: "bg-purple-500"
    },
    {
      title: "Education",
      icon: GraduationCap,
      description: "Dedicated to improving educational opportunities, advocating for quality education and addressing learning challenges.",
      color: "bg-indigo-500"
    },
    {
      title: "Environment",
      icon: Globe,
      description: "Promotes environmental sustainability and engages youth in environmental advocacy and climate change initiatives.",
      color: "bg-emerald-500"
    },
    {
      title: "Governance",
      icon: Building,
      description: "Develops leadership skills among youth, encouraging active participation in governance and policy-making processes.",
      color: "bg-orange-500"
    },
    {
      title: "Active Citizenship",
      icon: Award,
      description: "Promotes civic engagement and volunteerism, encouraging youth to contribute to community service and social change.",
      color: "bg-pink-500"
    },
    {
      title: "Global Mobility",
      icon: TrendingUp,
      description: "Creates opportunities for international exchange programs, internships, and global mobility opportunities.",
      color: "bg-cyan-500"
    },
    {
      title: "Economic Empowerment",
      icon: BookOpen,
      description: "Equips youth with skills for economic independence, supporting entrepreneurship and financial literacy programs.",
      color: "bg-yellow-500"
    }
  ]

  const leadershipStructure = [
    {
      position: "President",
      description: "Oversees overall operations and represents youth at local and provincial levels"
    },
    {
      position: "Vice President",
      description: "Supports the President and leads specific projects"
    },
    {
      position: "Secretary",
      description: "Handles records and correspondence"
    },
    {
      position: "Treasurer",
      description: "Manages financial resources"
    },
    {
      position: "Auditor",
      description: "Ensures transparency in financial activities"
    },
    {
      position: "Public Information Officer (PIO)",
      description: "Takes charge of communications and public relations"
    },
    {
      position: "Sergeant-at-Arms",
      description: "Maintains order during meetings and events"
    },
    {
      position: "Board of Directors (BOD)",
      description: "10 members, each heading a committee under the 10 Centers of Youth Participation"
    }
  ]

  return (
    <div className="min-h-screen bg-blue-50">
             {/* Header */}
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
           <div className="text-center text-white">
             <h1 className="text-4xl md:text-5xl font-bold mb-4">
               Overview of SKCF
             </h1>
             <p className="text-xl text-blue-100 max-w-3xl mx-auto">
               Sangguniang Kabataan Calapan City Federation
             </p>
             <p className="text-lg text-blue-100 mt-2">
               Empowering Youth Leadership Across 62 Barangays
             </p>
           </div>
         </div>
       </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["overview", "leadership", "centers", "governance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-red-600  text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-200 border border-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
                                                                                         {/* Hero Section */}
                <Card className="overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={cydc}
                      alt="SKCF Central Governing Body"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/80"></div>
                    <div className="relative h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Sangguniang Kabataan of Calapan City</h2>
                        <p className="text-xl max-w-2xl mx-auto">
                          Representing the youth from all 62 barangays of Calapan City
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed">
                        The Sangguniang Kabataan (SK) Calapan City Federation serves as the central governing body representing the youth from the 62 barangays of Calapan City. Its mission is to empower the youth through leadership, active participation in local governance, and the implementation of community-driven programs.
                      </p>
                      <p className="text-gray-600 leading-relaxed mt-4">
                        The Federation acts as a crucial bridge between the youth and the local government, ensuring that their concerns and aspirations are effectively communicated. It is committed to youth leadership, social responsibility, and community engagement, ensuring that young people actively contribute to the city's development.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Responsibilities</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Coordinating and representing SK Chairpersons of each barangay</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Implementing youth-focused programs and capacity-building activities</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Facilitating leadership training and educational workshops</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>Serving as a platform for youth engagement with local government</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">62 Barangays</h3>
                  <p className="text-gray-600">Representing youth from all barangays across Calapan City</p>
                </Card>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Youth Leadership</h3>
                  <p className="text-gray-600">Empowering young leaders through active participation</p>
                </Card>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Local Governance</h3>
                  <p className="text-gray-600">Direct voice in legislative processes and policy-making</p>
                </Card>
              </div>

              {/* Provincial Representation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Provincial Representation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Ex-Officio Membership</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-blue-600 mb-2">City Council Level</h5>
                        <p className="text-gray-600">
                          The elected President serves as an ex-officio member of the Sangguniang Panlungsod (City Council), giving the youth a direct voice in the legislative process.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-green-600 mb-2">Provincial Level</h5>
                        <p className="text-gray-600">
                          The President can be elected by SK Presidents of the 14 municipalities and one city in Oriental Mindoro to serve as an ex-officio member of the Provincial Board.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "leadership" && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-800 text-center">Leadership Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadershipStructure.map((role, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{role.position}</h3>
                          <p className="text-gray-600 text-sm">{role.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CYDC Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Calapan City Youth Development Council (CYDC)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The SK Calapan City Federation's President and Vice President preside over the Calapan City Youth Development Council (CYDC), which consists of 8 to 19 youth organizations across the city.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Advisory Role</h4>
                        <p className="text-gray-600 text-sm">
                          Serves as an advisory body that complements the Federation's work by bringing together youth groups from different sectors.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Collaboration</h4>
                        <p className="text-gray-600 text-sm">
                          Assists in the planning and execution of projects and programs of the SK Federation at all levels.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "centers" && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-800 text-center">10 Centers of Youth Participation</CardTitle>
                  <p className="text-gray-600 text-center">
                    Critical areas of focus for the Federation's committees, aligned with the Philippine Youth Development Plan 2023-2028
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {centersOfParticipation.map((center, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 ${center.color} rounded-lg flex items-center justify-center mb-4`}>
                            <center.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-3">{center.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{center.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "governance" && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-800 text-center">Governance & Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">DILG Guidance</h4>
                      <p className="text-gray-700 mb-4">
                        The Department of the Interior and Local Government (DILG) and National Youth Commission (NYC) play a significant role in guiding the SK Federation through various memoranda and circulars.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-600 mb-2">DILG MC 2020-062</h5>
                          <p className="text-gray-600 text-sm">Guidelines for SK elections, ensuring fair and transparent processes</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold text-green-600 mb-2">DILG MC 2021-016</h5>
                          <p className="text-gray-600 text-sm">Implementation of youth development programs, emphasizing youth welfare</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-600 mb-2">DILG MC 2022-014</h5>
                          <p className="text-gray-600 text-sm">Financial management, ensuring responsible fund handling and transparency</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">National Alignment</h4>
                      <p className="text-gray-700">
                        The Federation aligns with national development plans and government policies, creating meaningful opportunities for young people to lead, participate, and contribute to the progress of Calapan City and beyond.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
