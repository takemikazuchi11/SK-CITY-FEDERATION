"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface HistoryContent {
  title: string
  description: string
  links: {
    title: string
    href: string
  }[]
}

interface HistoryEditorProps {
  isOpen: boolean
  onClose: () => void
  initialContent: HistoryContent
  onSave: (content: HistoryContent) => void
}

export function HistoryEditor({ isOpen, onClose, initialContent, onSave }: HistoryEditorProps) {
  const [content, setContent] = useState<HistoryContent>(initialContent)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent({ ...content, title: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent({ ...content, description: e.target.value })
  }

  const handleLinkTitleChange = (index: number, value: string) => {
    const newLinks = [...content.links]
    newLinks[index].title = value
    setContent({ ...content, links: newLinks })
  }

  const handleLinkHrefChange = (index: number, value: string) => {
    const newLinks = [...content.links]
    newLinks[index].href = value
    setContent({ ...content, links: newLinks })
  }

  const addLink = () => {
    setContent({
      ...content,
      links: [...content.links, { title: "New Resource", href: "#" }],
    })
  }

  const removeLink = (index: number) => {
    const newLinks = [...content.links]
    newLinks.splice(index, 1)
    setContent({ ...content, links: newLinks })
  }

  const handleSave = () => {
    onSave(content)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit History Content</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={content.title} onChange={handleTitleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={content.description}
              onChange={handleDescriptionChange}
              rows={10}
              className="min-h-[200px]"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Related Resources</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLink} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Link
              </Button>
            </div>

            {content.links.map((link, index) => (
              <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
                <Input
                  placeholder="Resource Title"
                  value={link.title}
                  onChange={(e) => handleLinkTitleChange(index, e.target.value)}
                />
                <Input
                  placeholder="URL"
                  value={link.href}
                  onChange={(e) => handleLinkHrefChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

