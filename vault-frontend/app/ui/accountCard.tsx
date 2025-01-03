import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

interface AccountCardProps {
  name: string;
  nickname: string;
  isCredit: boolean;
  className?: string;
}

export default function AccountCard({ name, nickname, isCredit, className, ...rest }: AccountCardProps) {
  const [optionsClicked, setOptionsClicked] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handleOptionsClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOptionsClicked(true);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setOptionsClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      {...rest}
      className={clsx(
        "bg-gradient-to-l text-white rounded-2xl p-0 w-[20.25rem] h-[12.75rem]",
        { "from-accent to-cyan-600": isCredit, "from-green-600 to-[#528059]": !isCredit },
        className,
      )}
    >
      { !isCredit && <svg className="absolute mt-3 size-44" version="1.1" viewBox="0.0 0.0 696.6089238845144 672.8818897637796" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l696.60895 0l0 672.8819l-696.60895 0l0 -672.8819z" clipRule="nonzero"/></clipPath><g clipPath="url(#p.0)"><path fill="#000000" fillOpacity="0.0" d="m0 0l696.60895 0l0 672.8819l-696.60895 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-123.648285 619.956l606.86615 0l0 52.91339l-606.86615 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-172.9055 133.92126l352.69293 -133.92126l352.69293 133.92126z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-172.88094 133.94234l705.3858 0l0 14.1102295l-705.3858 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m295.93625 251.27837l113.38583 0l0 343.52753l-113.38583 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m123.10159 251.27837l113.38583 0l0 343.52753l-113.38583 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-49.733063 251.27837l113.38583 0l0 343.52753l-113.38583 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-123.607086 173.20155l606.86615 0l0 52.913376l-606.86615 0z" fillRule="evenodd"/></g></svg> }
      
      <div className="p-6 w-full h-full flex flex-col justify-between">

        <div className="h-[2.25rem] flex flex-row justify-between items-center z-10">
          <div className="w-[14rem] h-full">
            <h4 className="truncate font-medium text-2xl">{nickname}</h4>
          </div>
          
          <div onClick={handleOptionsClick} className="w-8 p-1 rounded-full cursor-pointer hover:bg-black/10 transition-all duration-150 ease-in-out">
            <div ref={componentRef}>
              <EllipsisVerticalIcon className="w-full"/>
            </div>
            { optionsClicked && (
              <div className="absolute flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-sm">
                <p className="px-4 py-2 rounded-t-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Change nickname</p>
                <p className="px-4 py-2 rounded-b-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Delete</p>
              </div>
            ) }
          </div>
        </div>
        
        { isCredit && (
          <div className="w-[2.5rem] h-[1.75rem] rounded-md bg-[#d5b378] grid grid-rows-3 grid-flow-col">
            <div className="border border-[#b8966b] rounded-tl-md"></div>
            <div className="border border-[#b8966b]"></div>
            <div className="border border-[#b8966b] rounded-bl-md"></div>
            <div className="border border-[#b8966b] row-span-3"></div>
            <div className="border border-[#b8966b] rounded-tr-md"></div>
            <div className="border border-[#b8966b]"></div>
            <div className="border border-[#b8966b] rounded-br-md"></div>
          </div>
        )}

        <div className="h-[2rem] flex flex-row justify-between items-end z-10">
          <h4 className="font-medium text-sm">{name}</h4>
          <h4 className="font-light text-sm">{isCredit ? "CREDIT CARD" : "BANK ACCOUNT"}</h4>
        </div>

      </div>
    </div>
  );
}
