"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { searchBarangays } from "@/lib/data-service"

interface Barangay {
  id: number
  name: string
  district: string
}

interface BarangaySearchProps {
  onBarangaySelect: (barangayId: number) => void
}

export function BarangaySearch({ onBarangaySelect }: BarangaySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Barangay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsLoading(true)
        const results = await searchBarangays(searchQuery)
        setSearchResults(results)
        setIsLoading(false)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length > 0) {
      setIsLoading(true)
      const results = await searchBarangays(searchQuery)
      setSearchResults(results)
      setIsLoading(false)
      setShowResults(true)
    }
  }

  const handleBarangayClick = (barangayId: number) => {
    onBarangaySelect(barangayId)
    setShowResults(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a barangay (e.g., Suqui, Lazareto)"
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button
          type="submit"
          className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div className="mt-2 text-center text-gray-600">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Searching...
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {searchResults.map((barangay) => (
              <li
                key={barangay.id}
                onClick={() => handleBarangayClick(barangay.id)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              >
                <span className="font-medium">{barangay.name}</span>
                <span className="text-sm text-gray-500">District {barangay.district}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && searchResults.length === 0 && !isLoading && (
        <div className="mt-2 text-center text-gray-600">No barangays found matching "{searchQuery}"</div>
      )}
    </div>
  )
}

