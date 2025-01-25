import { useState } from 'react';
import clsx from 'clsx';
import { HomeIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';
import IconButton from './iconButton';
import { redirect } from 'next/navigation';

interface BillCardProps {
  full?: boolean;
  isResidenceBill?: boolean;
  id: number;
  name: string;
  category: string;
  dueDate: string;
  total: string;
  onPay?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function BillCard({ full = true, isResidenceBill = false, id, name, category, dueDate, total, onPay, onEdit, onDelete, ...rest }: BillCardProps) {
  if (!full) {
    return (
      <div {...rest} className="mt-4 rounded-md">
        <div className="flex flex-row items-center gap-12 px-4 py-3 border transition-all duration-150 ease-in-out bg-white border-gray-200 text-off_black rounded-md">
          <p className="w-24 font-medium text-md text-right">{total}</p>
          <div className="w-28">
            <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
              {
                "bg-accent text-white": category === 'Residence',
                "bg-blue-100 text-blue-400": category === 'Banking',
                "bg-positive text-positive_text": category === 'Cellular',
                "bg-amber-100 text-yellow-600": category === 'Insurance',
                "bg-negative text-negative_text": category === 'Medical',
                "bg-orange-100 text-orange-600": category === 'Entertainment',
                "bg-gray-100 text-gray-500": category === 'Travel',
                "bg-teal-100 text-teal-500": category === 'Fitness',
                "bg-gray-400 text-white": category === 'Misc'
              }
            )}>{category}</p>
          </div>
          <p className="w-24 font-normal text-md truncate">{name}</p>
          <p className="w-24 font-normal text-md text-right">{dueDate}</p>
        </div>
      </div>
    );
  }

  const [cardOpen, setCardOpen] = useState<boolean>(false);

  return (
    <div
      {...rest}
      className={clsx("mt-4 rounded-md",
        {
          "shadow-[0_10px_40px_0_rgba(0,0,0,0.1)]": cardOpen
        }
      )}
    >
      <div
        className={clsx("flex flex-row justify-center items-center gap-12 px-4 py-3 border transition-all duration-150 ease-in-out",
          {
            "bg-white border-gray-200 text-off_black rounded-md": !cardOpen,
            "bg-negative_text border-negative_text text-white rounded-t-md": cardOpen
          }
        )}
      >
        <p className="w-24 font-medium text-md text-right">{total}</p>
        <div className="w-28">
          <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
            {
              "bg-accent text-white": !cardOpen && category === 'Residence',
              "bg-blue-100 text-blue-400": !cardOpen && category === 'Banking',
              "bg-positive text-positive_text": !cardOpen && category === 'Cellular',
              "bg-amber-100 text-yellow-600": !cardOpen && category === 'Insurance',
              "bg-negative text-negative_text": !cardOpen && category === 'Medical',
              "bg-orange-100 text-orange-600": !cardOpen && category === 'Entertainment',
              "bg-gray-100 text-gray-500": !cardOpen && category === 'Travel',
              "bg-teal-100 text-teal-500": !cardOpen && category === 'Fitness',
              "bg-gray-400 text-white": !cardOpen && category === 'Misc',
              "bg-white/20 text-white": cardOpen
            }
          )}>{category}</p>
        </div>
        <p className="w-24 font-normal text-md truncate">{name}</p>
        <p className="w-24 font-normal text-md text-right">{dueDate}</p>

        <button
          onClick={() => setCardOpen(!cardOpen)}
          className={clsx("w-8 rounded-md p-2 focus:outline-none transition-all duration-150 ease-in-out",
            {
              "text-off_gray bg-black/5 hover:bg-black/10 focus:bg-black/10": !cardOpen,
              "text-white bg-white/20 hover:bg-white/30 focus:bg-white/30": cardOpen
            }
          )}
        >
          { cardOpen ? <ChevronUpIcon/> : <ChevronDownIcon/> }
        </button>
      </div>

      { cardOpen &&
        <div className="bg-white p-4 rounded-b-md flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-off_gray font-normal">Bill Total</p>
            <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-semibold text-3xl`}>{total}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-medium text-2xl`}>Pay by {dueDate}</p>
          </div>

          { isResidenceBill ? (
            <div onClick={() => redirect('/residence')} className="w-36 py-1 flex flex-row justify-center gap-1 text-md text-off_gray rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none transition-all duration-150 ease-in-out">
              <p className="font-normal">Residence Bill</p>
              <HomeIcon className="w-4"></HomeIcon>
            </div>
          ) : (
            <div className="flex flex-row justify-end gap-4 w-36">
              <IconButton icon={CheckIcon} onClick={() => { if (onPay) onPay(id); }} blank={false}/>
              <IconButton icon={PencilIcon} onClick={() => { if (onEdit) onEdit(id); }} blank={false}/>
              <IconButton icon={TrashIcon} onClick={() => { if (onDelete) onDelete(id); }} blank={false}/>
            </div>
          )}
          
        </div>
      }
    </div>
  );
}