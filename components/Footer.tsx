import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import RNP from "@/public/rnp.png"
import { useLoading } from "@/lib/loading-context"

export default function Footer() {
  const footerLinks = {
    aboutGOVPH: {
      title: "About GOVPH",
      description:
        "Learn more about the Philippine government, its structure, how government works and the people behind it",
    },
    executive: {
      title: "Executive",
      links: [
        { text: "Office of the President", href: "https://www.foi.gov.ph/agencies/op/" },
        { text: "Office of the Vice President", href: "https://main.ovp.gov.ph/" },
      ],
    },
    judiciary: {
      title: "Judiciary",
      links: [
        { text: "Supreme Court", href: "https://sc.judiciary.gov.ph/" },
        { text: "Court of Appeals", href: "https://ca.judiciary.gov.ph/" },
        { text: "Sandiganbayan", href: "https://sb.judiciary.gov.ph/" },
        { text: "Court of Tax Appeals", href: "https://cta.judiciary.gov.ph/" },
        { text: "Judicial Bar and Council", href: "https://sc.judiciary.gov.ph/judicial-bar-and-council/" },
      ],
    },
    legislative: {
      title: "Legislative",
      links: [
        { text: "Senate of the Philippines", href: "http://www.senate.gov.ph/" },
        { text: "House of Representatives", href: "https://www.congress.gov.ph/" },
      ],
    },
    otherAgencies: {
      title: "Other Agencies",
      links: [
        { text: "Bureau of Internal Revenue", href: "https://www.bir.gov.ph/" },
        { text: "Bureau of Customs", href: "https://customs.gov.ph/" },
        { text: "Bureau of Treasury", href: "https://www.treasury.gov.ph/" },
        { text: "Bureau of Local Government Finance", href: "https://blgf.gov.ph/" },
      ],
    },
  }

  const { setLoading } = useLoading();

  return (
    <footer className="bg-red-50 text-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* NYC Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold">SANGGUNIANG KABATAAN LUNGSOD NG CALAPAN</span>
            </div>
            <p className="text-sm text-gray-600">
              The Sangguniang Kabataan serves as the advocate of the youth, championing policies and programs that
              prioritize their needs and empower their voices nationwide.
            </p>
          </div>

          {/* Republic Seal */}
          <div className="flex flex-col items-center justify-center">
            <Image src={RNP} alt="Republic Seal" width={100} height={100} className="mb-4" />
            <span className="text-lg font-semibold">REPUBLIC OF THE PHILIPPINES</span>
            <p className="text-sm text-gray-600 mt-2">All contents is in the public domain unless otherwise stated</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-end gap-4">
            <Link
              href="https://web.facebook.com/OneSKCalapan/?_rdc=1&_rdr#"
              className="hover:text-blue-600 transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-pink-600 transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About GOVPH */}
          <div>
            <h3 className="font-semibold mb-4">{footerLinks.aboutGOVPH.title}</h3>
            <p className="text-sm text-gray-600">{footerLinks.aboutGOVPH.description}</p>
          </div>

          {/* Executive */}
          <div>
            <h3 className="font-semibold mb-4">{footerLinks.executive.title}</h3>
            <ul className="space-y-2">
              {footerLinks.executive.links.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setLoading(true)}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Judiciary */}
          <div>
            <h3 className="font-semibold mb-4">{footerLinks.judiciary.title}</h3>
            <ul className="space-y-2">
              {footerLinks.judiciary.links.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setLoading(true)}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legislative */}
          <div>
            <h3 className="font-semibold mb-4">{footerLinks.legislative.title}</h3>
            <ul className="space-y-2">
              {footerLinks.legislative.links.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setLoading(true)}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Agencies */}
          <div>
            <h3 className="font-semibold mb-4">{footerLinks.otherAgencies.title}</h3>
            <ul className="space-y-2">
              {footerLinks.otherAgencies.links.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setLoading(true)}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

