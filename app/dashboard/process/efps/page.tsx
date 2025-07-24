"use client"

import type React from "react"
import efps from "@/public/efps.png"
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
  ClipboardList,
  ExternalLink,
  Download,
  Play,
} from "lucide-react"
import epreview from "@/public/epreview.png"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"

export default function EFPSPage() {
  const [activeTab, setActiveTab] = useState("file")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation

  const whatIsRef = useRef<HTMLDivElement>(null)
  const whoCanUseRef = useRef<HTMLDivElement>(null)
  const howToEnrollRef = useRef<HTMLDivElement>(null)
  const howToFileRef = useRef<HTMLDivElement>(null)
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
        <h1 className="text-3xl font-bold mb-2">Electronic Filing and Payment System (eFPS)</h1>
        <p className="text-gray-600 mb-8">
          Learn about the Bureau of Internal Revenue's Electronic Filing and Payment System
        </p>

        {/* Logo placeholders in top-right corner */}
        <div className="absolute top-0 right-0 flex space-x-2">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SK || "/placeholder.svg"} alt="Logo 1" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={CALAP || "/placeholder.svg"} alt="Logo 1" width={100} height={100} />
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
                What Is eFPS?
              </button>

              <button
                onClick={() => scrollToSection(whoCanUseRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Users className="h-4 w-4 mr-2" />
                Who Can Use the eFPS?
              </button>

              <button
                onClick={() => scrollToSection(howToEnrollRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                How To Enroll
              </button>

              <button
                onClick={() => scrollToSection(howToFileRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                How To File and Pay
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
          {/* What Is eFPS? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  What Is eFPS?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      The <strong>Electronic Filing and Payment System (eFPS)</strong> is an online tax filing and
                      payment system developed by the Bureau of Internal Revenue (BIR) to provide taxpayers with an
                      easy, convenient, and paperless way to file tax returns and pay taxes.
                    </p>
                    <p className="text-gray-700 mb-4">
                      The eFPS was implemented to streamline tax compliance, reduce processing errors, and provide a
                      more efficient tax collection system. It eliminates the need for manual filing and payment,
                      allowing taxpayers to fulfill their tax obligations electronically.
                    </p>
                    <p className="text-gray-700">
                      Through the eFPS, taxpayers can file their tax returns and pay their taxes online 24/7,
                      eliminating the need to visit BIR offices or Authorized Agent Banks (AABs).
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src={efps}
                        alt="eFPS Homepage Screenshot"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                       Official  eFPS Homepage
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who Can Use the eFPS? */}
          <div ref={whoCanUseRef} id="who-can-use" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Who Can Use the eFPS?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Mandatory eFPS Users</h3>
                    <p className="text-gray-700 mb-4">
                      The following taxpayers are required to use the eFPS for filing tax returns and paying taxes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Large Taxpayers as identified by the BIR</li>
                      <li>Top 20,000 Private Corporations based on taxes paid</li>
                      <li>Taxpayers enjoying fiscal incentives (e.g., those registered with PEZA, BOI, etc.)</li>
                      <li>
                        Government offices, including national government agencies, local government units, and
                        government-owned and controlled corporations
                      </li>
                      <li>Corporations with paid-up capital stock of P10 million and above</li>
                      <li>Withholding agents with at least 10 employees</li>
                      <li>
                        Corporations with authorized agent banks (AABs) as authorized by the BIR to accept tax payments
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Voluntary eFPS Users</h3>
                    <p className="text-gray-700 mb-4">
                      The following taxpayers may voluntarily enroll in and use the eFPS:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Individual taxpayers (self-employed, professionals, etc.)</li>
                      <li>Small and medium enterprises not covered by mandatory enrollment</li>
                      <li>Other taxpayers who wish to use the electronic system for convenience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How To Enroll in the eFPS */}
          <div ref={howToEnrollRef} id="how-to-enroll" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  How To Enroll in the eFPS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Enrolling in the eFPS involves several steps. Follow this process to successfully register for the
                  system:
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
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Register with the BIR</h3>
                      <p className="text-gray-700">
                        Ensure you are registered with the BIR and have a valid Taxpayer Identification Number (TIN). If
                        not yet registered, visit the nearest BIR office to register.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        2
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Visit the BIR eFPS Website</h3>
                      <p className="text-gray-700">
                        Go to the BIR eFPS website at{" "}
                        <a
                          href="https://efps.bir.gov.ph"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          https://efps.bir.gov.ph
                        </a>{" "}
                        and click on the "Enroll to eFPS" button.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        3
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Complete the Online Enrollment Form</h3>
                      <p className="text-gray-700">
                        Fill out the online enrollment form with your taxpayer information, including your TIN,
                        registered name, contact details, and other required information.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        4
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Submit Required Documents</h3>
                      <p className="text-gray-700">
                        Print the accomplished enrollment form and submit it to the designated BIR office along with the
                        required supporting documents, which may include:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                        <li>Photocopy of BIR Certificate of Registration (Form 2303)</li>
                        <li>Authorization letter and valid ID for the authorized representative</li>
                        <li>Other documents as may be required by the BIR</li>
                      </ul>
                    </div>

                    {/* Step 5 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        5
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Receive Enrollment Confirmation</h3>
                      <p className="text-gray-700">
                        After verification of your enrollment application, the BIR will send you an email confirmation
                        with your eFPS username and temporary password.
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        6
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Activate Your eFPS Account</h3>
                      <p className="text-gray-700">
                        Log in to the eFPS website using your username and temporary password. You will be prompted to
                        change your password upon first login. Once completed, your eFPS account is activated and ready
                        for use.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How To File and Pay ITR Using the eFPS */}
          <div ref={howToFileRef} id="how-to-file" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  How To File and Pay ITR Using the eFPS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Filing Process
                    </TabsTrigger>
                    <TabsTrigger value="pay" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Process
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="file" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Filing Your Tax Returns</h3>
                      <p className="text-gray-700">Follow these steps to file your tax returns through the eFPS:</p>

                      <ol className="space-y-4 mt-4">
                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">1. Log in to your eFPS Account</h4>
                          <p className="text-gray-700">
                            Visit the eFPS website at{" "}
                            <a
                              href="https://efps.bir.gov.ph"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              https://efps.bir.gov.ph
                            </a>{" "}
                            and log in using your username and password.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">2. Select the Tax Return to File</h4>
                          <p className="text-gray-700">
                            From the dashboard, select "File a Tax Return" and choose the appropriate tax return form
                            (e.g., BIR Form 1701 for individual income tax, BIR Form 1702 for corporate income tax).
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">3. Fill Out the Tax Return Form</h4>
                          <p className="text-gray-700">
                            Complete all required fields in the tax return form. The system will automatically calculate
                            certain amounts based on your inputs.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">4. Validate the Tax Return</h4>
                          <p className="text-gray-700">
                            After completing the form, click on "Validate" to check for any errors or missing
                            information. Address any issues identified by the system.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">5. Submit the Tax Return</h4>
                          <p className="text-gray-700">
                            Once validation is successful, click on "Submit" to file your tax return. The system will
                            generate a confirmation receipt with a reference number.
                          </p>
                        </li>

                        <li className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">6. Save or Print the Confirmation Receipt</h4>
                          <p className="text-gray-700">
                            Save or print the confirmation receipt for your records. This serves as proof of your tax
                            return filing.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </TabsContent>

                  <TabsContent value="pay" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Paying Your Taxes</h3>
                      <p className="text-gray-700">
                        After filing your tax return, you can proceed with payment through the eFPS:
                      </p>

                      <ol className="space-y-4 mt-4">
                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">1. Select Payment Option</h4>
                          <p className="text-gray-700">
                            After submitting your tax return, click on "Proceed to Payment" or select the payment option
                            from the dashboard.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">2. Choose Payment Method</h4>
                          <p className="text-gray-700">
                            Select your preferred payment method from the available options:
                          </p>
                          <ul className="list-disc pl-6 mt-2 text-gray-700">
                            <li>Authorized Agent Bank (AAB) online banking</li>
                            <li>Credit/debit card payment</li>
                            <li>GCash, PayMaya, or other digital wallets</li>
                            <li>Other electronic payment channels</li>
                          </ul>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">3. Enter Payment Details</h4>
                          <p className="text-gray-700">
                            Enter the required payment information, including the amount to be paid and your payment
                            account details.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">4. Confirm Payment</h4>
                          <p className="text-gray-700">
                            Review the payment details and confirm the transaction. You may be redirected to your bank's
                            website or payment gateway to complete the transaction.
                          </p>
                        </li>

                        <li className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">5. Save Payment Confirmation</h4>
                          <p className="text-gray-700">
                            After successful payment, a payment confirmation receipt will be generated. Save or print
                            this receipt for your records.
                          </p>
                        </li>
                      </ol>

                      <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                        <h4 className="font-medium text-yellow-800 mb-1 flex items-center">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Important Note
                        </h4>
                        <p className="text-gray-700">
                          Ensure that you complete both the filing and payment processes before the deadline to avoid
                          penalties and surcharges. The eFPS allows you to file and pay taxes 24/7, but it's advisable
                          to complete these transactions well before the deadline to account for any technical issues.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
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
                  Watch this video tutorial to learn how to use the eFPS for filing and paying your taxes:
                </p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={epreview}
                        alt="eFPS Tutorial Video Thumbnail"
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
                      src="https://www.youtube.com/embed/0Om4j69iaFU?si=aEQwhrVyfPs-oBUE"
                      title="eFPS Tutorial Video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">Video: Official BIR eFPS Tutorial</div>
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
                  For more information about the eFPS, you can visit the following resources:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="https://www.bir.gov.ph/index.php/efps.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">BIR eFPS Official Page</h3>
                      <p className="text-sm text-gray-600">Visit the official BIR website for eFPS information</p>
                    </div>
                  </Link>

                  <Link
                    href="https://efps.bir.gov.ph/help.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <HelpCircle className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">eFPS Help Center</h3>
                      <p className="text-sm text-gray-600">Access the eFPS help center for troubleshooting</p>
                    </div>
                  </Link>

                  <Link
                    href="https://www.bir.gov.ph/images/bir_files/internal_communications_2/RMCs/2018/RMC%20No.%2037-2018.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">eFPS Guidelines (PDF)</h3>
                      <p className="text-sm text-gray-600">Download the latest eFPS guidelines and regulations</p>
                    </div>
                  </Link>

                  <Link
                    href="https://www.bir.gov.ph/index.php/contact-us.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-700">BIR Contact Information</h3>
                      <p className="text-sm text-gray-600">Contact the BIR for assistance with eFPS issues</p>
                    </div>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Need Further Assistance?
                  </h3>
                  <p className="text-gray-700">
                    If you need further assistance with the eFPS, you can contact the BIR Helpdesk at{" "}
                    <strong>(02) 8538-3200</strong> or email them at{" "}
                    <a href="mailto:contact_us@bir.gov.ph" className="text-blue-600 hover:underline">
                      contact_us@bir.gov.ph
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
