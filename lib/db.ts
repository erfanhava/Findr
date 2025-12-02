import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Database types
export interface Document {
  id: string
  org_id: string
  source_id: string
  title: string
  content: string
  url: string
  metadata: any
  indexed_at: string
  search_vector: string
}

export interface Source {
  id: string
  org_id: string
  type: 'google_drive' | 'slack' | 'notion' | 'github' | 'figma'
  external_id: string
  config: any
  last_synced: string
}
