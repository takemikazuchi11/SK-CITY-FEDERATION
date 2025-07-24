import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/lib/auth-context"
import { LoadingProvider } from "@/lib/loading-context"
import LoadingSpinner from "@/components/loading-spinner"
import LoadingOverlay from "@/components/LoadingOverlay"
import GlobalLoadingHandler from "@/components/GlobalLoadingHandler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SK Management System",
  description: "A management system for Sangguniang Kabataan",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <AuthProvider>
            <LoadingOverlay />
            <GlobalLoadingHandler />
            {children}
            <Toaster />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}