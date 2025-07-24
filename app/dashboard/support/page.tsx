"use client"

import { motion } from "framer-motion"
import { Mail, MessageCircle, Phone, Clock, Code, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import ericka from "@/public/ericka.jpg"
import justin from "@/public/justin.png"
import charles from "@/public/charles.jpg"

export default function SupportPage() {
  const developers = [
    {
      name: "Justin Goyena",
      role: "Lead Developer",
      email: "justingoyena11@gmail.com",
      description: "Full-stack developer and project lead specializing in modern web applications.",
      isLead: true,
      profileImage: justin, // Replace with actual image path
    },
    {
      name: "Rose Ericka Leynes",
      role: "Developer",
      email: "roseerickaleynes8@gmail.com",
      description: "Frontend specialist focused on user experience and interface design.",
      isLead: false,
      profileImage: ericka, // Replace with actual image path
    },
    {
      name: "Charles Masangkay",
      role: "Developer",
      email: "charlesmasangkay24@gmail.com",
      description: "Backend developer with expertise in database management and API development.",
      isLead: false,
      profileImage: charles, // Replace with actual image path
    },
  ]

  // Gmail compose URL generator
  const handleContactDeveloper = (email: string, name: string) => {
    const subject = encodeURIComponent(`Support Request - SK City Federation Website`)
    const body = encodeURIComponent(`Hello ${name},

I need assistance with the SK City Federation website. 

Please describe your issue or question below:
[Please describe your issue here]

Additional Information:
- Page/Section: 
- Browser: 
- Device: 

Thank you for your help!

Best regards,`)

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`
    window.open(gmailUrl, "_blank")
  }

  // Contact all developers
  const handleContactAllDevelopers = () => {
    const allEmails = developers.map((dev) => dev.email).join(",")
    const subject = encodeURIComponent("Support Request - SK City Federation Website")
    const body = encodeURIComponent(`Hello Development Team,

I need assistance with the SK City Federation website. 

Please describe your issue or question below:
[Please describe your issue here]

Additional Information:
- Page/Section: 
- Browser: 
- Device: 

Thank you for your help!

Best regards,`)

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${allEmails}&su=${subject}&body=${body}`
    window.open(gmailUrl, "_blank")
  }

  const supportOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get direct help from our development team",
      action: "Contact Team",
      onClick: handleContactAllDevelopers,
      primary: true,
    },
    {
      icon: MessageCircle,
      title: "General Inquiries",
      description: "For general questions about the platform",
      action: "Contact Lead Developer",
      onClick: () => handleContactDeveloper(developers[0].email, developers[0].name),
    },
    {
      icon: Phone,
      title: "Technical Issues",
      description: "Report bugs or technical problems",
      action: "Report Issue",
      onClick: () => {
        const subject = encodeURIComponent("Technical Issue Report - SK City Federation")
        const body = encodeURIComponent(`Hello Development Team,

I encountered a technical issue on the SK City Federation website.

Issue Details:
- What happened: [Describe the issue]
- When it occurred: [Date and time]
- Page/Section: [Where did this happen]
- Browser: [Chrome, Firefox, Safari, etc.]
- Device: [Desktop, Mobile, Tablet]
- Steps to reproduce: [How can we recreate this issue]

Screenshots (if applicable): [Please attach any relevant screenshots]

Thank you for your assistance!`)
        const allEmails = developers.map((dev) => dev.email).join(",")
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${allEmails}&su=${subject}&body=${body}`, "_blank")
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support & Help</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need assistance? Our dedicated development team is here to help you make the most of the SK City Federation
            platform.
          </p>
        </motion.div>

        {/* Development Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Meet Your Development Team</CardTitle>
              <CardDescription className="text-lg">
                Dedicated professionals committed to providing excellent support and continuous platform improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {developers.map((developer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="relative mb-4">
                      <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                        <Image
                          src={developer.profileImage || "/placeholder.svg"}
                          alt={`${developer.name} profile picture`}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {developer.isLead && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                          <Star className="h-4 w-4 text-yellow-800" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">{developer.name}</h3>
                    <div className="flex justify-center mb-3">
                      <Badge
                        variant={developer.isLead ? "default" : "secondary"}
                        className={`${developer.isLead ? "bg-blue-600 hover:bg-blue-700" : ""} flex items-center space-x-1`}
                      >
                        <Code className="h-3 w-3" />
                        <span>{developer.role}</span>
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 px-2">{developer.description}</p>

                    <Button
                      onClick={() => handleContactDeveloper(developer.email, developer.name)}
                      variant={developer.isLead ? "default" : "outline"}
                      size="sm"
                      className={`${developer.isLead ? "bg-blue-600 hover:bg-blue-700" : ""} w-full`}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact {developer.name.split(" ")[0]}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help? We're Here for You!</h4>
                <p className="text-gray-700 mb-4">
                  Whether you're experiencing technical issues, need feature guidance, or have suggestions for
                  improvement, our team is ready to assist you. Click below to contact our entire development team.
                </p>
                <Button
                  onClick={handleContactAllDevelopers}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Development Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {supportOptions.map((option, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${option.primary ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50"}`}
            >
              <CardHeader className="text-center">
                <div
                  className={`mx-auto mb-3 h-12 w-12 rounded-full flex items-center justify-center ${option.primary ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={option.onClick}
                  variant={option.primary ? "default" : "outline"}
                  className={option.primary ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Response Time Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gray-100 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4 text-gray-700">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Typical Response Time: 24-48 hours</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                We strive to respond to all inquiries as quickly as possible during business hours.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How do I register for events?</h4>
                <p className="text-gray-700">
                  Navigate to the Events section and click on any event you're interested in. You'll find a registration
                  button on the event details page.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How do I update my profile information?</h4>
                <p className="text-gray-700">
                  Go to Account Settings from your profile menu to update your personal information, contact details,
                  and preferences.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">I'm not receiving notifications. What should I do?</h4>
                <p className="text-gray-700">
                  Check your notification settings in your account preferences. If the issue persists, please contact
                  our development team using the buttons above.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How can I suggest new features?</h4>
                <p className="text-gray-700">
                  We love hearing from our community! Use any of the "Contact" buttons above to share your ideas and
                  suggestions for platform improvements with our development team.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
