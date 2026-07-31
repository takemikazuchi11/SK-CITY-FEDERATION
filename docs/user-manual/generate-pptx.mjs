/**
 * Generates SK Calapan City Federation User Manual (.pptx)
 * Run: node docs/user-manual/generate-pptx.mjs
 */
import PptxGenJS from "pptxgenjs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.join(__dirname, "SK-User-Manual.pptx")

const BRAND = "2563EB" // blue-600
const MUTED = "64748B"
const LIGHT = "F1F5F9"

const pptx = new PptxGenJS()
pptx.author = "SK Calapan City Federation"
pptx.title = "SK City Federation Website — User Manual"
pptx.subject = "Basic user and admin guide"
pptx.layout = "LAYOUT_16x9"

function addTitleSlide(title, subtitle) {
  const slide = pptx.addSlide()
  slide.background = { color: BRAND }
  slide.addText(title, {
    x: 0.6,
    y: 2.2,
    w: 8.8,
    h: 1.2,
    fontSize: 36,
    bold: true,
    color: "FFFFFF",
    align: "center",
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 3.5,
      w: 8.8,
      h: 0.8,
      fontSize: 18,
      color: "E2E8F0",
      align: "center",
    })
  }
}

function addSectionSlide(title) {
  const slide = pptx.addSlide()
  slide.background = { color: BRAND }
  slide.addText(title, {
    x: 0.6,
    y: 2.6,
    w: 8.8,
    h: 1,
    fontSize: 32,
    bold: true,
    color: "FFFFFF",
    align: "center",
  })
}

function addScreenshotPlaceholder(slide, label) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.4,
    y: 1.05,
    w: 4.2,
    h: 3.9,
    fill: { color: LIGHT },
    line: { color: "CBD5E1", width: 1, dashType: "dash" },
  })
  slide.addText("[ Insert screenshot ]\n" + label, {
    x: 5.4,
    y: 2.55,
    w: 4.2,
    h: 1,
    fontSize: 11,
    color: MUTED,
    align: "center",
    italic: true,
  })
}

function addContentSlide(title, bullets, screenshotLabel) {
  const slide = pptx.addSlide()
  slide.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 9,
    h: 0.55,
    fontSize: 22,
    bold: true,
    color: BRAND,
  })

  slide.addText(bullets.map((b) => ({ text: b, options: { bullet: true, breakLine: true } })), {
    x: 0.5,
    y: 1.05,
    w: 4.7,
    h: 4.2,
    fontSize: 13,
    color: "1E293B",
    valign: "top",
  })

  if (screenshotLabel) {
    addScreenshotPlaceholder(slide, screenshotLabel)
  }
}

function addTwoColumnSlide(title, leftTitle, leftBullets, rightTitle, rightBullets) {
  const slide = pptx.addSlide()
  slide.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 9,
    h: 0.55,
    fontSize: 22,
    bold: true,
    color: BRAND,
  })

  slide.addText(leftTitle, {
    x: 0.5,
    y: 1.0,
    w: 4.3,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "0F172A",
  })
  slide.addText(leftBullets.map((b) => ({ text: b, options: { bullet: true, breakLine: true } })), {
    x: 0.5,
    y: 1.45,
    w: 4.3,
    h: 3.8,
    fontSize: 12,
    color: "334155",
    valign: "top",
  })

  slide.addText(rightTitle, {
    x: 5.2,
    y: 1.0,
    w: 4.3,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: "0F172A",
  })
  slide.addText(rightBullets.map((b) => ({ text: b, options: { bullet: true, breakLine: true } })), {
    x: 5.2,
    y: 1.45,
    w: 4.3,
    h: 3.8,
    fontSize: 12,
    color: "334155",
    valign: "top",
  })
}

// --- Slides ---

addTitleSlide(
  "SK Calapan City Federation",
  "Website User Manual — Basic Guide for Users & Administrators"
)

