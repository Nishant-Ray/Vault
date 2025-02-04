import React, { useState, useEffect } from 'react';
import { User, Account, ResidenceBill, ResidenceBillAddManualModalData, ResidenceBillAddDocumentModalData, ResidenceBillPayModalData, ResidenceBillEditModalData, SelectOption, RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE, RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE, RESIDENCE_BILL_PAY_MODAL_TYPE, RESIDENCE_BILL_EDIT_MODAL_TYPE, RESIDENCE_BILL_DELETE_MODAL_TYPE, ResidenceBillPaymentData, ResidencePayment } from '@/app/lib/definitions';
import { validDollarAmount, reformatDate } from '@/app/lib/utils';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import Warning from '@/app/ui/warning';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const initialManualModalData: ResidenceBillAddManualModalData = {
  total: '0',
  dueDate: '',
  category: 'Rent'
};

const initialDocumentModalData: ResidenceBillAddDocumentModalData = {
  nickname: ''
};

const initialPayModalData: ResidenceBillPayModalData = {
  alsoTransaction: false,
  accountID: ''
}

const initialEditModalData: ResidenceBillEditModalData = {
  total: '0',
  dueDate: '',
  category: 'Rent'
}

type ResidenceBillModalProps = {
  type: number;
  isOpen: boolean;
  residenceBill: ResidenceBill | null;
  residents: User[];
  payments: ResidencePayment[];
  paymentIdToPay: number | null;
  accounts: Account[];
  currentUserId: number;
  monthlyPaymentType: 'Rent' | 'Mortgage' | 'None';
  onManualModalSubmit: (data: ResidenceBillAddManualModalData, payments: Record<number, ResidenceBillPaymentData>) => void;
  onDocumentModalSubmit: (data: ResidenceBillAddDocumentModalData) => void;
  onPayModalSubmit: (billId: number, data: ResidenceBillPayModalData, paymentId: number | null) => void;
  onEditModalSubmit: (id: number, data: ResidenceBillEditModalData, payments: Record<number, ResidenceBillPaymentData>) => void
  onDeleteModalSubmit: (id: number) => void;
  onClose: () => void;
}

