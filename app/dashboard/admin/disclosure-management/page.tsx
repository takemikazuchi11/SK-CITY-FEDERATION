"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { getDisclosureUrls, updateDisclosureUrl, type DisclosureUrl } from "@/app/action/disclosure-actions"

export default function DisclosureManagementPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [disclosureUrls, setDisclosureUrls] = useState<DisclosureUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<number, string>>({})

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin && user) {
      router.push("/dashboard")
      toast.error("You don't have permission to access this page")
    }
  }, [user, isAdmin, router])

  // Fetch disclosure URLs
  useEffect(() => {
    if (!isAdmin) return

    const fetchUrls = async () => {
      try {
        const urls = await getDisclosureUrls()
        setDisclosureUrls(urls)

        // Initialize form data with current URLs
        const initialFormData: Record<number, string> = {}
        urls.forEach((item) => {
          initialFormData[item.id] = item.url || ""
        })
        setFormData(initialFormData)
      } catch (error) {
        console.error("Error fetching disclosure URLs:", error)
        toast.error("Failed to load disclosure URLs")
      } finally {
        setLoading(false)
      }
    }

    fetchUrls()
  }, [isAdmin])

  const handleInputChange = (id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSave = async (id: number) => {
    const url = formData[id] || ""

    setSaving(id)

    try {
      const result = await updateDisclosureUrl(id, url)

      if (result.success) {
        toast.success("URL updated successfully")

        // Refresh the data
        const urls = await getDisclosureUrls()
        setDisclosureUrls(urls)

        // Update form data
        const updatedFormData: Record<number, string> = {}
        urls.forEach((item) => {
          updatedFormData[item.id] = item.url || ""
        })
        setFormData(updatedFormData)
      } else {
        toast.error(result.error || "Failed to update URL")
      }
    } catch (error) {
      console.error("Error saving URL:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setSaving(null)
    }
  }

  const getDocumentIcon = (documentType: string) => {
    return <FileText className="h-5 w-5 text-blue-600" />
  }

  const formatLastUpdated = (updatedAt: string) => {
    return new Date(updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You don't have permission to access this page. Admin access required.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SKCF Disclosure Management</h1>
          <p className="text-muted-foreground mt-2">Manage URLs for the SKCF Full Disclosure Board documents</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <FileText className="h-4 w-4 mr-2" />
          Admin Panel
        </Badge>
      </div>

      <div className="grid gap-6">
        {disclosureUrls.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getDocumentIcon(item.document_type)}
                  <div>
                    <CardTitle className="text-xl">{item.document_type}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
                {formData[item.id] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(formData[item.id], "_blank")}
                    disabled={!formData[item.id]}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`url-${item.id}`}>Document URL</Label>
                <Input
                  id={`url-${item.id}`}
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={formData[item.id] || ""}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Enter the Google Drive URL or any public document URL</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {item.updated_at && <span>Last updated: {formatLastUpdated(item.updated_at)}</span>}
                </div>
                <Button onClick={() => handleSave(item.id)} disabled={saving === item.id} className="min-w-[100px]">
                  {saving === item.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save URL
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {disclosureUrls.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No disclosure documents found. Please check your database configuration.</AlertDescription>
        </Alert>
      )}

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tips:</strong> Use Google Drive sharing links for best compatibility. Make sure the documents are
          publicly accessible or shared with appropriate permissions.
        </AlertDescription>
      </Alert>
    </div>
  )
}
