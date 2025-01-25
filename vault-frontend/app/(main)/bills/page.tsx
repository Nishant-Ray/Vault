'use client';

import { useState, useRef, useEffect } from 'react';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import BillCard from '@/app/ui/billCard';
import BillModal from '@/app/ui/billModal';
import IconButton from '@/app/ui/iconButton';
import { PlusIcon } from '@heroicons/react/24/solid';
import { fetchAccounts, addTransaction, fetchAllBills, addBill, editBill, removeBill, fetchResidenceName, fetchAllResidenceBills, fetchBillInsights } from '@/app/lib/data';
import { formatDollarAmount, formatDate, unformatDate, isBill } from '@/app/lib/utils';
import { Account, Bill, BILL_ADD_MANUAL_MODAL_TYPE, BILL_ADD_DOCUMENT_MODAL_TYPE, BILL_PAY_MODAL_TYPE, BILL_EDIT_MODAL_TYPE, BILL_DELETE_MODAL_TYPE, TransactionAddManualModalData, BillAddManualModalData, BillPayModalData, BillEditModalData, ResidenceBill } from '@/app/lib/definitions';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [combinedBills, setCombinedBills] = useState<(Bill | ResidenceBill)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [billAddOptionsOpen, setBillAddOptionsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<number>(BILL_ADD_MANUAL_MODAL_TYPE);
  const [billModalOpen, setBillModalOpen] = useState<boolean>(false);
  const [billSelected, setBillSelected] = useState<Bill | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  const openBillAddOptions = () => {
    setBillAddOptionsOpen(true);
  };

  const handleManualClick = () => {
    setModalType(BILL_ADD_MANUAL_MODAL_TYPE);
    setBillModalOpen(true);
  };
  
  function hopefulBillAdd(bill: Bill) {
    const newCombinedBills = [...combinedBills];
    const index = newCombinedBills.findIndex(item => item.due_date > bill.due_date);
    if (index === -1) newCombinedBills.push(bill);
    else newCombinedBills.splice(index, 0, bill);
    setCombinedBills(newCombinedBills);
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
    const foundBill = combinedBills.find(bill => isBill(bill) && bill.id === id);
    if (foundBill) setBillSelected(foundBill as Bill);
    
    setModalType(BILL_PAY_MODAL_TYPE);
    setBillModalOpen(true);
  };

  const handlePayModalSubmit = async (id: number, data: BillPayModalData) => {
    setCombinedBills((prevCombinedBills) => prevCombinedBills.filter((bill) => !isBill(bill) || (isBill(bill) && bill.id !== id)));
    await removeBill(id);

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
    const foundBill = combinedBills.find(bill => isBill(bill) && bill.id === id);
    if (foundBill) setBillSelected(foundBill as Bill);

    setModalType(BILL_EDIT_MODAL_TYPE);
    setBillModalOpen(true);
  };

  function hopefulBillEdit(id: number, data: BillEditModalData) {
    const newCombinedBills = [...combinedBills];

    const index = newCombinedBills.findIndex(item => isBill(item) && item.id === id);
    const bill = newCombinedBills[index] as Bill;

    bill.name = data.name;
    bill.category = data.category;
    const newDate = unformatDate(data.dueDate);
    bill.total = Number(data.total);

    if (bill.due_date === newDate) {
      newCombinedBills[index] = bill;
    } else {
      bill.due_date = newDate;
      newCombinedBills.splice(index, 1);
      const newIndex = newCombinedBills.findIndex(item => item.due_date > bill.due_date);
      if (newIndex === -1) newCombinedBills.push(bill);
      else newCombinedBills.splice(newIndex, 0, bill);
    }

    setCombinedBills(newCombinedBills);
  }

  const handleEditModalSubmit = async (id: number, data: BillEditModalData) => {
    await editBill(id, data);
    hopefulBillEdit(id, data);

    setBillModalOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    const foundBill = combinedBills.find(bill => isBill(bill) && bill.id === id);
    if (foundBill) setBillSelected(foundBill as Bill);
    
    setModalType(BILL_DELETE_MODAL_TYPE);
    setBillModalOpen(true);
  };

  const handleDeleteModalSubmit = async (id: number) => {
    setCombinedBills((prevCombinedBills) => prevCombinedBills.filter((bill) => !isBill(bill) || (isBill(bill) && bill.id !== id)));
    await removeBill(id);

    setBillModalOpen(false);
    setBillSelected(null);
  };

  const handleBillModalClose = () => {
    setBillModalOpen(false);
    setBillSelected(null);
  };

  useEffect(() => {
    document.title = 'Bills | Vault';

    const fetchBillsData = async () => {
      setLoading(true);
      
      const fetchedBills = await fetchAllBills();

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);

      const fetchedResidenceName = await fetchResidenceName();
      if (fetchedResidenceName) {
        const fetchedResidenceBills = await fetchAllResidenceBills();
        
        if (fetchedBills && fetchedResidenceBills) {
          const newCombinedBills = [];
          let i = 0;
          let j = 0;
          while (i < fetchedBills.length || j < fetchedResidenceBills.length) {
            if (i < fetchedBills.length && j < fetchedResidenceBills.length) {
              if (fetchedBills[i].due_date <= fetchedResidenceBills[j].due_date) newCombinedBills.push(fetchedBills[i++]);
              else newCombinedBills.push(fetchedResidenceBills[j++]);
            } else if (i < fetchedBills.length) newCombinedBills.push(fetchedBills[i++]);
            else newCombinedBills.push(fetchedResidenceBills[j++]);
          }
          setCombinedBills(newCombinedBills);
        } else if (fetchedBills) setCombinedBills(fetchedBills);
        else if (fetchedResidenceBills) setCombinedBills(fetchedResidenceBills);

      } else if (fetchedBills) setCombinedBills(fetchedBills);
      
      const fetchedInsights = await fetchBillInsights();
      if (fetchedInsights) {
        setInsights(fetchedInsights.split('|'));
      }

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
              {combinedBills.length ? (
                <div className="flex flex-col mt-3 text-off_black">
                  <div className="flex flex-row items-center gap-12 bg-gray-100 rounded-md px-4 py-2 font-normal text-sm">
                    <h4 className="w-24 text-right">Total</h4>
                    <h4 className="w-28">Category</h4>
                    <h4 className="w-24">Name</h4>
                    <h4 className="w-24 text-right">Due Date</h4>
                    <div className="w-8 bg-gray-100"/>
                  </div>

                  {combinedBills.map((bill) => {
                    if (isBill(bill)) return <BillCard key={bill.id} id={bill.id} name={(bill as Bill).name} category={bill.category} dueDate={formatDate(bill.due_date)} total={formatDollarAmount(bill.total)} onPay={handlePayClick} onEdit={handleEditClick} onDelete={handleDeleteClick}/>
                    return <BillCard key={bill.id} isResidenceBill={true} id={bill.id} name={bill.category} category="Residence" dueDate={formatDate(bill.due_date)} total={formatDollarAmount(bill.total)}/>
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
                            <h4 className={`max-w-fit rounded-full px-3 py-1 font-semibold text-sm bg-[${bgColor}] text-[${textColor}]`}>{bill.category}</h4>
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
            { insights.length > 0 ? (
              <ul className="text-off_black text-md font-normal list-disc pl-5">
                { insights.map((insight, i) => {
                  return <li key={i}>{insight}</li>;
                })}
              </ul>
            ) : (
              <p className="text-md font-normal text-off_gray mt-1">No insights!</p>
            )}
            
          </Card>
        </div>
      </div>
    </main>
  );
}
