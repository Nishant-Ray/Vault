import clsx from 'clsx';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  size?: string;
}

export default function Button({ children, href, size = 'lg', ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      {...rest}
      className={clsx(
        `${dmSans.className} tracking-tight flex items-center max-w-fit font-bold text-white text-center rounded-3xl hover:shadow-lg transition-all duration-150 ease-in-out bg-primary hover:bg-primary_hover focus:bg-primary_hover active:bg-primary_click focus:outline-none transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-50`,
        { "h-12 px-10 text-2xl": size === "lg",
          "h-8 px-6 text-lg": size === "md",
          "h-8 px-4 text-sm": size === "sm"
        },
      )}
    >
      {children}
    </Link>
  );
}
