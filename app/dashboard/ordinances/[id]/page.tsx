"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getOrdinanceById, getResolutionById } from "@/lib/ordinance-service"

export default function OrdinancePage() {
  const params = useParams()
  const router = useRouter()
  const ordinanceId = params.id as string
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isResolution = ordinanceId.startsWith("resolution-")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let data

        if (isResolution) {
          // Extract the resolution number from the ID
          const resolutionNo = ordinanceId.replace("resolution-", "")
          data = await getResolutionById(resolutionNo)

          if (data) {
            // Format the data to match our component's expectations
            setDocument({
              id: data.resolution_no,
              title: data.title,
              description: data.description,
              author: data.author || "Unknown Author",
              authorImage: data.img || "/placeholder.svg?height=200&width=200",
              sponsors: data.sponsors || [],
              date: data.date,
              dateEnacted: data.date_enact,
              pdfUrl: data.pdf || "/sample-ordinance.pdf",
              isResolution: true,
            })
          }
        } else {
          // It's an ordinance
          data = await getOrdinanceById(ordinanceId)

          if (data) {
            // Format the data to match our component's expectations
            setDocument({
              id: data.ordinance_no,
              title: data.title,
              description: data.description,
              author: data.author || "Unknown Author",
              authorImage: data.img || "/placeholder.svg?height=200&width=200",
              sponsors: data.sponsors || [],
              date: data.date,
              dateEnacted: data.date_enact,
              pdfUrl: data.pdf || "/sample-ordinance.pdf",
              isResolution: false,
            })
          }
        }

        if (!data) {
          setError("Document not found")
        }
      } catch (err) {
        console.error("Error fetching document:", err)
        setError("Failed to load document. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ordinanceId, isResolution])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">{error || "Document Not Found"}</h1>
        <p>The document you are looking for does not exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const documentType = document.isResolution ? "Resolution" : "Ordinance"

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner with Overlay */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image src="/SK-banner.png" alt="Legislative Background" fill className="object-cover brightness-50" priority />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <h2 className="text-lg md:text-xl font-medium text-sky-300 mb-2">LEGISLATIVE ISSUANCES</h2>
          <h1 className="text-2xl md:text-4xl font-bold text-center px-4">
            {documentType.toUpperCase()} NO. {document.id}
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back to {document.isResolution ? "resolutions" : "ordinances"}
        </Button>

        <div className="bg-white shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Document Details */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-sky-600 mb-2">
                {documentType.toUpperCase()} NO. {document.id}
              </h2>
              <p className="text-gray-700 mb-6">{document.title}</p>

              <Separator className="my-6" />

              {/* Author Image */}
              <div className="flex justify-center mb-6">
                <Image
                  src={document.authorImage || "/placeholder.svg"}
                  alt={document.author}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>

              {/* Document Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Author(s)/Sponsor(s):</h3>
                  <p className="text-gray-800">
                    {document.author}
                    {document.sponsors && document.sponsors.length > 0 && <span>, {document.sponsors.join(", ")}</span>}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date:</h3>
                  <p className="text-gray-800">{document.date}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Enacted:</h3>
                  <p className="text-gray-800">{document.dateEnacted}</p>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-8">
                <Button
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700"
                  onClick={() => window.open(document.pdfUrl, "_blank")}
                >
                  <Download size={18} />
                  Click to download
                </Button>
              </div>
            </div>

            {/* Right Column - PDF Viewer */}
            <div className="bg-gray-100 p-4 min-h-[500px] flex items-center justify-center">
              <iframe
                src={`${document.pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full h-[600px] border border-gray-300"
                title={`${documentType} ${document.id} PDF`}
              >
                <p>Your browser does not support iframes. Please download the PDF to view it.</p>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
