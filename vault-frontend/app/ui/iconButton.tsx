import React from 'react';
import { HeroIconType } from '@/app/lib/definitions';

interface IconButtonProps {
  blank?: boolean;
  icon: HeroIconType;
  onClick: () => void;
  className?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ blank = true, icon: Icon, onClick, className, ...rest }, ref) => {
  if (blank) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick} {...rest}
        className="text-center bg-white rounded-full mt-0 w-7 h-7 p-1 text-gray-400 focus:outline-none cursor-pointer ring-1 ring-gray-200 hover:shadow-sm hover:ring-gray-300 transition-all duration-150 ease-in-out"
      >
        <Icon className="ml-0"/>
      </button>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick} {...rest}
      className="text-center rounded-md mt-0 w-8 h-8 p-2 text-off_gray focus:outline-none cursor-pointer bg-black/5 hover:bg-black/10 focus:bg-black/10 transition-all duration-150 ease-in-out"
    >
      <Icon className="ml-0"/>
    </button>
  );
});

export default IconButton;