import React, { useState, useEffect } from 'react';
import { Account, ResidenceBill, ResidenceBillAddManualModalData, ResidenceBillAddDocumentModalData, ResidenceBillPayModalData, ResidenceBillEditModalData, SelectOption, RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE, RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE, RESIDENCE_BILL_PAY_MODAL_TYPE, RESIDENCE_BILL_EDIT_MODAL_TYPE, RESIDENCE_BILL_DELETE_MODAL_TYPE } from '@/app/lib/definitions';
import { validDollarAmount, reformatDate } from '@/app/lib/utils';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import Warning from '@/app/ui/warning';

const initialManualModalData: ResidenceBillAddManualModalData = {
  total: '0',
  dueDate: '',
  category: 'category1'
};

const initialDocumentModalData: ResidenceBillAddDocumentModalData = {
  nickname: ''
};

const initialPayModalData: ResidenceBillPayModalData = {
  alsoTransaction: false,
  accountID: '',
  transactionCategory: 'category1',
}

const initialEditModalData: ResidenceBillEditModalData = {
  total: '0',
  dueDate: '',
  category: 'category1'
}

type ResidenceBillModalProps = {
  type: number;
  isOpen: boolean;
  residenceBill: ResidenceBill | null;
  accounts: Account[];
  onManualModalSubmit: (data: ResidenceBillAddManualModalData) => void;
  onDocumentModalSubmit: (data: ResidenceBillAddDocumentModalData) => void;
  onPayModalSubmit: (id: number, data: ResidenceBillPayModalData) => void;
  onEditModalSubmit: (id: number, data: ResidenceBillEditModalData) => void
  onDeleteModalSubmit: (id: number) => void;
  onClose: () => void;
}

