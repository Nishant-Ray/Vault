'use client';

import { dmSans } from '@/app/ui/fonts';
import SideNav from '@/app/ui/sideNav';
import { usePathname } from 'next/navigation';
import { pageTitles } from '@/app/lib/constants';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-row">
        <div className="sticky top-0 left-0 bg-white w-80 h-screen px-3 py-4 flex flex-col shadow-sm z-10">
          <SideNav/>
        </div>

        <div className="flex flex-col w-full">
          
          <div className="sticky top-0 left-0 w-full flex flex-row h-20 items-center px-5 bg-white shadow-sm z-0">
            <div className="w-full h-full flex justify-start items-center">
              <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-3xl font-bold`}>{pageTitles[pathname]}</h1>
            </div>

            <div className="w-full h-full flex flex-row justify-end items-center gap-x-6">
              <div className="w-10 h-10 rounded-3xl bg-green-400"/>
              <div className="w-10 h-10 rounded-3xl bg-orange-400"/>
            </div>  
          </div>

          <div className="w-full bg-off_white p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
