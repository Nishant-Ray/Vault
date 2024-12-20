import clsx from 'clsx';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function Button({ children, href, className, ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      {...rest}
      className={clsx(
        `${dmSans.className} tracking-tight flex h-12 items-center px-10 text-2xl font-bold text-white text-center rounded-3xl hover:shadow-lg transition-all duration-150 ease-in-out bg-primary hover:bg-primary_hover focus:bg-primary_hover active:bg-primary_click focus:outline-none transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-50`,
        className,
      )}
    >
      {children}
    </Link>
  );
}
