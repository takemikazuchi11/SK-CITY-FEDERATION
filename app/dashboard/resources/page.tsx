"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, FileText, Download, Folder, Upload, Trash2, Calendar, Loader2, Info, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  supabase,
  getFoldersWithFiles,
  uploadFile,
  addFile,
  deleteFile,
  getAllBarangayResources,
  deleteBarangayResource,
  getBarangays,
  type Barangay,
  type BarangayResourceFile,
  uploadBarangayResource,
  getOtherFoldersWithFiles,
  addOtherFolderFile,
  deleteOtherFolderFile,
  getCityGovernmentFoldersWithFiles,
  getSKCFFoldersWithFiles,
} from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { canEditBarangay } from "@/lib/role-based-access"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResourceFile {
  id: number
  title: string
  type: string
  url: string
}

interface ResourceFolder {
  id: number
  name: string
  files: ResourceFile[]
}

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

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resourceFolders, setResourceFolders] = useState<ResourceFolder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isBarangayUploadDialogOpen, setIsBarangayUploadDialogOpen] = useState(false)
  const [newFile, setNewFile] = useState<{
    title: string
    folder: string
    fileObject: File | null
  }>({
    title: "",
    folder: "",
    fileObject: null,
  })
  const [selectedFolder, setSelectedFolder] = useState<ResourceFolder | null>(null)
  const [selectedBarangayId, setSelectedBarangayId] = useState<number | null>(null)
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [barangayResources, setBarangayResources] = useState<{
    resources: Record<number, Record<string, BarangayResourceFile[]>>
    barangayMapping: Record<number, string>
  }>({
    resources: {},
    barangayMapping: {},
  })
  const [selectedBarangayFiles, setSelectedBarangayFiles] = useState<BarangayResourceFile[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(true)
  const [newBarangayFile, setNewBarangayFile] = useState<{
    title: string
    barangayId: number | null
    month: string
    fileObject: File | null
  }>({
    title: "",
    barangayId: null,
    month: "",
    fileObject: null,
  })
  const [isBarangayDropdownOpen, setIsBarangayDropdownOpen] = useState(false)
  // Add state for other folders
  const [otherFolders, setOtherFolders] = useState<any[]>([])
  const [selectedOtherFolder, setSelectedOtherFolder] = useState<any | null>(null)
  // Remove General Resources dropdown state and logic from the sidebar
  // Sidebar: General Resources button should just select the section, not toggle a dropdown
  const [cityGovernmentFolders, setCityGovernmentFolders] = useState<any[]>([])
  const [selectedCityGovFolder, setSelectedCityGovFolder] = useState<any | null>(null)
  const [skcfFolders, setSKCFFolders] = useState<any[]>([])
  const [selectedSKCFFolder, setSelectedSKCFFolder] = useState<any | null>(null)
  // Add new state for selected section
  const [selectedSection, setSelectedSection] = useState<'general' | 'citygov' | 'skcf' | null>('general');
  const [uploadTarget, setUploadTarget] = useState<{ section: 'general' | 'citygov' | 'skcf', folder: any } | null>(null);
  const [newSectionFile, setNewSectionFile] = useState<{ title: string; fileObject: File | null }>({ title: '', fileObject: null });

  const fileInputRef = useRef<HTMLInputElement>(null)
  const barangayFileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Determine if user is a moderator and get their assigned barangay
  const isModerator = user?.user_role === "moderator"
  const moderatorBarangay = user?.barangay || ""

  // Find the barangay ID for the moderator's assigned barangay
  const moderatorBarangayId =
    barangays.find((b) => b.name.toLowerCase() === moderatorBarangay.toLowerCase())?.id || null

  // Fetch data from Supabase
  const fetchResources = async () => {
    try {
      setIsLoading(true)
      const data = await getFoldersWithFiles()

      // Transform data to match our component's expected format
      const formattedData = data.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        files: folder.files || [],
      }))

      setResourceFolders(formattedData)
    } catch (error) {
      console.error("Error fetching resources:", error)
      toast({
        title: "Error",
        description: "Failed to fetch resources. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch barangays
  const fetchBarangays = async () => {
    try {
      setIsLoadingBarangays(true)
      const data = await getBarangays()
      setBarangays(data)

      // If user is a moderator, automatically select their barangay
      if (isModerator && moderatorBarangay) {
        const userBarangay = data.find((b) => b.name.toLowerCase() === moderatorBarangay.toLowerCase())
        if (userBarangay) {
          setSelectedBarangayId(userBarangay.id)
        }
      }
    } catch (error) {
      console.error("Error fetching barangays:", error)
      toast({
        title: "Error",
        description: "Failed to fetch barangays. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingBarangays(false)
    }
  }

  // Fetch barangay resources
  const fetchBarangayResources = async () => {
    try {
      const data = await getAllBarangayResources()
      setBarangayResources(data)
    } catch (error) {
      console.error("Error fetching barangay resources:", error)
      toast({
        title: "Error",
        description: "Failed to fetch barangay resources. Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Fetch other folders
  const fetchOtherFolders = async () => {
    try {
      const data = await getOtherFoldersWithFiles()
      setOtherFolders(data)
    } catch (error) {
      console.error("Error fetching other folders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch City Government/SKCF files. Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Fetch city government folders
  const fetchCityGovernmentFolders = async () => {
    try {
      const data = await getCityGovernmentFoldersWithFiles()
      setCityGovernmentFolders(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch City Government folders.",
        variant: "destructive",
      })
    }
  }
  // Fetch SKCF folders
  const fetchSKCFFolders = async () => {
    try {
      const data = await getSKCFFoldersWithFiles()
      setSKCFFolders(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch SKCF folders.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchResources()
    fetchBarangays()
    fetchBarangayResources()
    fetchOtherFolders()
    fetchCityGovernmentFolders()
    fetchSKCFFolders()

    // Set up real-time subscription for changes
    const resourcesSubscription = supabase
      .channel("resource-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resource_files",
        },
        () => {
          // Refresh data when changes happen
          fetchResources()
        },
      )
      .subscribe()

    const barangayResourcesSubscription = supabase
      .channel("barangay-resource-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "barangay_resources",
        },
        () => {
          // Refresh data when changes happen
          fetchBarangayResources()
        },
      )
      .subscribe()

    const otherFoldersSubscription = supabase
      .channel("other-folder-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "other_folder_files",
        },
        () => {
          // Refresh data when changes happen
          fetchOtherFolders()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(resourcesSubscription)
      supabase.removeChannel(barangayResourcesSubscription)
      supabase.removeChannel(otherFoldersSubscription)
    }
  }, [toast])

  useEffect(() => {
    // Update selected barangay files when barangay or month changes
    if (selectedBarangayId && selectedMonth && barangayResources.resources[selectedBarangayId]?.[selectedMonth]) {
      setSelectedBarangayFiles(barangayResources.resources[selectedBarangayId][selectedMonth])
    } else {
      setSelectedBarangayFiles([])
    }
  }, [selectedBarangayId, selectedMonth, barangayResources])

  const selectFolder = (folder: ResourceFolder) => {
    setSelectedFolder(folder)
    setSelectedBarangayId(null)
    setSelectedMonth("")
    setSelectedBarangayFiles([])
  }

  const selectBarangay = (barangayId: number) => {
    // Remove the restriction that prevents moderators from viewing other barangays
    // Only restrict editing, not viewing
    setSelectedBarangayId(barangayId)
    setSelectedFolder(null)
    setSelectedMonth("")
  }

  const selectMonth = (month: string) => {
    setSelectedMonth(month)
  }

  const filteredResources = resourceFolders
    .map((folder) => ({
      ...folder,
      files: folder.files.filter((file) => file.title.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((folder) => folder.files.length > 0 || !searchTerm)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewFile((prev) => ({
        ...prev,
        title: file.name.split(".")[0], // Remove extension from title
        fileObject: file as File,
      }))
    }
  }

  const handleBarangayFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewBarangayFile((prev) => ({
        ...prev,
        title: file.name.split(".")[0], // Remove extension from title
        fileObject: file as File,
      }))
    }
  }

  const handleUpload = async () => {
    if (!newFile.fileObject || (!selectedOtherFolder && !newFile.folder)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      })
      return
    }

    // Check if user has admin role for general resources
    if (user?.user_role !== "admin") {
      toast({
        title: "Permission denied",
        description: "You don't have permission to upload general resources.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const folderId = Number.parseInt(newFile.folder || (selectedOtherFolder && selectedOtherFolder.id.toString()) || "0")
      // Check if this is an other_folder
      const isOtherFolder = otherFolders.some((f) => f.id === folderId)

      if (!isOtherFolder) {
        const selectedFolder = resourceFolders.find((f) => f.id === folderId)
        if (!selectedFolder) {
          throw new Error("Selected folder not found")
        }
      }

      // Create a unique path for the file
      const fileExt = newFile.fileObject.name.split(".").pop()
      const filePath = `${Date.now()}-${newFile.title.replace(/\s+/g, "-")}.${fileExt}`

      // Upload to Supabase Storage
      await uploadFile(newFile.fileObject, filePath)

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("resources").getPublicUrl(filePath)

      // Add record to database
      const fileRecord = {
        title: newFile.title,
        type: fileExt?.toUpperCase() || "UNKNOWN",
        url: publicUrl,
        folder_id: folderId,
      }

      // Add record to database with explicit error handling
      if (isOtherFolder) {
        await addOtherFolderFile(fileRecord)
        await fetchOtherFolders()
      } else {
        await addFile(fileRecord)
        await fetchResources()
      }

      // Reset form
      setNewFile({ title: "", folder: "", fileObject: null })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setIsUploadDialogOpen(false)

      // Show success toast
      toast({
        title: "Success!",
        description: "File uploaded successfully!",
        duration: 3000,
      })

      // Force refresh the resource list
      // The fetchOtherFolders call is now handled by the subscription
    } catch (error) {
      console.error("Error in upload process:", error)
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "There was an error uploading your file. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Update handleBarangayUpload to remove moderator action logging
  const handleBarangayUpload = async () => {
    // For moderators, automatically set their assigned barangay
    const barangayId = isModerator ? moderatorBarangayId : newBarangayFile.barangayId

    if (!newBarangayFile.fileObject || !newBarangayFile.title || !barangayId || !newBarangayFile.month) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      })
      return
    }

    // Check if user has permission to upload to this barangay
    if (isModerator && !canEditBarangay(user, barangayResources.barangayMapping[barangayId] || "")) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to upload resources for this barangay.",
        variant: "destructive",
      })
      return
    }

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

    try {
      // Get the selected barangay name for display purposes
      const selectedBarangay = barangays.find((b) => b.id === barangayId)
      if (!selectedBarangay) {
        throw new Error("Selected barangay not found")
      }

      // Generate a safe file name to avoid conflicts
      const fileExt = newBarangayFile.fileObject.name.split(".").pop()
      const timestamp = Date.now()
      const safeFileName = `${selectedBarangay.name.replace(/\s+/g, "-")}_${
        newBarangayFile.month
      }_${timestamp}.${fileExt}`

      const result = await uploadBarangayResource({
        file: newBarangayFile.fileObject,
        fileName: safeFileName,
        title: newBarangayFile.title,
        barangayId: barangayId,
        month: newBarangayFile.month,
        userId: user.id,
      })

      // Reset form
      setNewBarangayFile({ title: "", barangayId: null, month: "", fileObject: null })
      if (barangayFileInputRef.current) {
        barangayFileInputRef.current.value = ""
      }
      setIsBarangayUploadDialogOpen(false)

      // Show success toast
      toast({
        title: "Success!",
        description: `File "${newBarangayFile.title}" uploaded successfully to ${selectedBarangay.name} - ${newBarangayFile.month} folder.`,
      })

      // Force refresh the resource list
      await fetchBarangayResources()
    } catch (error) {
      console.error("Error in upload process:", error)
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Update handleDeleteBarangayResource to remove logging
  const handleDeleteBarangayResource = async (resourceId: number, resourceInfo: BarangayResourceFile) => {
    // Check if user has permission to delete this barangay resource
    const barangayName = barangayResources.barangayMapping[resourceInfo.barangay_id] || ""

    if (!canEditBarangay(user, barangayName)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete resources for this barangay.",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteBarangayResource(resourceId)

      toast({
        title: "Success",
        description: "Barangay resource deleted successfully!",
      })
      // Refresh the list after deletion
      fetchBarangayResources()
    } catch (error) {
      console.error("Error deleting barangay resource:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update handleDelete for general resources to check for admin role
  const handleDelete = async (fileId: number) => {
    // Only admins can delete general resources
    if (user?.user_role !== "admin") {
      toast({
        title: "Permission denied",
        description: "Only administrators can delete general resources.",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteFile(fileId)

      toast({
        title: "Success",
        description: "File deleted successfully!",
      })
      // Refresh the list after deletion
      fetchResources()
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get file count for a specific barangay and month
  const getFileCount = (barangayId: number, month: string) => {
    if (!barangayResources.resources[barangayId]?.[month]) return 0
    return barangayResources.resources[barangayId][month].length
  }

  // Check if user can manage a specific barangay
  const canManageBarangay = (barangayId: number) => {
    const barangayName = barangayResources.barangayMapping[barangayId] || ""
    return canEditBarangay(user, barangayName)
  }

  // Add upload logic for SKCF and City Government
  const handleSectionFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewSectionFile(prev => ({ ...prev, fileObject: file, title: file.name.split(".")[0] }));
    }
  };
  const handleSectionUpload = async () => {
    if (!uploadTarget || !newSectionFile.title || !newSectionFile.fileObject) return;
    const folder = uploadTarget.folder;
    const file = newSectionFile.fileObject;
    const fileName = `${Date.now()}_${file.name}`;
    let uploadPath = '';
    let table = '';
    let folderIdField = '';
    if (uploadTarget.section === 'citygov') {
      uploadPath = `city_government/${folder.id}/${fileName}`;
      table = 'city_government_files';
      folderIdField = 'folder_id';
    } else if (uploadTarget.section === 'skcf') {
      uploadPath = `skcf/${folder.id}/${fileName}`;
      table = 'skcf_files';
      folderIdField = 'folder_id';
    } else {
      return;
    }
    try {
      // Upload to storage
      const { data: storageData, error: storageError } = await supabase.storage.from('resources').upload(uploadPath, file);
      if (storageError) throw storageError;
      const url = supabase.storage.from('resources').getPublicUrl(uploadPath).data.publicUrl;
      // Insert into table
      const { error: insertError } = await supabase.from(table).insert({
        title: newSectionFile.title,
        type: file.type,
        url,
        [folderIdField]: folder.id,
      });
      if (insertError) throw insertError;
      toast({ title: 'Success', description: 'File uploaded successfully!' });
      setIsUploadDialogOpen(false);
      setNewSectionFile({ title: '', fileObject: null });
      setUploadTarget(null);
      if (uploadTarget.section === 'citygov') fetchCityGovernmentFolders();
      if (uploadTarget.section === 'skcf') fetchSKCFFolders();
    } catch (error) {
      toast({ title: 'Upload failed', description: 'There was an error uploading the file.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Resources</h1>

        {/* Moderator Info Banner */}
        {isModerator && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              You are a moderator for <span className="font-semibold">{moderatorBarangay}</span> barangay. You can view
              all barangay resources but can only manage resources for your assigned barangay.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="mb-2 font-medium text-gray-700">Resources</div>

            {/* General Resources Button */}
            <button
              onClick={() => {
                setSelectedSection('general');
                setSelectedFolder(null);
                setSelectedOtherFolder(null);
                setSelectedBarangayId(null);
                setSelectedMonth("");
                setSelectedCityGovFolder(null);
                setSelectedSKCFFolder(null);
              }}
              className={`flex items-center w-full text-left p-2 rounded-md mb-2 ${
                selectedSection === 'general' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
              }`}
              type="button"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>General Resources</span>
            </button>
            {/* City Government Files Button */}
            <button
              onClick={() => {
                setSelectedSection('citygov');
                setSelectedFolder(null);
                setSelectedOtherFolder(null);
                setSelectedBarangayId(null);
                setSelectedMonth("");
                setSelectedCityGovFolder(null);
                setSelectedSKCFFolder(null);
              }}
              className={`flex items-center w-full text-left p-2 rounded-md mb-2 ${
                selectedSection === 'citygov' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
              }`}
              type="button"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>City Government Files</span>
            </button>
            {/* SKCF Files Button */}
            <button
              onClick={() => {
                setSelectedSection('skcf');
                setSelectedFolder(null);
                setSelectedOtherFolder(null);
                setSelectedBarangayId(null);
                setSelectedMonth("");
                setSelectedCityGovFolder(null);
                setSelectedSKCFFolder(null);
              }}
              className={`flex items-center w-full text-left p-2 rounded-md mb-2 ${
                selectedSection === 'skcf' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
              }`}
              type="button"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>SKCF Files</span>
            </button>

            {/* Barangay Resources Dropdown */}
            <div className="mb-4">
              <button
                className="flex items-center w-full text-left p-2 font-medium focus:outline-none"
                onClick={() => setIsBarangayDropdownOpen((prev) => !prev)}
                aria-expanded={isBarangayDropdownOpen}
                aria-controls="barangay-list"
              >
                <Folder className="h-4 w-4 mr-2" />
                <span>Barangay Resources</span>
                {isBarangayDropdownOpen ? (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>
              {isBarangayDropdownOpen && (
                <div className="pl-6 space-y-1" id="barangay-list">
                  {isLoadingBarangays ? (
                    <div className="flex items-center space-x-2 p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-500">Loading barangays...</span>
                    </div>
                  ) : (
                    barangays.map((barangay) => {
                      const isAssigned = isModerator && barangay.name.toLowerCase() === moderatorBarangay.toLowerCase()
                      return (
                        <TooltipProvider key={barangay.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => selectBarangay(barangay.id)}
                                className={`flex items-center w-full text-left p-2 rounded-md text-sm ${
                                  selectedBarangayId === barangay.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                                } ${isAssigned ? "font-medium" : ""}`}
                              >
                                {barangay.name}
                                {isAssigned && (
                                  <Badge variant="outline" className="ml-2 text-xs bg-blue-50">
                                    Assigned
                                  </Badge>
                                )}
                              </button>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* General Resources Section */}
            {selectedSection === 'general' && !selectedOtherFolder && !selectedBarangayId && !selectedCityGovFolder && !selectedSKCFFolder && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">General Resources</h2>
                  {user?.user_role === "admin" && (
                    <Button onClick={() => setIsUploadDialogOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" /> Upload General Resources
                    </Button>
                  )}
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search resources..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No resources found</div>
                ) : (
                  <div className="space-y-2">
                    {filteredResources.map((folder) => (
                      <div key={folder.id}>
                        <div
                          onClick={() => setSelectedFolder(selectedFolder && selectedFolder.id === folder.id ? null : folder)}
                          className={`border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedFolder && selectedFolder.id === folder.id ? "bg-blue-50 border-blue-500" : ""}`}
                        >
                          <div className="flex items-center">
                            <Folder className="h-5 w-5 mr-2 text-blue-600" />
                            <span className="font-medium">{folder.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{folder.files.length} files</span>
                        </div>
                        {/* Show files if this folder is selected */}
                        {selectedFolder && selectedFolder.id === folder.id && (
                          <div className="mt-2 ml-8">
                            {folder.files.length === 0 ? (
                              <div className="text-center py-4 text-gray-500">No files in this folder</div>
                            ) : (
                              <div className="space-y-2">
                                {folder.files.map((file: any) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center">
                                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                      <span>{file.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-4">{file.type}</span>
                                      <a
                                        href={file.url}
                                        className="flex items-center text-blue-600 hover:underline mr-4"
                                        download
                                      >
                                        <Download className="h-5 w-5 mr-1" />
                                        Download
                                      </a>
                                      {user?.user_role === "admin" && (
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(file.id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* City Government Files Section - List Folders */}
            {selectedSection === 'citygov' && !selectedOtherFolder && !selectedBarangayId && !selectedSKCFFolder && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">City Government Files</h2>
                  {user?.user_role === "admin" && (
                    <Button onClick={() => { setUploadTarget({ section: 'citygov', folder: null }); setIsUploadDialogOpen(true); }}>
                      <Upload className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                  )}
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search folders..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {cityGovernmentFolders
                    .filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((folder) => (
                      <div key={folder.id}>
                        <div
                          onClick={() => setSelectedCityGovFolder(selectedCityGovFolder && selectedCityGovFolder.id === folder.id ? null : folder)}
                          className={`border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedCityGovFolder && selectedCityGovFolder.id === folder.id ? "bg-blue-50 border-blue-500" : ""}`}
                        >
                          <div className="flex items-center">
                            <Folder className="h-5 w-5 mr-2 text-blue-600" />
                            <span className="font-medium">{folder.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{folder.files.length} files</span>
                          </div>
                        </div>
                        {/* Show files if this folder is selected */}
                        {selectedCityGovFolder && selectedCityGovFolder.id === folder.id && (
                          <div className="mt-2 ml-8">
                            {folder.files.length === 0 ? (
                              <div className="text-center py-4 text-gray-500">No files in this folder</div>
                            ) : (
                              <div className="space-y-2">
                                {folder.files.map((file: any) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center">
                                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                      <span>{file.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-4">{file.type}</span>
                                      <a
                                        href={file.url}
                                        className="flex items-center text-blue-600 hover:underline mr-4"
                                        download
                                      >
                                        <Download className="h-5 w-5 mr-1" />
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  {cityGovernmentFolders.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No folders found</div>
                  )}
                </div>
              </>
            )}
            {/* SKCF Files Section - List Folders */}
            {selectedSection === 'skcf' && !selectedOtherFolder && !selectedBarangayId && !selectedCityGovFolder && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">SKCF Files</h2>
                  {user?.user_role === "admin" && (
                    <Button onClick={() => { setUploadTarget({ section: 'skcf', folder: null }); setIsUploadDialogOpen(true); }}>
                      <Upload className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                  )}
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search folders..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {skcfFolders
                    .filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((folder) => (
                      <div key={folder.id}>
                        <div
                          onClick={() => setSelectedSKCFFolder(selectedSKCFFolder && selectedSKCFFolder.id === folder.id ? null : folder)}
                          className={`border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedSKCFFolder && selectedSKCFFolder.id === folder.id ? "bg-blue-50 border-blue-500" : ""}`}
                        >
                          <div className="flex items-center">
                            <Folder className="h-5 w-5 mr-2 text-blue-600" />
                            <span className="font-medium">{folder.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{folder.files.length} files</span>
                          </div>
                        </div>
                        {/* Show files if this folder is selected */}
                        {selectedSKCFFolder && selectedSKCFFolder.id === folder.id && (
                          <div className="mt-2 ml-8">
                            {folder.files.length === 0 ? (
                              <div className="text-center py-4 text-gray-500">No files in this folder</div>
                            ) : (
                              <div className="space-y-2">
                                {folder.files.map((file: any) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center">
                                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                      <span>{file.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-4">{file.type}</span>
                                      <a
                                        href={file.url}
                                        className="flex items-center text-blue-600 hover:underline mr-4"
                                        download
                                      >
                                        <Download className="h-5 w-5 mr-1" />
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  {skcfFolders.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No folders found</div>
                  )}
                </div>
              </>
            )}

            {/* Barangay Resources Section */}
            {selectedBarangayId && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {barangayResources.barangayMapping[selectedBarangayId] || "Barangay"} Resources
                  </h2>
                  {canManageBarangay(selectedBarangayId) && (
                    <Button onClick={() => {
                      setNewBarangayFile((prev) => ({
                        ...prev,
                        barangayId: selectedBarangayId || null,
                      }));
                      setIsBarangayUploadDialogOpen(true);
                    }}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Barangay Resources
                    </Button>
                  )}
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {MONTHS.map((month) => {
                    const fileCount = getFileCount(selectedBarangayId, month)
                    return (
                      <div
                        key={month}
                        onClick={() => selectMonth(month)}
                        className={`border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMonth === month ? "border-blue-500 bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Calendar className="h-8 w-8 mb-2 text-blue-600" />
                          <span className="font-medium">{month}</span>
                          <span className="text-sm text-gray-500 mt-1">{fileCount} files</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {selectedMonth && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-4">
                      {barangayResources.barangayMapping[selectedBarangayId]} - {selectedMonth} Files
                    </h3>
                    {selectedBarangayFiles.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No files available for this month</div>
                    ) : (
                      <div className="space-y-2">
                        {selectedBarangayFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-600" />
                              <span>{file.file_name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-4">{file.type}</span>
                              <a
                                href={file.url}
                                className="flex items-center text-blue-600 hover:underline mr-4"
                                download
                              >
                                <Download className="h-5 w-5 mr-1" />
                                Download
                              </a>
                              {canManageBarangay(file.barangay_id) && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteBarangayResource(file.id, file)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Upload General Resources Modal */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <Input id="file" type="file" onChange={handleFileSelect} ref={fileInputRef} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newFile.title}
                  onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="folder" className="text-right">
                  Folder
                </Label>
                {selectedOtherFolder ? (
                  <>
                    <Input value={selectedOtherFolder.name} readOnly className="col-span-3 bg-gray-50" />
                    <input type="hidden" value={selectedOtherFolder.id} />
                  </>
                ) : (
                  <Select value={newFile.folder} onValueChange={(value) => setNewFile({ ...newFile, folder: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceFolders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                      {otherFolders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!newFile.fileObject || (!selectedOtherFolder && !newFile.folder) || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Barangay Resources Modal */}
        <Dialog open={isBarangayUploadDialogOpen} onOpenChange={setIsBarangayUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Barangay Resource</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="barangay-file" className="text-right">
                  File
                </Label>
                <Input
                  id="barangay-file"
                  type="file"
                  onChange={handleBarangayFileSelect}
                  ref={barangayFileInputRef}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="barangay-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="barangay-title"
                  value={newBarangayFile.title}
                  onChange={(e) => setNewBarangayFile({ ...newBarangayFile, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="barangay" className="text-right">
                  Barangay
                </Label>
                {isModerator ? (
                  <Input id="barangay-readonly" value={moderatorBarangay} readOnly className="col-span-3 bg-gray-50" />
                ) : (
                  <Select
                    value={newBarangayFile.barangayId ? String(newBarangayFile.barangayId) : undefined}
                    onValueChange={(value) => setNewBarangayFile({ ...newBarangayFile, barangayId: Number(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select barangay" />
                    </SelectTrigger>
                    <SelectContent style={{ zIndex: 9999 }}>
                      {barangays.map((barangay) => (
                        <SelectItem key={barangay.id} value={barangay.id.toString()}>
                          {barangay.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="month" className="text-right">
                  Month
                </Label>
                <Select
                  value={newBarangayFile.month}
                  onValueChange={(value) => setNewBarangayFile({ ...newBarangayFile, month: value })}
                >
                  <SelectTrigger className="col-span-3">
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBarangayUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBarangayUpload}
                disabled={
                  !newBarangayFile.fileObject ||
                  (!isModerator && !newBarangayFile.barangayId) ||
                  !newBarangayFile.month ||
                  isUploading
                }
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog for SKCF and City Government */}
        <Dialog open={isUploadDialogOpen && uploadTarget?.section === 'citygov'} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="citygov-file" className="text-right">File</Label>
                <Input id="citygov-file" type="file" onChange={handleSectionFileSelect} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="citygov-title" className="text-right">Title</Label>
                <Input id="citygov-title" value={newSectionFile.title} onChange={e => setNewSectionFile(prev => ({ ...prev, title: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="citygov-folder" className="text-right">Folder</Label>
                <Select value={uploadTarget?.folder?.id ? String(uploadTarget.folder.id) : ''} onValueChange={value => setUploadTarget(uploadTarget && { ...uploadTarget, folder: cityGovernmentFolders.find(f => f.id === Number(value)) })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityGovernmentFolders.map(folder => (
                      <SelectItem key={folder.id} value={String(folder.id)}>{folder.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSectionUpload} disabled={!newSectionFile.fileObject || !uploadTarget?.folder}>{isUploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>) : ("Upload")}</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isUploadDialogOpen && uploadTarget?.section === 'skcf'} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skcf-file" className="text-right">File</Label>
                <Input id="skcf-file" type="file" onChange={handleSectionFileSelect} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skcf-title" className="text-right">Title</Label>
                <Input id="skcf-title" value={newSectionFile.title} onChange={e => setNewSectionFile(prev => ({ ...prev, title: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skcf-folder" className="text-right">Folder</Label>
                <Select value={uploadTarget?.folder?.id ? String(uploadTarget.folder.id) : ''} onValueChange={value => setUploadTarget(uploadTarget && { ...uploadTarget, folder: skcfFolders.find(f => f.id === Number(value)) })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {skcfFolders.map(folder => (
                      <SelectItem key={folder.id} value={String(folder.id)}>{folder.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSectionUpload} disabled={!newSectionFile.fileObject || !uploadTarget?.folder}>{isUploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>) : ("Upload")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
