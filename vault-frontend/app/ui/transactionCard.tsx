import { useState } from 'react';
import clsx from 'clsx';
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';
import IconButton from './iconButton';

interface TransactionCardProps {
  full?: boolean;
  id: number;
  amount: string;
  date: string;
  account: string;
  description: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TransactionCard({ full = true, id, amount, date, account, description, onEdit, onDelete, ...rest }: TransactionCardProps) {
  if (!full) {
    return (
      <div {...rest} className="mb-4 rounded-md">
        <div className="flex flex-row items-center gap-8 px-8 py-3 border transition-all duration-150 ease-in-out bg-white border-gray-200 text-off_black rounded-md">
          <p className="w-24 font-medium text-md truncate">{account}</p>
          <p className="w-24 font-normal text-md text-right">{date}</p>
          <p className="w-20 font-medium text-md text-right">{amount}</p>
          <p className="w-42 font-normal text-md truncate">{description}</p>
        </div>
      </div>
    );
  }

  const [cardOpen, setCardOpen] = useState<boolean>(false);

  return (
    <div
      {...rest}
      className={clsx("mb-4 rounded-md",
        {
          "shadow-[0_10px_40px_0_rgba(0,0,0,0.1)]": cardOpen
        }
      )}
    >
      <div
        className={clsx("flex flex-row items-center gap-8 px-4 py-3 border transition-all duration-150 ease-in-out",
          {
            "bg-white border-gray-200 text-off_black rounded-md": !cardOpen,
            "bg-negative_text border-negative_text text-white rounded-t-md": cardOpen
          }
        )}
      >
        <p className="w-24 font-medium text-md truncate">{account}</p>
        <p className="w-24 font-normal text-md text-right">{date}</p>
        <p className="w-20 font-medium text-md text-right">{amount}</p>
        <p className="w-36 font-normal text-md truncate">{description}</p>
        <button
          onClick={() => setCardOpen(!cardOpen)}
          className={clsx("w-8 rounded-md p-2 focus:outline-none transition-all duration-150 ease-in-out",
            {
              "text-off_gray bg-black/5 hover:bg-black/10 focus:bg-black/10": !cardOpen,
              "text-white bg-black/10 hover:bg-black/20 focus:bg-black/20": cardOpen
            }
          )}
        >
          { cardOpen ? <ChevronUpIcon/> : <ChevronDownIcon/> }
        </button>
      </div>

      { cardOpen &&
        <div className="bg-white p-4 rounded-b-md flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-off_gray font-normal">Transaction Amount</p>
            <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-semibold text-3xl`}>{amount}</p>
          </div>

          <div className="flex flex-col gap-1 w-72">
            <p className="text-sm text-off_gray font-normal">Transaction Description</p>
            <div className="bg-black/5 rounded-md p-2">
              <p className="text-off_black font-normal line-clamp-3">{description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <IconButton icon={PencilIcon} onClick={() => { if (onEdit) onEdit(id) }} blank={false}/>
            <IconButton icon={TrashIcon} onClick={() => { if (onDelete) onDelete(id) }} blank={false}/>
          </div>
          
        </div>
      }
    </div>
  );
}