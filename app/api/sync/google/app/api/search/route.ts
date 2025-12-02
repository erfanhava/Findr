import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export const runtime = 'edge'
export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const orgId = searchParams.get('org_id')
    
    if (!query || !orgId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    // Simple full-text search with Supabase
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, content, url, metadata, indexed_at')
      .eq('org_id', orgId)
      .textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(20)
    
    if (error) throw error
    
    // Format results
    const results = (data || []).map(doc => ({
      id: doc.id,
      title: doc.title,
      snippet: getSnippet(doc.content, query),
      url: doc.url,
      source: doc.metadata?.mimeType?.includes('google') ? 'Google Drive' : 'Unknown',
      score: 1 // Simple ranking
    }))
    
    // Cache at edge for 5 minutes
    const response = NextResponse.json({ results })
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

function getSnippet(content: string, query: string): string {
  const index = content.toLowerCase().indexOf(query.toLowerCase())
  const start = Math.max(0, index - 50)
  const end = Math.min(content.length, index + 100)
  let snippet = content.substring(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  return snippet
}
