'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'

export default function DashboardPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search across all your tools</h1>
        <p className="text-gray-600">
          Find documents, messages, and files from Google Drive, Slack, Notion, and more
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <SearchBar onSearch={handleSearch} />
        
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <SearchResults results={results} />
        )}

        {!loading && results.length === 0 && (
          <div className="mt-12 text-center text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg">Search for anything across your connected tools</p>
            <p className="text-sm mt-2">Try "Q4 roadmap" or "marketing budget"</p>
          </div>
        )}
      </div>
    </div>
  )
}
