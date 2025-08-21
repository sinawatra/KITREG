import { AdminLoginForm } from "@/components/admin-login-form"
import Link from "next/link"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4">
              <div className="text-[#9B0000] font-bold text-lg">KIT REG Admin</div>
            </Link>

            {/* Back to Home */}
            <Link href="/" className="text-gray-600 hover:text-[#9B0000] font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
