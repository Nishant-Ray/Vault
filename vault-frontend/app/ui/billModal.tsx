import React, { useState, useEffect } from 'react';
import { Account, Bill, BillAddManualModalData, BillAddDocumentModalData, BillPayModalData, BillEditModalData, SelectOption, BILL_ADD_MANUAL_MODAL_TYPE, BILL_ADD_DOCUMENT_MODAL_TYPE, BILL_EDIT_MODAL_TYPE, BILL_PAY_MODAL_TYPE } from '@/app/lib/definitions';
import { validDollarAmount, reformatDate } from '@/app/lib/utils';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import Warning from '@/app/ui/warning';

const initialManualModalData: BillAddManualModalData = {
  name: '',
  total: '0',
  dueDate: '',
  category: 'Banking'
};

const initialDocumentModalData: BillAddDocumentModalData = {
  nickname: ''
};

const initialPayModalData: BillPayModalData = {
  alsoTransaction: false,
  accountID: ''
}

const initialEditModalData: BillEditModalData = {
  name: '',
  total: '0',
  dueDate: '',
  category: 'Banking'
}

type BillModalProps = {
  type: number;
  isOpen: boolean;
  bill: Bill | null;
  accounts: Account[];
  onManualModalSubmit: (data: BillAddManualModalData) => void;
  onDocumentModalSubmit: (data: BillAddDocumentModalData) => void;
  onPayModalSubmit: (id: number, data: BillPayModalData) => void;
  onEditModalSubmit: (id: number, data: BillEditModalData) => void
  onDeleteModalSubmit: (id: number) => void;
  onClose: () => void;
}

