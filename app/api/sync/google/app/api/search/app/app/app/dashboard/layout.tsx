import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              StartupSearch
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Search
              </Link>
              <Link href="/dashboard/sources" className="text-gray-700 hover:text-blue-600">
                Sources
              </Link>
              <Link href="/dashboard/settings" className="text-gray-700 hover:text-blue-600">
                Settings
              </Link>
            </div>
          </div>
          <UserButton />
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
