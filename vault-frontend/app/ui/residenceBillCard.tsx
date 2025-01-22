import { useState } from 'react';
import clsx from 'clsx';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon, PencilIcon, TrashIcon, UserCircleIcon, DocumentCurrencyDollarIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';
import IconButton from './iconButton';

interface ResidenceBillCardProps {
  id: number;
  category: string;
  dueDate: string;
  total: string;
  onPay?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ResidenceBillCard({ id, category, dueDate, total, onPay, onEdit, onDelete, ...rest }: ResidenceBillCardProps) {
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

        <div className="w-24">
          <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
            {
              "bg-positive text-positive_text": !cardOpen,
              "bg-white/20 text-white": cardOpen
            }
          )}>{category}</p>
        </div>

        <p className="w-24 font-normal text-md text-right">{dueDate}</p>

        <div className="w-20">
          <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
            {
              "bg-positive text-positive_text": !cardOpen,
              "bg-white/20 text-white": cardOpen
            }
          )}>Not Paid</p>
        </div>

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
        <div className="flex flex-col">
          <div className="bg-white flex flex-col items-center gap-1 p-4">
            <div className="max-w-fit flex flex-row justify-center gap-8 px-4 py-2 bg-gray-100 rounded-md text-off_black font-normal text-sm">
              <p className="w-24">Resident</p>
              <p className="w-24">To Pay</p>
              <p className="w-20">Status</p>
              <p className="w-24 text-right">Amount</p>
              <div className="w-7"></div>
            </div>

            <div className="max-w-fit flex flex-row justify-center items-center gap-8 px-4 py-2 rounded-md text-off_black font-normal text-sm">
              <div className="flex flex-row items-center gap-2 w-24">
                <UserCircleIcon className="w-7 h-7 text-gray-300"/>
                <p className="">John</p>
              </div>
              
              <div className="flex flex-row items-center gap-2 w-24">
                <UserCircleIcon className="w-7 h-7 text-gray-300"/>
                <p className="">Bob</p>
              </div>

              <div className="w-20">
                <p className="max-w-fit rounded-md px-2 py-1 font-medium text-sm bg-positive text-positive_text">Paid</p>
              </div>

              <p className="w-24 text-right">$1,000.00</p>

              <IconButton icon={CheckIcon} onClick={() => { if (onPay) onPay(id); }} blank={false}/>
            </div>

            <div className="max-w-fit flex flex-row justify-center gap-8 px-4 py-2 rounded-md text-off_black font-normal text-sm">
              <div className="flex flex-row items-center gap-2 w-24">
                <UserCircleIcon className="w-7 h-7 text-gray-300"/>
                <p>Bob</p>
              </div>

              <div className="flex flex-row items-center gap-2 w-24">
                <DocumentCurrencyDollarIcon className="w-7 h-6 text-off_gray"></DocumentCurrencyDollarIcon>
                <p>Bill</p>
              </div>

              <div className="w-20">
                <p className="max-w-fit rounded-md px-2 py-1 font-medium text-sm bg-positive text-positive_text">Not Paid</p>
              </div>

              <p className="w-24 text-right">$2,000.00</p>

              <div className="w-7"></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-b-md flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-off_gray font-normal">Residence Bill Total</p>
              <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-semibold text-3xl`}>{total}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-medium text-2xl`}>Pay by {dueDate}</p>
            </div>

            <div className="flex flex-row justify-end gap-4">
              {/* <IconButton icon={CheckIcon} onClick={() => { if (onPay) onPay(id); }} blank={false}/> */}
              <IconButton icon={PencilIcon} onClick={() => { if (onEdit) onEdit(id); }} blank={false}/>
              <IconButton icon={TrashIcon} onClick={() => { if (onDelete) onDelete(id); }} blank={false}/>
            </div>
          </div>

          
        </div>
      }
    </div>
  );
}