import React from 'react';
import { HeroIconType } from '@/app/lib/definitions';

interface IconButtonProps {
  icon: HeroIconType;
  onClick: () => void;
  className?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ icon: Icon, onClick, className, ...rest }, ref) => {
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick} {...rest}
      className="text-center bg-white rounded-full mt-0 w-7 h-7 p-1 text-gray-400 focus:outline-none cursor-pointer ring-1 ring-gray-200 hover:shadow-sm hover:ring-gray-300 transition-all duration-150 ease-in-out"
    >
      <Icon className="ml-0"/>
    </button>
  );
});

export default IconButton;