'use client';

import { dmSans } from "../ui/fonts";
import SideNav from "../ui/sideNav";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/spending': 'Spending',
    '/wallet': 'Wallet',
    '/bills': 'Bills',
    '/residence': 'Residence',
    '/chatbot': 'Chatbot',
    '/settings': 'Settings',
  };

  return (
    <div>
      <div className="flex flex-row">
        <div className="bg-white w-80 h-screen px-3 py-4 flex flex-col">
          <SideNav/>
        </div>

        <div className="flex flex-col w-full">
          
          <div className="w-full flex flex-row h-20 items-center px-5 bg-white">
            <div className="w-full h-full flex justify-start items-center">
              <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-4xl font-bold`}>{titles[pathname]}</h1>
            </div>

            <div className="w-full h-full flex flex-row justify-end items-center gap-x-6">
              <div className="w-10 h-10 bg-green-400"/>
              <div className="w-10 h-10 bg-orange-400"/>
            </div>  
          </div>

          <div className="w-full bg-off_white">{children}</div>
        </div>
      </div>
    </div>
  );
}
