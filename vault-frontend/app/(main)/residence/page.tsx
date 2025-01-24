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
import ResidenceGraph from '@/app/ui/residenceGraph';
import { PaperAirplaneIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';
import clsx from 'clsx';
import { fetchCurrentUserId, fetchAccounts, addTransaction, fetchResidenceInfo, createResidence, editResidence, leaveResidence, deleteResidence, fetchAllResidenceBills, addResidenceBill, editResidenceBill, removeResidenceBill, fetchResidencePayments, addResidencePayment, editResidencePayment, deleteResidencePayment, payResidencePayment, fetchAllResidenceMessages, createResidenceMessage } from '@/app/lib/data';
import { SelectOption, User, Account, TransactionAddManualModalData, ResidenceData, RESIDENCE_CREATE_MODAL_TYPE, RESIDENCE_EDIT_MODAL_TYPE, RESIDENCE_LEAVE_MODAL_TYPE, RESIDENCE_DELETE_MODAL_TYPE, ResidenceCreateModalData, ResidenceEditModalData, ResidenceBill, RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE, RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE, RESIDENCE_BILL_PAY_MODAL_TYPE, RESIDENCE_BILL_EDIT_MODAL_TYPE, RESIDENCE_BILL_DELETE_MODAL_TYPE, ResidenceBillAddManualModalData, ResidenceBillAddDocumentModalData, ResidenceBillPayModalData, ResidenceBillEditModalData, ResidenceBillPaymentData, ResidencePayment, MonthlyPayment, ResidenceMessage } from '@/app/lib/definitions';
import { formatDollarAmount, getCurrentMonth, getLast12MonthsAsOptions, getMonthFromDate, formatDate, unformatDate,  } from '@/app/lib/utils';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [residenceData, setResidenceData] = useState<ResidenceData | null>(null);
  const [residentIdMapping, setResidentIdMapping] = useState<Record<number, string>>({});
  const [modalType, setModalType] = useState<number>(RESIDENCE_CREATE_MODAL_TYPE);
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [residenceBillAddOptionsOpen, setResidenceBillAddOptionsOpen] = useState<boolean>(false);
  const [residenceBillModalOpen, setResidenceBillModalOpen] = useState<boolean>(false);
  const [residenceBillSelected, setResidenceBillSelected] = useState<ResidenceBill | null>(null);
  const [relevantPayments, setRelevantPayments] = useState<ResidencePayment[]>([]);
  const [residenceBills, setResidenceBills] = useState<ResidenceBill[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [residencePayments, setResidencePayments] = useState<Record<number, ResidencePayment[]>>({});
  const [paymentIdToPay, setPaymentIdToPay] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<MonthlyPayment | null>(null);
  const [selectedMonthForMonthlyPayment, setSelectedMonthForMonthlyPayment] = useState<number>(getCurrentMonth());
  const last12Months: SelectOption[] = getLast12MonthsAsOptions();
  const [lastNumberOfMonths, setLastNumberOfMonths] = useState<number>(3);
  const last3Intervals: SelectOption[] = [{ value: 3, text: 'Last 3 months'}, { value: 6, text: 'Last 6 months'}, { value: 12, text: 'Last 12 months'}];
  const [residenceMessages, setResidenceMessages] = useState<ResidenceMessage[]>([]);
  const [currentResidenceMessage, setCurrentResidenceMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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

    let newResidentIdMapping: Record<number, string> = {};
    residenceData!.users.forEach(user => {
      newResidentIdMapping[user.id] = user.name;
    });
    setResidentIdMapping(newResidentIdMapping);
  };

  const handleEditResidenceModalSubmit = async (data: ResidenceEditModalData) => {
    await editResidence(data);
    hopefulResidenceEdit(data);

    setResidenceModalOpen(false);
  };

  const handleLeaveResidenceModalSubmit = async () => {
    await leaveResidence();
    setResidenceData(null);
    setResidentIdMapping({});

    setResidenceModalOpen(false);
  };

  const handleDeleteResidenceModalSubmit = async () => {
    await deleteResidence();
    setResidenceData(null);
    setResidentIdMapping({});

    setResidenceModalOpen(false);
  };

  const handleResidenceModalClose = () => {
    setResidenceModalOpen(false);
  };

  const handleResidentAdd = (resident: User, newMessage: ResidenceMessage) => {
    setResidenceData({
      residence: {
        name: residenceData!.residence.name,
        monthly_payment: residenceData!.residence.monthly_payment
      },
      users: [...residenceData!.users, resident]
    });

    setResidenceMessages([...residenceMessages, newMessage]);
  };

  const handleResidentRemove = (id: number, newMessage: ResidenceMessage) => {
    setResidenceData({
      residence: {
        name: residenceData!.residence.name,
        monthly_payment: residenceData!.residence.monthly_payment
      },
      users: residenceData!.users.filter((resident) => resident.id !== id)
    });

    setResidenceMessages([...residenceMessages, newMessage]);
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

  const handleManualModalSubmit = async (data: ResidenceBillAddManualModalData, payments: Record<number, ResidenceBillPaymentData>) => {
    const newBill = await addResidenceBill(data);
    if (newBill) {
      hopefulBillAdd(newBill);

      const billId = newBill.id;
      const newResidencePayments: Record<number, ResidencePayment[]> = {};
      const newPayments: ResidencePayment[] = [];
      for (const payerId in payments) {
        const payment = payments[payerId];
        if (payment.payeeId !== 0) {
          const newPayment = await addResidencePayment(billId, Number(payerId), payment.payeeId, payment.amount);
          if (newPayment) newPayments.push(newPayment);
        }
      }
      newResidencePayments[billId] = newPayments;
      setResidencePayments(newResidencePayments);
    }

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
    setRelevantPayments([]);
  };

  // RESIDENCE BILL CARD FUNCTIONS

  const handleOpenClick = (id: number) => {
    const foundBill = residenceBills.find(bill => bill.id === id);
    if (foundBill) setResidenceBillSelected(foundBill);
  }

  const handlePayClick = (billId: number, paymentId: number) => {
    const foundBill = residenceBills.find(bill => bill.id === billId);
    if (foundBill) {
      setResidenceBillSelected(foundBill);
      setRelevantPayments(residencePayments[billId]);
    }

    setPaymentIdToPay(paymentId);

    setModalType(RESIDENCE_BILL_PAY_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  const handlePayModalSubmit = async (billId: number, data: ResidenceBillPayModalData, paymentId: number | null) => {
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

    if (paymentId) {
      const newMessage = await payResidencePayment(paymentId);
      if (newMessage) {
        setResidenceMessages([...residenceMessages, newMessage]);
        setCurrentResidenceMessage('');
      }
      
      const newResidencePayments: Record<number, ResidencePayment[]> = { 
        ...residencePayments, 
        [billId]: residencePayments[billId].map(payment => 
          payment.id === paymentId ? { ...payment, status: 'Paid' } : payment
        )
      };
      setResidencePayments(newResidencePayments);

      if (residenceBillSelected) {
        if (residenceBillSelected.category === 'Rent' || residenceBillSelected.category === 'Mortgage' && (getMonthFromDate(residenceBillSelected.due_date) === selectedMonthForMonthlyPayment)) {
          for (let i = 0; i < residenceBills.length; i++) {
            const bill = residenceBills[i];
            const payments = newResidencePayments[bill.id];
      
            if (getMonthFromDate(bill.due_date) === selectedMonthForMonthlyPayment && (bill.category === 'Rent' || bill.category === 'Mortgage')) {
              let billPaid = 0;
      
              for (let j = 0; j < payments.length; j++) {
                const payment = payments[j];
                if (payment.payee_id === null && payment.status === 'Paid') billPaid += payment.amount;
              }
      
              setMonthlyPayment({
                total: bill.total,
                dueDate: bill.due_date,
                paid: billPaid === bill.total
              });
            }
          }
        }
      }
    }

    setResidenceBillModalOpen(false);
    setPaymentIdToPay(null);
    setResidenceBillSelected(null);
    setRelevantPayments([]);
  };

  const handleEditClick = (id: number) => {
    const foundBill = residenceBills.find(bill => bill.id === id);
    if (foundBill) {
      setResidenceBillSelected(foundBill);
      setRelevantPayments(residencePayments[id]);
    }

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

  const handleEditResidenceBillModalSubmit = async (id: number, data: ResidenceBillEditModalData, payments: Record<number, ResidenceBillPaymentData>) => {
    await editResidenceBill(id, data);
    hopefulResidenceBillEdit(id, data);

    const oldPayments = [...residencePayments[id]];
    const newPayments: ResidencePayment[] = [];

    // Update existing payments and removing payments that have payee_id of 0
    for (const oldPayment of oldPayments) {
      const { payeeId, amount } = payments[oldPayment.payer_id];
      if (oldPayment.payee_id === payeeId && oldPayment.amount === amount) newPayments.push(oldPayment);
      else {
        if (payeeId !== 0) {
          await editResidencePayment(oldPayment.id, id, oldPayment.payer_id, payeeId, amount);

          const newPayment = {
            ...oldPayment,
            payee_id: payeeId,
            amount: amount
          };
          newPayments.push(newPayment);
        } else {
          await deleteResidencePayment(oldPayment.id);
        }
      }
    };

    // Add any new payments
    for (const payerId of Object.keys(payments)) {
      const payerIdNumber = Number(payerId);
      const isExistingPayment = oldPayments.some((payment) => payment.payer_id === payerIdNumber);

      if (!isExistingPayment) {
        const paymentData = payments[payerIdNumber];
        if (paymentData.payeeId !== 0) {
          const newPayment = await addResidencePayment(id, payerIdNumber, paymentData.payeeId, paymentData.amount);
          if (newPayment) newPayments.push(newPayment);
        }
      }
    };

    setResidencePayments((prevPayments) => ({
      ...prevPayments,
      [id]: [...newPayments]
    }));

    setResidenceBillModalOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    const foundBill = residenceBills.find(bill => bill.id === id);
    if (foundBill) {
      setResidenceBillSelected(foundBill);
      setRelevantPayments(residencePayments[id]);
    }
    
    setModalType(RESIDENCE_BILL_DELETE_MODAL_TYPE);
    setResidenceBillModalOpen(true);
  };

  const handleDeleteResidenceBillModalSubmit = async (id: number) => {
    setResidenceBills((prevResdienceBills) => prevResdienceBills.filter((bill) => bill.id !== id));
    await removeResidenceBill(id);

    setResidenceBillModalOpen(false);
    setResidenceBillSelected(null);
    setRelevantPayments([]);
  };

  // RESIDENCE FIGURES FUNCTIONS

  const handleMonthChange = (value: number) => {
    setSelectedMonthForMonthlyPayment(value);

    let foundMonthlyPaymentBill = false;

    for (let i = 0; i < residenceBills.length; i++) {
      const bill = residenceBills[i];
      const payments = residencePayments[bill.id];

      if (getMonthFromDate(bill.due_date) === value && (bill.category === 'Rent' || bill.category === 'Mortgage')) {
        foundMonthlyPaymentBill = true;
        let billPaid = 0;

        for (let j = 0; j < payments.length; j++) {
          const payment = payments[j];
          if (payment.payee_id === null && payment.status === 'Paid') billPaid += payment.amount;
        }

        setMonthlyPayment({
          total: bill.total,
          dueDate: bill.due_date,
          paid: billPaid === bill.total
        });
      }
    }

    if (!foundMonthlyPaymentBill) setMonthlyPayment(null);
  };

  const handleIntervalChange = (lastNumberOfMonths: number) => {
    setLastNumberOfMonths(lastNumberOfMonths);
  };

  // RESIDENCE MESSAGE FUNCTIONS

  const handleResidenceMessageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentResidenceMessage(event.currentTarget.value);
  };

  const handleResidenceMessageSend = async () => {
    const newMessage = await createResidenceMessage(false, currentResidenceMessage);
    if (newMessage) {
      setResidenceMessages([...residenceMessages, newMessage]);
      setCurrentResidenceMessage('');
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [residenceMessages]);

  useEffect(() => {
    const fetchResidenceData = async () => {
      setLoading(true);

      const fetchedUserId = await fetchCurrentUserId();
      if (fetchedUserId) setCurrentUserId(fetchedUserId);

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);

      const fetchedResidenceInfo = await fetchResidenceInfo();
      if (fetchedResidenceInfo) {
        setResidenceData(fetchedResidenceInfo);

        let newResidentIdMapping: Record<number, string> = {};
        fetchedResidenceInfo.users.forEach(user => {
          newResidentIdMapping[user.id] = user.name;
        });
        setResidentIdMapping(newResidentIdMapping);
      }

      const fetchedResidenceBills = await fetchAllResidenceBills();
      if (fetchedResidenceBills) {
        setResidenceBills(fetchedResidenceBills);
        
        let residenceBillIdsToResidencePayments: Record<number, ResidencePayment[]> = {};
        for (let i = 0; i < fetchedResidenceBills.length; i++) {
          const bill = fetchedResidenceBills[i];

          const fetchedResidencePayments = await fetchResidencePayments(bill.id);
          if (fetchedResidencePayments) {
            residenceBillIdsToResidencePayments[bill.id] = fetchedResidencePayments;

            if (getMonthFromDate(bill.due_date) === selectedMonthForMonthlyPayment && (bill.category === 'Rent' || bill.category === 'Mortgage')) {
              let billPaid = 0;

              for (let j = 0; j < fetchedResidencePayments.length; j++) {
                const payment = fetchedResidencePayments[j];
                if (payment.payee_id === null && payment.status === 'Paid') billPaid += payment.amount;
              }

              setMonthlyPayment({
                total: bill.total,
                dueDate: bill.due_date,
                paid: billPaid === bill.total
              });
            }
          }
        }

        setResidencePayments(residenceBillIdsToResidencePayments);
      }

      const fetchedResidenceMessages = await fetchAllResidenceMessages();
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
      <ResidenceModal type={modalType} isOpen={residenceModalOpen} residenceData={residenceData} currentUserId={currentUserId} onCreateModalSubmit={handleCreateResidenceModalSubmit} onEditModalSubmit={handleEditResidenceModalSubmit} onLeaveModalSubmit={handleLeaveResidenceModalSubmit} onDeleteModalSubmit={handleDeleteResidenceModalSubmit} onClose={handleResidenceModalClose} onResidentAdd={handleResidentAdd} onResidentRemove={handleResidentRemove}/>
      <ResidenceBillModal type={modalType} isOpen={residenceBillModalOpen} residenceBill={residenceBillSelected} residents={residenceData!.users} payments={relevantPayments} paymentIdToPay={paymentIdToPay} accounts={accounts} currentUserId={currentUserId} monthlyPaymentType={residenceData!.residence.monthly_payment} onManualModalSubmit={handleManualModalSubmit} onDocumentModalSubmit={handleDocumentModalSubmit} onPayModalSubmit={handlePayModalSubmit} onEditModalSubmit={handleEditResidenceBillModalSubmit} onDeleteModalSubmit={handleDeleteResidenceBillModalSubmit} onClose={handleResidenceBillModalClose}/>

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
                { residenceData.residence.monthly_payment === 'None' ? (
                  <p className="text-md font-normal text-off_gray">No monthly payments!</p>
                ) : (
                  <>
                    <div className="flex flex-row justify-between">
                      <h3 className="text-lg font-medium text-off_black">Monthly { residenceData.residence.monthly_payment }</h3>
                      <Select options={last12Months} onSelect={handleMonthChange}/>
                    </div>

                    { monthlyPayment ? (
                      <>
                        <h2 className={`${dmSans.className} antialiased text-black tracking-tight text-4xl font-semibold my-4`}>{formatDollarAmount(monthlyPayment.total)}</h2>

                        <div className="flex flex-row items-center gap-2">
                          <div className={clsx("max-w-fit rounded-full px-3 py-1", { "bg-positive": monthlyPayment.paid, "bg-negative": !monthlyPayment.paid })}>
                            <p className={clsx("text-md font-medium", { "text-positive_text": monthlyPayment.paid, "text-negative_text": !monthlyPayment.paid })}>{monthlyPayment.paid ? 'Paid' : 'Not paid'}</p>
                          </div>
                          <h4 className="text-md font-normal text-gray-400">Due {formatDate(monthlyPayment.dueDate)}</h4>
                        </div>
                      </>
                    ) : (
                      <p className="text-md font-normal text-off_gray mt-1">No {residenceData.residence.monthly_payment.charAt(0).toLowerCase() + residenceData.residence.monthly_payment.substring(1)} bill found!</p>
                    )}
                  </>
                )}
              </Card>

              <Card>
                { residenceData.residence.monthly_payment === 'None' ? (
                  <p className="text-md font-normal text-off_gray">No monthly payments!</p>
                ) : (
                  <>
                    <div className="flex flex-row justify-between">
                      <h3 className="text-lg font-medium text-off_black">{ residenceData.residence.monthly_payment } vs. Utilities</h3>
                      <Select options={last3Intervals} onSelect={handleIntervalChange}/>
                    </div>

                    <ResidenceGraph monthlyPaymentType={residenceData.residence.monthly_payment} lastNumberOfMonths={lastNumberOfMonths} residenceBills={residenceBills}/>
                  </>
                )}
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-off_black">Manage Residence</h3>

                <div className="flex flex-col my-2 gap-4">
                  <div>
                    <p className="text-sm text-off_black font-medium mb-1">Residence Name</p>
                    <p className="text-md text-off_black font-normal bg-gray-100 rounded-md px-2 py-1 truncate">{residenceData.residence.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-off_black font-medium mb-1">Monthly Payment Type</p>
                    <p className="text-md text-off_black font-normal bg-gray-100 rounded-md px-2 py-1">{residenceData.residence.monthly_payment.charAt(0).toUpperCase() + residenceData.residence.monthly_payment.substring(1)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-off_black font-medium mb-1">Residents</p>
                    <div className="flex flex-col gap-2">
                      { residenceData.users.map((user) => {
                        return (
                          <div key={user.id} className="flex flex-row items-center gap-1">
                            <UserCircleIcon className="w-6 h-6 text-gray-300"/>
                            <p className="text-md text-off_black font-normal truncate">{user.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center mt-4 gap-2">
                  <Button onClick={handleEditResidenceClick} size="sm">Edit Residence</Button>
                  <div className="flex flex-row gap-2">
                    <Button onClick={handleLeaveResidenceClick} size="sm">Leave Residence</Button>
                    <Button onClick={handleDeleteResidenceClick} size="sm">Delete Residence</Button>
                  </div>
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
                        return <ResidenceBillCard key={bill.id} id={bill.id} category={bill.category} dueDate={formatDate(bill.due_date)} total={bill.total} payments={residencePayments[bill.id]} residentIdToName={residentIdMapping} currentUserId={currentUserId} onOpen={handleOpenClick} onPay={handlePayClick} onEdit={handleEditClick} onDelete={handleDeleteClick}/>
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
                      <div className="flex flex-col gap-4 pr-4 pb-4 items-start max-h-72 overflow-y-auto" ref={containerRef}>
                        {residenceMessages.map((message) => {
                          if (message.is_update) {
                            return (
                              <div key={message.id} className="self-center">
                                <h6 className="text-sm font-normal text-off_gray">{message.content}</h6>
                              </div>
                            );
                          }

                          return (
                            <div key={message.id} className={clsx({"self-end": message.user_id === currentUserId})}>
                              { message.user_id !== currentUserId && <p className="ml-3 mb-1 text-xs font-normal text-off_gray">{residentIdMapping[message.user_id]}</p> }
                              <h6 className={clsx("max-w-fit rounded-full px-3 py-1 text-md font-normal",
                                {
                                  "bg-white text-off_black": message.user_id !== currentUserId,
                                  "bg-accent text-white": message.user_id === currentUserId
                                }
                              )}>{message.content}</h6>
                            </div>
                          );
                        })}
                        <div ref={bottomRef}/>
                      </div>
                    ) : (
                      <p className="text-sm font-normal text-off_gray">No recent messages</p>
                    )}
                  </>
                  <form onSubmit={e => {e.preventDefault(); handleResidenceMessageSend();}} className="flex flex-row items-center gap-2 h-8">
                    <input className="rounded-full bg-white border border-gray-200 w-full px-4 py-1 focus:outline-none focus:border-gray-300 text-sm text-off_black font-normal" type="text" placeholder="Enter message" value={currentResidenceMessage} onChange={handleResidenceMessageChange}/>
                    <IconButton className="h-8" icon={PaperAirplaneIcon} onClick={handleResidenceMessageSend}></IconButton>
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
