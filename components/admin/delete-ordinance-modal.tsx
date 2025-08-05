"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteOrdinance, deleteResolution, type Ordinance, type Resolution } from "@/lib/ordinance-service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteOrdinanceModalProps {
  document: Ordinance | Resolution
  isResolution: boolean
}

export function DeleteOrdinanceModal({ document, isResolution }: DeleteOrdinanceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      if (isResolution) {
        await deleteResolution(document.resolution_no)
      } else {
        await deleteOrdinance(document.ordinance_no)
      }

      toast.success(`${isResolution ? "Resolution" : "Ordinance"} deleted successfully!`)
      setOpen(false)
      
      // Redirect to the ordinances/resolutions list page
      router.push(isResolution ? "/dashboard/ordinances" : "/dashboard/ordinances")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const documentType = isResolution ? "Resolution" : "Ordinance"
  const documentNumber = isResolution ? document.resolution_no : document.ordinance_no

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-2">
          <Trash2 size={16} />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {documentType}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{documentType} No. {documentNumber}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. The document will be permanently removed from the system.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {documentType}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 