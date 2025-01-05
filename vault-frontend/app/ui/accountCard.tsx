import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import Tilt from 'react-parallax-tilt';
import AccountModal from '@/app/ui/accountModal';
import { ACCOUNT_NICKNAME_MODAL_TYPE, ACCOUNT_REMOVE_MODAL_TYPE, AccountNicknameModalData } from '@/app/lib/definitions';
import { changeAccountNickname, removeAccount } from '@/app/lib/data';

interface AccountCardProps {
  name: string;
  id: number;
  nickname: string;
  isCredit: boolean;
  onRemove: (id: number) => void;
}

export default function AccountCard({ name, id, nickname, isCredit, onRemove, ...rest }: AccountCardProps) {
  const [newNickname, setNewNickname] = useState<string>(nickname);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [optionsClicked, setOptionsClicked] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [nicknameModal, setNicknameModal] = useState<boolean>(true);

  const handleOptionsClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOptionsClicked(true);
  };

  const handleNicknameClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsAccountModalOpen(true);
    setNicknameModal(true);
  };

  const handleRemoveClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsAccountModalOpen(true);
    setNicknameModal(false);
  };

  const handleAccountModalClose = () => {
    setIsAccountModalOpen(false);
  };

  const handleAccountNicknameFormSubmit = async (data: AccountNicknameModalData) => {
    setNewNickname(data.nickname);
    await changeAccountNickname(id, data.nickname);
    setIsAccountModalOpen(false);
  };

  const handleAccountRemove = async () => {
    onRemove(id);
    await removeAccount(id);
    setIsAccountModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setOptionsClicked(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Tilt scale={1.04} tiltMaxAngleX={5} tiltMaxAngleY={5} {...rest} className="z-0 w-[20.25rem] h-[12.75rem]">
      { !isCredit && <svg className="absolute mt-3 size-44" version="1.1" viewBox="0.0 0.0 696.6089238845144 672.8818897637796" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l696.60895 0l0 672.8819l-696.60895 0l0 -672.8819z" clipRule="nonzero"/></clipPath><g clipPath="url(#p.0)"><path fill="#000000" fillOpacity="0.0" d="m0 0l696.60895 0l0 672.8819l-696.60895 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-123.648285 619.956l606.86615 0l0 52.91339l-606.86615 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-172.9055 133.92126l352.69293 -133.92126l352.69293 133.92126z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-172.88094 133.94234l705.3858 0l0 14.1102295l-705.3858 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m295.93625 251.27837l113.38583 0l0 343.52753l-113.38583 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m123.10159 251.27837l113.38583 0l0 343.52753l-113.38583 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-49.733063 251.27837l113.38583 0l0 343.52753l-113.38583 0z" fillRule="evenodd"/><path fill="#ffffff" fillOpacity="0.2532" d="m-123.607086 173.20155l606.86615 0l0 52.913376l-606.86615 0z" fillRule="evenodd"/></g></svg> }
      
      <AccountModal modalType={nicknameModal ? ACCOUNT_NICKNAME_MODAL_TYPE : ACCOUNT_REMOVE_MODAL_TYPE} isOpen={isAccountModalOpen} onNicknameSubmit={handleAccountNicknameFormSubmit} onRemove={handleAccountRemove} onClose={handleAccountModalClose}></AccountModal>

      <div className={clsx(
        "bg-gradient-to-r text-white rounded-2xl hover:shadow-md p-6 w-full h-full flex flex-col justify-between",
        { "from-cyan-600 to-accent": isCredit, "from-green-700 to-green-600": !isCredit }
      )}>

        <div className="h-[2.25rem] flex flex-row justify-between items-center z-10">
          <div className="w-[14rem] h-full">
            <h4 className="truncate font-medium text-2xl">{newNickname}</h4>
          </div>
          
          <div onClick={handleOptionsClick} className="w-8 p-1 rounded-full cursor-pointer hover:bg-black/10 transition-all duration-150 ease-in-out">
            <div ref={componentRef}>
              <EllipsisVerticalIcon className="w-full"/>
            </div>
            { optionsClicked && (
              <div className="-translate-x-40 absolute w-44 flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-sm">
                <p onClick={handleNicknameClick} className="px-4 py-2 rounded-t-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Change nickname</p>
                <p onClick={handleRemoveClick} className="px-4 py-2 rounded-b-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Delete</p>
              </div>
            ) }
          </div>
        </div>
        
        { isCredit && (
          <div className="w-[2.5rem] h-[1.75rem] rounded-md bg-[#d5b378] grid grid-rows-3 grid-flow-col">
            <div className="border border-[#b69469] rounded-tl-md"></div>
            <div className="border border-[#b69469]"></div>
            <div className="border border-[#b69469] rounded-bl-md"></div>
            <div className="border border-[#b69469] row-span-3"></div>
            <div className="border border-[#b69469] rounded-tr-md"></div>
            <div className="border border-[#b69469]"></div>
            <div className="border border-[#b69469] rounded-br-md"></div>
          </div>
        )}

        <div className="h-[2rem] flex flex-row justify-between items-end z-10">
          <h4 className="font-medium text-sm">{name}</h4>
          <h4 className="font-light text-sm">{isCredit ? "CREDIT CARD" : "BANK ACCOUNT"}</h4>
        </div>

      </div>
    </Tilt>
  );
}
