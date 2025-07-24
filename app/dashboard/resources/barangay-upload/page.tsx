"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { uploadBarangayResource, getBarangays, type Barangay } from "@/lib/supabase"
import { AdminOnly } from "@/components/role-based-ui"
// Add imports for auth context
import { useAuth } from "@/lib/auth-context"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function BarangayResourceUpload() {
  const [selectedBarangayId, setSelectedBarangayId] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [fileTitle, setFileTitle] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [recentUploads, setRecentUploads] = useState<Array<{ title: string; barangayName: string; month: string }>>([])
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth() // Get the current user from auth context

  // Fetch barangays from the database
  useEffect(() => {
    async function fetchBarangays() {
      try {
        setIsLoading(true)
        const data = await getBarangays()
        setBarangays(data)
      } catch (error) {
        console.error("Error fetching barangays:", error)
        toast({
          title: "Error",
          description: "Failed to fetch barangays. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBarangays()
  }, [toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-fill the title with the file name (without extension)
      const fileName = file.name.split(".").slice(0, -1).join(".")
      setFileTitle(fileName)
    }
  }

  const validateForm = () => {
    if (!selectedBarangayId) {
      toast({
        title: "Missing information",
        description: "Please select a barangay.",
        variant: "destructive",
      })
      return false
    }

    if (!selectedMonth) {
      toast({
        title: "Missing information",
        description: "Please select a month.",
        variant: "destructive",
      })
      return false
    }

    if (!fileTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the file.",
        variant: "destructive",
      })
      return false
    }

    if (!selectedFile) {
      toast({
        title: "Missing file",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleUpload = async () => {
    if (!validateForm()) return

    // Check if user is authenticated
    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadStatus(null)

    try {
      // Get the selected barangay name for display purposes
      const selectedBarangay = barangays.find((b) => b.id === selectedBarangayId)
      if (!selectedBarangay) {
        throw new Error("Selected barangay not found")
      }

      // Generate a safe file name to avoid conflicts
      const fileExt = selectedFile!.name.split(".").pop()
      const timestamp = Date.now()
      const safeFileName = `${selectedBarangay.name.replace(/\s+/g, "-")}_${selectedMonth}_${timestamp}.${fileExt}`

      const result = await uploadBarangayResource({
        file: selectedFile!,
        fileName: safeFileName,
        title: fileTitle,
        barangayId: selectedBarangayId!,
        month: selectedMonth,
        userId: user.id, // Pass the user ID from the auth context
      })

      setUploadStatus({
        success: true,
        message: `File "${fileTitle}" successfully uploaded to ${selectedBarangay.name} - ${selectedMonth} folder.`,
      })

      // Add to recent uploads
      setRecentUploads((prev) => [
        { title: fileTitle, barangayName: selectedBarangay.name, month: selectedMonth },
        ...prev.slice(0, 4), // Keep only the 5 most recent uploads
      ])

      // Reset form
      setFileTitle("")
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Show toast notification
      toast({
        title: "Upload successful",
        description: `File has been uploaded to ${selectedBarangay.name} - ${selectedMonth} folder.`,
      })

      // Refresh the resources page after successful upload
      router.refresh()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus({
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      })

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <AdminOnly>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Barangay Resource Upload</h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upload Barangay Resource</CardTitle>
              <CardDescription>
                Upload files to specific barangay folders organized by month. Files will be accessible in the Resources
                section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barangay">Barangay</Label>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading barangays...</span>
                    </div>
                  ) : (
                    <Select
                      value={selectedBarangayId ? String(selectedBarangayId) : undefined}
                      onValueChange={(value) => setSelectedBarangayId(Number(value))}
                    >
                      <SelectTrigger id="barangay">
                        <SelectValue placeholder="Select barangay" />
                      </SelectTrigger>
                      <SelectContent>
                        {barangays.map((barangay) => (
                          <SelectItem key={barangay.id} value={String(barangay.id)}>
                            {barangay.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">File Title</Label>
                <Input
                  id="title"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  placeholder="Enter a descriptive title for the file"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} ref={fileInputRef} />
                {selectedFile && (
                  <p className="text-sm text-gray-500">
                    Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {uploadStatus && (
                <Alert variant={uploadStatus.success ? "default" : "destructive"}>
                  {uploadStatus.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle>{uploadStatus.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{uploadStatus.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={isUploading || isLoading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Upload File
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {recentUploads.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentUploads.map((upload, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{upload.title}</div>
                      <div className="text-sm text-gray-500">
                        {upload.barangayName} - {upload.month}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => router.push("/dashboard/resources")}>
              Return to Resources
            </Button>
          </div>
        </div>
      </div>
    </AdminOnly>
  )
}
