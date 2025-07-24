"use client"

import Link from "next/link"
import { ArrowLeft, Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ContactInfo {
  name: string
  fullName: string
  category: string
  phone?: string
  email?: string
  address: string
  hours?: string
  description: string
}

const contactData: ContactInfo[] = [
  {
    name: "NYC",
    fullName: "National Youth Commission",
    category: "National Agency",
    phone: "(043) 286-8234",
    email: "nyc.mimaropa@gmail.com",
    address: "Provincial Capitol Complex, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Promotes youth development and empowerment programs",
  },
  {
    name: "COA",
    fullName: "Commission on Audit",
    category: "Constitutional Body",
    phone: "(043) 286-2156",
    email: "coa.orientalmindoro@gmail.com",
    address: "Provincial Capitol Complex, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Government auditing and financial oversight services",
  },
  {
    name: "BIR",
    fullName: "Bureau of Internal Revenue",
    category: "National Agency",
    phone: "(043) 286-2345",
    email: "bir.calapan@bir.gov.ph",
    address: "BIR Building, J.P. Rizal Street, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Tax collection and revenue services",
  },
  {
    name: "LANDBANK",
    fullName: "Land Bank of the Philippines",
    category: "Government Bank",
    phone: "(043) 286-3456",
    email: "calapan@landbank.com",
    address: "Landbank Building, Magsaysay Street, Calapan City, Oriental Mindoro",
    hours: "9:00 AM - 3:00 PM (Mon-Fri)",
    description: "Agricultural and development banking services",
  },
  {
    name: "DBP",
    fullName: "Development Bank of the Philippines",
    category: "Government Bank",
    phone: "(043) 286-4567",
    email: "calapan.branch@dbp.ph",
    address: "DBP Building, Bonifacio Street, Calapan City, Oriental Mindoro",
    hours: "9:00 AM - 3:00 PM (Mon-Fri)",
    description: "Development financing and banking services",
  },
  {
    name: "COMELEC",
    fullName: "Commission on Elections",
    category: "Constitutional Body",
    phone: "(043) 286-5678",
    email: "comelec.orientalmindoro@gmail.com",
    address: "COMELEC Office, Provincial Capitol Complex, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Election administration and voter registration services",
  },
  {
    name: "LGU",
    fullName: "Local Government Unit - Calapan City",
    category: "Local Government",
    phone: "(043) 286-7890",
    email: "lgu.calapan@gmail.com",
    address: "Calapan City Hall, Magsaysay Avenue, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Local government services and administration",
  },
  {
    name: "CITY GOV",
    fullName: "Calapan City Government",
    category: "Local Government",
    phone: "(043) 286-8901",
    email: "mayor.calapan@gmail.com",
    address: "Office of the City Mayor, Calapan City Hall, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "City executive office and administrative services",
  },
  {
    name: "SK FEDERATION",
    fullName: "Sangguniang Kabataan Federation",
    category: "Youth Organization",
    phone: "(043) 286-9012",
    email: "sk.federation.calapan@gmail.com",
    address: "SK Federation Office, Calapan City Hall, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Youth council federation and youth programs",
  },
  {
    name: "SANGGUNIAN PANGLUSOD",
    fullName: "Sangguniang Panlungsod ng Calapan",
    category: "Local Government",
    phone: "(043) 286-0123",
    email: "sanggunian.calapan@gmail.com",
    address: "Session Hall, Calapan City Hall, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "City council legislative body and ordinance creation",
  },
  {
    name: "CITY POLICE",
    fullName: "Calapan City Police Station",
    category: "Law Enforcement",
    phone: "(043) 286-1234 / 911",
    email: "calapan.police@pnp.gov.ph",
    address: "Calapan City Police Station, J.P. Rizal Street, Calapan City, Oriental Mindoro",
    hours: "24/7 Emergency Services",
    description: "Law enforcement and public safety services",
  },
  {
    name: "BFP CALAPAN",
    fullName: "Bureau of Fire Protection - Calapan",
    category: "Emergency Services",
    phone: "(043) 286-2345 / 911",
    email: "bfp.calapan@bfp.gov.ph",
    address: "BFP Calapan Fire Station, Magsaysay Avenue, Calapan City, Oriental Mindoro",
    hours: "24/7 Emergency Services",
    description: "Fire prevention, suppression, and emergency response",
  },
  {
    name: "CITY HEALTH",
    fullName: "Calapan City Health Office",
    category: "Health Services",
    phone: "(043) 286-3456",
    email: "health.calapan@gmail.com",
    address: "City Health Office, Calapan City Hall Complex, Calapan City, Oriental Mindoro",
    hours: "8:00 AM - 5:00 PM (Mon-Fri)",
    description: "Public health services and medical assistance programs",
  },
  {
    name: "CDRRMO",
    fullName: "City Disaster Risk Reduction and Management Office",
    category: "Emergency Services",
    phone: "(043) 286-4567 / 911",
    email: "cdrrmo.calapan@gmail.com",
    address: "CDRRMO Office, Calapan City Hall Complex, Calapan City, Oriental Mindoro",
    hours: "24/7 Emergency Response",
    description: "Disaster preparedness, response, and risk reduction management",
  },
]

const categoryColors = {
  "National Agency": "bg-blue-100 text-blue-800",
  "Constitutional Body": "bg-purple-100 text-purple-800",
  "Government Bank": "bg-green-100 text-green-800",
  "Local Government": "bg-orange-100 text-orange-800",
  "Youth Organization": "bg-pink-100 text-pink-800",
  "Law Enforcement": "bg-red-100 text-red-800",
  "Emergency Services": "bg-red-100 text-red-800",
  "Health Services": "bg-teal-100 text-teal-800",
}

export default function ContactPage() {
  const categories = Array.from(new Set(contactData.map((contact) => contact.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-2 text-gray-600">
              Get in touch with government departments and agencies in Calapan City, Oriental Mindoro
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  const element = document.getElementById(category.replace(/\s+/g, "-").toLowerCase())
                  element?.scrollIntoView({ behavior: "smooth" })
                }}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Cards by Category */}
        {categories.map((category) => (
          <div key={category} id={category.replace(/\s+/g, "-").toLowerCase()} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-200 pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactData
                .filter((contact) => contact.category === category)
                .map((contact, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900">{contact.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{contact.fullName}</p>
                        </div>
                        <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                          {contact.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">{contact.description}</p>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        {contact.phone && (
                          <div className="flex items-start space-x-3">
                            <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Phone</p>
                              <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                        )}

                        {contact.email && (
                          <div className="flex items-start space-x-3">
                            <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Email</p>
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-blue-600 hover:text-blue-800 break-all"
                              >
                                {contact.email}
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start space-x-3">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Address</p>
                            <p className="text-sm text-gray-700">{contact.address}</p>
                          </div>
                        </div>

                        {contact.hours && (
                          <div className="flex items-start space-x-3">
                            <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Office Hours</p>
                              <p className="text-sm text-gray-700">{contact.hours}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        {/* Emergency Contacts Section */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-semibold text-red-900">Police Emergency</p>
              <a href="tel:911" className="text-2xl font-bold text-red-600 hover:text-red-800">
                911
              </a>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-900">Fire Emergency</p>
              <a href="tel:911" className="text-2xl font-bold text-red-600 hover:text-red-800">
                911
              </a>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-900">Disaster Response</p>
              <a href="tel:911" className="text-2xl font-bold text-red-600 hover:text-red-800">
                911
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Office hours may vary during holidays and special occasions</li>
            <li>• For urgent matters outside office hours, contact the respective emergency numbers</li>
            <li>• Some services may require appointments or prior coordination</li>
            <li>• Contact information is subject to change - please verify before visiting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
