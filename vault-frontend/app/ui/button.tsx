import React from 'react';
import clsx from 'clsx';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

type BaseButtonProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  buttonType?: 'action' | 'auth' | 'neutral';
  className?: string;
}

type LinkButtonProps = BaseButtonProps & {
  href: string;
  onClick?: never;
  type?: never;
}

type ActionButtonProps = BaseButtonProps & {
  href?: never;
  onClick: () => void;
  type?: never;
}

type FormButtonProps = BaseButtonProps & {
  href?: never;
  onClick?: never;
  type: "button" | "submit" | "reset" | undefined;
}

type ButtonProps = LinkButtonProps | ActionButtonProps | FormButtonProps;

const Button = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(({ children, href, onClick, size = 'xl', buttonType = 'action', type, className, ...rest }, ref) => {
  const buttonClasses = clsx(
    `${dmSans.className} tracking-tight flex items-center justify-center font-bold rounded-3xl hover:shadow-sm transition-all duration-150 ease-in-out focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50`,
    {
      "h-12 px-10 text-2xl": size === 'xl',
      "h-12 text-xl": size === 'lg',
      "h-8 px-6 text-lg": size === 'md',
      "h-8 px-4 text-sm": size === 'sm',
      "text-white bg-primary hover:bg-primary_hover focus:bg-primary_hover active:bg-primary_click": buttonType === 'action' || buttonType === 'auth',
      "text-off_black bg-gray-200 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-300": buttonType === 'neutral',
      "max-w-fit": buttonType === 'action' || buttonType === 'neutral',
      "w-full my-6": buttonType === 'auth'
    },
    className
  );

  if (href) {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...rest} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  if (type) {
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} type={type} {...rest} className={buttonClasses}>
        {children}
      </button>
    );
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} onClick={onClick} {...rest} className={buttonClasses}>
      {children}
    </button>
  );
});

export default Button;