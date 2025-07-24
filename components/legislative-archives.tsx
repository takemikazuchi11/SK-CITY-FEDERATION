"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ChevronRight } from "lucide-react"
import { getOrdinances, getResolutions, type Ordinance, type Resolution } from "@/lib/ordinance-service"
import { AddArchivesButton } from "@/components/add-archives-modal"

export default function LegislativeArchives() {
  const [ordinances, setOrdinances] = useState<Ordinance[]>([])
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Get 3 most recent ordinances and resolutions
        const ordinanceData = await getOrdinances(3)
        const resolutionData = await getResolutions(3)

        setOrdinances(ordinanceData)
        setResolutions(resolutionData)
        setError(null)
      } catch (err) {
        console.error("Error fetching legislative data:", err)
        setError("Failed to load legislative archives. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="bg-red-600 text-white px-12 py-3 text-2xl font-bold text-center shadow-md mx-auto mb-3" style={{display: 'inline-block'}}>
            Legislative Archives
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Access official ordinances and resolutions passed by the Sangguniang Kabataan City Federation to promote
            transparency and good governance.
          </p>
        </div>

        {error && (
          <div className="text-center text-red-600 mb-8">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Ordinances Column */}
            <div className="bg-white shadow-md overflow-hidden border-t-4 border-blue-600">
              <div className="bg-blue-900 text-white py-4 px-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FileText className="mr-2" /> Ordinances
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {ordinances.length > 0 ? (
                  ordinances.map((ordinance) => (
                    <Link href={`/dashboard/ordinances/${ordinance.ordinance_no}`} key={ordinance.id}>
                      <div className="p-6 hover:bg-blue-50 transition-colors cursor-pointer h-[160px]">
                        <h4 className="font-semibold text-blue-800 mb-1">Ordinance No. {ordinance.ordinance_no}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ordinance.title}</p>
                        <p className="text-gray-500 text-sm mb-1 line-clamp-2">{ordinance.description}</p>
                        <div className="text-xs text-gray-500">{ordinance.date}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">No ordinances found</div>
                )}
              </div>
              <div className="bg-gray-50 p-4 text-right">
                <Link
                  href="/dashboard/ordinances"
                  className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
                >
                  See More Ordinances <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Resolutions Column */}
            <div className="bg-white shadow-md overflow-hidden border-t-4 border-blue-600">
              <div className="bg-blue-900 text-white py-4 px-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FileText className="mr-2" /> Resolutions
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {resolutions.length > 0 ? (
                  resolutions.map((resolution) => (
                    <Link href={`/dashboard/ordinances/resolution-${resolution.resolution_no}`} key={resolution.id}>
                      <div className="p-6 hover:bg-blue-50 transition-colors cursor-pointer h-[160px]">
                        <h4 className="font-semibold text-blue-800 mb-1">Resolution No. {resolution.resolution_no}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{resolution.title}</p>
                        <p className="text-gray-500 text-sm mb-1 line-clamp-2">{resolution.description}</p>
                        <div className="text-xs text-gray-500">{resolution.date}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">No resolutions found</div>
                )}
              </div>
              <div className="bg-gray-50 p-4 text-right">
                <Link
                  href="/dashboard/ordinances?type=resolution"
                  className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
                >
                  See More Resolutions <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Add Archives Button - Only visible to admins */}
        <div className="mt-8 flex justify-center">
          <AddArchivesButton />
        </div>
      </div>
    </section>
  )
}
