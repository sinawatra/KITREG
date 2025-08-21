"use client";
import Link from 'next/link'
import Image from "next/image";
import { CountingNumber } from './ui/shadcn-io/counting-number';


import { useEffect, useState } from 'react';
import error from 'next/error';
// import { supabaseAdmin } from '@/lib/supabaseAdmin';






export function Footer() {
  // const [memberCount, setMemberCount] = useState(0);

  // useEffect(() => {
  //   async function fetchMemberCount() {
  //     const { count, error } = await supabaseAdmin
  //       .from("auth.users")
  //       .select("*", { count: "exact", head: true }); // head:true only fetches count

  //     if (error) {
  //       console.error(error);
  //     } else {
  //       setMemberCount(count || 12);
  //     }
  //   }
  //   console.log("Supabase count:", memberCount, "Error:", error);
  //   fetchMemberCount();
  // }, []);

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
            <div className="text-sm text-white mb-3 font-medium ">Coordinate By</div>
            <div className="flex justify-center md:justify-end space-x-3">
              {/* Cambodia Flag */}
              <div>
                <Image src="/images/cambodiaFlag.png" alt="Cambodia Flag" width={32} height={24} />
              </div>
              {/* Japan Flag */}
              <div>
                <Image src="/images/japanFlag.webp" alt="Japan Flag" width={32} height={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-red-800 mt-8 pt-4 text-center">
          <p className="text-sm text-white opacity-80">
            © 2024 Kirirom Institute of Technology. All rights reserved.
          </p>
          <br />
          <div>
            Total Register
          </div>
          <CountingNumber
            number={1000}
            inView={true}
            transition={{ stiffness: 3, damping: 30 }}
          />
        </div>
      </div>
    </footer>
  )
}
