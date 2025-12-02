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
  const code = searchParams.get('code')
  const userId = searchParams.get('state')
  
  if (!code || !userId) {
    return NextResponse.redirect('/dashboard?error=auth_failed')
  }
  
  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Encrypt and store tokens
    const encryptedAccess = encrypt(tokens.access_token!)
    const encryptedRefresh = tokens.refresh_token ? encrypt(tokens.refresh_token) : null
    
    await supabaseAdmin.from('connected_accounts').insert({
      user_id: userId,
      provider: 'google',
      provider_user_id: '', // Will get from API
      access_token: encryptedAccess.encrypted,
      refresh_token: encryptedRefresh?.encrypted,
      access_iv: encryptedAccess.iv,
      access_tag: encryptedAccess.tag,
      refresh_iv: encryptedRefresh?.iv,
      refresh_tag: encryptedRefresh?.tag,
      scopes: tokens.scope?.split(' ') || [],
      expires_at: new Date(tokens.expiry_date!).toISOString()
    })
    
    // Start initial sync
    await fetch(`${process.env.VERCEL_URL}/api/sync/google?user_id=${userId}`, {
      method: 'POST'
    })
    
    return NextResponse.redirect('/dashboard?source=google&status=connected')
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.redirect('/dashboard?error=auth_failed')
  }
}
