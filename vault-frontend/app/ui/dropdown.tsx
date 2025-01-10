import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface DropdownProps {
  list: string[];
  onUpdate: (index: number) => void;
}

export default function Dropdown({ list, onUpdate, ...rest }: DropdownProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [dropdownClicked, setDropdownClicked] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleDropdownClicked = () => {
    setDropdownClicked(true);
  };

  const handleDropdownOptionClicked = (index: number) => {
    setSelectedIndex(index);
    onUpdate(index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setDropdownClicked(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      {...rest}
      className="bg-white text-md font-normal text-off_gray rounded-full px-4 py-1 border border-gray-100 flex flex-row justify-between gap-2 cursor-pointer hover:shadow-sm hover:border-gray-200 transition-all duration-150 ease-in-out"
      ref={componentRef}
      onClick={handleDropdownClicked}
    >
      <p>{list.length ? list[selectedIndex] : ''}</p>
      <ChevronDownIcon className="w-4"/>
      { dropdownClicked && (
        <div className="absolute mt-7 flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-sm">
          {list.map((listOption, i) => {
            return (
              <p 
                key={i}
                onClick={() => handleDropdownOptionClicked(i)}
                className={clsx("text-md px-4 py-1 transition-all duration-150 ease-in-out cursor-pointer",
                  {
                    "bg-[#3297FD] text-white": i === selectedIndex,
                    "hover:bg-gray-100 bg-white text-black": i !== selectedIndex,
                    "rounded-t-md": i === 0,
                    "rounded-b-md": i === list.length - 1
                  }
                )}
              >
                {listOption}
              </p>
            );
          })}
        </div>
      ) }
    </div>
  );
}
