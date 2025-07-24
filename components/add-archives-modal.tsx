"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminOnly } from "@/components/role-based-ui"
import { PlusCircle, Upload, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { addLegislativeDocument } from "@/app/action/legislative-actions"

export function AddArchivesButton() {
  const [open, setOpen] = useState(false)
  const [documentType, setDocumentType] = useState<"ordinance" | "resolution">("ordinance")
  const [title, setTitle] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [date, setDate] = useState("")
  const [dateEnacted, setDateEnacted] = useState("")
  const [description, setDescription] = useState("")
  const [author, setAuthor] = useState("")
  const [sponsors, setSponsors] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const resetForm = () => {
    setDocumentType("ordinance")
    setTitle("")
    setDocumentNumber("")
    setDate("")
    setDateEnacted("")
    setDescription("")
    setAuthor("")
    setSponsors("")
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !documentNumber || !date || !file) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload a PDF file.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Upload the PDF file to Supabase Storage
      // This operation is client-side but doesn't require RLS permissions for uploads
      const fileExt = file.name.split(".").pop()
      const fileName = `${documentType}-${documentNumber}-${Date.now()}.${fileExt}`
      const filePath = `${documentType}s/${fileName}`

      // Set upsert to false to prevent overwriting existing files
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("sk-federation")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw new Error(`Error uploading file: ${uploadError.message}`)
      }

      // 2. Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage.from("sk-federation").getPublicUrl(filePath)
      const pdfUrl = publicUrlData.publicUrl

      // 3. Use server action to save the document metadata
      // Server actions bypass RLS policies
      const result = await addLegislativeDocument({
        type: documentType,
        title,
        documentNumber,
        date,
        dateEnacted: dateEnacted || undefined,
        description: description || undefined,
        author: author || undefined,
        sponsors: sponsors ? sponsors.split(",").map((s) => s.trim()) : undefined,
        pdfUrl,
        userId: user?.id,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to save document")
      }

      toast({
        title: "Document added successfully",
        description: `The ${documentType} has been added to the archives.`,
      })

      // Close the modal and reset the form
      setOpen(false)
      resetForm()

      // Refresh the page to show the new document
      window.location.reload()
    } catch (error) {
      console.error("Error adding document:", error)
      toast({
        title: "Error adding document",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminOnly>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white">
        <PlusCircle size={16} />
        Add Legislative Document
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Legislative Document</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={(value) => setDocumentType(value as "ordinance" | "resolution")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordinance">Ordinance</SelectItem>
                  <SelectItem value="resolution">Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">
                {documentType === "ordinance" ? "Ordinance" : "Resolution"} Number{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="documentNumber"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder={`Enter ${documentType} number (e.g., 2023-01)`}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateEnacted">Date Enacted</Label>
                <Input
                  id="dateEnacted"
                  type="date"
                  value={dateEnacted}
                  onChange={(e) => setDateEnacted(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description of the document"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter the author's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsors">Sponsors (comma-separated)</Label>
              <Input
                id="sponsors"
                value={sponsors}
                onChange={(e) => setSponsors(e.target.value)}
                placeholder="Enter sponsors, separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">
                Upload PDF <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" required />
                <Label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-900">{file ? file.name : "Click to upload PDF"}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF files only"}
                  </span>
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Document"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminOnly>
  )
}