export default function ResidenceBillModal({ type, isOpen, residenceBill, residents, payments, paymentIdToPay, accounts, currentUserId, monthlyPaymentType, onManualModalSubmit, onDocumentModalSubmit, onPayModalSubmit, onEditModalSubmit, onDeleteModalSubmit, onClose }: ResidenceBillModalProps) {
  const [residenceBillAddManualFormState, setResidenceBillAddManualFormState] = useState<ResidenceBillAddManualModalData>(initialManualModalData);
  const [residenceBillAddDocumentFormState, setResidenceBillAddDocumentFormState] = useState<ResidenceBillAddDocumentModalData>(initialDocumentModalData);
  const [residenceBillPayFormState, setResidenceBillPayFormState] = useState<ResidenceBillPayModalData>(initialPayModalData);
  const [residenceBillEditFormState, setResidenceBillEditFormState] = useState<ResidenceBillEditModalData>(initialEditModalData);
  const [residenceBillPaymentsState, setResidenceBillPaymentsState] = useState<Record<number, ResidenceBillPaymentData>>({}); // payer_id --> payment
  const [categoryOption, setCategoryOption] = useState<string>(initialManualModalData.category);
  const [payeeOptions, setPayeeOptions] = useState<SelectOption[]>([]);
  const [invalidDollarAmount, setInvalidDollarAmount] = useState<boolean>(false);
  const [improperPayments, setImproperPayments] = useState<boolean>(false);
  const [alsoTransactionChecked, setAlsoTransactionChecked] = useState<boolean>(false);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);

  const handleOpen = () => {
    reloadState();
  };

  const handleClose = () => {
    onClose();
    setResidenceBillAddManualFormState(initialManualModalData);
    setResidenceBillAddDocumentFormState(initialDocumentModalData);
    setResidenceBillPayFormState(initialPayModalData);
    setResidenceBillEditFormState(initialEditModalData);
    setResidenceBillPaymentsState({});
    if (type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE) setCategoryOption(initialManualModalData.category);
    setAlsoTransactionChecked(false);
    setInvalidDollarAmount(false);
    setImproperPayments(false);
  };

  const handleBillAddManualFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceBillAddManualFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'category') setCategoryOption(value);
  };

  const handleBillAddDocumentFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceBillAddDocumentFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleBillPaymentsInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const name = event.target.name;
    const id = Number(event.target.id.split('_')[2]);
    const value = Number(event.target.value);

    if (name === 'payee') {
      setResidenceBillPaymentsState((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          payeeId: value === -1 ? null : value,
        }
      }));
    } else if (name === 'amount') {
      setResidenceBillPaymentsState((prevState) => ({
        ...prevState,
        [id]: {
          ...prevState[id],
          amount: value,
        }
      }));
    }
  };

  const handleBillPayFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceBillPayFormState((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'accountID' ? Number(value) : ((name === 'alsoTransaction' && event.target instanceof HTMLInputElement) ? event.target.checked : value)
    }));

    if (name === 'alsoTransaction' && event.target instanceof HTMLInputElement) setAlsoTransactionChecked(event.target.checked);
  };

  const handleBillEditFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceBillEditFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'category') setCategoryOption(value);
  };

  const handleBillAddManualModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setInvalidDollarAmount(false);
    setImproperPayments(false);
    if (validDollarAmount(Number(residenceBillAddManualFormState.total))) {
      setInvalidDollarAmount(false);

      let billAmount: number = 0;
      for (const payment of Object.values(residenceBillPaymentsState)) {
        if (!validDollarAmount(payment.amount)) {
          setInvalidDollarAmount(true);
          break;
        }
        if (payment.payeeId === null) billAmount += payment.amount;
      }

      if (!invalidDollarAmount) {
        if (billAmount === Number(residenceBillAddManualFormState.total)) {
          onManualModalSubmit(residenceBillAddManualFormState, residenceBillPaymentsState);
          setResidenceBillAddManualFormState(initialManualModalData);
          setResidenceBillPaymentsState({});
          setImproperPayments(false);
        } else {
          setImproperPayments(true);
        }
      }
      
    } else {
      setInvalidDollarAmount(true);
    }
  };

  const handleBillAddDocumentModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onDocumentModalSubmit(residenceBillAddDocumentFormState);
    setResidenceBillAddDocumentFormState(initialDocumentModalData);
  };

  const handleBillPayModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (residenceBill) {
      onPayModalSubmit(residenceBill.id, residenceBillPayFormState, paymentIdToPay);
      setResidenceBillPayFormState(initialPayModalData);
    }
  };

  const handleBillEditModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setInvalidDollarAmount(false);
    setImproperPayments(false);
    if (residenceBill) {
      if (validDollarAmount(Number(residenceBillEditFormState.total))) {
        setInvalidDollarAmount(false);

        let billAmount: number = 0;
        for (const payment of Object.values(residenceBillPaymentsState)) {
          if (!validDollarAmount(payment.amount)) {
            setInvalidDollarAmount(true);
            break;
          }
          if (payment.payeeId === null) billAmount += payment.amount;
        }

        if (!invalidDollarAmount) {
          if (billAmount === Number(residenceBillEditFormState.total)) {
            onEditModalSubmit(residenceBill.id, residenceBillEditFormState, residenceBillPaymentsState);
            setResidenceBillEditFormState(initialEditModalData);
            setResidenceBillPaymentsState({});
            setImproperPayments(false);
          } else {
            setImproperPayments(true);
          }
        }
      } else {
        setInvalidDollarAmount(true);
      }
    }
  };

  const handleBillDeleteModal = (): void => {
    if (residenceBill) onDeleteModalSubmit(residenceBill.id);
  };

  const reloadState = () => {
    if (residenceBill) {
      setResidenceBillEditFormState({
        total: String(residenceBill.total),
        dueDate: reformatDate(residenceBill.due_date),
        category: residenceBill.category
      });

      setCategoryOption(residenceBill.category);
    }
  };

  useEffect(() => {
    let newAccountOptions: SelectOption[] = [];
    accounts.forEach(account => {
      newAccountOptions.push({value: account.id, text: account.nickname});
    });
    setAccountOptions(newAccountOptions);
  }, [accounts]);

  useEffect(() => {
    reloadState();
  }, [residenceBill]);

  useEffect(() => {
    let newState = { ...residenceBillPaymentsState };

    payments.forEach(payment => {
      newState[payment.payer_id] = {
        payeeId: payment.payee_id,
        amount: payment.amount
      };
    });

    setResidenceBillPaymentsState(newState);
  }, [payments]);

  useEffect(() => {
    const newPayeeOptions: SelectOption[] = [
      { value: 0, text: 'None' },
      { value: -1, text: 'Bill Directly' }
    ];
    residents.forEach(resident => {
      newPayeeOptions.push({ value: resident.id, text: resident.name });
    });

    setPayeeOptions(newPayeeOptions);
  }, [residents]);

  return (
    <Modal
      title={ type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE ? "Enter Residence Bill Information" :
              type === RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE ? "Upload Residence Bill Document" :
              type === RESIDENCE_BILL_PAY_MODAL_TYPE ? "Mark this residence bill as paid?" :
              type === RESIDENCE_BILL_EDIT_MODAL_TYPE ? "Edit Residence Bill Information" :
              "Are you sure you want to delete this residence bill?" }
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
    >

      { type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE ? (
        <form onSubmit={handleBillAddManualModalFormSubmit}>
          <Input onChange={handleBillAddManualFormInputChange} value={String(residenceBillAddManualFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillAddManualFormInputChange} value={String(residenceBillAddManualFormState.dueDate)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>

          { monthlyPaymentType !== 'None' && <Input onChange={handleBillAddManualFormInputChange} id={monthlyPaymentType} name="category" type="radio" value={monthlyPaymentType} label="Category" sideLabel={monthlyPaymentType} checked={categoryOption === monthlyPaymentType} standalone={false}/> }
          <Input onChange={handleBillAddManualFormInputChange} id="Water" name="category" type="radio" value="Water" sideLabel="Water" checked={categoryOption === 'Water'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="Electricity" name="category" type="radio" value="Electricity" sideLabel="Electricity" checked={categoryOption === 'Electricity'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="Internet" name="category" type="radio" value="Internet" sideLabel="Internet" checked={categoryOption === 'Internet'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="Trash" name="category" type="radio" value="Trash" sideLabel="Trash" checked={categoryOption === 'Trash'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="Gas" name="category" type="radio" value="Gas" sideLabel="Gas" checked={categoryOption === 'Gas'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="Misc" name="category" type="radio" value="Misc" sideLabel="Misc." checked={categoryOption === 'Misc'}/>

          <div className="mb-2">
            <p className="block mb-2 text-lg font-medium text-off_black pl-2">Resident Bill Payments</p>
            <div className="w-full flex flex-row justify-center items-center gap-12 px-4 py-2 bg-gray-100 rounded-md text-off_black font-normal text-sm">
                <p className="w-44">Resident</p>
                <p className="w-44">To Pay</p>
                <p className="w-36">Amount</p>
            </div>
            <div className="flex flex-col gap-1">
              { residents.map((resident) => {
                const payeeIdValue = resident.id in residenceBillPaymentsState ? (residenceBillPaymentsState[resident.id].payeeId ?? -1) : 0; 
                const amountValue = resident.id in residenceBillPaymentsState ? residenceBillPaymentsState[resident.id].amount : "";

                return (
                  <div key={resident.id} className="w-full flex flex-row justify-center items-center gap-12 px-4 py-2 text-off_black font-normal text-md">
                    <div className="w-44 flex flex-row items-center gap-1">
                      <UserCircleIcon className="w-6 h-6 text-gray-300"/>
                      <p className="truncate">{ resident.name }<span className="text-xs text-off_gray">{resident.id === currentUserId ? ' (YOU)' : ''}</span></p>
                    </div>

                    <Select onChange={handleBillPaymentsInputChange} id={`add_payee_${String(resident.id)}`} name="payee" options={payeeOptions.filter((option) => option.value !== resident.id)} value={payeeIdValue} className="w-44"/>

                    <input onChange={handleBillPaymentsInputChange} id={`add_amount_${String(resident.id)}`} name="amount" defaultValue={amountValue} className="w-36 bg-gray-200 rounded-full px-4 py-1 focus:outline-none" type="number" placeholder="Enter amount"/>
                  </div>
                );
              })}
            </div>
          </div>

          <Warning isShown={invalidDollarAmount || improperPayments}>{ invalidDollarAmount ? 'Please enter a valid dollar amount!' : improperPayments ? 'Please ensure direct payments add up to bill amount!' : '' }</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE ? (
        // <form onSubmit={handleBillAddDocumentModalFormSubmit}>
        //   <Input onChange={handleBillAddDocumentFormInputChange} value={residenceBillAddDocumentFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
        //   <div className="flex flex-row justify-center mt-8">
        //     <Button type="submit" size="md">Enter</Button>
        //   </div>
        // </form>
        <p className="font-normal text-md text-off_black w-full text-center">This feature is under construction!</p>
      ) : (type === RESIDENCE_BILL_PAY_MODAL_TYPE ? (
        <form onSubmit={handleBillPayModalFormSubmit}>
          <Input onChange={handleBillPayFormInputChange} id="alsoTransaction" name="alsoTransaction" type="checkbox" label="Log this as a transaction?" sideLabel="Yes" checked={alsoTransactionChecked}/>
          
          { residenceBillPayFormState.alsoTransaction && (
            <>
              <Select onChange={handleBillPayFormInputChange} value={residenceBillPayFormState.accountID} id="accountID" name="accountID" label="Account Used" options={accountOptions}/>
            </>
          )}

          <div className="flex flex-row justify-center gap-8">
            <Button type="submit" size="md">Pay Bill</Button>
            <Button onClick={handleClose} buttonType="neutral" size="md">Cancel</Button>
          </div>
        </form>
      ) : (type === RESIDENCE_BILL_EDIT_MODAL_TYPE ? (
        <form onSubmit={handleBillEditModalFormSubmit}>
          <Input onChange={handleBillEditFormInputChange} value={String(residenceBillEditFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillEditFormInputChange} value={String(residenceBillEditFormState.dueDate)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>

          { monthlyPaymentType !== 'None' && <Input onChange={handleBillEditFormInputChange} id={monthlyPaymentType} name="category" type="radio" value={monthlyPaymentType} label="Category" sideLabel={monthlyPaymentType} checked={categoryOption === monthlyPaymentType} standalone={false}/> }
          <Input onChange={handleBillEditFormInputChange} id="Water" name="category" type="radio" value="Water" sideLabel="Water" checked={categoryOption === 'Water'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="Electricity" name="category" type="radio" value="Electricity" sideLabel="Electricity" checked={categoryOption === 'Electricity'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="Internet" name="category" type="radio" value="Internet" sideLabel="Internet" checked={categoryOption === 'Internet'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="Trash" name="category" type="radio" value="Trash" sideLabel="Trash" checked={categoryOption === 'Trash'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="Gas" name="category" type="radio" value="Gas" sideLabel="Gas" checked={categoryOption === 'Gas'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="Misc" name="category" type="radio" value="Misc" sideLabel="Misc" checked={categoryOption === 'Misc'}/>

          <div className="mb-2">
            <p className="block mb-2 text-lg font-medium text-off_black pl-2">Resident Bill Payments</p>
            <div className="w-full flex flex-row justify-center items-center gap-12 px-4 py-2 bg-gray-100 rounded-md text-off_black font-normal text-sm">
                <p className="w-44">Resident</p>
                <p className="w-44">To Pay</p>
                <p className="w-36">Amount</p>
            </div>
            <div className="flex flex-col gap-1">
              { residents.map((resident) => {
                const payeeIdValue = resident.id in residenceBillPaymentsState ? (residenceBillPaymentsState[resident.id].payeeId ?? -1) : 0; 
                const amountValue = resident.id in residenceBillPaymentsState ? residenceBillPaymentsState[resident.id].amount : "";

                return (
                  <div key={resident.id} className="w-full flex flex-row justify-center items-center gap-12 px-4 py-2 text-off_black font-normal text-md">
                    <div className="w-44 flex flex-row items-center gap-1">
                      <UserCircleIcon className="w-6 h-6 text-gray-300"/>
                      <p className="truncate">{ resident.name }<span className="text-xs text-off_gray">{resident.id === currentUserId ? ' (YOU)' : ''}</span></p>
                    </div>

                    <Select onChange={handleBillPaymentsInputChange} id={`edit_payee_${String(resident.id)}`} name="payee" options={payeeOptions.filter((option) => option.value !== resident.id)} value={payeeIdValue} className="w-44"/>

                    <input onChange={handleBillPaymentsInputChange} id={`edit_amount_${String(resident.id)}`} name="amount" defaultValue={amountValue} className="w-36 bg-gray-200 rounded-full px-4 py-1 focus:outline-none" type="number" placeholder="Enter amount"/>
                  </div>
                );
              })}
            </div>
          </div>

          <Warning isShown={invalidDollarAmount || improperPayments}>{ invalidDollarAmount ? 'Please enter a valid dollar amount!' : improperPayments ? 'Please ensure direct payments add up to bill amount!' : '' }</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (
        <div className="flex flex-row justify-center gap-8">
          <Button onClick={handleBillDeleteModal} size="md">Delete Bill</Button>
          <Button onClick={onClose} buttonType="neutral" size="md">Cancel</Button>
        </div>
      ))))}
    </Modal>
  )
}
