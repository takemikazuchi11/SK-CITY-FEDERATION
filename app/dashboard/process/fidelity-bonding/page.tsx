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
  Users,
  ClipboardList,
  ExternalLink,
  Download,
  Play,
  Shield,
  FileCheck,
  Calendar,
} from "lucide-react"
import SK from "@/public/SK-Logo.jpg"
import fidelity from "@/public/fidelity.png"
import CALAP from "@/public/calap.png"
import fpreview from "@/public/fpreview.png" // Replace with actual fidelity bond image when available

export default function FidelityBondingPage() {
  const [activeTab, setActiveTab] = useState("requirements")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation
  const whatIsRef = useRef<HTMLDivElement>(null)
  const whoIsEligibleRef = useRef<HTMLDivElement>(null)
  const requirementsRef = useRef<HTMLDivElement>(null)
  const applicationProcessRef = useRef<HTMLDivElement>(null)
  const feesAndDeadlinesRef = useRef<HTMLDivElement>(null)
  const videoTutorialRef = useRef<HTMLDivElement>(null)
  const moreInfoRef = useRef<HTMLDivElement>(null)

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
        <h1 className="text-3xl font-bold mb-2">Fidelity Bonding for Sangguniang Kabataan (SK)</h1>
        <p className="text-gray-600 mb-8">
          Learn about the process of obtaining a fidelity bond for SK officials and treasurers
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
                What Is Fidelity Bonding?
              </button>

              <button
                onClick={() => scrollToSection(whoIsEligibleRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Users className="h-4 w-4 mr-2" />
                Who Is Eligible?
              </button>

              <button
                onClick={() => scrollToSection(requirementsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Requirements
              </button>

              <button
                onClick={() => scrollToSection(applicationProcessRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Application Process
              </button>

              <button
                onClick={() => scrollToSection(feesAndDeadlinesRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Fees and Deadlines
              </button>

              <button
                onClick={() => scrollToSection(videoTutorialRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Play className="h-4 w-4 mr-2" />
                Video Tutorial
              </button>

              <button
                onClick={() => scrollToSection(moreInfoRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>More Information</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 space-y-8">
          {/* What Is Fidelity Bonding? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  What Is Fidelity Bonding?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      A <strong>Fidelity Bond</strong> is a form of insurance protection that covers policyholders for
                      losses that they incur as a result of fraudulent acts by specified individuals. For Sangguniang
                      Kabataan (SK) officials, particularly treasurers, it serves as a guarantee against loss of public
                      funds due to acts of dishonesty.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Under Republic Act 10742 (SK Reform Act of 2015) and its Implementing Rules and Regulations,
                      certain SK officials are required to secure a fidelity bond to protect public funds that they
                      handle in the course of their duties.
                    </p>
                    <p className="text-gray-700">
                      The fidelity bond ensures accountability and provides a safeguard for public funds, giving
                      assurance to the government and the community that financial resources are protected against
                      potential misuse.
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src={fidelity|| "/placeholder.svg"}
                        alt="Fidelity Bond Certificate Sample"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                         Fidelity Bond Certificate
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who Is Eligible? */}
          <div ref={whoIsEligibleRef} id="who-is-eligible" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Who Is Eligible?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Required Officials</h3>
                    <p className="text-gray-700 mb-4">
                      The following SK officials are required to secure a fidelity bond:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>
                        <strong>SK Treasurer</strong> - As the primary custodian of SK funds, the treasurer is required
                        to be bonded to protect public funds under their management.
                      </li>
                      <li>
                        <strong>SK Chairperson</strong> - In some jurisdictions, the chairperson may also be required to
                        secure a fidelity bond, especially if they are signatories to financial transactions.
                      </li>
                      <li>
                        <strong>Other SK Officials</strong> - Depending on local regulations, other SK officials who
                        handle public funds may also be required to secure a fidelity bond.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Eligibility Criteria</h3>
                    <p className="text-gray-700 mb-4">To be eligible for a fidelity bond, the applicant must:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Be a duly elected and qualified SK official</li>
                      <li>Have taken the oath of office</li>
                      <li>Be designated to handle public funds as part of their official duties</li>
                      <li>Have no pending criminal case related to moral turpitude or dishonesty</li>
                      <li>
                        Comply with all requirements set by the Bureau of the Treasury or the authorized bonding company
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          <div ref={requirementsRef} id="requirements" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="requirements" className="flex items-center">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Document Requirements
                    </TabsTrigger>
                    <TabsTrigger value="forms" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Forms to Complete
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="requirements" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Required Documents</h3>
                      <p className="text-gray-700">
                        The following documents are required when applying for a fidelity bond:
                      </p>

                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Personal Identification
                          </h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>Valid government-issued ID (e.g., Passport, Driver's License, UMID)</li>
                            <li>Recent 2x2 ID picture (2 copies)</li>
                            <li>Birth Certificate (NSO/PSA certified copy)</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Proof of Position
                          </h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>Certificate of Election from COMELEC</li>
                            <li>Oath of Office</li>
                            <li>Appointment or Designation Order (for SK Treasurer)</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Financial Documents
                          </h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>Certification of SK Fund Amount</li>
                            <li>Latest SK Financial Statement</li>
                            <li>Barangay Certification of Good Fund Management (if applicable)</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Additional Requirements
                          </h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>NBI Clearance (issued within the last 6 months)</li>
                            <li>Barangay Clearance</li>
                            <li>Community Tax Certificate (Cedula)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                        <h4 className="font-medium text-yellow-800 mb-1 flex items-center">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Important Note
                        </h4>
                        <p className="text-gray-700">
                          All documents must be original or certified true copies. Photocopies must be clear and
                          legible. Bring both original documents and photocopies during application for verification
                          purposes.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="forms" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Forms to Complete</h3>
                      <p className="text-gray-700">
                        The following forms need to be completed as part of the fidelity bond application:
                      </p>

                      <div className="space-y-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">1. Fidelity Bond Application Form</h4>
                          <p className="text-gray-700 mb-2">
                            This is the main application form that collects personal information, position details, and
                            bond amount requirements.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Fidelity Bond Application Form
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">2. Personal Information Sheet</h4>
                          <p className="text-gray-700 mb-2">
                            A detailed form collecting personal background information, including family details,
                            educational background, and employment history.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Personal Information Sheet
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">3. Statement of Assets and Liabilities</h4>
                          <p className="text-gray-700 mb-2">
                            A declaration of personal assets and liabilities, which helps assess the financial standing
                            of the applicant.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Statement of Assets and Liabilities Form
                          </Link>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">4. Certification of Fund Accountability</h4>
                          <p className="text-gray-700 mb-2">
                            A form certifying the amount of public funds that the official is accountable for, which
                            determines the bond amount.
                          </p>
                          <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Certification of Fund Accountability
                          </Link>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                        <h4 className="font-medium text-yellow-800 mb-1 flex items-center">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Form Completion Tips
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>Fill out all forms completely and accurately using black ink</li>
                          <li>Ensure all information provided is truthful and verifiable</li>
                          <li>Have the forms notarized where required</li>
                          <li>Make photocopies of completed forms for your records</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Application Process */}
          <div ref={applicationProcessRef} id="application-process" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Application Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The process of applying for a fidelity bond involves several steps. Follow this process to
                  successfully secure your bond:
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
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Prepare Required Documents</h3>
                      <p className="text-gray-700">
                        Gather all the required documents and forms as listed in the Requirements section. Ensure all
                        documents are complete, accurate, and up-to-date.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        2
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Complete Application Forms</h3>
                      <p className="text-gray-700">
                        Fill out all required application forms completely and accurately. Have the forms notarized
                        where required. Make sure to sign all necessary signature fields.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        3
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Submit to Local Treasury Office</h3>
                      <p className="text-gray-700">
                        Submit your completed application forms and supporting documents to your local Municipal or City
                        Treasury Office. They will review your application for completeness and accuracy.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        4
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Pay the Bond Premium</h3>
                      <p className="text-gray-700">
                        Once your application is approved, pay the required bond premium at the designated payment
                        center. Keep the official receipt as proof of payment.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        5
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Verification and Processing</h3>
                      <p className="text-gray-700">
                        The Treasury Office will verify your documents and process your application. This may include
                        background checks and verification of the information provided.
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        6
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Receive Your Fidelity Bond</h3>
                      <p className="text-gray-700">
                        Once approved, you will receive your Fidelity Bond Certificate. Keep this document in a safe
                        place as you may need to present it for official transactions.
                      </p>
                    </div>

                    {/* Step 7 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        7
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Annual Renewal</h3>
                      <p className="text-gray-700">
                        Fidelity bonds typically need to be renewed annually. Mark your calendar for renewal and start
                        the process at least one month before expiration.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fees and Deadlines */}
          <div ref={feesAndDeadlinesRef} id="fees-and-deadlines" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Fees and Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Bond Premium Fees</h3>
                    <p className="text-gray-700 mb-4">
                      The premium for a fidelity bond is calculated based on the amount of public funds that the
                      official is accountable for. Here's a general guide to the fee structure:
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-blue-100">
                            <th className="py-2 px-4 border-b text-left">Bond Amount</th>
                            <th className="py-2 px-4 border-b text-left">Annual Premium Rate</th>
                            <th className="py-2 px-4 border-b text-left">Estimated Premium Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">Up to ₱100,000</td>
                            <td className="py-2 px-4">0.5% - 1.0%</td>
                            <td className="py-2 px-4">₱500 - ₱1,000</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">₱100,001 - ₱500,000</td>
                            <td className="py-2 px-4">0.4% - 0.8%</td>
                            <td className="py-2 px-4">₱400 - ₱4,000</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">₱500,001 - ₱1,000,000</td>
                            <td className="py-2 px-4">0.3% - 0.6%</td>
                            <td className="py-2 px-4">₱1,500 - ₱6,000</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4">Above ₱1,000,000</td>
                            <td className="py-2 px-4">0.25% - 0.5%</td>
                            <td className="py-2 px-4">Varies based on amount</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Note: Actual premium rates may vary depending on the bonding company and specific risk factors.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Additional Fees</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Processing Fees</h4>
                        <p className="text-gray-700">Application processing fee: ₱100 - ₱500 (varies by location)</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Documentary Stamp Tax</h4>
                        <p className="text-gray-700">
                          Documentary stamp tax: ₱30 per ₱4,000 of bond amount or fraction thereof
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Notarial Fees</h4>
                        <p className="text-gray-700">Notarization of documents: ₱50 - ₱100 per document</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Certification Fees</h4>
                        <p className="text-gray-700">Various certifications: ₱50 - ₱200 per certification</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-700">Important Deadlines</h3>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Initial Bond Application</h4>
                        <p className="text-gray-700">
                          SK officials must secure a fidelity bond within <strong>30 days</strong> from the date of
                          assuming office or from the date of designation as fund custodian.
                        </p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Annual Renewal</h4>
                        <p className="text-gray-700">
                          Fidelity bonds must be renewed <strong>annually</strong>, at least <strong>15 days</strong>{" "}
                          before the expiration of the current bond.
                        </p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Change in Fund Accountability</h4>
                        <p className="text-gray-700">
                          If there is an increase in the amount of funds being handled, the bond must be updated within{" "}
                          <strong>15 days</strong> from the date of the change.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Consequences of Non-Compliance
                    </h4>
                    <p className="text-gray-700">
                      Failure to secure or renew a fidelity bond as required may result in:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                      <li>Administrative sanctions</li>
                      <li>Suspension from handling public funds</li>
                      <li>Possible disqualification from holding public office</li>
                      <li>Personal liability for any losses incurred during the unbonded period</li>
                    </ul>
                  </div>
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
                  Watch this video tutorial to learn about the fidelity bonding process for SK officials:
                </p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={fpreview}
                        alt="Fidelity Bond Tutorial Video Thumbnail"
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
                      src="https://www.youtube.com/embed/com_NBMH8Cg?si=XzOwF65hNkdLAnP6"
                      title="Fidelity Bond Tutorial Video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Video: Official SK Fidelity Bond Application Tutorial
                </div>
              </CardContent>
            </Card>
          </div>

          {/* More Information */}
          <div ref={moreInfoRef} id="more-info" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  More Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  For more information about fidelity bonding for SK officials, you can visit the following resources:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="https://www.dilg.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">DILG Official Website</h3>
                      <p className="text-sm text-gray-600">Department of the Interior and Local Government</p>
                    </div>
                  </Link>

                  <Link
                    href="https://www.treasury.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">Bureau of the Treasury</h3>
                      <p className="text-sm text-gray-600">Official website for bonding information</p>
                    </div>
                  </Link>

                  <Link
                    href="https://www.nyc.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">National Youth Commission</h3>
                      <p className="text-sm text-gray-600">Resources for SK officials and youth leaders</p>
                    </div>
                  </Link>

                  <Link
                    href="https://www.gsis.gov.ph/insurance/non-life-insurance/fidelity-bond/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">GSIS Fidelity Bond Information</h3>
                      <p className="text-sm text-gray-600">Government Service Insurance System bonding details</p>
                    </div>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Need Further Assistance?
                  </h3>
                  <p className="text-gray-700">
                    If you need further assistance with the fidelity bonding process, you can contact your local
                    Municipal or City Treasurer's Office, or reach out to the DILG Youth Affairs Office at{" "}
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
                      <strong>DILG Memorandum Circular No. 2018-212</strong> - Guidelines on the Mandatory Fidelity
                      Bonding of SK Officials
                    </li>
                    <li>
                      <strong>COA Circular No. 97-002</strong> - Regulations on the Bonding of Accountable Officers
                    </li>
                    <li>
                      <strong>Local Government Code of 1991</strong> - Provisions on Accountability of Local Officials
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
