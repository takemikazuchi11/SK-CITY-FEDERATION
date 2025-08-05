"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PermissionGuard } from "@/components/role-based-ui"
import { createOrdinance } from "@/lib/ordinance-service"
import { toast } from "sonner"

export default function CreateOrdinancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ordinance_no: "",
    title: "",
    description: "",
    date: "",
    date_enact: "",
    author: "",
    sponsors: "",
    img: "",
    pdf: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const ordinanceData = {
        ...formData,
        sponsors: formData.sponsors ? formData.sponsors.split(",").map(s => s.trim()) : [],
      }

      await createOrdinance(ordinanceData)
      toast.success("Ordinance created successfully!")
      router.push("/dashboard/ordinances")
    } catch (error) {
      console.error("Error creating ordinance:", error)
      toast.error("Failed to create ordinance. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <PermissionGuard permission="manage:legislative_documents">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Ordinance</h1>
              <p className="text-gray-600">Add a new ordinance to the legislative database</p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Ordinance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ordinance_no">Ordinance Number *</Label>
                    <Input
                      id="ordinance_no"
                      value={formData.ordinance_no}
                      onChange={(e) => handleInputChange("ordinance_no", e.target.value)}
                      placeholder="e.g., 2024-001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder="Author name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ordinance title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the ordinance"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_enact">Date Enacted *</Label>
                    <Input
                      id="date_enact"
                      type="date"
                      value={formData.date_enact}
                      onChange={(e) => handleInputChange("date_enact", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sponsors">Sponsors (comma-separated) *</Label>
                  <Input
                    id="sponsors"
                    value={formData.sponsors}
                    onChange={(e) => handleInputChange("sponsors", e.target.value)}
                    placeholder="Sponsor 1, Sponsor 2, Sponsor 3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="img">Author Image URL *</Label>
                    <Input
                      id="img"
                      value={formData.img}
                      onChange={(e) => handleInputChange("img", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdf">PDF URL *</Label>
                    <Input
                      id="pdf"
                      value={formData.pdf}
                      onChange={(e) => handleInputChange("pdf", e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Create Ordinance
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
} 