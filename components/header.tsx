'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Image
              src="/images/kit-reg-logo.png"
              alt="KIT REG Logo"
              width={150} // Adjust width as needed for proper display
              height={50} // Adjust height as needed for proper display
              className="h-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/workshop" className="text-[#9B0000] hover:text-[#8A0000] font-medium">
              Workshop
            </Link>
            <Link href="/job-offers" className="text-[#9B0000] hover:text-[#8A0000] font-medium">
              Job Offers
            </Link>
            <Link href="/announcement" className="text-[#9B0000] hover:text-[#8A0000] font-medium">
              Announcement
            </Link>
            <Link href="/activity" className="text-[#9B0000] hover:text-[#8A0000] font-medium">
              Activity
            </Link>
          </nav>

          {/* Login Button */}
          <Link href="/login">
            <Button className="bg-[#9B0000] hover:bg-[#8A0000] text-white px-6">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
