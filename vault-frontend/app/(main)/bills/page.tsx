'use client';

import { useState, useRef, useEffect } from 'react';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import BillCard from '@/app/ui/billCard';
import BillModal from '@/app/ui/billModal';
import IconButton from '@/app/ui/iconButton';
import { PlusIcon } from '@heroicons/react/24/solid';
import { fetchAccounts, addTransaction, fetchAllBills, addBill, editBill, removeBill } from '@/app/lib/data';
import { formatDollarAmount, getCurrentDate, formatDate, unformatDate } from '@/app/lib/utils';
import { Account, Bill, BILL_ADD_MANUAL_MODAL_TYPE, BILL_ADD_DOCUMENT_MODAL_TYPE, BILL_PAY_MODAL_TYPE, BILL_EDIT_MODAL_TYPE, BILL_DELETE_MODAL_TYPE, TransactionAddManualModalData, BillAddManualModalData, BillPayModalData, BillEditModalData } from '@/app/lib/definitions';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [billAddOptionsOpen, setBillAddOptionsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<number>(BILL_ADD_MANUAL_MODAL_TYPE);
  const [billModalOpen, setBillModalOpen] = useState<boolean>(false);
  const [billSelected, setBillSelected] = useState<Bill | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const openBillAddOptions = () => {
    setBillAddOptionsOpen(true);
  };

  const handleManualClick = () => {
    setModalType(BILL_ADD_MANUAL_MODAL_TYPE);
    setBillModalOpen(true);
  };
  
  function hopefulBillAdd(bill: Bill) {
    const newBills = [...bills];
    const index = newBills.findIndex(item => item.due_date > bill.due_date);
    if (index === -1) newBills.push(bill);
    else newBills.splice(index, 0, bill);
    setBills(newBills);
  }

  const handleManualModalSubmit = async (data: BillAddManualModalData) => {
    const newBill = await addBill(data);
    if (newBill) hopefulBillAdd(newBill);

    setBillModalOpen(false);
  };

  const handleDocumentClick = () => {
    setModalType(BILL_ADD_DOCUMENT_MODAL_TYPE);
    setBillModalOpen(true);
  };

  const handleDocumentModalSubmit = () => {
    setBillModalOpen(false);
  };

  const handlePayClick = (id: number) => {
    const foundBill = bills.find(bill => bill.id === id);
    if (foundBill) setBillSelected(foundBill);
    
    setModalType(BILL_PAY_MODAL_TYPE);
    setBillModalOpen(true);
  };

  const handlePayModalSubmit = async (id: number, data: BillPayModalData) => {
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
    await removeBill(id);

    console.log(data);

    if (data.alsoTransaction) {
      const transactionData: TransactionAddManualModalData = {
        accountID: data.accountID,
        date: (new Date()).toDateString(),
        amount: String(billSelected?.total),
        category: data.transactionCategory,
        description: `${billSelected?.name} Bill Payment`
      };
      
      await addTransaction(transactionData);
    }

    setBillModalOpen(false);
    setBillSelected(null);
  };
  
  const handleEditClick = (id: number) => {
    const foundBill = bills.find(bill => bill.id === id);
    if (foundBill) setBillSelected(foundBill);

    setModalType(BILL_EDIT_MODAL_TYPE);
    setBillModalOpen(true);
  };

  function hopefulBillEdit(id: number, data: BillEditModalData) {
    const newBills = [...bills];

    const index = newBills.findIndex(item => item.id === id);
    const bill = newBills[index];

    bill.name = data.name;
    bill.category = data.category;
    const newDate = unformatDate(data.dueDate);
    bill.total = Number(data.total);

    if (bill.due_date === newDate) {
      newBills[index] = bill;
    } else {
      bill.due_date = newDate;
      newBills.splice(index, 1);
      const newIndex = newBills.findIndex(item => item.due_date > bill.due_date);
      if (newIndex === -1) newBills.push(bill);
      else newBills.splice(newIndex, 0, bill);
    }

    setBills(newBills);
  }

  const handleEditModalSubmit = async (id: number, data: BillEditModalData) => {
    await editBill(id, data);
    hopefulBillEdit(id, data);

    setBillModalOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    const foundBill = bills.find(bill => bill.id === id);
    if (foundBill) setBillSelected(foundBill);
    
    setModalType(BILL_DELETE_MODAL_TYPE);
    setBillModalOpen(true);
  };

  const handleDeleteModalSubmit = async (id: number) => {
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
    await removeBill(id);

    setBillModalOpen(false);
    setBillSelected(null);
  };

  const handleBillModalClose = () => {
    setBillModalOpen(false);
    setBillSelected(null);
  };

  useEffect(() => {
    const fetchBillsData = async () => {
      setLoading(true);
      
      const fetchedBills = await fetchAllBills();
      if (fetchedBills) setBills(fetchedBills);

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);

      setLoading(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setBillAddOptionsOpen(false);
      }
    };

    fetchBillsData();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <BillModal type={modalType} isOpen={billModalOpen} bill={billSelected} accounts={accounts} onManualModalSubmit={handleManualModalSubmit} onDocumentModalSubmit={handleDocumentModalSubmit} onPayModalSubmit={handlePayModalSubmit} onEditModalSubmit={handleEditModalSubmit} onDeleteModalSubmit={handleDeleteModalSubmit} onClose={handleBillModalClose}/>

      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8 w-3/5">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">All Bills</h3>

              <div>
                <IconButton icon={PlusIcon} onClick={openBillAddOptions} ref={buttonRef}/>
                { billAddOptionsOpen && 
                  <div className="absolute w-44 flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-lg">
                    <p onClick={handleManualClick} className="cursor-pointer px-4 py-2 rounded-t-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Manually enter</p>
                    <p onClick={handleDocumentClick} className="cursor-pointer px-4 py-2 rounded-b-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Upload document</p>
                  </div>
                }
              </div>
            </div>

            <div>
              {bills.length ? (
                <div className="flex flex-col mt-3 text-off_black">
                  <div className="flex flex-row items-center gap-12 bg-gray-100 rounded-md px-4 py-2 font-normal text-sm">
                    <h4 className="w-24 text-right">Total</h4>
                    <h4 className="w-24">Category</h4>
                    <h4 className="w-24">Name</h4>
                    <h4 className="w-24 text-right">Due Date</h4>
                    <div className="w-8 bg-gray-100"/>
                  </div>

                  {bills.map((bill) => {
                    return <BillCard key={bill.id} id={bill.id} name={bill.name} category={bill.category} dueDate={formatDate(bill.due_date)} total={formatDollarAmount(bill.total)} onPay={handlePayClick} onEdit={handleEditClick} onDelete={handleDeleteClick}/>
                  })}

                  {/* {bills.map((bill, i) => {
                    const billCategoryColorArr = billCategoryColors.get(bill.category);
                    if (billCategoryColorArr) {
                      const bgColor = billCategoryColorArr[0];
                      const textColor = billCategoryColorArr[1];
                      return (
                        <div key={i} className="flex flex-row items-center h-12 gap-16 border-t border-gray-200">
                          <h4 className="w-24 text-red-700 font-semibold text-md">{formatDate(bill.due_date)}</h4>
                          <h4 className="w-16 text-off_black font-bold text-md text-right">{formatDollarAmount(bill.total)}</h4>
                          <div className="w-24">
                            <h4 className={`max-w-fit rounded-3xl px-3 py-1 font-semibold text-sm bg-[${bgColor}] text-[${textColor}]`}>{bill.category}</h4>
                          </div>
                          <h4 className="w-36 text-off_black font-medium text-md truncate">{bill.name}</h4>
                        </div>
                      );
                    }
                  })} */}
                </div>
              ) : (
                <p className="text-md font-normal text-off_gray mt-1">No upcoming bills!</p>
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-8 w-2/5">
          <Card>
            <h3 className="text-lg font-medium text-off_black">AI Insights</h3>

            <p className="text-md font-normal text-off_gray mt-1">No insights!</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
