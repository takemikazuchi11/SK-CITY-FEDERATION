"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  CheckCircle,
  HelpCircle,
  ClipboardList,
  ExternalLink,
  Download,
  Play,
  BarChart3,
  FileCheck,
  Calendar,
  Clock,
  FileSearch,
  Table,
} from "lucide-react"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"
import disclosureImage from "@/public/SK-Logo.jpg" // Replace with actual disclosure board image when available

export default function DisclosurePage() {
  const [activeTab, setActiveTab] = useState("q1")
  const [activeDocTab, setActiveDocTab] = useState("financial")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation
  const whatIsRef = useRef<HTMLDivElement>(null)
  const legalBasisRef = useRef<HTMLDivElement>(null)
  const requiredDocumentsRef = useRef<HTMLDivElement>(null)
  const quarterlyReportsRef = useRef<HTMLDivElement>(null)
  const submissionProcessRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const playVideo = () => {
    setIsVideoPlaying(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 relative">
        <h1 className="text-3xl font-bold mb-2">Quarterly Full Disclosure Board</h1>
        <p className="text-gray-600 mb-8">
          Learn about the SK Quarterly Full Disclosure requirements and access important reports
        </p>

        {/* Logo placeholders in top-right corner */}
        <div className="absolute top-0 right-0 flex space-x-2">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SK || "/placeholder.svg"} alt="SK Logo" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={CALAP || "/placeholder.svg"} alt="CALAP Logo" width={100} height={100} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="sticky top-24 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection(whatIsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                What Is Full Disclosure?
              </button>

              <button
                onClick={() => scrollToSection(legalBasisRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Legal Basis
              </button>

              <button
                onClick={() => scrollToSection(requiredDocumentsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Required Documents
              </button>

              <button
                onClick={() => scrollToSection(quarterlyReportsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Quarterly Reports
              </button>

              <button
                onClick={() => scrollToSection(submissionProcessRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Submission Process
              </button>

              <button
                onClick={() => scrollToSection(timelineRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Timeline & Deadlines
              </button>

              <button
                onClick={() => scrollToSection(faqRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </button>

              <button
                onClick={() => scrollToSection(resourcesRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>Resources</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 space-y-8">
          {/* What Is Full Disclosure? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileSearch className="h-5 w-5 mr-2" />
                  What Is Full Disclosure?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      The <strong>Full Disclosure Policy (FDP)</strong> is a transparency mechanism that requires all
                      local government units (LGUs), including the Sangguniang Kabataan (SK), to disclose to the public
                      all financial transactions, budget reports, and other documents related to public funds.
                    </p>
                    <p className="text-gray-700 mb-4">
                      For the SK, the Quarterly Full Disclosure Board is a mandatory reporting system where financial
                      statements, budget allocations, project implementations, and fund utilization reports are made
                      available to the public on a quarterly basis.
                    </p>
                    <p className="text-gray-700">
                      This policy promotes transparency, accountability, and good governance by allowing constituents to
                      monitor how their SK officials manage and utilize public funds for youth development programs and
                      activities.
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src={disclosureImage || "/placeholder.svg"}
                        alt="Full Disclosure Board Sample"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        Sample Full Disclosure Board
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Basis */}
          <div ref={legalBasisRef} id="legal-basis" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Legal Basis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <p className="text-gray-700">
                    The Full Disclosure Policy for SK is mandated by several laws and regulations:
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Republic Act 10742</h3>
                      <p className="text-gray-700">
                        The Sangguniang Kabataan Reform Act of 2015 requires transparency and accountability in the
                        operations of the SK, including the disclosure of financial transactions and reports.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">DILG Memorandum Circular 2018-189</h3>
                      <p className="text-gray-700">
                        Provides guidelines on the implementation of the Full Disclosure Policy for SK, including the
                        specific documents to be disclosed and the manner of disclosure.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Local Government Code of 1991</h3>
                      <p className="text-gray-700">
                        Section 352 mandates that local government units shall disclose to the public all information on
                        financial transactions and budget reports.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Executive Order No. 2, s. 2016</h3>
                      <p className="text-gray-700">
                        The Freedom of Information (FOI) Executive Order enhances transparency in government operations,
                        including those of the SK.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                    <h4 className="font-medium text-yellow-800 mb-1 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Important Note
                    </h4>
                    <p className="text-gray-700">
                      Failure to comply with the Full Disclosure Policy may result in administrative sanctions against
                      SK officials, as provided in the relevant laws and regulations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Required Documents */}
          <div ref={requiredDocumentsRef} id="required-documents" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeDocTab} onValueChange={setActiveDocTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="financial" className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Financial Reports
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Project Reports
                    </TabsTrigger>
                    <TabsTrigger value="other" className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Other Documents
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="financial" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Financial Reports</h3>
                      <p className="text-gray-700">
                        The following financial reports must be disclosed on a quarterly basis:
                      </p>

                      <div className="grid gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quarterly Statement of Cash Flow
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A report showing the inflow and outflow of cash during the quarter, including beginning and
                            ending balances.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quarterly Statement of Fund Utilization
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A detailed report on how SK funds were utilized during the quarter, categorized by program,
                            project, or activity.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quarterly Financial Report
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A comprehensive report on the financial status of the SK, including income, expenses, and
                            balances.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quarterly Budget Execution Report
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A report comparing the planned budget with actual expenditures for the quarter.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Project Reports</h3>
                      <p className="text-gray-700">
                        The following project-related reports must be disclosed on a quarterly basis:
                      </p>

                      <div className="grid gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Quarterly Project Implementation Report
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A detailed report on the status of all projects implemented during the quarter, including
                            progress, challenges, and outcomes.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            List of Completed Projects
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A list of all projects completed during the quarter, including the cost, location, and
                            beneficiaries.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Project Monitoring Report
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A report on the monitoring activities conducted for ongoing projects, including findings and
                            recommendations.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Project Impact Assessment
                          </h4>
                          <p className="text-gray-700 mb-2">
                            An assessment of the impact of completed projects on the target beneficiaries and the
                            community.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="other" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Other Required Documents</h3>
                      <p className="text-gray-700">
                        The following additional documents must also be disclosed on a quarterly basis:
                      </p>

                      <div className="grid gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Annual Investment Plan
                          </h4>
                          <p className="text-gray-700 mb-2">
                            A plan detailing the investment priorities of the SK for the year, updated quarterly if
                            there are changes.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Minutes of SK Meetings
                          </h4>
                          <p className="text-gray-700 mb-2">
                            Minutes of all SK meetings held during the quarter, particularly those related to financial
                            decisions.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Inventory of SK Properties
                          </h4>
                          <p className="text-gray-700 mb-2">
                            An updated inventory of all properties owned or managed by the SK, including their condition
                            and value.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            SK Resolutions and Ordinances
                          </h4>
                          <p className="text-gray-700 mb-2">
                            Copies of all resolutions and ordinances passed by the SK during the quarter, especially
                            those related to budget and projects.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Template
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quarterly Reports */}
          <div ref={quarterlyReportsRef} id="quarterly-reports" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Quarterly Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Access the quarterly reports for the current year. Select a quarter to view or download the
                  corresponding reports.
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="q1" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Q1 (Jan-Mar)
                    </TabsTrigger>
                    <TabsTrigger value="q2" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Q2 (Apr-Jun)
                    </TabsTrigger>
                    <TabsTrigger value="q3" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Q3 (Jul-Sep)
                    </TabsTrigger>
                    <TabsTrigger value="q4" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Q4 (Oct-Dec)
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="q1" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">First Quarter Reports (January - March)</h3>

                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="py-2 px-4 border-b text-left">Report Name</th>
                              <th className="py-2 px-4 border-b text-left">Date Submitted</th>
                              <th className="py-2 px-4 border-b text-left">Status</th>
                              <th className="py-2 px-4 border-b text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q1 Statement of Cash Flow</td>
                              <td className="py-2 px-4">April 10, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q1 Fund Utilization Report</td>
                              <td className="py-2 px-4">April 10, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q1 Project Implementation Report</td>
                              <td className="py-2 px-4">April 12, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="py-2 px-4">Q1 Financial Report</td>
                              <td className="py-2 px-4">April 15, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Q1 Summary
                        </h4>
                        <p className="text-gray-700">
                          All required reports for Q1 have been submitted and approved. The SK implemented 3 major
                          projects during this quarter with a total expenditure of ₱125,000.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="q2" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Second Quarter Reports (April - June)</h3>

                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="py-2 px-4 border-b text-left">Report Name</th>
                              <th className="py-2 px-4 border-b text-left">Date Submitted</th>
                              <th className="py-2 px-4 border-b text-left">Status</th>
                              <th className="py-2 px-4 border-b text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q2 Statement of Cash Flow</td>
                              <td className="py-2 px-4">July 12, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q2 Fund Utilization Report</td>
                              <td className="py-2 px-4">July 12, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q2 Project Implementation Report</td>
                              <td className="py-2 px-4">July 15, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="py-2 px-4">Q2 Financial Report</td>
                              <td className="py-2 px-4">July 18, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Approved
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Q2 Summary
                        </h4>
                        <p className="text-gray-700">
                          All required reports for Q2 have been submitted and approved. The SK implemented 4 major
                          projects during this quarter with a total expenditure of ₱180,000.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="q3" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Third Quarter Reports (July - September)</h3>

                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="py-2 px-4 border-b text-left">Report Name</th>
                              <th className="py-2 px-4 border-b text-left">Date Submitted</th>
                              <th className="py-2 px-4 border-b text-left">Status</th>
                              <th className="py-2 px-4 border-b text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q3 Statement of Cash Flow</td>
                              <td className="py-2 px-4">October 10, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Under Review
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q3 Fund Utilization Report</td>
                              <td className="py-2 px-4">October 10, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Under Review
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">Q3 Project Implementation Report</td>
                              <td className="py-2 px-4">October 12, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Under Review
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="py-2 px-4">Q3 Financial Report</td>
                              <td className="py-2 px-4">October 15, 2023</td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  Under Review
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Q3 Summary
                        </h4>
                        <p className="text-gray-700">
                          All required reports for Q3 have been submitted and are currently under review. The SK
                          implemented 5 major projects during this quarter with a total expenditure of ₱210,000.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="q4" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">
                        Fourth Quarter Reports (October - December)
                      </h3>

                      <div className="p-8 text-center">
                        <Calendar className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                        <h4 className="text-lg font-medium text-gray-700 mb-2">Reports Not Yet Due</h4>
                        <p className="text-gray-600 max-w-md mx-auto">
                          The fourth quarter reports will be available after December 31. Reports are due for submission
                          by January 15 of the following year.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Submission Process */}
          <div ref={submissionProcessRef} id="submission-process" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Submission Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Follow these steps to properly submit your quarterly full disclosure reports:
                </p>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>

                  {/* Steps */}
                  <div className="space-y-8 relative">
                    {/* Step 1 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        1
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Prepare Required Reports</h3>
                      <p className="text-gray-700">
                        Gather all the required reports and documents as listed in the Required Documents section.
                        Ensure all reports are complete, accurate, and properly formatted using the provided templates.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        2
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">SK Council Approval</h3>
                      <p className="text-gray-700">
                        Present the reports to the SK Council for review and approval. Ensure that all reports are
                        signed by the appropriate SK officials (Chairperson, Treasurer, Secretary).
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        3
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Submit to Barangay Council</h3>
                      <p className="text-gray-700">
                        Submit the approved reports to the Barangay Council for endorsement. The Barangay Secretary will
                        issue a certification of receipt and endorsement.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        4
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Submit to Municipal/City Youth Office
                      </h3>
                      <p className="text-gray-700">
                        Submit the endorsed reports to the Municipal or City Youth Office. They will review the reports
                        for completeness and compliance with requirements.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        5
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Post on Full Disclosure Board</h3>
                      <p className="text-gray-700">
                        Once approved, post printed copies of the reports on the SK Full Disclosure Board located at the
                        Barangay Hall or SK Office. Ensure that the reports are protected from damage and remain
                        readable.
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        6
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Upload to Online Portal</h3>
                      <p className="text-gray-700">
                        Upload electronic copies of the reports to this online portal. Ensure that all files are in PDF
                        format and properly labeled with the quarter and year.
                      </p>
                    </div>

                    {/* Step 7 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        7
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Maintain Records</h3>
                      <p className="text-gray-700">
                        Keep original copies of all submitted reports in the SK office for reference and audit purposes.
                        These records should be properly organized and accessible.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Deadlines */}
          <div ref={timelineRef} id="timeline" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline & Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Adherence to the following timeline and deadlines is crucial for compliance with the Full Disclosure
                    Policy:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="py-2 px-4 border-b text-left">Quarter</th>
                          <th className="py-2 px-4 border-b text-left">Period Covered</th>
                          <th className="py-2 px-4 border-b text-left">Submission Deadline</th>
                          <th className="py-2 px-4 border-b text-left">Posting Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">First Quarter</td>
                          <td className="py-2 px-4">January 1 - March 31</td>
                          <td className="py-2 px-4">April 15</td>
                          <td className="py-2 px-4">April 30 - July 31</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">Second Quarter</td>
                          <td className="py-2 px-4">April 1 - June 30</td>
                          <td className="py-2 px-4">July 15</td>
                          <td className="py-2 px-4">July 31 - October 31</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">Third Quarter</td>
                          <td className="py-2 px-4">July 1 - September 30</td>
                          <td className="py-2 px-4">October 15</td>
                          <td className="py-2 px-4">October 31 - January 31</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 px-4">Fourth Quarter</td>
                          <td className="py-2 px-4">October 1 - December 31</td>
                          <td className="py-2 px-4">January 15 (following year)</td>
                          <td className="py-2 px-4">January 31 - April 30 (following year)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Late Submission
                      </h4>
                      <p className="text-gray-700">
                        Late submission of reports may result in administrative sanctions. If you anticipate delays,
                        submit a written request for extension at least 5 days before the deadline.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Early Submission
                      </h4>
                      <p className="text-gray-700">
                        Early submission is encouraged to allow time for review and correction if needed. Reports can be
                        submitted as early as the last week of the quarter.
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Consequences of Non-Compliance
                    </h4>
                    <p className="text-gray-700">Failure to comply with the Full Disclosure Policy may result in:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                      <li>Administrative sanctions against SK officials</li>
                      <li>Withholding of SK funds for the next quarter</li>
                      <li>Negative audit findings from the Commission on Audit</li>
                      <li>Possible disqualification from SK incentive programs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div ref={faqRef} id="faq" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      1. Who is responsible for preparing the quarterly full disclosure reports?
                    </h4>
                    <p className="text-gray-700">
                      The SK Treasurer, in coordination with the SK Chairperson and Secretary, is primarily responsible
                      for preparing the financial reports. The SK Chairperson is ultimately responsible for ensuring
                      compliance with the Full Disclosure Policy.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      2. What happens if we miss a deadline for submission?
                    </h4>
                    <p className="text-gray-700">
                      If you miss a deadline, you should still submit the reports as soon as possible with a written
                      explanation for the delay. Late submission may result in administrative sanctions, but complete
                      non-submission is a more serious violation.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      3. Can we modify reports after they have been submitted?
                    </h4>
                    <p className="text-gray-700">
                      If you discover errors in submitted reports, you should submit corrected versions as soon as
                      possible with a written explanation of the changes. The corrected reports will need to go through
                      the same approval process as the original reports.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      4. Do we need to submit reports if we had no financial transactions during the quarter?
                    </h4>
                    <p className="text-gray-700">
                      Yes, you still need to submit reports even if there were no financial transactions. In such cases,
                      you would submit "nil" reports indicating that no transactions occurred during the period.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      5. How long should we keep copies of the full disclosure reports?
                    </h4>
                    <p className="text-gray-700">
                      SK offices should keep copies of all full disclosure reports for at least five years, or as
                      required by local audit regulations. These records are important for audit purposes and historical
                      reference.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      6. Can the public request copies of our full disclosure reports?
                    </h4>
                    <p className="text-gray-700">
                      Yes, the full disclosure reports are public documents and should be made available to any citizen
                      who requests them. This is in line with the transparency principle of the Full Disclosure Policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resources */}
          <div ref={resourcesRef} id="resources" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Access these resources to help you comply with the Full Disclosure Policy:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="#" className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <Download className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">Full Disclosure Policy Manual</h3>
                      <p className="text-sm text-gray-600">Comprehensive guide to the SK Full Disclosure Policy</p>
                    </div>
                  </Link>

                  <Link href="#" className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <Download className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">Report Templates Package</h3>
                      <p className="text-sm text-gray-600">Complete set of templates for all required reports</p>
                    </div>
                  </Link>

                  <Link href="#" className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <Play className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">Video Tutorial Series</h3>
                      <p className="text-sm text-gray-600">Step-by-step video guides for preparing reports</p>
                    </div>
                  </Link>

                  <Link href="#" className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <Table className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">Sample Completed Reports</h3>
                      <p className="text-sm text-gray-600">Examples of properly completed disclosure reports</p>
                    </div>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Need Further Assistance?
                  </h3>
                  <p className="text-gray-700">
                    If you need further assistance with the Full Disclosure Policy, you can contact your local Municipal
                    or City Youth Office, or reach out to the DILG Youth Affairs Office at{" "}
                    <strong>(02) 8876-3454</strong> or email them at{" "}
                    <a href="mailto:youth.affairs@dilg.gov.ph" className="text-blue-600 hover:underline">
                      youth.affairs@dilg.gov.ph
                    </a>
                    .
                  </p>
                </div>

                <div className="mt-6 p-4 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">Legal References</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Republic Act 10742</strong> - Sangguniang Kabataan Reform Act of 2015
                    </li>
                    <li>
                      <strong>DILG Memorandum Circular No. 2018-189</strong> - Guidelines on the Implementation of the
                      Full Disclosure Policy for SK
                    </li>
                    <li>
                      <strong>Local Government Code of 1991</strong> - Provisions on Transparency and Accountability
                    </li>
                    <li>
                      <strong>Executive Order No. 2, s. 2016</strong> - Freedom of Information Executive Order
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
