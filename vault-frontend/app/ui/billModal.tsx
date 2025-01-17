import React, { useState, useEffect } from 'react';
import { Account, Bill, BillAddManualModalData, BillAddDocumentModalData, BillEditModalData, SelectOption, BILL_ADD_MANUAL_MODAL_TYPE, BILL_ADD_DOCUMENT_MODAL_TYPE, BILL_EDIT_MODAL_TYPE, BILL_PAY_MODAL_TYPE } from '@/app/lib/definitions';
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
  category: 'category1'
};

const initialDocumentModalData: BillAddDocumentModalData = {
  nickname: ''
};

const initialEditModalData: BillEditModalData = {
  name: '',
  total: '0',
  dueDate: '',
  category: 'category1'
}

type BillModalProps = {
  type: number;
  isOpen: boolean;
  bill: Bill | null;
  onManualModalSubmit: (data: BillAddManualModalData) => void;
  onDocumentModalSubmit: (data: BillAddDocumentModalData) => void;
  onPayModalSubmit: (id: number) => void;
  onEditModalSubmit: (id: number, data: BillEditModalData) => void
  onDeleteModalSubmit: (id: number) => void;
  onClose: () => void;
}

export default function BillModal({ type, isOpen, bill, onManualModalSubmit, onDocumentModalSubmit, onPayModalSubmit, onEditModalSubmit, onDeleteModalSubmit, onClose }: BillModalProps) {
  const [billAddManualFormState, setBillAddManualFormState] = useState<BillAddManualModalData>(initialManualModalData);
  const [billAddDocumentFormState, setBillAddDocumentFormState] = useState<BillAddDocumentModalData>(initialDocumentModalData);
  const [billEditFormState, setBillEditFormState] = useState<BillEditModalData>(initialEditModalData);
  const [categoryOption, setCategoryOption] = useState<string>(initialManualModalData.category);
  const [invalidDollarAmount, setInvalidDollarAmount] = useState<boolean>(false);

  const handleClose = () => {
    setBillAddManualFormState(initialManualModalData);
    setBillAddDocumentFormState(initialDocumentModalData);
    setBillEditFormState(initialEditModalData);
    setCategoryOption(initialManualModalData.category);
    setInvalidDollarAmount(false);
    onClose();
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

  const handleBillPayModal = (): void => {
    if (bill) onPayModalSubmit(bill.id);
  };

  const handleBillEditModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (bill) {
      if (validDollarAmount(Number(billEditFormState.total))) {
        onEditModalSubmit(bill.id, billEditFormState);
        setBillEditFormState(initialManualModalData);
        setInvalidDollarAmount(false);
      } else {
        setInvalidDollarAmount(true);
      }
    }
  };

  const handleBillDeleteModal = (): void => {
    if (bill) onDeleteModalSubmit(bill.id);
  };

  useEffect(() => {
    if (bill) {
      setBillEditFormState({
        name: bill.name,
        total: String(bill.total),
        dueDate: reformatDate(bill.due_date),
        category: bill.category
      });
    }
  }, [bill]);

  return (
    <Modal
      title={ type === BILL_ADD_MANUAL_MODAL_TYPE ? "Enter Bill Information" :
              type === BILL_ADD_DOCUMENT_MODAL_TYPE ? "Upload Bill Document" :
              type === BILL_PAY_MODAL_TYPE ? "Mark this bill as paid?" :
              type === BILL_EDIT_MODAL_TYPE ? "Edit Bill Information" :
              "Are you sure you want to delete this bill?" }
      isOpen={isOpen}
      onClose={handleClose}
    >
      
      { type === BILL_ADD_MANUAL_MODAL_TYPE ? (
        <form onSubmit={handleBillAddManualModalFormSubmit}>
          <Input onChange={handleBillAddManualFormInputChange} value={billAddManualFormState.name} id="name" name="name" type="text" label="Name" placeholder="Enter bill name"/>
          <Input onChange={handleBillAddManualFormInputChange} value={String(billAddManualFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillAddManualFormInputChange} value={String(billAddManualFormState.dueDate)} min={new Date().toJSON().slice(0, 10)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>
          
          <Input onChange={handleBillAddManualFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" radioLabel="Category 1" checked={categoryOption == 'category1'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="category2" name="category" type="radio" value="category2" radioLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="category3" name="category" type="radio" value="category3" radioLabel="Category 3" checked={categoryOption === 'category3'}/>
          
          <Warning isShown={invalidDollarAmount}>Please enter a valid dollar amount!</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === BILL_ADD_DOCUMENT_MODAL_TYPE ? (
        <form onSubmit={handleBillAddDocumentModalFormSubmit}>
          <Input onChange={handleBillAddDocumentFormInputChange} value={billAddDocumentFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button>
          </div>
        </form>
      ) : (type === BILL_PAY_MODAL_TYPE ? (
        <div className="flex flex-row justify-center gap-8">
          <Button onClick={handleBillPayModal} size="md">Pay Bill</Button>
          <Button onClick={onClose} buttonType="neutral" size="md">Cancel</Button>
        </div>
      ) : (type === BILL_EDIT_MODAL_TYPE ? (
        <form onSubmit={handleBillEditModalFormSubmit}>
          <Input onChange={handleBillEditFormInputChange} value={billEditFormState.name} id="name" name="name" type="text" label="Name" placeholder="Enter bill name"/>
          <Input onChange={handleBillEditFormInputChange} value={String(billEditFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillEditFormInputChange} value={String(billEditFormState.dueDate)} min={new Date().toJSON().slice(0, 10)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>
          
          <Input onChange={handleBillEditFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" radioLabel="Category 1" checked={categoryOption == 'category1'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="category2" name="category" type="radio" value="category2" radioLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="category3" name="category" type="radio" value="category3" radioLabel="Category 3" checked={categoryOption === 'category3'}/>
          
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