export default function BillModal({ type, isOpen, bill, accounts, onManualModalSubmit, onDocumentModalSubmit, onPayModalSubmit, onEditModalSubmit, onDeleteModalSubmit, onClose }: BillModalProps) {
  const [billAddManualFormState, setBillAddManualFormState] = useState<BillAddManualModalData>(initialManualModalData);
  const [billAddDocumentFormState, setBillAddDocumentFormState] = useState<BillAddDocumentModalData>(initialDocumentModalData);
  const [billPayFormState, setBillPayFormState] = useState<BillPayModalData>(initialPayModalData);
  const [billEditFormState, setBillEditFormState] = useState<BillEditModalData>(initialEditModalData);
  const [categoryOption, setCategoryOption] = useState<string>(initialManualModalData.category);
  const [invalidDollarAmount, setInvalidDollarAmount] = useState<boolean>(false);
  const [alsoTransactionChecked, setAlsoTransactionChecked] = useState<boolean>(false);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);

  const handleOpen = () => {
    if (type === BILL_EDIT_MODAL_TYPE) reloadState();
  };

  const handleClose = () => {
    onClose();
    setBillAddManualFormState(initialManualModalData);
    setBillAddDocumentFormState(initialDocumentModalData);
    setBillPayFormState(initialPayModalData);
    setBillEditFormState(initialEditModalData);
    if (type === BILL_ADD_MANUAL_MODAL_TYPE) setCategoryOption(initialManualModalData.category);
    setAlsoTransactionChecked(false);
    setInvalidDollarAmount(false);
  };

  const handleBillAddManualFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setBillAddManualFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'category') setCategoryOption(value);
  };

  const handleBillAddDocumentFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setBillAddDocumentFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleBillPayFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setBillPayFormState((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'accountID' ? Number(value) : ((name === 'alsoTransaction' && event.target instanceof HTMLInputElement) ? event.target.checked : value)
    }));

    if (name === 'alsoTransaction' && event.target instanceof HTMLInputElement) setAlsoTransactionChecked(event.target.checked);
  };

  const handleBillEditFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setBillEditFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'category') setCategoryOption(value);
  };

  const handleBillAddManualModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (validDollarAmount(Number(billAddManualFormState.total))) {
      onManualModalSubmit(billAddManualFormState);
      setBillAddManualFormState(initialManualModalData);
      setInvalidDollarAmount(false);
    } else {
      setInvalidDollarAmount(true);
    }
  };

  const handleBillAddDocumentModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onDocumentModalSubmit(billAddDocumentFormState);
    setBillAddDocumentFormState(initialDocumentModalData);
  };

  const handleBillPayModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (bill) {
      onPayModalSubmit(bill.id, billPayFormState);
      setBillPayFormState(initialPayModalData);
    }
  };

  const handleBillEditModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (bill) {
      if (validDollarAmount(Number(billEditFormState.total))) {
        onEditModalSubmit(bill.id, billEditFormState);
        setBillEditFormState(initialEditModalData);
        setInvalidDollarAmount(false);
      } else {
        setInvalidDollarAmount(true);
      }
    }
  };

  const handleBillDeleteModal = (): void => {
    if (bill) onDeleteModalSubmit(bill.id);
  };

  const reloadState = () => {
    if (bill) {
      setBillEditFormState({
        name: bill.name,
        total: String(bill.total),
        dueDate: reformatDate(bill.due_date),
        category: bill.category
      });

      setCategoryOption(bill.category);
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
  }, [bill]);

  return (
    <Modal
      title={ type === BILL_ADD_MANUAL_MODAL_TYPE ? "Enter Bill Information" :
              type === BILL_ADD_DOCUMENT_MODAL_TYPE ? "Upload Bill Document" :
              type === BILL_PAY_MODAL_TYPE ? "Mark this bill as paid?" :
              type === BILL_EDIT_MODAL_TYPE ? "Edit Bill Information" :
              "Are you sure you want to delete this bill?" }
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
    >

      { type === BILL_ADD_MANUAL_MODAL_TYPE ? (
        <form onSubmit={handleBillAddManualModalFormSubmit}>
          <Input onChange={handleBillAddManualFormInputChange} value={billAddManualFormState.name} id="name" name="name" type="text" label="Name" placeholder="Enter bill name"/>
          <Input onChange={handleBillAddManualFormInputChange} value={String(billAddManualFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillAddManualFormInputChange} value={String(billAddManualFormState.dueDate)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>

          <Input onChange={handleBillAddManualFormInputChange} id="Banking" name="category" type="radio" value="Banking" label="Category" sideLabel="Banking" checked={categoryOption === 'Banking'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="Cellular" name="category" type="radio" value="Cellular" sideLabel="Cellular" checked={categoryOption === 'Cellular'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="Insurance" name="category" type="radio" value="Insurance" sideLabel="Insurance" checked={categoryOption === 'Insurance'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="Medical" name="category" type="radio" value="Medical" sideLabel="Medical" checked={categoryOption === 'Medical'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="Entertainment" name="category" type="radio" value="Entertainment" sideLabel="Entertainment" checked={categoryOption === 'Entertainment'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="Travel" name="category" type="radio" value="Travel" sideLabel="Travel" checked={categoryOption === 'Travel'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="Fitness" name="category" type="radio" value="Fitness" sideLabel="Fitness" checked={categoryOption === 'Fitness'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="Misc" name="category" type="radio" value="Misc" sideLabel="Misc" checked={categoryOption === 'Misc'}/>

          <Warning isShown={invalidDollarAmount}>Please enter a valid dollar amount!</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === BILL_ADD_DOCUMENT_MODAL_TYPE ? (
        // <form onSubmit={handleBillAddDocumentModalFormSubmit}>
        //   <Input onChange={handleBillAddDocumentFormInputChange} value={billAddDocumentFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
        //   <div className="flex flex-row justify-center mt-8">
        //     <Button type="submit" size="md">Enter</Button>
        //   </div>
        // </form>
        <p className="font-normal text-md text-off_black w-full text-center">This feature is under construction!</p>
      ) : (type === BILL_PAY_MODAL_TYPE ? (
        <form onSubmit={handleBillPayModalFormSubmit}>
          <Input onChange={handleBillPayFormInputChange} id="alsoTransaction" name="alsoTransaction" type="checkbox" label="Log this as a transaction?" sideLabel="Yes" checked={alsoTransactionChecked}/>
          
          { billPayFormState.alsoTransaction && (
            <>
              <Select onChange={handleBillPayFormInputChange} value={billPayFormState.accountID} id="accountID" name="accountID" label="Account Used" options={accountOptions}/>
            </>
          )}

          <div className="flex flex-row justify-center gap-8">
            <Button type="submit" size="md">Pay Bill</Button>
            <Button onClick={handleClose} buttonType="neutral" size="md">Cancel</Button>
          </div>
        </form>
      ) : (type === BILL_EDIT_MODAL_TYPE ? (
        <form onSubmit={handleBillEditModalFormSubmit}>
          <Input onChange={handleBillEditFormInputChange} value={billEditFormState.name} id="name" name="name" type="text" label="Name" placeholder="Enter bill name"/>
          <Input onChange={handleBillEditFormInputChange} value={String(billEditFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillEditFormInputChange} value={String(billEditFormState.dueDate)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>

          <Input onChange={handleBillEditFormInputChange} id="Banking" name="category" type="radio" value="Banking" label="Category" sideLabel="Banking" checked={categoryOption === 'Banking'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="Cellular" name="category" type="radio" value="Cellular" sideLabel="Cellular" checked={categoryOption === 'Cellular'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="Insurance" name="category" type="radio" value="Insurance" sideLabel="Insurance" checked={categoryOption === 'Insurance'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="Medical" name="category" type="radio" value="Medical" sideLabel="Medical" checked={categoryOption === 'Medical'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="Entertainment" name="category" type="radio" value="Entertainment" sideLabel="Entertainment" checked={categoryOption === 'Entertainment'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="Travel" name="category" type="radio" value="Travel" sideLabel="Travel" checked={categoryOption === 'Travel'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="Fitness" name="category" type="radio" value="Fitness" sideLabel="Fitness" checked={categoryOption === 'Fitness'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="Misc" name="category" type="radio" value="Misc" sideLabel="Misc" checked={categoryOption === 'Misc'}/>

          {/* { partOfResidence && <Input onChange={handleBillEditFormInputChange} id="residence" name="residence" type="checkbox" label="Add this as a residence bill?" sideLabel="Yes" checked={residenceChecked}/> } */}

          <Warning isShown={invalidDollarAmount}>Please enter a valid dollar amount!</Warning>

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
