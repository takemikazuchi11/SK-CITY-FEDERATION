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
  ClipboardList,
  ExternalLink,
  Download,
  Play,
  AlertTriangle,
  FileQuestion,
  Globe,
  Lock,
  CreditCardIcon as PaymentIcon,
  Smartphone,
  Clock,
} from "lucide-react"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"

export default function ETPSPage() {
  const [activeTab, setActiveTab] = useState("registration")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation
  const whatIsRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const registrationRef = useRef<HTMLDivElement>(null)
  const paymentProcessRef = useRef<HTMLDivElement>(null)
  const supportedBanksRef = useRef<HTMLDivElement>(null)
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
        <h1 className="text-3xl font-bold mb-2">Electronic Tax Payment System (ETPS)</h1>
        <p className="text-gray-600 mb-8">
          Learn about the Bureau of Internal Revenue's Electronic Tax Payment System and how to use it effectively
        </p>

        {/* Logo placeholders in top-right corner */}
        <div className="absolute top-0 right-0 flex space-x-2">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SK || "/placeholder.svg"} alt="SK Logo" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={CALAP || "/placeholder.svg"} alt="BIR Logo" width={100} height={100} />
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
                What Is ETPS?
              </button>

              <button
                onClick={() => scrollToSection(benefitsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Benefits of ETPS
              </button>

              <button
                onClick={() => scrollToSection(registrationRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Users className="h-4 w-4 mr-2" />
                Registration Process
              </button>

              <button
                onClick={() => scrollToSection(paymentProcessRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Process
              </button>

              <button
                onClick={() => scrollToSection(supportedBanksRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                Supported Banks
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
          {/* What Is ETPS? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  What Is ETPS?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      The <strong>Electronic Tax Payment System (ETPS)</strong> is an online platform developed by the
                      Bureau of Internal Revenue (BIR) in partnership with authorized agent banks (AABs) to provide
                      taxpayers with a convenient and secure way to pay their taxes electronically.
                    </p>
                    <p className="text-gray-700 mb-4">
                      ETPS allows taxpayers to pay various tax types online through internet banking facilities of
                      accredited banks, eliminating the need to physically visit bank branches or BIR offices. This
                      system complements the Electronic Filing and Payment System (eFPS) by providing additional
                      electronic payment options.
                    </p>
                    <p className="text-gray-700">
                      As an SK official with tax obligations, understanding and utilizing ETPS can significantly
                      streamline your tax payment process, saving you time and ensuring timely compliance with tax
                      regulations.
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="ETPS Interface"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        ETPS Online Interface
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Key Features of ETPS
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-2 list-disc pl-5">
                    <li className="text-gray-700">24/7 tax payment availability</li>
                    <li className="text-gray-700">Secure online transaction processing</li>
                    <li className="text-gray-700">Immediate payment confirmation</li>
                    <li className="text-gray-700">Multiple payment options (credit/debit cards, online banking)</li>
                    <li className="text-gray-700">Automated payment tracking</li>
                    <li className="text-gray-700">Integration with eFPS for seamless tax filing and payment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits of ETPS */}
          <div ref={benefitsRef} id="benefits" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Benefits of ETPS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Using the Electronic Tax Payment System offers numerous advantages for SK officials and other
                  taxpayers:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Time Efficiency</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>No need to visit banks or BIR offices</li>
                      <li>Eliminates queuing time</li>
                      <li>Process tax payments in minutes</li>
                      <li>24/7 availability</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <Lock className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Security</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Encrypted transactions</li>
                      <li>Reduced risk of payment fraud</li>
                      <li>Digital payment confirmation</li>
                      <li>Secure authentication protocols</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <PaymentIcon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Convenience</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Multiple payment options</li>
                      <li>Pay from anywhere with internet</li>
                      <li>Mobile-friendly interface</li>
                      <li>Immediate payment confirmation</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Record Keeping</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Digital receipts and payment history</li>
                      <li>Easy tracking of past payments</li>
                      <li>Simplified audit preparation</li>
                      <li>Automated record-keeping</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Compliance</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Reduced risk of late payments</li>
                      <li>Immediate payment confirmation</li>
                      <li>Easier adherence to tax deadlines</li>
                      <li>Minimized human error in payment processing</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Environmental Impact
                  </h3>
                  <p className="text-gray-700">
                    By using ETPS, you're also contributing to environmental sustainability through:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                    <li>Reduced paper consumption</li>
                    <li>Lower carbon footprint by eliminating travel to BIR offices or banks</li>
                    <li>Decreased need for physical storage of paper receipts</li>
                  </ul>
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
                  Before you can use the ETPS, you need to register for the service. Follow these steps to complete your
                  registration:
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="registration" className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Registration Steps
                    </TabsTrigger>
                    <TabsTrigger value="requirements" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Requirements
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="registration" className="pt-4">
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
                            Verify Your BIR Registration Status
                          </h3>
                          <p className="text-gray-700">
                            Ensure you are properly registered with the BIR and have a valid Taxpayer Identification
                            Number (TIN). If you're not yet registered, you must first complete your BIR registration.
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            2
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">
                            Enroll in Your Bank's Online Banking Service
                          </h3>
                          <p className="text-gray-700">
                            Register for online banking with one of the BIR's authorized agent banks (AABs) that offer
                            ETPS services. Complete your bank's online banking enrollment process, which typically
                            requires visiting a branch with identification documents.
                          </p>
                        </div>

                        {/* Step 3 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            3
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">
                            Activate ETPS Feature in Online Banking
                          </h3>
                          <p className="text-gray-700">
                            Once your online banking is set up, log in to your account and look for the ETPS or "Pay
                            BIR" option. Some banks require additional activation or enrollment specifically for the tax
                            payment feature. Follow your bank's instructions to activate this service.
                          </p>
                        </div>

                        {/* Step 4 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            4
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Link Your TIN to Your Account</h3>
                          <p className="text-gray-700">
                            Enter your TIN and other required taxpayer information in the ETPS section of your online
                            banking platform. This links your tax identity to your bank account for seamless payments.
                          </p>
                        </div>

                        {/* Step 5 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            5
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Verify Your Registration</h3>
                          <p className="text-gray-700">
                            Complete any verification steps required by your bank, which may include confirming your
                            email address, mobile number, or receiving activation codes. Some banks may require a
                            waiting period for verification.
                          </p>
                        </div>

                        {/* Step 6 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            6
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Begin Using ETPS</h3>
                          <p className="text-gray-700">
                            Once your registration is confirmed, you can start using ETPS to pay your taxes online
                            through your bank's platform. Familiarize yourself with the interface and payment process
                            before your first tax payment deadline.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="pt-4">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        To register for ETPS, you'll need to prepare the following requirements:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Personal Identification
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Valid government-issued ID (e.g., Passport, Driver's License, UMID)</li>
                            <li>TIN ID or BIR Certificate of Registration</li>
                            <li>Proof of address (utility bill, bank statement)</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            For SK Officials
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Certificate of Election or Appointment</li>
                            <li>Barangay Certification (if required)</li>
                            <li>SK ID or other proof of position</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Online Banking Requirements
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Active bank account with an authorized agent bank</li>
                            <li>Enrollment in the bank's online banking service</li>
                            <li>Valid email address</li>
                            <li>Active mobile number for OTP verification</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Technical Requirements
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Computer or smartphone with internet access</li>
                            <li>Updated web browser (Chrome, Firefox, Safari, Edge)</li>
                            <li>Stable internet connection</li>
                            <li>Ability to receive SMS or email notifications</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                        <h3 className="font-medium text-yellow-800 mb-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Important Note
                        </h3>
                        <p className="text-gray-700">
                          Requirements may vary slightly depending on your bank. It's advisable to check with your
                          specific bank for any additional requirements they may have for ETPS enrollment. Some banks
                          may require you to visit a branch in person to complete the enrollment process.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Payment Process */}
          <div ref={paymentProcessRef} id="payment-process" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Once you've registered for ETPS, follow these steps to pay your taxes electronically:
                </p>

                <div className="bg-gray-50 p-5 rounded-lg border mb-6">
                  <h3 className="font-semibold mb-4 text-lg">Step-by-Step Payment Guide</h3>

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Log in to Your Online Banking</h4>
                        <p className="text-gray-700">
                          Access your bank's website or mobile app and log in using your credentials. Navigate to the
                          "Pay Bills" or "Payment" section and look for the BIR or ETPS option.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Select Tax Type</h4>
                        <p className="text-gray-700">
                          Choose the appropriate tax type you need to pay (e.g., Income Tax, Percentage Tax, VAT). Make
                          sure to select the correct form number corresponding to your tax obligation.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Enter Tax Details</h4>
                        <p className="text-gray-700">Input the required information, including:</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
                          <li>Taxpayer Identification Number (TIN)</li>
                          <li>Tax period (month/quarter and year)</li>
                          <li>Tax return filing reference number (if applicable)</li>
                          <li>Amount to be paid</li>
                          <li>Other details specific to the tax type</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Review Payment Details</h4>
                        <p className="text-gray-700">
                          Carefully verify all the information you've entered. Check the tax type, amount, and period to
                          ensure accuracy. Errors in these details can lead to misapplication of payments or penalties.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        5
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Confirm and Authorize Payment</h4>
                        <p className="text-gray-700">
                          Confirm the payment details and authorize the transaction. Depending on your bank, you may
                          need to enter a One-Time Password (OTP) sent to your registered mobile number or use another
                          authentication method to complete the transaction.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        6
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Save Payment Confirmation</h4>
                        <p className="text-gray-700">
                          Once the payment is processed, you'll receive a confirmation receipt. Save or print this
                          receipt for your records. This serves as proof of payment and contains important details like
                          the payment reference number that you may need for future reference.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-2">Payment Confirmation</h3>
                    <p className="text-gray-700 mb-2">
                      Your payment confirmation should include these essential details:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Payment Reference Number</li>
                      <li>Transaction Date and Time</li>
                      <li>Tax Type and Form Number</li>
                      <li>Tax Period</li>
                      <li>Amount Paid</li>
                      <li>TIN</li>
                      <li>Bank Reference Number</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                      Important Reminders
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Ensure sufficient funds in your account before initiating payment</li>
                      <li>Complete payments before 10:00 PM on the due date to avoid penalties</li>
                      <li>Keep payment confirmations for at least three years</li>
                      <li>Verify that the payment was properly posted by checking your BIR payment history</li>
                      <li>Contact your bank immediately if you encounter any issues during payment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supported Banks */}
          <div ref={supportedBanksRef} id="supported-banks" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Supported Banks
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The following Authorized Agent Banks (AABs) support ETPS for tax payments. Each bank may have slightly
                  different interfaces and procedures, but the general process remains similar:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">BDO Unibank, Inc.</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: BDO Online Banking → Bills Payment → Government → BIR
                    </p>
                    <Link
                      href="https://www.bdo.com.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Bank of the Philippine Islands</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: BPI Online → Pay Bills → Government → Bureau of Internal Revenue
                    </p>
                    <Link
                      href="https://www.bpi.com.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Metropolitan Bank & Trust Company</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: Metrobank Online → Bills Payment → Government → BIR
                    </p>
                    <Link
                      href="https://www.metrobank.com.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Land Bank of the Philippines</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: LANDBANK iAccess → Pay Bills → Government → BIR
                    </p>
                    <Link
                      href="https://www.landbank.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Security Bank Corporation</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: Security Bank Online → Bills Payment → Government → BIR
                    </p>
                    <Link
                      href="https://www.securitybank.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Union Bank of the Philippines</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: UnionBank Online → Pay Bills → Government → BIR
                    </p>
                    <Link
                      href="https://www.unionbankph.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Philippine National Bank</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: PNB Internet Banking → Bills Payment → Government → BIR
                    </p>
                    <Link
                      href="https://www.pnb.com.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Rizal Commercial Banking Corporation</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: RCBC Online Banking → Pay Bills → Government → BIR
                    </p>
                    <Link
                      href="https://www.rcbc.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Development Bank of the Philippines</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Access via: DBP Online Banking → Bills Payment → Government → BIR
                    </p>
                    <Link
                      href="https://www.dbp.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Website
                    </Link>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Note on Bank Selection
                  </h3>
                  <p className="text-gray-700">
                    For the most convenient experience, it's recommended to use the bank where you already have an
                    active account. This eliminates the need to open a new account solely for tax payments. Check with
                    your bank if they support ETPS, as the list of participating banks may change over time.
                  </p>
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
                  Watch this step-by-step video tutorial on how to use the Electronic Tax Payment System:
                </p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=720&width=1280"
                        alt="ETPS Tutorial Video Thumbnail"
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
                      title="ETPS Tutorial Video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Video: Complete Guide to Using the Electronic Tax Payment System
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Video Contents:</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Introduction to ETPS and its benefits</li>
                    <li>How to register for ETPS through your bank</li>
                    <li>Step-by-step guide to making tax payments</li>
                    <li>How to retrieve payment history and receipts</li>
                    <li>Troubleshooting common issues</li>
                    <li>Tips for secure online tax payments</li>
                  </ol>
                </div>
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
                    <h3 className="font-semibold mb-2 text-blue-700">
                      Is ETPS different from eFPS (Electronic Filing and Payment System)?
                    </h3>
                    <p className="text-gray-700">
                      Yes, they are different systems. The eFPS is a comprehensive system that allows for both filing
                      tax returns and paying taxes electronically. ETPS, on the other hand, is specifically for making
                      tax payments through participating banks' online platforms. ETPS is often used by taxpayers who
                      file their returns manually but prefer to pay electronically.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      Are there any fees for using ETPS to pay taxes?
                    </h3>
                    <p className="text-gray-700">
                      Most banks do not charge additional fees for using ETPS to pay taxes. However, it's advisable to
                      check with your specific bank as policies may vary. Some banks might have transaction limits or
                      fees for certain types of accounts.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What should I do if my payment transaction fails?
                    </h3>
                    <p className="text-gray-700">
                      If your payment transaction fails, first check if the amount was debited from your account. If it
                      was debited but you didn't receive a confirmation, contact your bank immediately with the
                      transaction details. If no amount was debited, you can try the transaction again or use an
                      alternative payment method to avoid late payment penalties.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">Can I use ETPS for all types of tax payments?</h3>
                    <p className="text-gray-700">
                      ETPS supports most common tax types, including income tax, percentage tax, value-added tax, and
                      withholding taxes. However, some specialized tax types or specific forms may not be available
                      through all banks' ETPS platforms. Check with your bank or the BIR for the complete list of tax
                      types supported by ETPS.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      How quickly are ETPS payments reflected in the BIR system?
                    </h3>
                    <p className="text-gray-700">
                      ETPS payments are typically reflected in the BIR system within 1-2 banking days. However, during
                      peak tax seasons or due to technical issues, it may take longer. It's advisable to make payments
                      well before the deadline to account for any potential delays in processing.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      Can I use ETPS if I'm not enrolled in online banking?
                    </h3>
                    <p className="text-gray-700">
                      No, ETPS requires enrollment in your bank's online banking service. If you're not yet enrolled in
                      online banking, you'll need to complete that process first before you can use ETPS. Alternatively,
                      you can pay taxes through other methods such as visiting a bank branch or using the eFPS if you're
                      registered for it.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What if I made a mistake in my ETPS payment details?
                    </h3>
                    <p className="text-gray-700">
                      If you discover an error in your payment details after completing the transaction, you should
                      immediately contact the BIR and submit a written request for correction, along with supporting
                      documents including your payment confirmation. It's crucial to address errors promptly to avoid
                      potential issues during tax audits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Need Assistance Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Need Assistance?</h2>
            <p className="mb-4">For more information about the Electronic Tax Payment System, you can:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-700">BIR Contact Information</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="font-medium">BIR Hotline:</span>
                    <span>(02) 8538-3200</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>contact_us@bir.gov.ph</span>
                  </li>
                  <li>
                    <Link
                      href="https://www.bir.gov.ph"
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit the BIR website
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-700">Bank Support</h3>
                <ul className="space-y-2">
                  <li>Contact your bank's customer service hotline</li>
                  <li>Visit your bank's branch for in-person assistance</li>
                  <li>Check your bank's website for ETPS guides</li>
                  <li>Use your bank's online chat support if available</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                <Download className="h-5 w-5 mr-2 text-green-600" />
                Downloadable Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    ETPS User Guide (PDF)
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    BIR Tax Payment Calendar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Common Tax Payment Codes Reference
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
