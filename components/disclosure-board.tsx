"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, FileSpreadsheet, FileCog, FileBarChart, FileCheck, FileSearch, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { AddArchivesButton } from "./add-archives-modal"
import { useLoading } from "@/lib/loading-context"

interface DisclosureUrl {
  id: number
  document_type: string
  url: string | null
  description: string | null
}

const getIconForDocumentType = (documentType: string) => {
  switch (documentType.toLowerCase()) {
    case "cbydp":
      return FileText
    case "abyip":
      return FileSpreadsheet
    case "annual budget":
      return FileCog
    default:
      return FileBarChart
  }
}

const getColorForDocumentType = (documentType: string) => {
  switch (documentType.toLowerCase()) {
    case "cbydp":
      return "text-blue-600"
    case "abyip":
      return "text-green-600"
    case "annual budget":
      return "text-purple-600"
    default:
      return "text-amber-600"
  }
}

const getButtonColorForDocumentType = (documentType: string) => {
  switch (documentType.toLowerCase()) {
    case "cbydp":
      return "bg-[#2563eb] hover:bg-[#1d4ed8]"
    case "abyip":
      return "bg-[#3b82f6] hover:bg-[#2563eb]"
    case "annual budget":
      return "bg-[#60a5fa] hover:bg-[#3b82f6]"
    default:
      return "bg-[#1e40af] hover:bg-[#1e3a8a]"
  }
}

export default function DisclosureBoard() {
  const [disclosureUrls, setDisclosureUrls] = useState<DisclosureUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    const fetchDisclosureUrls = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("disclosure_urls").select("*").order("id")

        if (error) {
          throw error
        }

        // Filter out documents without URLs
        const documentsWithUrls = data?.filter((doc) => doc.url && doc.url.trim() !== "" && doc.url !== "EMPTY") || []
        setDisclosureUrls(documentsWithUrls)
      } catch (err) {
        console.error("Error fetching disclosure URLs:", err)
        setError("Failed to load disclosure documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDisclosureUrls()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mx-auto mb-8" style={{display: 'inline-block'}}>
            SKCF Full Disclosure Board
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading disclosure documents...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mx-auto mb-8" style={{display: 'inline-block'}}>
            SKCF Full Disclosure Board
          </div>
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center">
          <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mb-8 inline-block">
            SKCF Full Disclosure Board
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <Card className="bg-[#1e3a8a] border-4 border-[#2563eb] shadow-lg relative overflow-hidden">
            {/* Board texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:20px_20px]"></div>

            {/* Pins at corners */}
            <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-[#3b82f6] shadow-md z-10"></div>
            <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#60a5fa] shadow-md z-10"></div>
            <div className="absolute bottom-4 left-4 w-5 h-5 rounded-full bg-[#93c5fd] shadow-md z-10"></div>
            <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-[#bfdbfe] shadow-md z-10"></div>

            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold relative z-10 text-white">
                Public Documents & Reports
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10">
              {disclosureUrls.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white text-lg">No disclosure documents are currently available.</p>
                  <p className="text-gray-300 text-sm mt-2">Please check back later or contact the administrator.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {disclosureUrls.map((doc, index) => {
                    const IconComponent = getIconForDocumentType(doc.document_type)
                    const iconColor = getColorForDocumentType(doc.document_type)
                    const buttonColor = getButtonColorForDocumentType(doc.document_type)
                    const rotationClass =
                      index % 3 === 0 ? "rotate-[-1deg]" : index % 3 === 1 ? "rotate-[1deg]" : "rotate-[-0.5deg]"

                    return (
                      <div
                        key={doc.id}
                        className={`bg-white p-5 rounded-md shadow-md transform ${rotationClass} hover:rotate-0 transition-transform duration-300 border border-gray-200 hover:shadow-blue-200 hover:border-blue-200`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <IconComponent className={`h-12 w-12 ${iconColor} mb-3`} />
                          <h3 className="font-bold text-lg mb-2">{doc.document_type}</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {doc.description || `${doc.document_type} Document`}
                          </p>
                          <Link
                            href={doc.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center px-4 py-2 ${buttonColor} text-white rounded-md transition-colors`}
                            onClick={() => setGlobalLoading(true)}
                          >
                            View Document
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Static documents that don't require URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Quarterly Full Disclosure Board */}
                <div className="bg-white p-5 rounded-md shadow-md transform rotate-[0.5deg] hover:rotate-0 transition-transform duration-300 border border-gray-200 hover:shadow-blue-200 hover:border-blue-200">
                  <div className="flex flex-col items-center text-center">
                    <FileBarChart className="h-12 w-12 text-amber-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Quarterly Full Disclosure</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Quarterly reports on financial transactions, projects, and activities for transparency and
                      accountability.
                    </p>
                    <Link href="#" className="text-[#1e40af] hover:text-[#1e3a8a] font-medium inline-flex items-center" onClick={() => setGlobalLoading(true)}>
                      see full details <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>

                {/* MIL */}
                <div className="bg-white p-5 rounded-md shadow-md transform rotate-[-1deg] hover:rotate-0 transition-transform duration-300 border border-gray-200 hover:shadow-blue-200 hover:border-blue-200">
                  <div className="flex flex-col items-center text-center">
                    <FileCheck className="h-12 w-12 text-red-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">MIL</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Monthly Investment and Liquidation reports detailing expenditures and financial activities.
                    </p>
                    <Link href="#" className="text-[#1d4ed8] hover:text-[#1e3a8a] font-medium inline-flex items-center" onClick={() => setGlobalLoading(true)}>
                      see full details <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>

                {/* COA reports */}
                <div className="bg-white p-5 rounded-md shadow-md transform rotate-[1deg] hover:rotate-0 transition-transform duration-300 border border-gray-200 hover:shadow-blue-200 hover:border-blue-200">
                  <div className="flex flex-col items-center text-center">
                    <FileSearch className="h-12 w-12 text-teal-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">COA Reports</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Commission on Audit reports evaluating financial compliance and management practices.
                    </p>
                    <Link href="#" className="text-[#3b82f6] hover:text-[#1e40af] font-medium inline-flex items-center" onClick={() => setGlobalLoading(true)}>
                      see full details <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