export default function ResidenceBillModal({ type, isOpen, residenceBill, accounts, onManualModalSubmit, onDocumentModalSubmit, onPayModalSubmit, onEditModalSubmit, onDeleteModalSubmit, onClose }: ResidenceBillModalProps) {
  const [residenceBillAddManualFormState, setResidenceBillAddManualFormState] = useState<ResidenceBillAddManualModalData>(initialManualModalData);
  const [residenceBillAddDocumentFormState, setResidenceBillAddDocumentFormState] = useState<ResidenceBillAddDocumentModalData>(initialDocumentModalData);
  const [residenceBillPayFormState, setResidenceBillPayFormState] = useState<ResidenceBillPayModalData>(initialPayModalData);
  const [residenceBillEditFormState, setResidenceBillEditFormState] = useState<ResidenceBillEditModalData>(initialEditModalData);
  const [categoryOption, setCategoryOption] = useState<string>(initialManualModalData.category);
  const [invalidDollarAmount, setInvalidDollarAmount] = useState<boolean>(false);
  const [alsoTransactionChecked, setAlsoTransactionChecked] = useState<boolean>(false);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
  const [transactionCategoryOption, setTransactionCategoryOption] = useState<string>(initialPayModalData.transactionCategory);

  const handleClose = () => {
    onClose();
    setResidenceBillAddManualFormState(initialManualModalData);
    setResidenceBillAddDocumentFormState(initialDocumentModalData);
    setResidenceBillPayFormState(initialPayModalData);
    setResidenceBillEditFormState(initialEditModalData);
    if (type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE) setCategoryOption(initialManualModalData.category);
    setAlsoTransactionChecked(false);
    if (type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE) setTransactionCategoryOption(initialPayModalData.transactionCategory);
    setInvalidDollarAmount(false);
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

  const handleBillPayFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceBillPayFormState((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'accountID' ? Number(value) : ((name === 'alsoTransaction' && event.target instanceof HTMLInputElement) ? event.target.checked : value)
    }));

    if (name === 'transactionCategory') setTransactionCategoryOption(value);
    else if (name === 'alsoTransaction' && event.target instanceof HTMLInputElement) setAlsoTransactionChecked(event.target.checked);
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
    if (validDollarAmount(Number(residenceBillAddManualFormState.total))) {
      onManualModalSubmit(residenceBillAddManualFormState);
      setResidenceBillAddManualFormState(initialManualModalData);
      setInvalidDollarAmount(false);
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
      onPayModalSubmit(residenceBill.id, residenceBillPayFormState);
      setResidenceBillPayFormState(initialPayModalData);
    }
  };

  const handleBillEditModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (residenceBill) {
      if (validDollarAmount(Number(residenceBillEditFormState.total))) {
        onEditModalSubmit(residenceBill.id, residenceBillEditFormState);
        setResidenceBillEditFormState(initialEditModalData);
        setInvalidDollarAmount(false);
      } else {
        setInvalidDollarAmount(true);
      }
    }
  };

  const handleBillDeleteModal = (): void => {
    if (residenceBill) onDeleteModalSubmit(residenceBill.id);
  };

  useEffect(() => {
    let newAccountOptions: SelectOption[] = [];
    accounts.forEach(account => {
      newAccountOptions.push({value: account.id, text: account.nickname});
    });
    setAccountOptions(newAccountOptions);
  }, [accounts]);

  useEffect(() => {
    if (residenceBill) {
      setResidenceBillEditFormState({
        total: String(residenceBill.total),
        dueDate: reformatDate(residenceBill.due_date),
        category: residenceBill.category
      });
    }
  }, [residenceBill]);

  return (
    <Modal
      title={ type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE ? "Enter Residence Bill Information" :
              type === RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE ? "Upload Residence Bill Document" :
              type === RESIDENCE_BILL_PAY_MODAL_TYPE ? "Mark this residence bill as paid?" :
              type === RESIDENCE_BILL_EDIT_MODAL_TYPE ? "Edit Residence Bill Information" :
              "Are you sure you want to delete this residence bill?" }
      isOpen={isOpen}
      onClose={handleClose}
    >

      { type === RESIDENCE_BILL_ADD_MANUAL_MODAL_TYPE ? (
        <form onSubmit={handleBillAddManualModalFormSubmit}>
          <Input onChange={handleBillAddManualFormInputChange} value={String(residenceBillAddManualFormState.total)} id="total" name="total" type="number" label="Total ($)" placeholder="Enter bill total"/>
          <Input onChange={handleBillAddManualFormInputChange} value={String(residenceBillAddManualFormState.dueDate)} id="dueDate" name="dueDate" type="date" label="Due Date of Bill"/>

          <Input onChange={handleBillAddManualFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" sideLabel="Category 1" checked={categoryOption === 'category1'} standalone={false}/>
          <Input onChange={handleBillAddManualFormInputChange} id="category2" name="category" type="radio" value="category2" sideLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleBillAddManualFormInputChange} id="category3" name="category" type="radio" value="category3" sideLabel="Category 3" checked={categoryOption === 'category3'}/>

          <Warning isShown={invalidDollarAmount}>Please enter a valid dollar amount!</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === RESIDENCE_BILL_ADD_DOCUMENT_MODAL_TYPE ? (
        <form onSubmit={handleBillAddDocumentModalFormSubmit}>
          <Input onChange={handleBillAddDocumentFormInputChange} value={residenceBillAddDocumentFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button>
          </div>
        </form>
      ) : (type === RESIDENCE_BILL_PAY_MODAL_TYPE ? (
        <form onSubmit={handleBillPayModalFormSubmit}>
          <Input onChange={handleBillPayFormInputChange} id="alsoTransaction" name="alsoTransaction" type="checkbox" label="Log this as a transaction?" sideLabel="Yes" checked={alsoTransactionChecked}/>
          
          { residenceBillPayFormState.alsoTransaction && (
            <>
              <Select onChange={handleBillPayFormInputChange} value={residenceBillPayFormState.accountID} id="accountID" name="accountID" label="Account Used" options={accountOptions}/>

              <Input onChange={handleBillPayFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" sideLabel="Category 1" checked={transactionCategoryOption === 'category1'} standalone={false}/>
              <Input onChange={handleBillPayFormInputChange} id="category2" name="category" type="radio" value="category2" sideLabel="Category 2" checked={transactionCategoryOption === 'category2'} standalone={false} />
              <Input onChange={handleBillPayFormInputChange} id="category3" name="category" type="radio" value="category3" sideLabel="Category 3" checked={transactionCategoryOption === 'category3'}/>
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

          <Input onChange={handleBillEditFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" sideLabel="Category 1" checked={categoryOption === 'category1'} standalone={false}/>
          <Input onChange={handleBillEditFormInputChange} id="category2" name="category" type="radio" value="category2" sideLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleBillEditFormInputChange} id="category3" name="category" type="radio" value="category3" sideLabel="Category 3" checked={categoryOption === 'category3'}/>

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
