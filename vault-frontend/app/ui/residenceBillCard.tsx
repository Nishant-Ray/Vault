import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon, PencilIcon, TrashIcon, UserCircleIcon, DocumentCurrencyDollarIcon } from '@heroicons/react/24/solid';
import IconButton from './iconButton';
import { dmSans } from '@/app/ui/fonts';
import { ResidencePayment } from '@/app/lib/definitions';
import { formatDollarAmount } from '@/app/lib/utils';
import { residenceBillColors } from '@/app/lib/colors';

interface ResidenceBillCardProps {
  id: number;
  category: string;
  dueDate: string;
  total: number;
  payments: ResidencePayment[];
  residentIdToName: Record<number, string>;
  currentUserId: number;
  onOpen?: (id: number) => void;
  onPay?: (billId: number, paymentId: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ResidenceBillCard({ id, category, dueDate, total, payments, residentIdToName, currentUserId, onOpen, onPay, onEdit, onDelete, ...rest }: ResidenceBillCardProps) {
  const [cardOpen, setCardOpen] = useState<boolean>(false);
  const [billPaid, setBillPaid] = useState<boolean>(false);

  const handleCardOpen = () => {
    if (cardOpen) setCardOpen(false);
    else {
      if (onOpen) onOpen(id);
      setCardOpen(true);
    }
  };

  useEffect(() => {
    if (payments) {
      let billAmount = 0;
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        if (payment.payee_id === null && payment.status === 'Paid') billAmount += payment.amount;
      }
      
      setBillPaid(billAmount === total);
    }
  }, [payments]);

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
        <p className="w-24 font-medium text-md text-right">{formatDollarAmount(total)}</p>

        <div className="w-24">
          <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
            {
              "bg-accent text-white": !cardOpen && category === 'Rent',
              "bg-blue-100 text-blue-400": !cardOpen && category === 'Water',
              "bg-positive text-positive_text": !cardOpen && category === 'Electricity',
              "bg-orange-100 text-orange-600": !cardOpen && category === 'Internet',
              "bg-gray-600 text-white": !cardOpen && category === 'Trash',
              "bg-gray-100 text-gray-400": !cardOpen && category === 'Misc',
              "bg-white/20 text-white": cardOpen
            }
          )}>{category}</p>
        </div>

        <p className="w-24 font-normal text-md text-right">{dueDate}</p>

        <div className="w-20">
          <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
            {
              "bg-positive text-positive_text": !cardOpen && billPaid,
              "bg-negative text-negative_text": !cardOpen && !billPaid,
              "bg-white/20 text-white": cardOpen
            }
          )}>{billPaid ? 'Paid' : 'Not Paid'}</p>
        </div>

        <button
          onClick={handleCardOpen}
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
          { !payments || payments.length === 0 ? (
            <div className="bg-white p-4 text-center text-off_gray font-normal text-sm">
              <p>Click the edit button below to setup payments for this bill!</p>
            </div>
          ) : (
            <div className="bg-white flex flex-col items-center gap-1 p-4">
              <div className="max-w-fit flex flex-row justify-center gap-8 px-4 py-2 bg-gray-100 rounded-md text-off_black font-normal text-sm">
                <p className="w-28">Resident</p>
                <p className="w-28">To Pay</p>
                <p className="w-20">Status</p>
                <p className="w-20 text-right">Amount</p>
                <div className="w-8"></div>
              </div>

              { payments.map((payment) => {
                return (
                  <div key={payment.id} className="max-w-fit flex flex-row justify-center items-center gap-8 px-4 py-2 rounded-md text-off_black font-normal text-sm">
                    <div className="flex flex-row items-center gap-1 w-28">
                      <UserCircleIcon className="w-6 h-6 text-gray-300"/>
                      <p className="truncate">{ residentIdToName[payment.payer_id] }<span className="text-xs text-off_gray">{payment.payer_id === currentUserId ? ' (YOU)' : ''}</span></p>
                    </div>
                    
                    <div className="flex flex-row items-center gap-1 w-28">
                      { payment.payee_id ? <UserCircleIcon className="w-6 h-6 text-gray-300"/> : <DocumentCurrencyDollarIcon className="w-7 h-6 text-off_gray"/> }
                      <p className="truncate">{ payment.payee_id ? residentIdToName[payment.payee_id] : 'Bill Directly' }<span className="text-xs text-off_gray">{payment.payee_id === currentUserId ? ' (YOU)' : ''}</span></p>
                    </div>

                    <div className="w-20">
                      <p className={clsx("max-w-fit rounded-md px-2 py-1 font-medium text-sm",
                        {
                          "bg-positive text-positive_text": payment.status === 'Paid',
                          "bg-negative text-negative_text": payment.status === 'Pending'
                        }
                      )}>{ payment.status }</p>
                    </div>

                    <p className="w-20 text-right">{ formatDollarAmount(payment.amount) }</p>
                    
                    { payment.payer_id === currentUserId && payment.status === 'Pending' ? <IconButton icon={CheckIcon} onClick={() => { if (onPay) onPay(id, payment.id); }} blank={false}/> : <div className="w-8"></div> }
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white p-4 rounded-b-md flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-off_gray font-normal">Residence Bill Total</p>
              <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-semibold text-3xl`}>{formatDollarAmount(total)}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className={`${dmSans.className} antialiased tracking-tight text-off_black font-medium text-2xl`}>Pay by {dueDate}</p>
            </div>

            <div className="flex flex-row justify-end gap-4">
              <IconButton icon={PencilIcon} onClick={() => { if (onEdit) onEdit(id); }} blank={false}/>
              <IconButton icon={TrashIcon} onClick={() => { if (onDelete) onDelete(id); }} blank={false}/>
            </div>
          </div>

          
        </div>
      }
    </div>
  );
}