const tocSlide = pptx.addSlide()
tocSlide.addText("Table of Contents", {
  x: 0.5,
  y: 0.35,
  w: 9,
  h: 0.55,
  fontSize: 22,
  bold: true,
  color: BRAND,
})
tocSlide.addText(
  [
    "1. Introduction",
    "2. Getting Started (Login & Registration)",
    "3. Dashboard & Navigation",
    "4. User Guide — Everyday Features",
    "5. Admin Guide — Management Tools",
    "6. FAQ & Support",
  ].map((t) => ({ text: t, options: { bullet: true, breakLine: true } })),
  { x: 0.7, y: 1.2, w: 8.5, h: 4, fontSize: 16, color: "1E293B" }
)

addSectionSlide("1. Introduction")

addContentSlide(
  "About This Website",
  [
    "Official platform for the Sangguniang Kabataan (SK) Calapan City Federation.",
    "Browse announcements, events, programs, and transparency documents.",
    "Youth members can register for events, manage their account, and download a KK ID Card.",
    "Administrators manage content, users, events, and disclosure records.",
    "This manual covers basic tasks. Add your own screenshots in the placeholder boxes.",
  ],
  "Homepage or dashboard overview"
)

addSectionSlide("2. Getting Started")

addContentSlide(
  "Creating an Account",
  [
    "Go to the Login page and select the Register tab.",
    "Fill in: first name, last name, email, password, and barangay.",
    "Choose your barangay from the dropdown list.",
    "Click Register to create your account.",
    "After registering, sign in with your email and password.",
    "You can also use Sign in with Google if enabled.",
  ],
  "Register tab on /login"
)

addContentSlide(
  "Signing In & Signing Out",
  [
    "Open the website and go to Login.",
    "Enter your email and password, then click Sign in.",
    "Use Forgot password? if you need to reset your credentials.",
    "Once signed in, click your profile avatar (top-right) to open the menu.",
    "Select Logout at the bottom of the profile menu to sign out.",
  ],
  "Login page and profile menu"
)

addSectionSlide("3. Dashboard & Navigation")

addContentSlide(
  "Main Navigation Bar",
  [
    "Home — dashboard with announcements, events, news, and disclosure board.",
    "About — vision/mission, SK history, federation officers, barangay officials.",
    "Programs — CYDC, Katipunan ng Kabataan (KK), and Events.",
    "Process — BIR filing, COA reports, EFPS, disclosure, and related guides.",
    "Resources — downloadable files and documents.",
    "Contact Us — reach the SK Federation.",
  ],
  "Top navigation bar"
)

addContentSlide(
  "Profile Menu (All Users)",
  [
    "KK ID Card — view and download your Katipunan ng Kabataan ID.",
    "Account Settings — update profile photo, contact info, and password.",
    "My Events — events you registered for.",
    "Notifications — alerts for announcements and event updates.",
    "Support & Help — contact the development team and read FAQs.",
  ],
  "Profile sidebar menu"
)

addSectionSlide("4. User Guide")

addContentSlide(
  "Browsing Announcements & News",
  [
    "Announcements appear on the dashboard home page.",
    "Click an announcement to read the full details.",
    "Some announcements may include polls — cast your vote when available.",
    "News articles are listed in the News section on the dashboard.",
    "Click a news item to open the full article page.",
  ],
  "Announcements and news on dashboard"
)

addContentSlide(
  "Finding & Registering for Events",
  [
    "Go to Programs → Events from the navigation bar.",
    "Browse upcoming events and click one to view details.",
    "On the event page, click Register to join (sign in required).",
    "Track your registrations under My Events in the profile menu.",
    "You will receive notifications about event updates.",
  ],
  "Events list and event detail page"
)

addContentSlide(
  "KK ID Card",
  [
    "Open KK ID Card from your profile menu.",
    "Your card displays after KK registration is approved.",
    "If not registered, follow the link to complete KK registration.",
    "Use the Download button to save your ID as a PDF.",
    "Keep your profile photo updated in Account Settings for the ID photo.",
  ],
  "KK ID Card page"
)

