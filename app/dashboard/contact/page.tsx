"use client"

import Link from "next/link"
import { ArrowLeft, Phone, Mail, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getContacts, addContact, updateContact, deleteContact, ContactInfo } from "@/lib/contact-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const categoryColors = {
  "National Agency": "bg-blue-100 text-blue-800",
  "Constitutional Body": "bg-purple-100 text-purple-800",
  "Government Bank": "bg-green-100 text-green-800",
  "Local Government": "bg-orange-100 text-orange-800",
  "Youth Organization": "bg-pink-100 text-pink-800",
  "Law Enforcement": "bg-red-100 text-red-800",
  "Emergency Services": "bg-red-100 text-red-800",
  "Health Services": "bg-teal-100 text-teal-800",
}

const isAdmin = true // TODO: Replace with real admin check

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)
  const [form, setForm] = useState<ContactInfo>({
    name: "",
    fullName: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    hours: "",
    description: "",
  })
  const { toast } = useToast()
  const [pendingDelete, setPendingDelete] = useState<ContactInfo | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    setLoading(true)
    setError(null)
    try {
      const data = await getContacts()
      setContacts(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function openAddDialog() {
    setEditingContact(null)
    setForm({
      name: "",
      fullName: "",
      category: "",
      phone: "",
      email: "",
      address: "",
      hours: "",
      description: "",
    })
    setShowDialog(true)
  }

  function openEditDialog(contact: ContactInfo) {
    setEditingContact(contact)
    setForm(contact)
    setShowDialog(true)
  }

  async function handleSave() {
    try {
      if (editingContact && editingContact.id) {
        await updateContact({ ...form, id: editingContact.id })
        toast({ title: "Contact updated!", description: `${form.name} was updated successfully.` })
      } else {
        await addContact(form)
        toast({ title: "Contact added!", description: `${form.name} was added successfully.` })
      }
      setShowDialog(false)
      fetchContacts()
    } catch (e: any) {
      let msg = e.message || "An error occurred."
      if (msg.includes("fullName")) {
        msg = "Database error: Could not find the 'fullName' column. Please check your database column name. It should be 'fullname' (all lowercase) or update your code to match the database.";
      }
      toast({ title: "Error", description: msg, variant: "destructive" })
    }
  }

  async function handleDelete(id: number | undefined) {
    if (!id) return
    try {
      await deleteContact(id)
      toast({ title: "Contact deleted!", description: `Contact was deleted successfully.` })
      fetchContacts()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "An error occurred.", variant: "destructive" })
    }
    setPendingDelete(null)
  }

  const categories = Array.from(new Set(contacts.map((contact) => contact.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            {isAdmin && (
              <Button onClick={openAddDialog} className="ml-4">Add Contact</Button>
            )}
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-2 text-gray-600">
              Get in touch with government departments and agencies in Calapan City, Oriental Mindoro
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  const element = document.getElementById(category.replace(/\s+/g, "-").toLowerCase())
                  element?.scrollIntoView({ behavior: "smooth" })
                }}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading contacts...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            {/* Contact Cards by Category */}
            {categories.map((category) => (
              <div key={category} id={category.replace(/\s+/g, "-").toLowerCase()} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-200 pb-2">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contacts
                    .filter((contact) => contact.category === category)
                    .map((contact, index) => (
                      <Card key={contact.id || index} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-900">{contact.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{contact.fullName}</p>
                            </div>
                            <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                              {contact.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-700">{contact.description}</p>
                          <div className="space-y-3">
                            {contact.phone && (
                              <div className="flex items-start space-x-3">
                                <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Phone</p>
                                  <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                                    {contact.phone}
                                  </a>
                                </div>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-start space-x-3">
                                <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Email</p>
                                  <a
                                    href={`mailto:${contact.email}`}
                                    className="text-sm text-blue-600 hover:text-blue-800 break-all"
                                  >
                                    {contact.email}
                                  </a>
                                </div>
                              </div>
                            )}
                            <div className="flex items-start space-x-3">
                              <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Address</p>
                                <p className="text-sm text-gray-700">{contact.address}</p>
                              </div>
                            </div>
                            {contact.hours && (
                              <div className="flex items-start space-x-3">
                                <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Office Hours</p>
                                  <p className="text-sm text-gray-700">{contact.hours}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {isAdmin && (
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" onClick={() => openEditDialog(contact)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => setPendingDelete(contact)}>Delete</Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Emergency Contacts Section */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-semibold text-red-900">Police Emergency</p>
              <a href="tel:911" className="text-2xl font-bold text-red-600 hover:text-red-800">
                911
              </a>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-900">Fire Emergency</p>
              <a href="tel:911" className="text-2xl font-bold text-red-600 hover:text-red-800">
                911
              </a>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-900">Disaster Response</p>
              <a href="tel:911" className="text-2xl font-bold text-red-600 hover:text-red-800">
                911
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Office hours may vary during holidays and special occasions</li>
            <li>• For urgent matters outside office hours, contact the respective emergency numbers</li>
            <li>• Some services may require appointments or prior coordination</li>
            <li>• Contact information is subject to change - please verify before visiting</li>
          </ul>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg w-full sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add Contact"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="grid gap-4 py-4">
              <Input autoFocus placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              <Select value={form.category} onValueChange={value => setForm(f => ({ ...f, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <Input placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Hours" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
                <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" type="button" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button type="submit">{editingContact ? "Update" : "Add"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!pendingDelete} onOpenChange={open => { if (!open) setPendingDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <b>{pendingDelete?.name}</b>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(pendingDelete?.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
