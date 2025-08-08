"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface KKFormData {
  id: string
  first_name: string
  last_name: string
  gender: string
  barangay: string
  phone: string
  created_at: string
  address: string
}

export default function KKIdCardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [kkData, setKkData] = useState<KKFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    fetchKKData()
  }, [user?.email])

  const fetchKKData = async () => {
    if (!user?.email) return

    try {
      const { data, error } = await supabase
        .from("kk_registrations")
        .select("*")
        .eq("email", user.email)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching KK data:", error)
      }

      setKkData(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase()
  }

  const generateKKId = (id: string) => {
    return `${id}-2024`
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your KK ID Card...</p>
        </div>
      </div>
    )
  }

  if (!kkData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/dashboard" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-600 text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">KK Form Required</h2>
            <p className="text-gray-600 mb-6">
              Please fill up the KK form first to view your digital ID card.
            </p>
                         <Button 
               onClick={() => router.push("/dashboard/programs/kk/register")}
               className="bg-blue-600 hover:bg-blue-700"
             >
              Fill KK Form
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/dashboard" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">KK Digital ID Card</h1>
          <p className="text-gray-600">Your Katipunan ng Kabataan Identification Card</p>
        </div>

        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowBack(!showBack)}
            variant="outline"
            className="mr-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {showBack ? "Show Front" : "Show Back"}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="w-96 h-56 bg-white rounded-lg shadow-lg border-2 border-green-600 overflow-hidden">
            {!showBack ? (
              // Front Side
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="bg-green-600 text-white p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                      SK
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                      KK
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs">Republic of the Philippines</div>
                    <div className="text-sm font-bold">SANGGUNIANG KABATAAN</div>
                    <div className="text-xs">Brgy. {kkData.barangay}, Calapan City, Oriental Mindoro</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold">#DAVIESA</div>
                    <div className="text-xs">SERBISYO PARA SA KABATAAN</div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 flex">
                  {/* Photo Placeholder */}
                  <div className="w-24 h-32 bg-gray-200 rounded border-2 border-green-600 flex items-center justify-center mr-4">
                    <div className="text-gray-500 text-xs text-center">PHOTO</div>
                  </div>

                  {/* Personal Info */}
                  <div className="flex-1">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold text-green-600">KATIPUNAN NG KABATAAN IDENTIFICATION CARD</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="w-24 font-medium">Last Name:</span>
                        <span className="font-bold">{kkData.last_name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 font-medium">First Name:</span>
                        <span className="font-bold">{kkData.first_name}</span>
                      </div>
                                             <div className="flex">
                         <span className="w-24 font-medium">Sex:</span>
                         <span className="font-bold">{kkData.gender}</span>
                       </div>
                       <div className="flex">
                         <span className="w-24 font-medium">Barangay:</span>
                         <span className="font-bold">{kkData.barangay}</span>
                       </div>
                       <div className="flex">
                         <span className="w-24 font-medium">Contact:</span>
                         <span className="font-bold">{kkData.phone}</span>
                       </div>
                      <div className="flex">
                        <span className="w-24 font-medium">Date Issued:</span>
                        <span className="font-bold">{formatDate(kkData.created_at)}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="border-t border-gray-300 pt-2">
                        <span className="text-xs text-gray-500">Signature</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-green-600 text-white p-2 text-center">
                  <div className="text-sm font-bold">KK ID No: {generateKKId(kkData.id)}</div>
                </div>
              </div>
            ) : (
              // Back Side
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="bg-green-600 text-white p-3 text-center">
                  <div className="text-sm font-bold">TERMS AND CONDITIONS</div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="text-xs space-y-2 leading-tight">
                    <p><strong>1.</strong> Every holder of the Katipunan ng Kabataan (KK) ID is entitled to specific privileges and benefits for designated projects, programs, and activities organized by the Sangguniang Kabataan (SK) of Barangay {kkData.barangay}, Calapan City, Oriental Mindoro.</p>
                    
                    <p><strong>2.</strong> The KK ID serves as proof of identity within the territorial jurisdiction of Barangay {kkData.barangay} but is not recognized as a valid government-issued ID.</p>
                    
                    <p><strong>3.</strong> The ID is non-transferable and may only be utilized by the designated holder. Therefore, it cannot be shared or used by any other individual to access youth-related activities within the barangay.</p>
                    
                    <p><strong>4.</strong> The SK Officials retain the right to revoke or replace the ID in instances of misuse, damage, or failure to comply with the stipulated terms and conditions for its usage.</p>
                    
                    <p><strong>5.</strong> It is imperative to carry the ID at all times during KK assemblies or any KK events for identification purposes.</p>
                    
                    <p><strong>6.</strong> In the event of card loss, please notify the Sangguniang Kabataan of Barangay {kkData.barangay} and request a replacement.</p>
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <div className="text-xs">
                      <div className="font-bold">Address:</div>
                      <div>{kkData.address}, {kkData.barangay}, Calapan City, Oriental Mindoro</div>
                    </div>
                    <div className="text-xs mt-2">
                      <div className="font-bold">Full Name:</div>
                      <div>{kkData.first_name} {kkData.last_name}</div>
                    </div>
                                         <div className="text-xs mt-2">
                       <div className="font-bold">Contact Number:</div>
                       <div>{kkData.phone}</div>
                     </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-green-600 text-white p-2 text-center">
                  <div className="text-sm font-bold">HON. [SK CHAIRPERSON NAME]</div>
                  <div className="text-xs">SK Chairperson</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
