"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Users,
  Play,
  Calendar,
  AlertTriangle,
  FileQuestion,
} from "lucide-react"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"
import SPC from "@/public/SPC.jpg"

export default function BIRFilingPage() {
  const [activeTab, setActiveTab] = useState("registration")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation
  const whatIsRef = useRef<HTMLDivElement>(null)
  const registrationRef = useRef<HTMLDivElement>(null)
  const filingProcessRef = useRef<HTMLDivElement>(null)
  const deadlinesRef = useRef<HTMLDivElement>(null)
  const videoTutorialRef = useRef<HTMLDivElement>(null)
  const faqsRef = useRef<HTMLDivElement>(null)

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
        <h1 className="text-3xl font-bold mb-2">Bureau of Internal Revenue (BIR) Filing</h1>
        <p className="text-gray-600 mb-8">
          Learn about the Bureau of Internal Revenue filing requirements and procedures for SK officials
        </p>

        {/* Logo placeholders in top-right corner */}
        <div className="absolute top-0 right-0 flex space-x-2">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SK || "/placeholder.svg"} alt="SK Logo" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SPC || "/placeholder.svg"} alt="SPC Logo" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={CALAP || "/placeholder.svg"} alt="Calap Logo" width={100} height={100} />
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
                What Is BIR Filing?
              </button>

              <button
                onClick={() => scrollToSection(registrationRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Users className="h-4 w-4 mr-2" />
                Registration Process
              </button>

              <button
                onClick={() => scrollToSection(filingProcessRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Filing Process
              </button>

              <button
                onClick={() => scrollToSection(deadlinesRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Important Deadlines
              </button>

              <button
                onClick={() => scrollToSection(videoTutorialRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Play className="h-4 w-4 mr-2" />
                Video Tutorial
              </button>

              <button
                onClick={() => scrollToSection(faqsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileQuestion className="h-4 w-4 mr-2" />
                FAQs
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 space-y-8">
          {/* What Is BIR Filing? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  What Is BIR Filing?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      <strong>BIR Filing</strong> refers to the process of registering with the Bureau of Internal
                      Revenue (BIR) and submitting required tax returns and payments. As an SK official receiving
                      honoraria or allowances, you are required to comply with BIR regulations to ensure proper
                      documentation of your income and compliance with Philippine tax laws.
                    </p>
                    <p className="text-gray-700 mb-4">
                      SK officials are considered income earners and are therefore subject to tax regulations. Proper
                      tax compliance demonstrates transparency, accountability, and good governance in your role as a
                      youth leader.
                    </p>
                    <p className="text-gray-700">
                      Understanding and fulfilling your tax obligations is an essential part of your responsibility as
                      an SK official. This guide will help you navigate the BIR filing process specific to your
                      position.
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="BIR Filing Concept"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        BIR Filing for SK Officials
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      Required Documents
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Valid ID (e.g., Passport, Driver's License, UMID)</li>
                      <li>Barangay Certificate</li>
                      <li>Appointment or Election Certificate</li>
                      <li>Birth Certificate</li>
                      <li>TIN ID (if already registered)</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      Benefits of Compliance
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Legal compliance with tax regulations</li>
                      <li>Avoid penalties and legal issues</li>
                      <li>Establish good financial record</li>
                      <li>Contribute to national development</li>
                      <li>Demonstrate good governance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Process */}
          <div ref={registrationRef} id="registration-process" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Registration Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Before you can file your taxes, you need to register with the BIR. Follow these steps to complete your
                  registration as an SK official:
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
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Obtain a Tax Identification Number (TIN)
                      </h3>
                      <p className="text-gray-700">If you don't have a TIN yet, you need to apply for one by:</p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                        <li>Visit the BIR Revenue District Office (RDO) with jurisdiction over your barangay</li>
                        <li>
                          Complete BIR Form 1904 (Application for Registration for Self-Employed and Mixed Income
                          Individuals)
                        </li>
                        <li>Submit the form along with required documents</li>
                        <li>Receive your TIN</li>
                      </ul>
                    </div>

                    {/* Step 2 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        2
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Register as a Professional/Mixed Income Earner
                      </h3>
                      <p className="text-gray-700">
                        After obtaining your TIN, register as a professional/mixed income earner:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                        <li>Complete BIR Form 1901 (Application for Registration)</li>
                        <li>
                          Submit the form with supporting documents (Appointment/Election Certificate, Barangay
                          Certificate)
                        </li>
                        <li>Pay the registration fee</li>
                        <li>Attend the required taxpayer's briefing</li>
                      </ul>
                    </div>

                    {/* Step 3 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        3
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Register Books of Accounts</h3>
                      <p className="text-gray-700">You need to register your books of accounts:</p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                        <li>Purchase books of accounts (Journal, Ledger, etc.)</li>
                        <li>Complete BIR Form 1901 for registration of books</li>
                        <li>Pay the documentary stamp tax</li>
                        <li>Have your books stamped by the BIR</li>
                      </ul>
                    </div>

                    {/* Step 4 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        4
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Register for Electronic Filing and Payment System (eFPS)
                      </h3>
                      <p className="text-gray-700">For easier filing and payment:</p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                        <li>Visit the BIR website and register for eFPS</li>
                        <li>Complete the online registration form</li>
                        <li>Receive confirmation and access credentials</li>
                        <li>Familiarize yourself with the eFPS platform</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Important Note
                  </h3>
                  <p className="text-gray-700">
                    Registration requirements may vary slightly depending on your specific situation. It's recommended
                    to contact your local BIR office for the most up-to-date information specific to SK officials.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filing Process */}
          <div ref={filingProcessRef} id="filing-process" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Filing Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  After registration, you need to regularly file your tax returns. Here's how to complete your tax
                  filing obligations as an SK official:
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="registration" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Quarterly Filing
                    </TabsTrigger>
                    <TabsTrigger value="annual" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Annual Filing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="registration" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Quarterly Income Tax Filing</h3>
                      <p className="text-gray-700">As an SK official, you need to file quarterly income tax returns:</p>

                      <ol className="space-y-4 mt-4">
                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">1. Complete BIR Form 1701Q</h4>
                          <p className="text-gray-700">
                            Fill out the Quarterly Income Tax Return form with your personal information and income
                            details for the quarter.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">2. Calculate Your Taxable Income</h4>
                          <p className="text-gray-700">
                            Determine your total income from SK honoraria and allowances for the quarter and calculate
                            the taxable portion.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">3. Compute Tax Due</h4>
                          <p className="text-gray-700">
                            Calculate the tax due based on the applicable tax rate. SK officials may qualify for the 8%
                            flat tax rate if annual income doesn't exceed ₱3 million.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">4. File and Pay</h4>
                          <p className="text-gray-700">
                            Submit your quarterly tax return and pay the tax due through eFPS, authorized agent banks,
                            or the BIR office before the deadline.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </TabsContent>

                  <TabsContent value="annual" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Annual Income Tax Filing</h3>
                      <p className="text-gray-700">At the end of the tax year, file your annual income tax return:</p>

                      <ol className="space-y-4 mt-4">
                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">1. Complete BIR Form 1701</h4>
                          <p className="text-gray-700">
                            Fill out the Annual Income Tax Return form with your complete income information for the
                            entire year.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">2. Summarize Annual Income and Expenses</h4>
                          <p className="text-gray-700">
                            Compile all your income from SK honoraria and allowances for the entire year, along with any
                            allowable deductions and expenses.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">3. Calculate Final Tax Liability</h4>
                          <p className="text-gray-700">
                            Determine your final tax liability for the year, taking into account the quarterly payments
                            you've already made.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">4. Pay Remaining Tax Due</h4>
                          <p className="text-gray-700">
                            Pay any remaining tax due after deducting your quarterly payments. If you've overpaid, you
                            may be eligible for a tax refund.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">5. Keep Records</h4>
                          <p className="text-gray-700">
                            Keep copies of all filed returns and payment receipts for at least three years, as the BIR
                            may audit your records during this period.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-2">Filing Methods</h3>
                  <p>You can file your tax returns through any of these methods:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Electronic Filing and Payment System (eFPS)</li>
                    <li>Electronic BIR Forms (eBIRForms)</li>
                    <li>Authorized Agent Banks (AABs)</li>
                    <li>BIR Revenue District Office</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Deadlines */}
          <div ref={deadlinesRef} id="important-deadlines" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Important Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Meeting tax deadlines is crucial to avoid penalties. Mark these important dates on your calendar:
                </p>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      Quarterly Income Tax Returns (1701Q)
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">1st Quarter (Jan-Mar):</span> May 15
                      </li>
                      <li>
                        <span className="font-medium">2nd Quarter (Apr-Jun):</span> August 15
                      </li>
                      <li>
                        <span className="font-medium">3rd Quarter (Jul-Sep):</span> November 15
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      Annual Income Tax Return (1701)
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Filing Deadline:</span> April 15 of the following year
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      Percentage Tax Returns (2551Q) - If applicable
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">1st Quarter:</span> April 25
                      </li>
                      <li>
                        <span className="font-medium">2nd Quarter:</span> July 25
                      </li>
                      <li>
                        <span className="font-medium">3rd Quarter:</span> October 25
                      </li>
                      <li>
                        <span className="font-medium">4th Quarter:</span> January 25 of the following year
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Late Filing Penalties
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Failure to file tax returns on time may result in penalties including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>25% surcharge on the tax due</li>
                    <li>20% annual interest</li>
                    <li>Compromise penalty based on the tax due</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Tutorial */}
          <div ref={videoTutorialRef} id="video-tutorial" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Video Tutorial
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Watch this video tutorial to learn how to register with BIR and file your taxes as an SK official:
                </p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=720&width=1280"
                        alt="BIR Filing Tutorial Video Thumbnail"
                        fill
                        className="object-cover opacity-70"
                      />
                      <button
                        onClick={playVideo}
                        className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        aria-label="Play video"
                      >
                        <Play className="h-8 w-8" />
                      </button>
                    </div>
                  ) : (
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="BIR Filing Tutorial Video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">Video: BIR Filing Guide for SK Officials</div>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div ref={faqsRef} id="faqs" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileQuestion className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Are SK officials required to register with the BIR?</h3>
                    <p className="text-gray-700">
                      Yes, SK officials receiving honoraria or allowances are required to register with the BIR. This is
                      in compliance with the Tax Code which requires all income earners to register and file tax
                      returns.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">What tax forms do SK officials need to file?</h3>
                    <p className="text-gray-700">
                      SK officials typically need to file BIR Form 1701Q (Quarterly Income Tax Return) and BIR Form 1701
                      (Annual Income Tax Return). Depending on your tax situation, you may also need to file BIR Form
                      2551Q (Quarterly Percentage Tax Return) if you opt for the 8% flat tax rate.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Are SK honoraria taxable?</h3>
                    <p className="text-gray-700">
                      Yes, honoraria received by SK officials are considered taxable income. However, you may be
                      eligible for certain deductions and exemptions depending on your total income and tax status.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Can SK officials avail of the 8% flat tax rate?</h3>
                    <p className="text-gray-700">
                      SK officials with gross annual receipts/income not exceeding ₱3 million may opt for the 8% flat
                      tax rate in lieu of the graduated income tax rates and percentage tax. This is a simplified tax
                      scheme that may be beneficial depending on your income level.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">
                      What happens if I don't register with the BIR as an SK official?
                    </h3>
                    <p className="text-gray-700">
                      Failure to register with the BIR and comply with tax filing requirements may result in penalties,
                      including fines and surcharges. It's important to comply with tax regulations to avoid legal
                      issues and demonstrate good governance as a public servant.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Do I need to issue receipts for my SK honoraria?</h3>
                    <p className="text-gray-700">
                      Generally, you don't need to issue receipts for honoraria received as an SK official since these
                      are paid by the government. However, you should keep proper documentation of all income received
                      for tax filing purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Can I file my BIR returns online?</h3>
                    <p className="text-gray-700">
                      Yes, the BIR offers electronic filing and payment through the Electronic Filing and Payment System
                      (eFPS) and the Electronic BIR Forms (eBIRForms). These platforms allow you to file returns and pay
                      taxes online, making compliance more convenient.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Need Assistance Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Need Assistance?</h2>
            <p className="mb-4">For more information about BIR filing requirements for SK officials, you can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visit your local BIR Revenue District Office</li>
              <li>
                Call the BIR Hotline at <span className="font-medium">(02) 8538-3200</span>
              </li>
              <li>
                Visit the{" "}
                <Link
                  href="https://www.bir.gov.ph"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BIR website
                </Link>
              </li>
              <li>Consult with a tax professional or accountant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
