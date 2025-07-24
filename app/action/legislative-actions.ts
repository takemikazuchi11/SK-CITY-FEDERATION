"use server"

import { supabase } from "@/lib/supabase"

type LegislativeDocumentInput = {
  type: "ordinance" | "resolution"
  title: string
  documentNumber: string
  date: string
  dateEnacted?: string
  description?: string
  author?: string
  sponsors?: string[]
  pdfUrl: string
  userId?: string
}

export async function addLegislativeDocument(input: LegislativeDocumentInput) {
  try {
    // Determine which table to insert into based on document type
    const tableName = input.type === "ordinance" ? "ordinance" : "resolution"

    // Prepare the document data
    const documentData: Record<string, any> = {
      title: input.title,
      description: input.description || null,
      date: input.date,
      date_enact: input.dateEnacted || null,
      author: input.author || null,
      sponsors: input.sponsors || [],
      pdf: input.pdfUrl,
      created_at: new Date().toISOString(),
    }

    // Add the appropriate ID field based on document type
    if (input.type === "ordinance") {
      documentData.ordinance_no = input.documentNumber
    } else {
      documentData.resolution_no = input.documentNumber
    }

    // Insert the document into the database
    // Using server action bypasses RLS policies
    const { error } = await supabase.from(tableName).insert(documentData)

    if (error) {
      console.error("Error inserting document:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in addLegislativeDocument:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
