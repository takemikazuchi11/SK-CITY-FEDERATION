"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { MapPinIcon, AlertTriangle } from "lucide-react"
import { deleteUserAccount } from "@/app/action/account-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// List of barangays in San Juan City
const BARANGAYS = [
  "​Balingayan", "​Balite", "​Baruyan", "​Batino", "​Bayanan I", "​Bayanan II", "Biga", "​Bondoc", "​Bucayao", "​Buhuan", "​Bulusan", "​Calero", "​Camansihan", "​Camilmil", "​Canubing I", "​Canubing II", "​Comunal", "​Guinobatan", "​Gulod", "​Gutad", "​Ibaba East", "​Ibaba West", "​Ilaya", "​Lalud", "​Lazareto", "​Libis", "​Lumangbayan", "​Mahal Na Pangalan", "​Maidlang", "​Malad", "​Malamig", "​Managpi", "​Masipit", "​Nag-Iba I", "​Nag-Iba II", "​Navotas", "​Pachoca", "​Palhi", "​Panggalaan", "​Parang", "​Patas", "​Personas", "​Puting Tubig", "​San Antonio", "​San Raphael", "​San Vicente Central", "​San Vicente East", "​San Vicente North", "​San Vicente South", "​San Vicente West", "​Santa Cruz", "​Santa Isabel", "​Santa Maria Village", "​Santa Rita", "​Santo Niño", "​Sapul", "​Silonay", "​Suqui", "​Tawagan", "​Tawiran", "​Tibag", "Wawa"
]

export default function AccountPage() {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [barangay, setBarangay] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "")
      setLastName(user.last_name || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setBarangay(user.barangay || "")
      setPhotoUrl(user.photo_url || "")
      console.log('Loaded user:', user)
      console.log('Loaded barangay:', user.barangay)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!user?.id) {
        toast.error("User not found")
        return
      }

      // Check if email has changed
      const emailChanged = email !== user.email

      // If email changed, show a simple success message
      if (emailChanged) {
        toast.success("Email address updated successfully.")
      }

      // Update user profile in database
      const { data, error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          barangay: barangay,
          photo_url: photoUrl,
        })
        .eq("id", user.id)
        .select()

      if (error) {
        throw error
      }

      // Update local storage with new user data
      const updatedUser = {
        ...user,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        barangay: barangay,
        photo_url: photoUrl,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      // Force reload user from localStorage to update context
      window.location.reload()

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    console.log("Delete account clicked, confirmation:", deleteConfirmation)
    
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion")
      return
    }

    // Test if the function is being called
    console.log("Function is being called - proceeding with deletion")
    toast.info("Starting account deletion process...")

    setIsDeleting(true)
    console.log("Starting account deletion process...")
    
    try {
      console.log("Calling deleteUserAccount server action with userId:", user?.id)
      const result = await deleteUserAccount(user?.id || "")
      console.log("Server action result:", result)
      
      if (result.success) {
        console.log("Account deletion successful")
        toast.success("Account deleted successfully")
        // Clear localStorage and redirect
        localStorage.removeItem("user")
        window.location.href = "/login?message=account-deleted"
      } else {
        console.error("Account deletion failed:", result.error)
        toast.error(result.error || "Failed to delete account")
        setShowDeleteDialog(false)
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("An unexpected error occurred while deleting your account")
      setShowDeleteDialog(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogClose = () => {
    setShowDeleteDialog(false)
    setDeleteConfirmation("")
  }


  if (!user) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={photoUrl || ""} alt={`${firstName} ${lastName}`} />
                    <AvatarFallback className="text-lg">
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <p className="text-sm text-muted-foreground">{user.user_role}</p>
                  </div>
                </div>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
                    <p className="text-sm text-muted-foreground">Paste a direct image link for your profile picture.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                                         <p className="text-sm text-muted-foreground">
                       You can change your email address. The change will be applied immediately.
                     </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Input
                      id="barangay"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      placeholder="Enter your barangay"
                    />
                  </div>
                </div>
                <CardFooter className="px-0">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Change password</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all of your content. This action cannot be undone.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium">Warning: This action is irreversible</p>
                        <ul className="mt-1 space-y-1 text-xs">
                          <li>• All your profile data will be permanently deleted</li>
                          <li>• You will lose access to all events and announcements</li>
                          <li>• Your account cannot be recovered</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  disabled={isDeleting}
                  onClick={() => {
                    console.log("Delete account button clicked")
                    setShowDeleteDialog(true)
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete account"}
                </Button>
                <AlertDialog open={showDeleteDialog} onOpenChange={handleDialogClose}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Delete Account</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>
                          Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-red-800 mb-2">This will permanently:</p>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• Delete your profile and all personal information</li>
                            <li>• Remove your access to all events and announcements</li>
                            <li>• Cancel any event registrations</li>
                            <li>• Delete all your account data from our systems</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">
                            Type <span className="bg-gray-100 px-1 rounded font-mono">DELETE</span> to confirm:
                          </p>
                          <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="font-mono"
                            disabled={isDeleting}
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting} onClick={handleDialogClose}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteConfirmation !== "DELETE"}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting Account..." : "Yes, Delete My Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
