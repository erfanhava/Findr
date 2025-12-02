import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin } from '@/lib/db'
import { decrypt } from '@/lib/encryption'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  
  if (!userId) {
    return NextResponse.json({ error: 'No user ID' }, { status: 400 })
  }
  
  try {
    // Get user's encrypted tokens
    const { data: account } = await supabaseAdmin
      .from('connected_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single()
    
    if (!account) {
      return NextResponse.json({ error: 'No Google account' }, { status: 400 })
    }
    
    // Decrypt tokens
    const accessToken = decrypt(
      account.access_token,
      account.access_iv,
      account.access_tag
    )
    
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: account.refresh_token ? decrypt(
        account.refresh_token,
        account.refresh_iv,
        account.refresh_tag
      ) : undefined
    })
    
    // Fetch Drive files
    const drive = google.drive({ version: 'v3', auth: oauth2Client })
    const files = await drive.files.list({
      pageSize: 100,
      fields: 'files(id, name, mimeType, webViewLink, modifiedTime)',
      orderBy: 'modifiedTime desc'
    })
    
    // Process each file
    for (const file of files.data.files || []) {
      let content = ''
      
      if (file.mimeType === 'application/vnd.google-apps.document') {
        // Google Doc
        const docs = google.docs({ version: 'v1', auth: oauth2Client })
        const doc = await docs.documents.get({ documentId: file.id! })
        content = doc.data.body?.content?.map((c: any) => 
          c.paragraph?.elements?.map((e: any) => e.textRun?.content).join('')
        ).join(' ') || ''
      } else if (file.mimeType?.includes('text/')) {
        // Text file
        const fileData = await drive.files.get({
          fileId: file.id!,
          alt: 'media'
        }, { responseType: 'text' })
        content = fileData.data as string
      }
      
      if (content) {
        await supabaseAdmin.from('documents').upsert({
          org_id: account.org_id,
          source_id: account.id,
          external_id: file.id,
          title: file.name || 'Untitled',
          content: content.substring(0, 10000), // Limit content
          url: file.webViewLink,
          metadata: file,
          indexed_at: new Date().toISOString()
        }, {
          onConflict: 'org_id,external_id'
        })
      }
    }
    
    return NextResponse.json({ success: true, count: files.data.files?.length || 0 })
  } catch (error) {
    console.error('Google sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