addContentSlide(
  "Account Settings",
  [
    "Open Account Settings from the profile menu.",
    "Update your name, phone number, and barangay if needed.",
    "Upload or change your profile photo.",
    "Change your password using the password section.",
    "Save changes before leaving the page.",
  ],
  "Account Settings page"
)

addContentSlide(
  "Resources & Transparency",
  [
    "Resources — browse and download federation documents.",
    "Disclosure Board on the dashboard shows quarterly financial reports.",
    "Process pages explain compliance steps (BIR, COA, EFPS, etc.).",
    "Use the chatbot on the dashboard for quick help finding information.",
  ],
  "Resources and disclosure board"
)

addSectionSlide("5. Admin Guide")

addTwoColumnSlide(
  "Admin Access & Roles",
  "Who can do what",
  [
    "Admin — full access to all management tools.",
    "Moderator — manage own barangay content and resources.",
    "Editor — create announcements, events, and upload resources.",
    "User — browse, register for events, manage account.",
  ],
  "How to open admin tools",
  [
    "Sign in with an admin account.",
    "Open the profile menu (top-right avatar).",
    "Admin-only links appear at the top of the menu.",
    "Select Admin Dashboard to view analytics and manage data.",
  ]
)

addContentSlide(
  "Admin Dashboard",
  [
    "Shows stats: users, events, announcements, KK registrations.",
    "Tabs include: User Management, Event Participation, KK Registrations.",
    "View charts for platform activity and growth.",
    "Review event feedback submitted by participants.",
    "Use this page as your central management hub.",
  ],
  "Admin Dashboard (/dashboard/admin)"
)

addContentSlide(
  "Creating Announcements",
  [
    "Profile menu → Create Announcement.",
    "Enter title, content, category, and optional image.",
    "Set start and end dates to control when it is visible.",
    "Publish to notify users (if notifications are enabled).",
    "For polls: Profile menu → Create Poll Announcement.",
  ],
  "Create Announcement form"
)

addContentSlide(
  "Creating & Managing Events",
  [
    "Profile menu → Create Event.",
    "Fill in title, date, time, location, description, and image.",
    "Save the event — it appears under Programs → Events.",
    "Edit events from the event detail page (admin/editor only).",
    "Track registrations in Admin Dashboard → Event Participation.",
  ],
  "Create Event form"
)

addContentSlide(
  "Disclosure & User Management",
  [
    "Add Files SKCF — upload quarterly disclosure documents.",
    "Disclosure files appear on the dashboard Disclosure Board.",
    "Admin Dashboard → User Management — view and edit user roles.",
    "Assign roles: admin, moderator, editor, or user as needed.",
    "Moderator Logs — review moderator activity (admin only).",
  ],
  "Disclosure management and user table"
)

addSectionSlide("6. FAQ & Support")

addContentSlide(
  "Frequently Asked Questions",
  [
    "How do I register for events? → Programs → Events → open event → Register.",
    "How do I update my profile? → Profile menu → Account Settings.",
    "Not receiving notifications? → Check Account Settings; contact Support if needed.",
    "How do I get my KK ID Card? → Complete KK registration, then open KK ID Card.",
    "How do I suggest features? → Support & Help → Contact Development Team.",
  ],
  null
)

const supportSlide = pptx.addSlide()
supportSlide.addText("Need Help?", {
  x: 0.5,
  y: 0.35,
  w: 9,
  h: 0.55,
  fontSize: 22,
  bold: true,
  color: BRAND,
})
supportSlide.addText(
  [
    "Go to Support & Help from the profile menu (/dashboard/support).",
    "Contact the development team via the email buttons on that page.",
    "Typical response time: 24–48 hours during business days.",
    "",
    "Development Team:",
    "• Justin Goyena — Lead Developer",
    "• Rose Ericka Leynes — Developer",
    "• Charles Masangkay — Developer",
  ].join("\n"),
  { x: 0.5, y: 1.1, w: 9, h: 3.5, fontSize: 14, color: "334155" }
)

addTitleSlide("Thank You", "SK Calapan City Federation — Youth. Service. Progress.")

await pptx.writeFile({ fileName: outputPath })
console.log("Created:", outputPath)
