'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { pages } from '@/app/lib/constants';
import { dmSans } from '@/app/ui/fonts';
import clsx from 'clsx';

// const links = [
//   { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon, solidIcon: SolidSquares2X2Icon },
//   { name: "Spending", href: "/spending", icon: BanknotesIcon, solidIcon: SolidBanknotesIcon },
//   { name: "Wallet", href: "/wallet", icon: CreditCardIcon, solidIcon: SolidCreditCardIcon },
//   { name: "Bills", href: "/bills", icon: DocumentCurrencyDollarIcon, solidIcon: SolidDocumentCurrencyDollarIcon },
//   { name: "Residence", href: "/residence", icon: HomeIcon, solidIcon: SolidHomeIcon },
//   { name: "Chatbot", href: "/chatbot", icon: ChatBubbleLeftEllipsisIcon, solidIcon: SolidChatBubbleLeftEllipsisIcon },
//   { name: "Settings", href: "/settings", icon: Cog8ToothIcon, solidIcon: SolidCog8ToothIcon }
// ];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col">
      <Link href={"/"} className={`${dmSans.className} antialiased tracking-tighter mb-4 text-primary font-bold text-5xl focus:outline-none hover:drop-shadow-md focus:drop-shadow-md transition-all duration-150 ease-in-out`}>Vault</Link>
      {pages.map((page) => {
        const LinkIcon = pathname === page.href ? page.solidIcon : page.icon;
        return (
          <Link
            key={page.name}
            href={page.href}
            className={clsx(
              "flex flex-row gap-2 text-xl font-medium mb-2 px-1 py-1.5 rounded-lg hover:text-off_black hover:bg-gray-100 transition-all duration-150 ease-in-out",
              {
                "text-off_black bg-gray-100": pathname === page.href,
                "text-off_gray": pathname !== page.href,
              }
            )}
          >
            <LinkIcon className="w-6"/>
            <p>{page.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
