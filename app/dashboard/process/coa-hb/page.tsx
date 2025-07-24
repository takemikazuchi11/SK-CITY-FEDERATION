"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BookOpen, CheckCircle, HelpCircle, Users, ClipboardList, ExternalLink, Download, Play, AlertTriangle, FileQuestion, BarChart, Calculator, Landmark, FileCheck, Clock } from 'lucide-react'
import SK from "@/public/SK-Logo.jpg"
import CALAP from "@/public/calap.png"

export default function COAHandbookPage() {
  const [activeTab, setActiveTab] = useState("purpose")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Refs for scroll navigation
  const whatIsRef = useRef<HTMLDivElement>(null)
  const purposeRef = useRef<HTMLDivElement>(null)
  const keyComponentsRef = useRef<HTMLDivElement>(null)
  const howToUseRef = useRef<HTMLDivElement>(null)
  const accountingProceduresRef = useRef<HTMLDivElement>(null)
  const reportingRequirementsRef = useRef<HTMLDivElement>(null)
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
        <h1 className="text-3xl font-bold mb-2">COA Handbook for SK</h1>
        <p className="text-gray-600 mb-8">
          A comprehensive guide to the Commission on Audit Handbook for Sangguniang Kabataan officials
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
                What Is COA Handbook?
              </button>

              <button
                onClick={() => scrollToSection(purposeRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Purpose and Importance
              </button>

              <button
                onClick={() => scrollToSection(keyComponentsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Key Components
              </button>

              <button
                onClick={() => scrollToSection(howToUseRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                How To Use
              </button>

              <button
                onClick={() => scrollToSection(accountingProceduresRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Accounting Procedures
              </button>

              <button
                onClick={() => scrollToSection(reportingRequirementsRef)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center text-blue-600"
              >
                <BarChart className="h-4 w-4 mr-2" />
                Reporting Requirements
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
          {/* What Is COA Handbook? */}
          <div ref={whatIsRef} id="what-is" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  What Is COA Handbook?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <p className="text-gray-700 mb-4">
                      The <strong>Commission on Audit (COA) Handbook for Sangguniang Kabataan</strong> is an official
                      guide developed by the Commission on Audit specifically for SK officials. It provides
                      comprehensive guidelines on financial management, accounting procedures, auditing requirements, and
                      reporting standards that SK officials must follow in managing public funds.
                    </p>
                    <p className="text-gray-700 mb-4">
                      This handbook serves as the authoritative reference for SK treasurers, chairpersons, and other
                      officials involved in financial transactions. It outlines the legal framework, accounting
                      principles, and procedural requirements for proper financial governance in accordance with
                      Philippine laws and regulations.
                    </p>
                    <p className="text-gray-700">
                      Understanding and following the COA Handbook is essential for SK officials to ensure transparency,
                      accountability, and compliance with government auditing standards in the management of SK funds.
                    </p>
                  </div>
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="COA Handbook Cover"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        COA Handbook for Sangguniang Kabataan
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <Landmark className="h-5 w-5 mr-2" />
                    Legal Basis
                  </h3>
                  <p className="text-gray-700 mb-2">
                    The COA Handbook for SK is based on the following legal frameworks:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Republic Act No. 10742 (Sangguniang Kabataan Reform Act of 2015)</li>
                    <li>COA Circular No. 2012-001 (Revised Guidelines for the Prevention and Disallowance of Irregular, Unnecessary, Excessive, Extravagant, and Unconscionable Expenditures)</li>
                    <li>COA Circular No. 2013-002 (Prescribing the Adoption of the Revised Chart of Accounts for Local Government Units)</li>
                    <li>Local Government Code of 1991 (Republic Act No. 7160)</li>
                    <li>Other relevant COA issuances and circulars</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purpose and Importance */}
          <div ref={purposeRef} id="purpose" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Purpose and Importance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The COA Handbook serves several critical purposes for SK officials and plays a vital role in ensuring
                  proper governance:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Ensures Compliance</h3>
                    </div>
                    <p className="text-gray-700">
                      The handbook ensures that SK officials comply with government accounting rules, auditing
                      standards, and financial reporting requirements. It helps officials avoid audit findings,
                      disallowances, and potential legal issues by providing clear guidelines on proper financial
                      management.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Promotes Transparency</h3>
                    </div>
                    <p className="text-gray-700">
                      By following standardized accounting and reporting procedures, SK officials can maintain
                      transparency in financial transactions. This builds trust with constituents and demonstrates
                      responsible stewardship of public funds allocated to youth development programs.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <Calculator className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Standardizes Procedures</h3>
                    </div>
                    <p className="text-gray-700">
                      The handbook establishes uniform accounting procedures, documentation requirements, and reporting
                      formats across all SK units nationwide. This standardization ensures consistency in financial
                      management practices and facilitates easier consolidation and review of financial reports.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 p-2 rounded-full text-white mr-3">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-blue-700">Serves as a Reference</h3>
                    </div>
                    <p className="text-gray-700">
                      The handbook functions as a comprehensive reference that SK officials can consult when faced with
                      questions about financial procedures, documentation requirements, or reporting obligations. It
                      provides clear guidance for both routine and special financial transactions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Why It Matters
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Proper understanding and implementation of the COA Handbook is crucial because:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      <span className="font-medium">Personal Liability:</span> SK officials can be held personally
                      liable for disallowed expenditures and financial irregularities if proper procedures are not
                      followed.
                    </li>
                    <li>
                      <span className="font-medium">Fund Utilization:</span> The handbook ensures that SK funds are
                      properly utilized for their intended purposes, maximizing the impact of youth development
                      programs.
                    </li>
                    <li>
                      <span className="font-medium">Audit Readiness:</span> Following the handbook prepares SK officials
                      for regular COA audits, reducing the risk of adverse audit findings.
                    </li>
                    <li>
                      <span className="font-medium">Good Governance:</span> Adherence to the handbook demonstrates the
                      SK's commitment to good governance principles and responsible leadership.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Components */}
          <div ref={keyComponentsRef} id="key-components" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Key Components
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The COA Handbook for SK contains several key components that SK officials should be familiar with:
                </p>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="purpose" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Budget Management
                    </TabsTrigger>
                    <TabsTrigger value="accounting" className="flex items-center">
                      <Calculator className="h-4 w-4 mr-2" />
                      Accounting System
                    </TabsTrigger>
                    <TabsTrigger value="reporting" className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Reporting Guidelines
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="purpose" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Budget Management</h3>
                      <p className="text-gray-700">
                        The handbook provides comprehensive guidelines on SK budget preparation, approval, execution, and
                        monitoring:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Budget Preparation</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Annual Investment Plan (AIP) development</li>
                            <li>Budget proposal templates and formats</li>
                            <li>Timeline for budget preparation</li>
                            <li>Required supporting documents</li>
                            <li>Participatory budgeting guidelines</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Budget Approval Process</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>SK Council deliberation procedures</li>
                            <li>Barangay Council review requirements</li>
                            <li>Municipal/City review process</li>
                            <li>Budget resolution templates</li>
                            <li>Documentation of approval process</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Budget Execution</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Proper fund disbursement procedures</li>
                            <li>Required signatories for financial transactions</li>
                            <li>Procurement guidelines specific to SK</li>
                            <li>Cash advance and liquidation procedures</li>
                            <li>Budget realignment protocols</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Budget Monitoring</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Budget utilization tracking methods</li>
                            <li>Financial performance indicators</li>
                            <li>Variance analysis procedures</li>
                            <li>Regular budget review requirements</li>
                            <li>Year-end budget evaluation</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg mt-4">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Best Practices
                        </h4>
                        <p className="text-gray-700">
                          The handbook emphasizes these budget management best practices:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
                          <li>Align budget with SK development plan priorities</li>
                          <li>Ensure at least 10% allocation for training and capacity building</li>
                          <li>Maintain proper documentation for all budget-related decisions</li>
                          <li>Conduct regular budget performance reviews</li>
                          <li>Practice transparency by making budget information accessible to constituents</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="accounting" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Accounting System</h3>
                      <p className="text-gray-700">
                        The handbook outlines the accounting system that SK officials must implement:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Chart of Accounts</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Standardized account codes for SK transactions</li>
                            <li>Asset classification and recording</li>
                            <li>Liability recognition and accounting</li>
                            <li>Revenue and expense categorization</li>
                            <li>Equity accounts management</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Books of Accounts</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Cash receipts journal maintenance</li>
                            <li>Cash disbursements journal requirements</li>
                            <li>General journal for adjusting entries</li>
                            <li>General ledger management</li>
                            <li>Subsidiary ledgers for specific accounts</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Transaction Documentation</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Required supporting documents for receipts</li>
                            <li>Disbursement voucher preparation</li>
                            <li>Purchase order and request documentation</li>
                            <li>Payroll preparation guidelines</li>
                            <li>Inventory and asset documentation</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Internal Controls</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Segregation of duties requirements</li>
                            <li>Authorization protocols for transactions</li>
                            <li>Cash handling procedures</li>
                            <li>Regular reconciliation requirements</li>
                            <li>Safeguarding of assets guidelines</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                          Common Accounting Pitfalls
                        </h4>
                        <p className="text-gray-700">
                          The handbook highlights these common accounting errors to avoid:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
                          <li>Incomplete or missing supporting documents</li>
                          <li>Improper classification of expenses</li>
                          <li>Failure to record transactions promptly</li>
                          <li>Inadequate segregation of duties</li>
                          <li>Lack of regular reconciliation of accounts</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reporting" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-700">Reporting Guidelines</h3>
                      <p className="text-gray-700">
                        The handbook provides detailed guidance on financial reporting requirements:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Financial Statements</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Statement of Financial Position (Balance Sheet)</li>
                            <li>Statement of Financial Performance (Income Statement)</li>
                            <li>Statement of Cash Flows</li>
                            <li>Statement of Changes in Net Assets/Equity</li>
                            <li>Notes to Financial Statements</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Performance Reports</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Physical and Financial Plan implementation reports</li>
                            <li>Program/Project/Activity accomplishment reports</li>
                            <li>Performance indicators and metrics</li>
                            <li>Outcome and impact assessment</li>
                            <li>Beneficiary documentation</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Reporting Periods</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Monthly financial reports</li>
                            <li>Quarterly budget utilization reports</li>
                            <li>Semi-annual performance reports</li>
                            <li>Annual financial statements</li>
                            <li>End-of-term accountability reports</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Submission Requirements</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Required signatories for reports</li>
                            <li>Submission deadlines for various reports</li>
                            <li>Proper channels for report submission</li>
                            <li>Number of copies required</li>
                            <li>Electronic submission protocols</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mt-4">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Reporting Timeline
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-blue-100">
                                <th className="py-2 px-4 border-b text-left">Report Type</th>
                                <th className="py-2 px-4 border-b text-left">Frequency</th>
                                <th className="py-2 px-4 border-b text-left">Deadline</th>
                                <th className="py-2 px-4 border-b text-left">Submit To</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">Financial Reports</td>
                                <td className="py-2 px-4">Monthly</td>
                                <td className="py-2 px-4">5th day of following month</td>
                                <td className="py-2 px-4">Barangay Treasurer</td>
                              </tr>
                              <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">Budget Utilization</td>
                                <td className="py-2 px-4">Quarterly</td>
                                <td className="py-2 px-4">15th day after quarter end</td>
                                <td className="py-2 px-4">Municipal Accounting Office</td>
                              </tr>
                              <tr className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">Performance Reports</td>
                                <td className="py-2 px-4">Semi-Annual</td>
                                <td className="py-2 px-4">30th day after period end</td>
                                <td className="py-2 px-4">DILG Municipal Office</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="py-2 px-4">Annual Financial Statements</td>
                                <td className="py-2 px-4">Annual</td>
                                <td className="py-2 px-4">February 15 of following year</td>
                                <td className="py-2 px-4">COA Municipal Auditor</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* How To Use */}
          <div ref={howToUseRef} id="how-to-use" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  How To Use
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The COA Handbook is designed to be a practical guide for SK officials. Here's how to effectively use
                  it in your day-to-day financial management activities:
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
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Familiarize Yourself with the Content</h3>
                      <p className="text-gray-700">
                        Begin by reading through the entire handbook to gain a comprehensive understanding of its
                        contents. Pay special attention to sections relevant to your specific role (e.g., SK Treasurer,
                        Chairperson). Take notes on key points and procedures that apply to your regular duties.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        2
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Implement the Accounting System
                      </h3>
                      <p className="text-gray-700">
                        Set up the required books of accounts and filing systems as specified in the handbook. Establish
                        proper documentation procedures for all financial transactions. Create templates for commonly
                        used forms (e.g., disbursement vouchers, purchase requests) based on the handbook's guidelines.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        3
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Use as a Reference for Transactions
                      </h3>
                      <p className="text-gray-700">
                        Consult the handbook before processing any financial transaction to ensure compliance with
                        proper procedures. Refer to specific sections when questions arise about particular types of
                        transactions, such as procurement, cash advances, or program expenditures. Use the handbook to
                        verify required supporting documents for each transaction type.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        4
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">
                        Follow Reporting Guidelines
                      </h3>
                      <p className="text-gray-700">
                        Use the handbook's reporting templates and guidelines to prepare required financial reports.
                        Create a reporting calendar based on the submission deadlines specified in the handbook. Ensure
                        all reports contain the required information and are properly reviewed before submission.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        5
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Conduct Regular Self-Audits</h3>
                      <p className="text-gray-700">
                        Use the handbook's audit guidelines to conduct regular self-assessments of your financial
                        management practices. Create a checklist based on common audit findings mentioned in the
                        handbook. Address any identified issues promptly to ensure compliance before formal audits.
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                        6
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Share Knowledge with the SK Council</h3>
                      <p className="text-gray-700">
                        Conduct orientation sessions for other SK officials using the handbook as a guide. Highlight key
                        financial management principles and procedures that all council members should understand.
                        Ensure that the entire SK council is aware of their collective responsibility for proper
                        financial management.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Practical Tips
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      <span className="font-medium">Keep it accessible:</span> Store a physical copy of the handbook in
                      your office and save a digital version on your devices for easy reference.
                    </li>
                    <li>
                      <span className="font-medium">Use bookmarks:</span> Mark frequently referenced sections for quick
                      access during your day-to-day operations.
                    </li>
                    <li>
                      <span className="font-medium">Create checklists:</span> Develop procedure checklists based on the
                      handbook for routine financial processes.
                    </li>
                    <li>
                      <span className="font-medium">Seek clarification:</span> If you encounter ambiguous guidelines,
                      contact your municipal COA auditor for clarification.
                    </li>
                    <li>
                      <span className="font-medium">Stay updated:</span> Check for updates or new circulars that may
                      supplement or modify the handbook's guidelines.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounting Procedures */}
          <div ref={accountingProceduresRef} id="accounting-procedures" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Accounting Procedures
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The COA Handbook outlines specific accounting procedures that SK officials must follow. Here are the
                  key procedures for common financial transactions:
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h3 className="font-semibold mb-4 text-lg text-blue-700">Cash Receipts Procedure</h3>

                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Issue Official Receipt</h4>
                          <p className="text-gray-700">
                            For every cash or check received, issue an official receipt (OR) from the authorized OR
                            booklet. Ensure the OR contains complete information including date, payor, amount in words
                            and figures, purpose, and authorized signature.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Record in Cash Receipts Journal</h4>
                          <p className="text-gray-700">
                            Record the receipt in the Cash Receipts Journal on the same day, indicating the OR number,
                            date, payor, nature of receipt, and amount. Classify the receipt according to the
                            appropriate account code based on the standard chart of accounts.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Deposit Collections</h4>
                          <p className="text-gray-700">
                            Deposit all collections intact to the authorized SK bank account within 24 hours or the next
                            banking day. Obtain a validated deposit slip and attach it to the duplicate copy of the OR.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Update Subsidiary Ledgers</h4>
                          <p className="text-gray-700">
                            Update the appropriate subsidiary ledgers for specific accounts affected by the transaction.
                            Ensure that the subsidiary ledger balances reconcile with the general ledger control
                            accounts.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h3 className="font-semibold mb-4 text-lg text-blue-700">Disbursement Procedure</h3>

                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Prepare Disbursement Voucher</h4>
                          <p className="text-gray-700">
                            Complete a Disbursement Voucher (DV) for each payment, ensuring all required information is
                            provided. The DV must indicate the payee, date, amount, purpose, accounting classification,
                            and supporting documents attached.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Attach Supporting Documents</h4>
                          <p className="text-gray-700">
                            Attach all required supporting documents to the DV, which may include:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
                            <li>Approved purchase request</li>
                            <li>Canvass sheets/price quotations</li>
                            <li>Purchase order</li>
                            <li>Inspection and acceptance report</li>
                            <li>Official receipts or sales invoices</li>
                            <li>Delivery receipts</li>
                            <li>Approved contracts (for services)</li>
                            <li>Other relevant documentation</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Secure Proper Approvals</h4>
                          <p className="text-gray-700">
                            Route the DV for review and approval by authorized officials. Typically, this includes:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
                            <li>Certification of availability of funds by the SK Treasurer</li>
                            <li>Approval by the SK Chairperson</li>
                            <li>Countersignature by the Barangay Treasurer (if required)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Issue Check or Cash Payment</h4>
                          <p className="text-gray-700">
                            Prepare the check or cash payment based on the approved DV. For check payments, ensure that
                            authorized signatories sign the check. For cash payments, have the payee acknowledge receipt
                            by signing on the DV.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          5
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Record in Cash Disbursements Journal</h4>
                          <p className="text-gray-700">
                            Record the disbursement in the Cash Disbursements Journal, indicating the DV number, check
                            number (if applicable), date, payee, purpose, and amount. Classify the disbursement
                            according to the appropriate expense account code.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          6
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">File Documentation</h4>
                          <p className="text-gray-700">
                            File the DV with all supporting documents in sequential order by DV number. Maintain a
                            separate file for paid DVs for easy reference during audits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h3 className="font-semibold mb-4 text-lg text-blue-700">Procurement Procedure</h3>

                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Prepare Purchase Request</h4>
                          <p className="text-gray-700">
                            Complete a Purchase Request (PR) form detailing the items or services needed, specifications,
                            estimated cost, and purpose. Ensure the PR is signed by the requesting official and approved
                            by the SK Chairperson.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Conduct Canvass/Request for Quotation</h4>
                          <p className="text-gray-700">
                            For purchases above a certain threshold (typically ₱50,000), obtain at least three price
                            quotations from different suppliers. Document these quotations on a canvass sheet or through
                            formal Request for Quotation forms.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Evaluate Quotations and Select Supplier</h4>
                          <p className="text-gray-700">
                            Evaluate the quotations based on price, quality, delivery time, and other relevant factors.
                            Document the selection process and justification for the chosen supplier, especially if the
                            lowest price was not selected.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Issue Purchase Order</h4>
                          <p className="text-gray-700">
                            Prepare a Purchase Order (PO) for the selected supplier, detailing the items or services to
                            be provided, quantities, unit prices, total amount, delivery terms, and payment terms.
                            Ensure the PO is approved by authorized officials.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          5
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Receive and Inspect Goods/Services</h4>
                          <p className="text-gray-700">
                            Upon delivery, inspect the goods or services to ensure they meet the specifications and
                            quality requirements. Complete an Inspection and Acceptance Report (IAR) documenting the
                            results of the inspection.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          6
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Process Payment</h4>
                          <p className="text-gray-700">
                            Process payment following the disbursement procedure, attaching all procurement
                            documentation (PR, canvass sheets, PO, IAR, delivery receipts, and supplier's invoice) to
                            the Disbursement Voucher.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Common Audit Findings to Avoid
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      <span className="font-medium">Splitting of purchases</span> to circumvent procurement
                      requirements for larger amounts
                    </li>
                    <li>
                      <span className="font-medium">Incomplete supporting documents</span> attached to disbursement
                      vouchers
                    </li>
                    <li>
                      <span className="font-medium">Lack of proper signatures</span> on financial documents
                    </li>
                    <li>
                      <span className="font-medium">Improper recording</span> of transactions in the books of accounts
                    </li>
                    <li>
                      <span className="font-medium">Delayed deposit</span> of collections to the authorized bank account
                    </li>
                    <li>
                      <span className="font-medium">Inadequate documentation</span> of bidding or canvassing process
                    </li>
                    <li>
                      <span className="font-medium">Improper use of funds</span> for purposes not aligned with approved
                      SK plans and budgets
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reporting Requirements */}
          <div ref={reportingRequirementsRef} id="reporting-requirements" className="scroll-mt-24">
            <Card>
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Reporting Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-6">
                  The COA Handbook specifies various reporting requirements that SK officials must comply with. These
                  reports are essential for transparency, accountability, and proper monitoring of SK funds:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-3">Financial Reports</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Trial Balance</span>
                          <span className="text-sm text-gray-600">Monthly, due by the 5th day of the following month</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Statement of Financial Position</span>
                          <span className="text-sm text-gray-600">Quarterly, due 15 days after the quarter ends</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Statement of Financial Performance</span>
                          <span className="text-sm text-gray-600">Quarterly, due 15 days after the quarter ends</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Statement of Cash Flows</span>
                          <span className="text-sm text-gray-600">Quarterly, due 15 days after the quarter ends</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Notes to Financial Statements</span>
                          <span className="text-sm text-gray-600">Quarterly, due 15 days after the quarter ends</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-3">Budget and Utilization Reports</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Annual Investment Plan</span>
                          <span className="text-sm text-gray-600">Annual, due by November 30 of preceding year</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">SK Budget</span>
                          <span className="text-sm text-gray-600">Annual, due by December 31 of preceding year</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Quarterly Physical and Financial Plan</span>
                          <span className="text-sm text-gray-600">Quarterly, due 15 days before the quarter starts</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Budget Utilization Report</span>
                          <span className="text-sm text-gray-600">Quarterly, due 15 days after the quarter ends</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Report of Obligations</span>
                          <span className="text-sm text-gray-600">Monthly, due by the 5th day of the following month</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-3">Performance Reports</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Program/Project/Activity Accomplishment Report</span>
                          <span className="text-sm text-gray-600">Monthly, due by the 10th day of the following month</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Semi-Annual Performance Report</span>
                          <span className="text-sm text-gray-600">Semi-Annual, due 30 days after the period ends</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Annual Performance Report</span>
                          <span className="text-sm text-gray-600">Annual, due by January 31 of the following year</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Beneficiary Documentation</span>
                          <span className="text-sm text-gray-600">Per project, due within 15 days after project completion</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-3">Inventory and Asset Reports</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Report of Physical Count of Inventories</span>
                          <span className="text-sm text-gray-600">Semi-Annual, due 30 days after the period ends</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Report of Physical Count of Property, Plant and Equipment</span>
                          <span className="text-sm text-gray-600">Annual, due by January 31 of the following year</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Inventory and Inspection Report of Unserviceable Property</span>
                          <span className="text-sm text-gray-600">As needed, prior to disposal of assets</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Property Transfer Report</span>
                          <span className="text-sm text-gray-600">As needed, within 5 days after transfer</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border mb-6">
                  <h3 className="font-semibold mb-4 text-lg">Report Submission Process</h3>

                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Prepare the Report</h4>
                        <p className="text-gray-700">
                          Complete the report using the prescribed format and ensure all required information is
                          included. Verify the accuracy of all figures and ensure consistency across related reports.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Secure Required Signatures</h4>
                        <p className="text-gray-700">
                          Obtain signatures from all required officials, typically including the SK Treasurer (preparer),
                          SK Chairperson (approver), and other officials as specified in the handbook.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Submit to Proper Authorities</h4>
                        <p className="text-gray-700">
                          Submit the report to the appropriate authorities as specified in the handbook. This may include
                          the Barangay Treasurer, Municipal Accountant, COA Auditor, or other designated officials.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">Obtain Acknowledgment Receipt</h4>
                        <p className="text-gray-700">
                          Secure an acknowledgment receipt or transmittal copy as proof of submission. This is important
                          for documenting compliance with reporting requirements.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        5
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-700">File Copies for Reference</h4>
                        <p className="text-gray-700">
                          Maintain complete copies of all submitted reports, including supporting documents and
                          acknowledgment receipts, for future reference and audit purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Important Reminders
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      <span className="font-medium">Meet deadlines:</span> Late submission of reports may result in
                      administrative sanctions or delays in fund releases.
                    </li>
                    <li>
                      <span className="font-medium">Ensure accuracy:</span> Inaccurate reports may lead to audit
                      findings and potential disallowances.
                    </li>
                    <li>
                      <span className="font-medium">Maintain consistency:</span> Ensure that figures are consistent
                      across different reports covering the same period.
                    </li>
                    <li>
                      <span className="font-medium">Keep proper documentation:</span> Maintain supporting documents for
                      all reported figures and transactions.
                    </li>
                    <li>
                      <span className="font-medium">Address feedback promptly:</span> If reports are returned for
                      correction, address the issues immediately and resubmit.
                    </li>
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
                  Watch this comprehensive video tutorial on understanding and implementing the COA Handbook for SK:
                </p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=720&width=1280"
                        alt="COA Handbook Tutorial Video Thumbnail"
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
                      title="COA Handbook Tutorial Video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Video: Comprehensive Guide to the COA Handbook for SK Officials
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Video Contents:</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Introduction to the COA Handbook and its importance</li>
                    <li>Legal framework and basis for SK financial management</li>
                    <li>Step-by-step guide to SK budget preparation and execution</li>
                    <li>Proper accounting procedures for common SK transactions</li>
                    <li>How to prepare and submit required financial reports</li>
                    <li>Common audit findings and how to avoid them</li>
                    <li>Best practices for SK financial management</li>
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
                      Who is responsible for implementing the COA Handbook guidelines in the SK?
                    </h3>
                    <p className="text-gray-700">
                      While the SK Treasurer has primary responsibility for financial management and accounting
                      procedures, the entire SK Council, particularly the Chairperson, shares responsibility for proper
                      implementation of the COA Handbook guidelines. The SK Chairperson, as the head of the SK, is
                      ultimately accountable for ensuring compliance with financial regulations.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What happens if we don't follow the procedures in the COA Handbook?
                    </h3>
                    <p className="text-gray-700">
                      Failure to follow the procedures outlined in the COA Handbook may result in audit findings,
                      disallowances of expenditures, and potential personal liability for SK officials. In serious cases
                      of non-compliance, officials may face administrative or even legal sanctions. Additionally,
                      non-compliance may affect the release of future SK funds and damage the credibility of the SK
                      council.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      Can we modify the accounting procedures to suit our local context?
                    </h3>
                    <p className="text-gray-700">
                      The core accounting procedures and reporting requirements in the COA Handbook must be followed as
                      prescribed, as they are based on national standards and regulations. However, SK councils may
                      implement additional internal controls or documentation procedures that enhance (but do not
                      replace) the required processes. Any modifications should be documented and should never reduce
                      the level of control or transparency required by the handbook.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      How do we handle donations and contributions to the SK?
                    </h3>
                    <p className="text-gray-700">
                      All donations and contributions, whether in cash or in kind, must be properly documented and
                      recorded in the SK's books of accounts. Cash donations should be issued an official receipt and
                      deposited in the SK account. In-kind donations should be recorded at fair market value and
                      included in the appropriate inventory or asset records. A donation registry should be maintained,
                      and all donations must be reported in the financial statements with proper disclosures.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What should we do if we discover errors in previously submitted reports?
                    </h3>
                    <p className="text-gray-700">
                      If errors are discovered in previously submitted reports, SK officials should prepare corrected
                      reports as soon as possible. Submit a formal letter explaining the nature of the errors and the
                      corrections made, along with the revised reports. Ensure that all affected reports are corrected
                      to maintain consistency. It's important to address errors proactively rather than waiting for them
                      to be discovered during an audit, as this demonstrates good faith and responsible financial
                      management.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2 text-blue-700">
                      How long should we keep financial records and reports?
                    </h3>
                    <p className="text-gray-700">
                      Financial records, reports, and supporting documents should be kept for at least ten (10) years,
                      or as specified in the latest COA regulations. This retention period ensures that documents are
                      available for future audits, investigations, or reference. Records should be stored in a secure,
                      organized manner, protected from damage, loss, or unauthorized access. It's advisable to maintain
                      both physical and digital copies of important documents when possible.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-blue-700">
                      What training is available to help SK officials understand the COA Handbook?
                    </h3>
                    <p className="text-gray-700">
                      Several training opportunities are available for SK officials to better understand the COA
                      Handbook. These include: (1) DILG-sponsored SK financial management workshops, (2) COA-conducted
                      orientation sessions for newly elected SK officials, (3) Provincial/Municipal Accounting Office
                      technical assistance programs, (4) Online courses and webinars offered by government agencies and
                      partner organizations, and (5) Peer learning sessions with experienced SK officials. It's
                      recommended that all SK officials, especially the Treasurer and Chairperson, participate in these
                      training opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Need Assistance Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Need Assistance?</h2>
            <p className="mb-4">For more information about the COA Handbook for SK, you can:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-700">COA Contact Information</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="font-medium">COA Hotline:</span>
                    <span>(02) 8931-7592</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>info@coa.gov.ph</span>
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
                <h3 className="font-semibold mb-2 text-blue-700">DILG Support</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="font-medium">DILG Hotline:</span>
                    <span>(02) 8876-3454</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>youth.affairs@dilg.gov.ph</span>
                  </li>
                  <li>
                    <Link
                      href="https://www.dilg.gov.ph"
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit the DILG website
                    </Link>
                  </li>
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
                    Complete COA Handbook for SK (PDF)
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    SK Financial Report Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 underline hover:text-blue-800 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    SK Accounting Forms and Checklists
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
