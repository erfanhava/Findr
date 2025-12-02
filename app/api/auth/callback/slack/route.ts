import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const userId = searchParams.get('state')
    
    if (!code || !userId) {
      return NextResponse.redirect('/dashboard?error=auth_failed')
    }
    
    // TODO: Exchange code for tokens and store in DB
    return NextResponse.redirect('/dashboard?source=google&status=connected')
  } catch (error) {
    return NextResponse.redirect('/dashboard?error=auth_failed')
  }
}