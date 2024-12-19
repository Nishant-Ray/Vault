'use client';

import {
  Squares2X2Icon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentCurrencyDollarIcon,
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';
import {
  Squares2X2Icon as SolidSquares2X2Icon,
  BanknotesIcon as SolidBanknotesIcon,
  CreditCardIcon as SolidCreditCardIcon,
  DocumentCurrencyDollarIcon as SolidDocumentCurrencyDollarIcon,
  HomeIcon as SolidHomeIcon,
  ChatBubbleLeftEllipsisIcon as SolidChatBubbleLeftEllipsisIcon,
  Cog8ToothIcon as SolidCog8ToothIcon
} from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { dmSans } from '@/app/ui/fonts';
import clsx from 'clsx';

const links = [
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon, solidIcon: SolidSquares2X2Icon },
  { name: "Spending", href: "/spending", icon: BanknotesIcon, solidIcon: SolidBanknotesIcon },
  { name: "Wallet", href: "/wallet", icon: CreditCardIcon, solidIcon: SolidCreditCardIcon },
  { name: "Bills", href: "/bills", icon: DocumentCurrencyDollarIcon, solidIcon: SolidDocumentCurrencyDollarIcon },
  { name: "Residence", href: "/residence", icon: HomeIcon, solidIcon: SolidHomeIcon },
  { name: "Chatbot", href: "/chatbot", icon: ChatBubbleLeftEllipsisIcon, solidIcon: SolidChatBubbleLeftEllipsisIcon },
  { name: "Settings", href: "/settings", icon: Cog8ToothIcon, solidIcon: SolidCog8ToothIcon }
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col">
      <Link href={"/"} className={`${dmSans.className} antialiased tracking-tighter mb-4 text-primary font-bold text-5xl`}>Vault</Link>
      {links.map((link) => {
        const LinkIcon = pathname === link.href ? link.solidIcon : link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex flex-row gap-2 text-xl font-medium mb-2 px-1 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-150 ease-in-out",
              {
                "text-off_black bg-gray-100": pathname === link.href
              }
            )}
          >
            <LinkIcon className="w-6"/>
            <p>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
