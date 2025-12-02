"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "sonner"

// Note: These asset imports need to be updated with actual file paths
// For now using placeholder paths - update these once assets are available
// import skBaliteLogo from "@/public/sk-balite-logo.png"
// import alsLogo from "@/public/als-logo.jpg"
// import daviescaLogo from "@/public/daviesca-logo.png"
// import kkIdBg from "@/public/kk-id-bg.png"
// import viescaSignature from "@/public/viesca-signature.png"

interface KKIDCardProps {
  registration: {
    first_name: string
    middle_name?: string
    last_name: string
    sitio?: string
    birthdate: string
    sex?: string
    contact_number?: string
    date_issued?: string
    kk_id_number?: string
    full_name: string
    address: string
    guardian_name?: string
    emergency_contact_number?: string
    emergency_address?: string
  }
  photoUrl?: string
}

const KKIDCard = ({
  registration,
  photoUrl
}: KKIDCardProps) => {
  const frontCardRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)

  const downloadPDF = async () => {
    if (!frontCardRef.current || !backCardRef.current) return

    try {
      // Create a new PDF document in landscape orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Capture front card
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const frontImgData = frontCanvas.toDataURL('image/png')
      const frontImgWidth = 297 // A4 width in mm (landscape)
      const frontImgHeight = (frontCanvas.height * frontImgWidth) / frontCanvas.width
      
      // Add front card to PDF
      pdf.addImage(frontImgData, 'PNG', 0, 0, frontImgWidth, frontImgHeight)

      // Add back card as a new page
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const backImgData = backCanvas.toDataURL('image/png')
      const backImgWidth = 297 // A4 width in mm (landscape)
      const backImgHeight = (backCanvas.height * backImgWidth) / backCanvas.width

      pdf.addPage()
      pdf.addImage(backImgData, 'PNG', 0, 0, backImgWidth, backImgHeight)

      // Download the PDF
      const fileName = `KK-ID-Card-${registration.full_name.replace(/\s+/g, '-')}-${registration.kk_id_number || 'PENDING'}.pdf`
      pdf.save(fileName)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>
      </div>
      {/* Front of ID Card */}
      <Card ref={frontCardRef} className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-lg">
        <div className="relative">
          {/* Header with orange background */}
          <div className="bg-[#ff5c00] text-white px-6 py-1 flex items-center justify-between">
            <div className="flex items-center gap-0">
              <img src="/calap.png" alt="Calapan Logo" className="h-20 w-20 object-contain" />
              <img src="/SK-Logo-removebg-preview.png" alt="SK Logo" className="h-20 w-20 object-contain" />
            </div>
            <div className="text-center flex-1">
              <p className="text-base font-normal text-left">Republic of the Philippines</p>
              <h2 className="text-3xl font-bold tracking-wider text-left">SANGGUNIANG KABATAAN</h2>
              <p className="text-sm text-left">Calapan City, Oriental Mindoro</p>
            </div>
            
            <div className="w-44">
              {/* Right side logo - to be updated in the future  <img src="/SK-Logo.jpg" alt="Logo" className="h-28 w-auto object-contain" />*/}
              
            </div>
          </div>

          {/* ID Content with background */}
          <div className="relative bg-gray-50 p-8" style={{
            // TODO: Add actual background image when available
            // backgroundImage: `url(/kk-id-bg.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            {/* Title */}
            <h3 className="font-black text-[#ff5c00] mb-6 tracking-wide text-3xl">
              KATIPUNAN NG KABATAAN IDENTIFICATION CARD
            </h3>

            <div className="flex gap-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-56 h-64 border-[6px] border-[#ff5c00] rounded-3xl bg-white flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt={registration.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">Photo<br />Placeholder</span>
                  )}
                </div>
                
                {/* KK ID No */}
                <div className="mt-6">
                  <p className="text-base text-gray-900 font-normal">KK ID No:</p>
                  <p className="font-bold text-[#ff5c00] mt-1 text-4xl">{registration.kk_id_number || 'PENDING'}</p>
                </div>
              </div>

              {/* ID Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Last Name</p>
                    <p className="font-bold text-gray-900 mt-1 my-[6px] text-3xl">{registration.last_name?.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-normal">First Name</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">{registration.first_name?.toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Middle Name</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">{registration.middle_name?.toUpperCase() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Birthdate</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">
                      {format(new Date(registration.birthdate), 'MM/dd/yyyy')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Sitio</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">{registration.sitio?.toUpperCase() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Sex Assigned on Birth</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">{registration.sex?.toUpperCase() || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Contact Number</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">{registration.contact_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Date Issued</p>
                    <p className="font-bold text-gray-900 mt-1 text-3xl">
                      {registration.date_issued ? format(new Date(registration.date_issued), 'MM/dd/yyyy') : format(new Date(), 'MM/dd/yyyy')}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <div className="text-center">
                    <div className="w-48 border-b-2 border-gray-900 mb-1"></div>
                    <p className="text-sm font-semibold text-gray-900">Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#ff5c00] h-4"></div>
        </div>
      </Card>

      {/* Back of ID Card */}
      <Card ref={backCardRef} className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-lg">
        <div className="relative">
          {/* Header */}
          <div className="bg-[#ff5c00] text-white px-6 py-1 flex items-center justify-between">
            <div className="flex items-center gap-0">
              <img src="/calap.png" alt="Calapan Logo" className="h-20 w-20 object-contain" />
              <img src="/SK-Logo-removebg-preview.png" alt="SK Logo" className="h-20 w-20 object-contain" />
            </div>
            <div className="text-center flex-1">
              <p className="text-base font-normal text-left">Republika ng Pilipinas</p>
              <h3 className="font-bold tracking-wider text-left text-3xl">SANGGUNIANG KABATAAN</h3>
              <p className="text-sm text-left">Calapan City, Oriental Mindoro</p>
            </div>
            <div className="w-44">
              {/* Right side logo - to be updated in the future  <img src="/SK-Logo.jpg" alt="Logo" className="h-28 w-auto object-contain" />*/}
              
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-[300px_1px_1fr] gap-8 items-start">
              {/* Left: Emergency Contact */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-900">In case of emergencies, please contact</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Name</p>
                    <p className="mt-1 font-bold text-3xl">{registration.guardian_name || ''}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Contact Number</p>
                    <p className="mt-1 text-3xl font-bold">{registration.emergency_contact_number || registration.contact_number || ''}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-900 font-normal">Address</p>
                    <p className="mt-1 text-3xl">{registration.emergency_address || registration.address || ''}</p>
                  </div>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block h-full border-l-2 border-gray-300"></div>

              {/* Right: Terms and Conditions */}
              <div>
                <h4 className="text-xl font-black text-center mb-4 text-gray-900">TERMS AND CONDITIONS</h4>
                <ol className="text-xs space-y-2 list-decimal list-outside pl-4 text-gray-900 leading-relaxed text-justify">
                  <li>Every holder of the Katipunan ng Kabataan (KK) ID is entitled to specific privileges and benefits for designated projects, programs, and activities organized by the Sangguniang Kabataan (SK) City Federation, Calapan City, Oriental Mindoro.                  </li>
                  <li>The KK ID serves as proof of identity within the territorial jurisdiction of Calapan City but is not recognized as a valid government-issued ID.</li>
                  <li>The ID is non-transferable and may only be utilized by the designated holder. Therefore, it cannot be shared or used by any other individual to access youth-related activities within the City.</li>
                  <li>The SK Officials retain the right to revoke or replace the ID in instances of misuse, damage, or failure to comply with the stipulated terms and conditions for its usage.</li>
                  <li>It is imperative to carry the ID at all times during KK assemblies or any KK events for identification purposes.</li>
                  <li>In the event of card loss, please notify the Sangguniang Kabataan City Federation and request a replacement.</li>
                </ol>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-8 text-center relative">
              {/* TODO: Replace with actual signature image when available */}
              {/* <img src="/viesca-signature.png" alt="Signature" className="h-40 w-auto mx-auto absolute left-[42%] top--5 -translate-x-1/2 -translate-y-1/2 z-0 opacity-100" /> */}
              <p className="text-xl font-black text-gray-900 relative z-10">HON. DEO P. LOPEZ</p>
              <p className="text-base font-normal text-gray-900 relative z-10">SK PRESIDENT/EX-OFFICIO SP MEMBER</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#ff5c00] h-4"></div>
        </div>
      </Card>
    </div>
  )
}

export default function KKIDCardPage() {
  const { user, loading: authLoading } = useAuth()
  const [registration, setRegistration] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegistration = async () => {
      if (authLoading) return
      
      if (!user?.email) {
        setError("Please log in to view your KK ID Card")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetch KK registration by email
        const { data, error: fetchError } = await supabase
          .from("kk_registrations")
          .select("*")
          .eq("email", user.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            // No registration found
            setError("You haven't registered for Katipunan ng Kabataan yet.")
            setRegistration(null)
          } else {
            console.error("Error fetching registration:", fetchError)
            setError("Failed to load your registration data")
          }
        } else if (data) {
          // Map database fields to ID card format
          const mappedRegistration = {
            first_name: data.first_name || "",
            middle_name: data.middle_name || "",
            last_name: data.last_name || "",
            sitio: data.barangay || "", // Using barangay as sitio for now
            birthdate: data.birth_date || "",
            sex: data.gender === "male" ? "Male" : data.gender === "female" ? "Female" : data.gender || "",
            contact_number: data.phone || "",
            date_issued: data.created_at || new Date().toISOString(),
            kk_id_number: data.id ? `KK-${data.id.slice(0, 8).toUpperCase()}` : "PENDING",
            full_name: `${data.first_name || ""} ${data.middle_name || ""} ${data.last_name || ""}`.trim(),
            address: data.address || "",
            guardian_name: (data as any).guardian_name || "",
            emergency_contact_number: (data as any).emergency_contact_number || "",
            emergency_address: (data as any).emergency_address || "",
          }
          setRegistration(mappedRegistration)
          setError(null)
        }
      } catch (err) {
        console.error("Error in fetchRegistration:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchRegistration()
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading your KK ID Card...</p>
        </div>
      </div>
    )
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              KK ID Card System
            </h1>
            <p className="text-xl text-gray-600">
              Katipunan ng Kabataan Identification Card Management
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-xl">KK ID Card Not Available</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  You don't have a KK ID Card yet because you haven't submitted your Katipunan ng Kabataan registration form.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  To get your KK ID Card, you need to:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                  <li>Complete the KK Registration form with all required information</li>
                  <li>Submit the registration form for review</li>
                  <li>Wait for approval (if required)</li>
                  <li>Once approved, your KK ID Card will be available here</li>
                </ol>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link href="/dashboard/programs/kk/register">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Go to KK Registration Form
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            KK ID Card System
          </h1>
          <p className="text-xl text-gray-600">
            Katipunan ng Kabataan Identification Card Management
          </p>
        </div>

        {/* KK ID Card Component with real data */}
        <KKIDCard 
          registration={registration}
          photoUrl={user?.photo_url || undefined}
        />
      </div>
    </div>
  )
}
