'use client';

import { useState, useRef, useEffect } from 'react';
import { dmSans } from '@/app/ui/fonts';
import SideNav from '@/app/ui/sideNav';
import IconButton from '@/app/ui/iconButton';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const openNotifications = () => {
    setNotificationsOpen(true);
  };

  const closeNotifications = () => {
    setNotificationsOpen(false);
  };

  const NotificationsContainer = () => {
    return (
      <div className="top-16 right-20 ml-0 absolute w-72 p-4 flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-lg">
        <div className="flex flex-row justify-between">
          <p className="text-lg font-medium">Notifications</p>
          <IconButton icon={XMarkIcon} onClick={closeNotifications} outline={false}/>
        </div>
        
        <div>
          <p>John invited you to join Apartment_Name</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
              <div ref={buttonRef} onClick={openNotifications} className="w-10 h-10 rounded-full text-off_black bg-white hover:bg-gray-200 flex justify-center items-center">
                <BellIcon className="w-6"/>
              </div>
              { notificationsOpen && 
                <NotificationsContainer/>
              }
              <UserCircleIcon className="w-12 h-12 text-gray-300"/>
            </div>  
          </div>

          <div className="w-full bg-off_white p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
