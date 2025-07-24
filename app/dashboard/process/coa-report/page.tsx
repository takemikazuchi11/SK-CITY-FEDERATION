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
  Download,
  Play,
  Calendar,
  AlertTriangle,
  FileQuestion,
  BarChart,
  FileCheck,
  Clock,
} from "lucide-react"
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"

export default function COAReportPage() {
  const [activeTab, setActiveTab] = useState("preparation")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation
  const whatIsRef = useRef<HTMLDivElement>(null)
  const requirementsRef = useRef<HTMLDivElement>(null)
  const preparationRef = useRef<HTMLDivElement>(null)
  const submissionRef = useRef<HTMLDivElement>(null)
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
        <h1 className="text-3xl font-bold mb-2">Certificate of Authority (COA) Report</h1>
        <p className="text-gray-600 mb-8">
          Learn about the Commission on Audit reporting requirements and procedures for SK officials
        </p>

        {/* Logo placeholders in top-right corner */}
        <div className="absolute top-0 right-0 flex space-x-2">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={SK || "/placeholder.svg"} alt="SK Logo" width={100} height={100} />
          </div>
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image src={CALAP || "/placeholder.svg"} alt="COA Logo" width={100} height={100} />
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
                What Is COA Report?
              </button>

              <button
                onClick={() => scrollToSection(requirementsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Requirements
              </button>

              <button
                onClick={() => scrollToSection(preparationRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Report Preparation
              </button>

              <button
                onClick={() => scrollToSection(submissionRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Submission Process
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
          {/* What Is COA Report? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  What Is COA Report?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      A <strong>Certificate of Authority (COA) Report</strong> is a financial document required by the
                      Commission on Audit (COA) from all government entities, including Sangguniang Kabataan (SK)
                      organizations. This report provides a comprehensive overview of the financial activities,
                      transactions, and fund utilization of the SK during a specific period.
                    </p>
                    <p className="text-gray-700 mb-4">
                      The COA report serves as a mechanism for transparency and accountability, ensuring that public
                      funds allocated to SK are properly accounted for and used according to government regulations and
                      guidelines.
                    </p>
                    <p className="text-gray-700">
                      As an SK official, particularly the treasurer, you are responsible for preparing and submitting
                      accurate and timely COA reports to maintain good financial governance and comply with audit
                      requirements.
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="COA Report Sample"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        Sample COA Report Format
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                      Purpose of COA Reports
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ensure transparency in financial transactions</li>
                      <li>Maintain accountability for public funds</li>
                      <li>Prevent misuse or misappropriation of resources</li>
                      <li>Document financial activities for audit purposes</li>
                      <li>Comply with government regulations</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      Key Stakeholders
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>SK Treasurer (primary preparer)</li>
                      <li>SK Chairperson (approver)</li>
                      <li>Barangay Treasurer (reviewer)</li>
                      <li>Commission on Audit (recipient)</li>
                      <li>Local Government Unit (oversight)</li>
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
                <p className="text-gray-700 mb-6">
                  To prepare a complete and accurate COA report, you need to gather the following documents and
                  information:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Financial Records</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Cash receipts and disbursement journals</li>
                      <li>Bank statements and reconciliations</li>
                      <li>Official receipts for all income received</li>
                      <li>Approved vouchers for all expenditures</li>
                      <li>Petty cash records</li>
                      <li>Previous financial reports</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Supporting Documents</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Approved SK Annual Investment Plan</li>
                      <li>Approved project proposals and budgets</li>
                      <li>Minutes of SK meetings related to financial decisions</li>
                      <li>Resolutions authorizing expenditures</li>
                      <li>Contracts and agreements with suppliers/service providers</li>
                      <li>Inventory of SK properties and assets</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Required Forms</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Report of Collections and Deposits (RCD)</li>
                      <li>Report of Disbursements (RD)</li>
                      <li>Registry of Appropriations and Allotments (RAA)</li>
                      <li>Registry of Allotments and Obligations (RAO)</li>
                      <li>Monthly Statement of Cash Flow</li>
                      <li>Quarterly Financial Reports</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Signatories</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>SK Treasurer (preparer)</li>
                      <li>SK Chairperson (approver)</li>
                      <li>Barangay Treasurer (reviewer/certifier)</li>
                      <li>Barangay Accountant (if applicable)</li>
                      <li>Municipal/City Accountant (for final review)</li>
                      <li>COA Representative (for acknowledgment)</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Important Note
                  </h3>
                  <p className="text-gray-700">
                    All financial documents must be original or certified true copies. Keep duplicates of all submitted
                    reports and supporting documents for your records. Ensure that all forms are properly filled out,
                    signed, and dated to avoid delays in processing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Preparation */}
          <div ref={preparationRef} id="preparation" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Report Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">
                  Preparing a COA report involves several steps. Follow this process to ensure your report is accurate
                  and compliant with COA requirements:
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preparation" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Preparation Steps
                    </TabsTrigger>
                    <TabsTrigger value="common-errors" className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Common Errors to Avoid
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preparation" className="pt-4">
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
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Gather Financial Data</h3>
                          <p className="text-gray-700">
                            Collect all financial records, receipts, vouchers, and supporting documents for the
                            reporting period. Organize them chronologically and by category (income, expenses, etc.).
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            2
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Reconcile Financial Records</h3>
                          <p className="text-gray-700">
                            Verify that all transactions are properly recorded and match supporting documents. Reconcile
                            bank statements with your cash book. Ensure that beginning balances match ending balances
                            from previous reports.
                          </p>
                        </div>

                        {/* Step 3 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            3
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Complete Required Forms</h3>
                          <p className="text-gray-700">
                            Fill out all required COA forms accurately. Ensure that all financial data is correctly
                            entered and categorized according to the prescribed chart of accounts. Double-check all
                            calculations to avoid mathematical errors.
                          </p>
                        </div>

                        {/* Step 4 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            4
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Prepare Financial Statements</h3>
                          <p className="text-gray-700">
                            Create the required financial statements, including the Statement of Financial Position
                            (Balance Sheet), Statement of Financial Performance (Income Statement), and Statement of
                            Cash Flows.
                          </p>
                        </div>

                        {/* Step 5 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            5
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Attach Supporting Documents</h3>
                          <p className="text-gray-700">
                            Organize and attach all supporting documents required by COA. This includes receipts,
                            vouchers, resolutions, and other documentation that substantiates the financial
                            transactions.
                          </p>
                        </div>

                        {/* Step 6 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            6
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Review and Verify</h3>
                          <p className="text-gray-700">
                            Thoroughly review the entire report for accuracy, completeness, and compliance with COA
                            requirements. Have another SK official, preferably the Chairperson, review the report before
                            submission.
                          </p>
                        </div>

                        {/* Step 7 */}
                        <div className="ml-12 relative">
                          <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                            7
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-blue-700">Obtain Required Signatures</h3>
                          <p className="text-gray-700">
                            Secure all required signatures from the appropriate officials, including the SK Treasurer,
                            SK Chairperson, and Barangay Treasurer. Ensure that all signatories understand the content
                            of the report.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="common-errors" className="pt-4">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Avoid these common errors when preparing your COA report to prevent rejection or audit findings:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h3 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Mathematical Errors
                          </h3>
                          <p className="text-gray-700">
                            Incorrect addition, subtraction, or calculation of totals. Always double-check all
                            calculations and use accounting software when possible to minimize errors.
                          </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h3 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Missing Supporting Documents
                          </h3>
                          <p className="text-gray-700">
                            Failure to attach required receipts, vouchers, or other supporting documents. Ensure all
                            transactions are properly documented with original receipts.
                          </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h3 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Inconsistent Information
                          </h3>
                          <p className="text-gray-700">
                            Discrepancies between different sections of the report or between the report and supporting
                            documents. Ensure all information is consistent throughout the report.
                          </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h3 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Improper Classification
                          </h3>
                          <p className="text-gray-700">
                            Incorrectly categorizing expenses or revenues. Use the prescribed chart of accounts and
                            ensure all transactions are properly classified.
                          </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h3 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Incomplete Signatures
                          </h3>
                          <p className="text-gray-700">
                            Missing signatures from required officials. Ensure all required signatories have reviewed
                            and signed the report before submission.
                          </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h3 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Late Submission
                          </h3>
                          <p className="text-gray-700">
                            Failing to submit the report by the deadline. Mark submission deadlines on your calendar and
                            prepare reports well in advance.
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mt-4">
                        <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                          Pro Tip
                        </h3>
                        <p className="text-gray-700">
                          Consider using accounting software specifically designed for government accounting to minimize
                          errors and streamline the report preparation process. Many local government units provide
                          access to such software for SK officials.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Submission Process */}
          <div ref={submissionRef} id="submission-process" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Submission Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  Once your COA report is prepared, follow these steps to properly submit it to the appropriate
                  authorities:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Internal Review Process</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>Submit the report to the SK Chairperson for initial review and approval</li>
                      <li>Present the report to the SK Council during a formal meeting for transparency</li>
                      <li>
                        Submit the approved report to the Barangay Treasurer for review and certification of accuracy
                      </li>
                      <li>
                        If required, have the Municipal/City Accountant review the report for compliance with accounting
                        standards
                      </li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">External Submission</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>
                        Prepare the required number of copies of the report (typically three: one for COA, one for the
                        LGU, and one for SK records)
                      </li>
                      <li>Submit the report to the designated COA office in your jurisdiction</li>
                      <li>Obtain an acknowledgment receipt or stamped copy as proof of submission</li>
                      <li>
                        File a copy of the report and the acknowledgment receipt in your SK records for future reference
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border mb-6">
                  <h3 className="font-semibold mb-3 text-lg">Required Submission Format</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-blue-700">Physical Submission</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Printed on legal-sized paper (8.5" x 14")</li>
                        <li>Bound or fastened securely with a table of contents</li>
                        <li>All pages must be numbered consecutively</li>
                        <li>Supporting documents must be properly labeled and organized</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-blue-700">Electronic Submission (if applicable)</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>PDF format with searchable text</li>
                        <li>File size should not exceed 10MB per document</li>
                        <li>Follow the prescribed file naming convention</li>
                        <li>Submit through the official COA electronic submission portal</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Important Reminders
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>
                      Always obtain a receipt or acknowledgment of your submission as proof that you've complied with
                      the requirement
                    </li>
                    <li>
                      Keep a copy of all submitted reports and supporting documents for your records and for future
                      reference
                    </li>
                    <li>Be prepared to respond to any queries or clarifications requested by COA after submission</li>
                    <li>
                      If there are any errors discovered after submission, file an amended report as soon as possible
                      with a written explanation
                    </li>
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
                  Meeting COA report deadlines is crucial to avoid audit findings and penalties. Mark these important
                  dates on your calendar:
                </p>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      Monthly Reports
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Report of Collections and Deposits (RCD):</span> Within 10 days
                        after the end of each month
                      </li>
                      <li>
                        <span className="font-medium">Report of Disbursements (RD):</span> Within 10 days after the end
                        of each month
                      </li>
                      <li>
                        <span className="font-medium">Monthly Statement of Cash Flow:</span> Within 15 days after the
                        end of each month
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      Quarterly Reports
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Quarterly Financial Reports:</span> Within 30 days after the end
                        of each quarter
                      </li>
                      <li>
                        <span className="font-medium">Quarterly Physical Report of Operations:</span> Within 30 days
                        after the end of each quarter
                      </li>
                      <li>
                        <span className="font-medium">Quarterly Report of SK Fund Utilization:</span> Within 30 days
                        after the end of each quarter
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      Annual Reports
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Annual Financial Statements:</span> On or before February 14 of
                        the following year
                      </li>
                      <li>
                        <span className="font-medium">Annual Report of SK Fund Utilization:</span> On or before February
                        28 of the following year
                      </li>
                      <li>
                        <span className="font-medium">Annual Inventory of SK Properties:</span> On or before January 31
                        of the following year
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Consequences of Late Submission
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Failure to submit COA reports on time may result in the following:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Issuance of a Notice of Suspension or Disallowance</li>
                    <li>Administrative sanctions against responsible officials</li>
                    <li>Withholding of subsequent fund releases</li>
                    <li>Negative audit findings in the Annual Audit Report</li>
                    <li>Potential legal liability under RA 3019 (Anti-Graft and Corrupt Practices Act)</li>
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
                  Watch this step-by-step video tutorial on how to prepare and submit a COA report for SK officials:
                </p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=720&width=1280"
                        alt="COA Report Tutorial Video Thumbnail"
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
                      title="COA Report Tutorial Video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Video: COA Report Preparation Guide for SK Officials
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Video Contents:</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Introduction to COA reporting requirements for SK</li>
                    <li>Step-by-step guide to gathering financial documents</li>
                    <li>How to complete each required form</li>
                    <li>Tips for organizing supporting documents</li>
                    <li>Common mistakes to avoid</li>
                    <li>Proper submission process</li>
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
                      Who is responsible for preparing the COA report in the SK?
                    </h3>
                    <p className="text-gray-700">
                      The SK Treasurer is primarily responsible for preparing the COA report, with oversight from the SK
                      Chairperson. However, it's a collaborative effort that may involve other SK officials and the
                      Barangay Treasurer for guidance and review.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What happens if there are errors in our submitted COA report?
                    </h3>
                    <p className="text-gray-700">
                      If errors are discovered after submission, you should file an amended report as soon as possible
                      with a written explanation of the corrections made. Depending on the nature of the errors, COA may
                      issue a Notice of Suspension or Disallowance, which requires a written explanation and
                      rectification.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      Can we use digital or electronic records for our COA reports?
                    </h3>
                    <p className="text-gray-700">
                      Yes, many COA offices now accept electronic submissions of reports. However, you should confirm
                      with your local COA office about their specific requirements for electronic submission. Even with
                      electronic submission, you should maintain physical copies of all supporting documents.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      How long should we keep copies of our COA reports and supporting documents?
                    </h3>
                    <p className="text-gray-700">
                      COA regulations require that financial records and reports be kept for at least 10 years. However,
                      it's good practice to maintain these records throughout the term of the SK officials and transfer
                      them properly to the next set of officials for continuity and reference.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What if we don't have any financial transactions for a particular period?
                    </h3>
                    <p className="text-gray-700">
                      Even if there are no financial transactions for a particular period, you are still required to
                      submit a "negative report" or a report indicating zero transactions. This demonstrates compliance
                      with reporting requirements and provides documentation that no financial activities occurred
                      during that period.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      Can we get assistance in preparing our COA reports?
                    </h3>
                    <p className="text-gray-700">
                      Yes, you can seek assistance from the Barangay Treasurer, Municipal/City Accountant, or the local
                      COA office. Many local government units also offer training programs for SK officials on financial
                      management and reporting. Additionally, the Department of the Interior and Local Government (DILG)
                      provides resources and guidance for SK financial management.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What are the most common audit findings for SK financial reports?
                    </h3>
                    <p className="text-gray-700">
                      Common audit findings include incomplete documentation, mathematical errors, improper
                      classification of expenses, lack of proper authorization for disbursements, late submission of
                      reports, and non-compliance with procurement regulations. Being aware of these common issues can
                      help you avoid them in your own reporting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Need Assistance Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Need Assistance?</h2>
            <p className="mb-4">For more information about COA reporting requirements for SK officials, you can:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-700">Contact Information</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="font-medium">COA Hotline:</span>
                    <span>(02) 8931-7592</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>citizen.desk@coa.gov.ph</span>
                  </li>
                  <li>
                    <Link
                      href="https://www.coa.gov.ph"
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit the COA website
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-700">Additional Resources</h3>
                <ul className="space-y-2">
                  <li>Visit your local COA Regional Office</li>
                  <li>Consult with your Municipal/City Accountant</li>
                  <li>Attend COA training seminars for government officials</li>
                  <li>Download COA circulars and guidelines from the official website</li>
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
                    COA Report Template for SK Officials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    COA Circular on SK Financial Reporting
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    SK Financial Management Handbook
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
