import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#9B0000] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left side - KITREG and description */}
          <div className="mb-6 md:mb-0 flex-1">
            <div className="mb-3">
              <h2 className="text-2xl font-bold text-white">KITREG</h2>
            </div>
            <p className="text-sm text-white max-w-md leading-relaxed">
              Reserve for the available events in the Kirirom Institute of Technology at the earliest
            </p>
          </div>

          {/* Center - Navigation */}
          <nav className="flex flex-row space-x-6 mb-6 md:mb-0 flex-1 justify-center">
            <Link href="/workshop" className="text-white hover:text-gray-200 text-sm font-medium">
              Workshop
            </Link>
            <Link href="/job-offers" className="text-white hover:text-gray-200 text-sm font-medium">
              Job offer
            </Link>
            <Link href="/announcement" className="text-white hover:text-gray-200 text-sm font-medium">
              Announcement
            </Link>
            <Link href="/activity" className="text-white hover:text-gray-200 text-sm font-medium">
              Activity
            </Link>
          </nav>

          {/* Right side - Coordinate By with flags */}
          <div className="text-center flex-1 md:text-right">
            <div className="text-sm text-white mb-3 font-medium">Coordinate By</div>
            <div className="flex justify-center md:justify-end space-x-3">
              {/* Cambodia Flag */}
              <div className="w-8 h-6 relative overflow-hidden rounded-sm shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-600"></div>
                <div className="absolute top-1/3 left-0 w-full h-1/3 bg-red-600"></div>
                <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                </div>
              </div>
              
              {/* Japan Flag */}
              <div className="w-8 h-6 relative overflow-hidden rounded-sm shadow-sm">
                <div className="absolute inset-0 bg-white"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-red-800 mt-8 pt-4 text-center">
          <p className="text-sm text-white opacity-80">
            © 2024 Kirirom Institute of Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
