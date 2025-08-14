import { ForgotPasswordForm } from '@/components/forgot-password-form'
import Link from 'next/link'

export default function ForgotPasswordPage() {
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
                <div className="text-xs text-gray-600">
                  Keitman<br />
                  Institute of<br />
                  Technology
                </div>
              </div>
            </Link>

            {/* Back to Login */}
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-[#9B0000] font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
