'use client';

import { dmSans } from '@/app/ui/fonts';
import SideNav from '@/app/ui/sideNav';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-row">
        <div className="sticky top-0 left-0 bg-white min-w-60 h-screen px-3 py-4 flex flex-col shadow-sm z-10">
          <SideNav/>
        </div>

        <div className="flex flex-col w-full">
          
          <div className="z-50 sticky top-0 left-0 w-full flex flex-row h-20 items-center px-5 bg-white shadow-sm z-0">
            <div className="w-full h-full flex justify-start items-center">
              <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-3xl font-bold`}>{pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}</h1>
            </div>

            <div className="w-full h-full flex flex-row justify-end items-center gap-x-4">
              <div className="w-10 h-10 rounded-full text-off_black bg-white hover:bg-gray-200 flex justify-center items-center">
                <BellIcon className="w-6"/>
              </div>
              <UserCircleIcon className="w-12 h-12 text-gray-300"/>
            </div>  
          </div>

          <div className="w-full bg-off_white p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
