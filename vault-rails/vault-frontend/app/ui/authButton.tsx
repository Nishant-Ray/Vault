import clsx from 'clsx';
import { dmSans } from '@/app/ui/fonts';

interface AuthButtonProps {
  children: React.ReactNode;
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
}

export default function AuthButton({ children, type, className, ...rest }: AuthButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={clsx(
        `${dmSans.className} antialiased tracking-tighter my-6 text-white font-bold rounded-3xl text-xl w-full h-12 bg-primary hover:bg-primary_hover focus:bg-primary_hover active:bg-primary_click focus:outline-none text-center hover:shadow-lg transition-all duration-150 ease-in-out aria-disabled:cursor-not-allowed aria-disabled:opacity-50`,
        className,
      )}
    >
      {children}
    </button>
  );
}
