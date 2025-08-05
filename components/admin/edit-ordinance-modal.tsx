"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Loader2 } from "lucide-react"
import { updateOrdinance, updateResolution, type Ordinance, type Resolution } from "@/lib/ordinance-service"
import { toast } from "sonner"

interface EditOrdinanceModalProps {
  document: Ordinance | Resolution
  isResolution: boolean
  onUpdate: () => void
}

export function EditOrdinanceModal({ document, isResolution, onUpdate }: EditOrdinanceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: document.title,
    description: document.description,
    date: document.date,
    date_enact: document.date_enact,
    author: document.author || "",
    sponsors: document.sponsors ? document.sponsors.join(", ") : "",
    img: document.img || "",
    pdf: document.pdf || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updates = {
        ...formData,
        sponsors: formData.sponsors ? formData.sponsors.split(",").map(s => s.trim()) : [],
      }

      if (isResolution) {
        await updateResolution(document.resolution_no, updates)
      } else {
        await updateOrdinance(document.ordinance_no, updates)
      }

      toast.success(`${isResolution ? "Resolution" : "Ordinance"} updated successfully!`)
      setOpen(false)
      onUpdate()
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("Failed to update document. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit size={16} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit {isResolution ? "Resolution" : "Ordinance"} {isResolution ? document.resolution_no : document.ordinance_no}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date_enact">Date Enacted</Label>
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
            <Label htmlFor="sponsors">Sponsors (comma-separated)</Label>
            <Input
              id="sponsors"
              value={formData.sponsors}
              onChange={(e) => handleInputChange("sponsors", e.target.value)}
              placeholder="Sponsor 1, Sponsor 2, Sponsor 3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="img">Author Image URL</Label>
              <Input
                id="img"
                value={formData.img}
                onChange={(e) => handleInputChange("img", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="pdf">PDF URL</Label>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update {isResolution ? "Resolution" : "Ordinance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 