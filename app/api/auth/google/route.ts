import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin } from '@/lib/db'
import { encrypt } from '@/lib/encryption'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.VERCEL_URL}/api/auth/callback/google`
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  
  if (!userId) return NextResponse.json({ error: 'No user ID' }, { status: 400 })
  
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/documents.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/calendar.readonly'
  ]
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: userId,
    prompt: 'consent'
  })
  
  return NextResponse.redirect(url)
}
