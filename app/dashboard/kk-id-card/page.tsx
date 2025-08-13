"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Construction } from "lucide-react"

export default function KKIDCardPage() {
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

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto text-center shadow-lg">
          <CardHeader className="pb-6">
            <div className="mx-auto mb-6 w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Construction className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
              Coming Soon
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-medium">In Development</span>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We're currently working on building a comprehensive KK ID Card management system 
              that will streamline the identification process for all Katipunan ng Kabataan members.
            </p>
            <p className="text-gray-500">
              This feature will include ID card generation, management, and verification capabilities.
              Stay tuned for updates!
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            For immediate assistance, please contact your SK officials or visit the main dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
