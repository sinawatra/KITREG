import { LoginForm } from '@/components/login-form'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#9B0000] flex items-center justify-center">
              <span className="text-white font-bold text-sm">KIT</span>
            </div>
            <div>
              <div className="text-[#9B0000] font-bold text-lg">KIT REG</div>
            </div>
          </Link>

          {/* Back to Home */}
          <Link 
            href="/" 
            className="text-gray-600 hover:text-[#9B0000] font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  </div>
)
}
