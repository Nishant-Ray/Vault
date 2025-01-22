'use client';

import { useState, useRef, useEffect } from 'react';
import Loading from '@/app/ui/loading';
import Button from '@/app/ui/button';
import IconButton from '@/app/ui/iconButton';
import Card from '@/app/ui/card';
import Select from '@/app/ui/select';
import ResidenceModal from '@/app/ui/residenceModal';
import ResidenceBillModal from '@/app/ui/residenceBillModal';
import ResidenceBillCard from '@/app/ui/residenceBillCard';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';
import clsx from 'clsx';
import { fetchAccounts, addTransaction, fetchResidenceInfo, createResidence, editResidence, leaveResidence, deleteResidence, fetchAllResidenceBills, addResidenceBill, editResidenceBill, removeResidenceBill, fetchRecentResidenceMessages } from '@/app/lib/data';
import { SelectOption, Account, TransactionAddManualModalData, ResidenceData, RESIDENCE_CREATE_MODAL_TYPE, RESIDENCE_EDIT_MODAL_TYPE, RESIDENCE_LEAVE_MODAL_TYPE, RESIDENCE_DELETE_MODAL_TYPE, ResidenceCreateModalData, ResidenceEditModalData, ResidenceBill, RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE, RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE, RESIDENCE_BILL_PAY_MODAL_TYPE, RESIDENCE_BILL_EDIT_MODAL_TYPE, RESIDENCE_BILL_DELETE_MODAL_TYPE, ResidenceBillAddManualModalData, ResidenceBillAddDocumentModalData, ResidenceBillPayModalData, ResidenceBillEditModalData, ResidenceMessage } from '@/app/lib/definitions';
import { formatDollarAmount, getLast12MonthsAsOptions, formatDate, unformatDate } from '@/app/lib/utils';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [residenceData, setResidenceData] = useState<ResidenceData | null>(null);
  const [modalType, setModalType] = useState<number>(RESIDENCE_CREATE_MODAL_TYPE);
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [residenceBillAddOptionsOpen, setResidenceBillAddOptionsOpen] = useState<boolean>(false);
  const [residenceBillModalOpen, setResidenceBillModalOpen] = useState<boolean>(false);
  const [residenceBillSelected, setResidenceBillSelected] = useState<ResidenceBill | null>(null);
  const [residenceBills, setResidenceBills] = useState<ResidenceBill[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState({ total: 4300, dueDate: 20250131, paid: false });
  const last12Months: SelectOption[] = getLast12MonthsAsOptions();
  const monthlyPaymentVsUtilities: SelectOption[] = [{ value: 0, text: 'Last 3 months'}, { value: 0, text: 'Last 6 months'}, { value: 0, text: 'Last 12 months'}];
  const [residenceMessages, setResidenceMessages] = useState<ResidenceMessage[]>([]);

  // RESIDENCE MODAL FUNCTIONS

  const handleCreateResidenceClick = () => {
    setModalType(RESIDENCE_CREATE_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const handleEditResidenceClick = () => {
    setModalType(RESIDENCE_EDIT_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const handleLeaveResidenceClick = () => {
    setModalType(RESIDENCE_LEAVE_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const handleDeleteResidenceClick = () => {
    setModalType(RESIDENCE_LEAVE_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const hopefulResidenceCreate = (data: ResidenceCreateModalData) => {
    setResidenceData({
      residence: {
        name: data.name,
        monthly_payment: data.monthlyPayment
      },
      users: []
    });
  };

  const handleCreateResidenceModalSubmit = async (data: ResidenceCreateModalData) => {
    await createResidence(data);
    hopefulResidenceCreate(data);

    setResidenceModalOpen(false);
  };

  const hopefulResidenceEdit = (data: ResidenceEditModalData) => {
    setResidenceData({
      residence: {
        name: data.name,
        monthly_payment: data.monthlyPayment
      },
      users: residenceData!.users || []
    });
  };

  const handleEditResidenceModalSubmit = async (data: ResidenceEditModalData) => {
    await editResidence(data);
    hopefulResidenceEdit(data);

    setResidenceModalOpen(false);
  };

  const handleLeaveResidenceModalSubmit = async () => {
    await leaveResidence();
    setResidenceData(null);

    setResidenceModalOpen(false);
  };

  const handleDeleteResidenceModalSubmit = async () => {
    await deleteResidence();
    setResidenceData(null);

    setResidenceModalOpen(false);
  };

  const handleResidenceModalClose = () => {
    setResidenceModalOpen(false);
  };

  // RESIDENCE BILL MODAL FUNCTIONS

  const openResidenceBillAddOptions = () => {
    setResidenceBillAddOptionsOpen(true);
  };

  const handleManualClick = () => {
    setModalType(RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  function hopefulBillAdd(bill: ResidenceBill) {
    const newResidenceBills = [...residenceBills];
    const index = newResidenceBills.findIndex(item => item.due_date > bill.due_date);
    if (index === -1) newResidenceBills.push(bill);
    else newResidenceBills.splice(index, 0, bill);
    setResidenceBills(newResidenceBills);
  }

  const handleManualModalSubmit = async (data: ResidenceBillAddManualModalData) => {
    const newBill = await addResidenceBill(data);
    if (newBill) hopefulBillAdd(newBill);

    setResidenceBillModalOpen(false);
  };

  const handleDocumentClick = () => {
    setModalType(RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  const handleDocumentModalSubmit = () => {
    setResidenceBillModalOpen(false);
  };

  const handleResidenceBillModalClose = () => {
    setResidenceBillModalOpen(false);
    setResidenceBillSelected(null);
  };

  // RESIDENCE CARD FUNCTIONS

  const handlePayClick = (id: number) => {
    const foundBill = residenceBills.find(bill => bill.id === id);
    if (foundBill) setResidenceBillSelected(foundBill);
    
    setModalType(RESIDENCE_BILL_PAY_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  const handlePayModalSubmit = async (id: number, data: ResidenceBillPayModalData) => {
    if (data.alsoTransaction) {
      const transactionData: TransactionAddManualModalData = {
        accountID: data.accountID,
        date: (new Date()).toDateString(),
        amount: String(residenceBillSelected?.total),
        category: data.transactionCategory,
        description: `${residenceBillSelected?.category} Residence Bill Payment (due ${formatDate(residenceBillSelected!.due_date)})`
      };
      
      await addTransaction(transactionData);
    }

    setResidenceBillModalOpen(false);
    setResidenceBillSelected(null);
  };

  const handleEditClick = (id: number) => {
    const foundBill = residenceBills.find(bill => bill.id === id);
    if (foundBill) setResidenceBillSelected(foundBill);

    setModalType(RESIDENCE_BILL_EDIT_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  function hopefulResidenceBillEdit(id: number, data: ResidenceBillEditModalData) {
    const newResidenceBills = [...residenceBills];

    const index = newResidenceBills.findIndex(item => item.id === id);
    const bill = newResidenceBills[index];

    bill.category = data.category;
    const newDate = unformatDate(data.dueDate);
    bill.total = Number(data.total);

    if (bill.due_date === newDate) {
      newResidenceBills[index] = bill;
    } else {
      bill.due_date = newDate;
      newResidenceBills.splice(index, 1);
      const newIndex = newResidenceBills.findIndex(item => item.due_date > bill.due_date);
      if (newIndex === -1) newResidenceBills.push(bill);
      else newResidenceBills.splice(newIndex, 0, bill);
    }

    setResidenceBills(newResidenceBills);
  }

  const handleEditResidenceBillModalSubmit = async (id: number, data: ResidenceBillEditModalData) => {
    await editResidenceBill(id, data);
    hopefulResidenceBillEdit(id, data);

    setResidenceBillModalOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    const foundBill = residenceBills.find(bill => bill.id === id);
    if (foundBill) setResidenceBillSelected(foundBill);
    
    setModalType(RESIDENCE_BILL_DELETE_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  const handleDeleteResidenceBillModalSubmit = async (id: number) => {
    setResidenceBills((prevResdienceBills) => prevResdienceBills.filter((bill) => bill.id !== id));
    await removeResidenceBill(id);

    setResidenceBillModalOpen(false);
    setResidenceBillSelected(null);
  };

  useEffect(() => {
    const fetchResidenceData = async () => {
      setLoading(true);

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);

      const fetchedResidenceInfo = await fetchResidenceInfo();
      if (fetchedResidenceInfo) setResidenceData(fetchedResidenceInfo);

      const fetchedResidenceBills = await fetchAllResidenceBills();
      if (fetchedResidenceBills) setResidenceBills(fetchedResidenceBills);

      const fetchedResidenceMessages = await fetchRecentResidenceMessages();
      if (fetchedResidenceMessages) setResidenceMessages(fetchedResidenceMessages);
      
      setLoading(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setResidenceBillAddOptionsOpen(false);
      }
    };

    fetchResidenceData();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <ResidenceModal type={modalType} isOpen={residenceModalOpen} residence={residenceData?.residence || null} onCreateModalSubmit={handleCreateResidenceModalSubmit} onEditModalSubmit={handleEditResidenceModalSubmit} onLeaveModalSubmit={handleLeaveResidenceModalSubmit} onDeleteModalSubmit={handleDeleteResidenceModalSubmit} onClose={handleResidenceModalClose}/>
      <ResidenceBillModal type={modalType} isOpen={residenceBillModalOpen} residenceBill={residenceBillSelected} accounts={accounts} onManualModalSubmit={handleManualModalSubmit} onDocumentModalSubmit={handleDocumentModalSubmit} onPayModalSubmit={handlePayModalSubmit} onEditModalSubmit={handleEditResidenceBillModalSubmit} onDeleteModalSubmit={handleDeleteResidenceBillModalSubmit} onClose={handleResidenceBillModalClose}/>

      { !residenceData ? (
        <div className="absolute top-20 left-60 right-0 bottom-0 flex flex-col justify-center items-center gap-2 text-center">
          <h3 className={`${dmSans.className} antialiased tracking-tight text-off_black font-semibold text-5xl`}>You're not part of a residence!</h3>
          <p className="mb-8 text-off_gray text-md leading-tight">Create a residence or accept an invite to join an existing residence.</p>
          <Button onClick={handleCreateResidenceClick}>Create a Residence</Button>
        </div>
      ) : (
        <div>
          <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>{residenceData.residence.name}</h1>

          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-8 w-2/5">
              <Card>
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-medium text-off_black">Monthly { residenceData.residence.monthly_payment === 'rent' ? 'Rent' : 'Mortgage' }</h3>
                  <Select options={last12Months} onSelect={() => {}}/>
                </div>
    
                <h2 className={`${dmSans.className} antialiased text-black tracking-tight text-4xl font-semibold my-4`}>{formatDollarAmount(monthlyPayment.total)}</h2>

                <div className={clsx("max-w-fit rounded-full px-3 py-1", { "bg-positive": monthlyPayment.paid, "bg-negative": !monthlyPayment.paid })}>
                  <p className={clsx("text-md font-medium", { "text-positive_text": monthlyPayment.paid, "text-negative_text": !monthlyPayment.paid })}>{monthlyPayment.paid ? 'Paid' : 'Not paid'}</p>
                </div>
              </Card>

              <Card>
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-medium text-off_black">{ residenceData.residence.monthly_payment === 'rent' ? 'Rent' : 'Mortgage' } vs. Utilities</h3>
                  <Select options={monthlyPaymentVsUtilities} onSelect={() => {}}/>
                </div>

                <p>Rent vs utilities graph</p>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-off_black">Manage Residence</h3>
                  <div className="flex flex-col mt-4 gap-2">
                    <Button onClick={handleEditResidenceClick} size="md">Edit Residence</Button>
                    <Button onClick={handleLeaveResidenceClick} size="md">Leave Residence</Button>
                    <Button onClick={handleDeleteResidenceClick} size="md">Delete Residence</Button>
                  </div>
                </Card>
              
            </div>

            <div className="flex flex-col gap-8 w-3/5">
              <Card>
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-medium text-off_black">All Bills</h3>

                  <div>
                    <IconButton icon={PlusIcon} onClick={openResidenceBillAddOptions} ref={buttonRef}/>
                    { residenceBillAddOptionsOpen && 
                      <div className="absolute -translate-x-36 w-44 flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-lg">
                        <p onClick={handleManualClick} className="cursor-pointer px-4 py-2 rounded-t-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Manually enter</p>
                        <p onClick={handleDocumentClick} className="cursor-pointer px-4 py-2 rounded-b-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Upload document</p>
                      </div>
                    }
                  </div>
                </div>

                <div>
                  {residenceBills.length ? (
                    <div className="flex flex-col mt-3 text-off_black">
                      <div className="flex flex-row justify-center items-center gap-12 bg-gray-100 rounded-md px-4 py-2 font-normal text-sm">
                        <h4 className="w-24 text-right">Total</h4>
                        <h4 className="w-24">Category</h4>
                        <h4 className="w-24 text-right">Due Date</h4>
                        <h4 className="w-20">Status</h4>
                        <div className="w-8"></div>
                      </div>

                      {residenceBills.map((bill) => {
                        return <ResidenceBillCard key={bill.id} id={bill.id} category={bill.category} dueDate={formatDate(bill.due_date)} total={formatDollarAmount(bill.total)} onPay={handlePayClick} onEdit={handleEditClick} onDelete={handleDeleteClick}/>
                      })}

                    </div>
                  ) : (
                    <p className="text-md font-normal text-off_gray mt-1">No upcoming residence bills!</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-off_black">Residence Messages</h3>
                <div className="mt-2 flex flex-col bg-off_white p-4 rounded-xl">
                  <>
                    {residenceMessages.length ? (
                      <div className="flex flex-col gap-4 pb-4 max-h-72">
                        {residenceMessages.map((message, i) => {
                          return (
                            <div key={i}>
                              <p className="ml-3 mb-1 text-xs font-normal text-off_gray">User {message.user_id}</p>
                              <h6 className="bg-white max-w-fit rounded-full px-3 py-1 text-md font-normal text-off_black">{message.content}</h6>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm font-normal text-off_gray">No recent messages</p>
                    )}
                  </>
                  <form className="flex flex-row items-center gap-2 h-8">
                    <input className="rounded-full bg-white border border-gray-200 w-full px-3 py-1" type="text" placeholder="Enter message"/>
                    <IconButton className="h-8" icon={PaperAirplaneIcon} onClick={() => {}}></IconButton>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) }
    </main>
  )
}
