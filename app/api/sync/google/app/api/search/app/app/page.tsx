import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">StartupSearch</div>
        <div className="flex gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Dashboard
            </Link>
          </SignedIn>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Google for your startup's scattered knowledge
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          One search across Google Drive, Slack, Notion, GitHub, and Figma.
          Find anything in seconds, not hours.
        </p>
        
        <div className="flex justify-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700">
                Start Searching Free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700">
              Go to Dashboard
            </Link>
          </SignedIn>
          <a href="#features" className="px-8 py-3 border-2 border-gray-300 text-gray-700 text-lg rounded-lg hover:border-blue-600">
            Learn More
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="text-blue-600 text-2xl mb-2">🚀</div>
            <h3 className="font-bold mb-2">5-Minute Setup</h3>
            <p className="text-gray-600">Connect your tools and search immediately</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="text-blue-600 text-2xl mb-2">💰</div>
            <h3 className="font-bold mb-2">Free for Small Teams</h3>
            <p className="text-gray-600">Up to 10 users, no credit card required</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="text-blue-600 text-2xl mb-2">🔍</div>
            <h3 className="font-bold mb-2">Instant Search</h3>
            <p className="text-gray-600">Find anything across all your apps</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="text-blue-600 text-2xl mb-2">🛡️</div>
            <h3 className="font-bold mb-2">Privacy First</h3>
            <p className="text-gray-600">Your data stays yours, always encrypted</p>
          </div>
        </div>
      </main>
    </div>
  )
}
