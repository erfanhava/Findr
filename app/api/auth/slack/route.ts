import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  
  if (!userId) {
    return NextResponse.json({ error: 'No user ID' }, { status: 400 })
  }
  
  const scopes = [
    'channels:history',
    'groups:history',
    'users:read'
  ].join(',')
  
  const url = `https://slack.com/oauth/v2/authorize?client_id=${
    process.env.SLACK_CLIENT_ID
  }&scope=${scopes}&state=${userId}&redirect_uri=${
    encodeURIComponent(`${process.env.VERCEL_URL}/api/auth/callback/slack`)
  }`
  
  return NextResponse.redirect(url)
}