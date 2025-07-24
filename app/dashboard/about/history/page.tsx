"use client"

import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import sk from "@/public/SK-banner.png"
import banner from "@/public/banner-sk.jpeg"
import sk1 from "@/public/sk1.jpg"

export default function SKHistoryPage() {
  const links = [
    {
      title: "Full Text of Republic Act No. 10742",
      href: "https://www.officialgazette.gov.ph/2016/01/15/republic-act-no-10742/",
    },
    {
      title: "SK Reform Act Implementing Rules and Regulations",
      href: "#",
    },
    {
      title: "DILG Memorandum on SK Implementation",
      href: "#",
    },
    {
      title: "Youth Development Programs under RA 10742",
      href: "#",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-blue-900/80">
          <Image
            src={sk || "/placeholder.svg"}
            alt="SK Background"
            fill
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">Sangguniang Kabataan History</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Key Highlights */}
            <div className="bg-cyan-50 rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b border-cyan-200 pb-2">Highlights:</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    The <strong>Kabataang Barangay (KB)</strong> was established in 1975 under Presidential Decree No.
                    684 by President Ferdinand Marcos Sr., with Imee Marcos as its first national chairperson.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    The KB was criticized for being politically influenced, lacking transparency, and failing to
                    genuinely empower the youth, leading to its abolition in the late 1980s.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    The <strong>Sangguniang Kabataan (SK)</strong> was officially established under Republic Act No.
                    7160 (Local Government Code of 1991), authored by Senator Aquilino "Nene" Pimentel Jr.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    The SK provided a formal avenue for young people aged 15 to 21 to participate in governance, with SK
                    Chairpersons given ex-officio seats in Barangay Councils.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    By 2013, Senator Franklin Drilon pushed for SK abolition, arguing it had become a breeding ground
                    for corruption, leading to postponed elections and reform discussions.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    <strong>Republic Act No. 10742</strong> (SK Reform Act of 2016) introduced major reforms: raised age
                    requirement to 18-24 years, implemented anti-political dynasty provisions, and required mandatory
                    leadership training.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    <strong>Republic Act No. 11768</strong> (2022) further enhanced SK by allowing honoraria for
                    officials, expanding programs to benefit youth up to 30 years old, and broadening funding scope to
                    include mental health and disaster response.
                  </span>
                </li>
                {/* SK Group Picture - Static */}
                <div className="mt-6 pt-4 border-t border-cyan-200">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={sk1} // Replace with your actual image filename
                        alt="SK Group Picture - Current Leadership"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      Current Sangguniang Kabataan officials working together for youth development
                    </p>
                  </div>
                </div>
              </ul>
            </div>

            {/* Right Column - Detailed History */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  The history of youth representation in the Philippines began with the Kabataang Barangay (KB),
                  established in 1975 under Presidential Decree No. 684 by President Ferdinand Marcos Sr. The KB aimed
                  to involve young Filipinos in governance and community service, with <em>Imee Marcos</em> as its first
                  national chairperson. However, the KB was criticized for being politically influenced, lacking
                  transparency, and failing to genuinely empower the youth. Due to these controversies, it was
                  eventually abolished in the late 1980s.
                </p>

                <p className="mb-4">
                  In response to the need for structured youth representation, the Sangguniang Kabataan (SK) was
                  officially established under Republic Act No. 7160, also known as the Local Government Code of 1991,
                  authored by Senator Aquilino "Nene" Pimentel Jr. The SK provided a formal avenue for young people aged
                  15 to 21 to participate in governance, with each barangay electing an SK Chairperson and council
                  members. The SK Chairperson was also given an ex-officio seat in the Barangay Council, ensuring youth
                  perspectives in local decision-making.
                </p>

                <p className="mb-4">
                  Despite its noble intentions, the SK faced growing criticisms over the years. Allegations of
                  corruption, inefficiency, and political dynasties influencing youth elections led to calls for its
                  abolition. By 2013, Senator Franklin Drilon strongly pushed for removing SK, arguing that it had
                  become a breeding ground for corruption. As debates on its future continued, SK elections were
                  postponed multiple times, prompting discussions on whether reforms could improve the system instead of
                  abolishing it.
                </p>

                <p className="mb-4">
                  Rather than dismantling the SK, Congress enacted Republic Act No. 10742, the Sangguniang Kabataan
                  Reform Act of 2016, authored by Senator Bam Aquino and Rep. Sarah Elago. This landmark law introduced
                  major reforms, including raising the age requirement for SK officials to 18-24 years old, implementing
                  an anti-political dynasty provision, requiring mandatory leadership training, and strengthening
                  financial transparency by granting SK its own budget with stricter auditing. These changes aimed to
                  make SK more accountable and effective in addressing youth concerns.
                </p>

                <p className="mb-4">
                  Despite these reforms, challenges in implementation persisted. To further strengthen youth governance,
                  Republic Act No. 11768 was passed in 2022, authored by Senator Sonny Angara, Senator Imee Marcos, Rep.
                  Sarah Elago, and Rep. Eric Go Yap. This law introduced additional improvements, such as allowing
                  honoraria for SK officials, expanding SK programs to benefit youth up to 30 years old, and broadening
                  SK's scope to fund livelihood programs, mental health initiatives, and disaster response projects.
                  Additionally, SK officials were granted more financial autonomy, enabling them to collaborate with
                  NGOs and private groups for youth programs.
                </p>

                <p className="mb-4">
                  Despite these legislative efforts, concerns about SK's effectiveness remain. Issues like low voter
                  turnout, barangay political interference, and lack of active youth engagement continue to be raised.
                  Some lawmakers, including Senator Imee Marcos, have even suggested abolishing SK entirely if it fails
                  to produce real youth leaders. Meanwhile, youth organizations and policymakers continue to explore
                  ways to make SK more impactful, with proposals to replace it with an independent, community-driven
                  youth council system.
                </p>

                <p>
                  As of today, the Sangguniang Kabataan remains the official youth governance body in the Philippines,
                  continuously evolving through legislative amendments to address the challenges it faces. While
                  discussions on its future persist, the SK continues to function as a platform for young leaders to
                  engage in public service, governance, and community development.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Evolution Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  1975
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Kabataang Barangay</h3>
                <p className="text-sm text-gray-600">Established under PD 684 by President Marcos Sr.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  1991
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">SK Establishment</h3>
                <p className="text-sm text-gray-600">Under RA 7160 by Sen. Pimentel Jr.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  2016
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Major Reforms</h3>
                <p className="text-sm text-gray-600">RA 10742 Reform Act by Sen. Aquino & Rep. Elago</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  2022
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Enhancement</h3>
                <p className="text-sm text-gray-600">RA 11768 by Sen. Angara & others</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-[300px] md:h-[400px] bg-blue-100">
              <Image src={banner || "/placeholder.svg"} alt="SK Act Implementation" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent text-white p-6">
                <p className="text-sm font-medium">
                  Sangguniang Kabataan officials during a community project implementation
                </p>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-blue-50 rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b border-blue-200 pb-2">Related Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow bg-white">
                  <Link
                    href={link.href}
                    className="flex items-center text-blue-700 hover:text-blue-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="font-medium">{link.title}</span>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
