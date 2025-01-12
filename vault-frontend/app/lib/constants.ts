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

export const pages = [
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon, solidIcon: SolidSquares2X2Icon },
  { name: "Wallet", href: "/wallet", icon: CreditCardIcon, solidIcon: SolidCreditCardIcon },
  { name: "Spending", href: "/spending", icon: BanknotesIcon, solidIcon: SolidBanknotesIcon },
  { name: "Bills", href: "/bills", icon: DocumentCurrencyDollarIcon, solidIcon: SolidDocumentCurrencyDollarIcon },
  { name: "Residence", href: "/residence", icon: HomeIcon, solidIcon: SolidHomeIcon },
  { name: "Chatbot", href: "/chatbot", icon: ChatBubbleLeftEllipsisIcon, solidIcon: SolidChatBubbleLeftEllipsisIcon },
  { name: "Settings", href: "/settings", icon: Cog8ToothIcon, solidIcon: SolidCog8ToothIcon }
];

export const months: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const transactionCategories = [];

export const billCategories = ['Credit Card', 'Rent', 'Utilities', 'Wi-Fi', 'Cellular', 'Insurance', 'Medical', 'Entertainment', 'Transportation', 'Medical', 'Fitness', 'Misc.'];

export const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";