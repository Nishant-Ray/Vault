import React, { useState, useEffect } from 'react';
import { Account, Transaction, TransactionAddManualModalData, TransactionAddDocumentModalData, TransactionEditModalData, SelectOption, TRANSACTION_ADD_MANUAL_MODAL_TYPE, TRANSACTION_ADD_DOCUMENT_MODAL_TYPE, TRANSACTION_EDIT_MODAL_TYPE } from '@/app/lib/definitions';
import { validDollarAmount, reformatDate } from '@/app/lib/utils';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import Warning from '@/app/ui/warning';

const initialManualModalData: TransactionAddManualModalData = {
  accountID: '',
  date: '',
  amount: '0',
  category: 'category1',
  description: ''
};

const initialDocumentModalData: TransactionAddDocumentModalData = {
  nickname: ''
};

const initialEditModalData: TransactionEditModalData = {
  accountID: '',
  date: '',
  amount: '0',
  category: 'category1',
  description: ''
}

type TransactionModalProps = {
  type: number;
  isOpen: boolean;
  accounts: Account[];
  transaction: Transaction | null;
  onManualModalSubmit: (data: TransactionAddManualModalData) => void;
  onDocumentModalSubmit: (data: TransactionAddDocumentModalData) => void;
  onEditModalSubmit: (id: number, data: TransactionEditModalData) => void
  onDeleteModalSubmit: (id: number) => void;
  onClose: () => void;
}

export default function TransactionModal({ type, isOpen, accounts, transaction, onManualModalSubmit, onDocumentModalSubmit, onEditModalSubmit, onDeleteModalSubmit, onClose }: TransactionModalProps) {
  const [transactionAddManualFormState, setTransactionAddManualFormState] = useState<TransactionAddManualModalData>(initialManualModalData);
  const [transactionAddDocumentFormState, setTransactionAddDocumentFormState] = useState<TransactionAddDocumentModalData>(initialDocumentModalData);
  const [transactionEditFormState, setTransactionEditFormState] = useState<TransactionEditModalData>(initialEditModalData);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
  const [categoryOption, setCategoryOption] = useState<string>(initialManualModalData.category);
  const [invalidDollarAmount, setInvalidDollarAmount] = useState<boolean>(false);

  const handleClose = () => {
    setTransactionAddManualFormState(initialManualModalData);
    setTransactionAddDocumentFormState(initialDocumentModalData);
    setTransactionEditFormState(initialEditModalData);
    setCategoryOption(initialManualModalData.category);
    setInvalidDollarAmount(false);
    onClose();
  };

  const handleTransactionAddManualFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setTransactionAddManualFormState((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'accountID' ? Number(value) : value
    }));

    if (name === 'category') setCategoryOption(value);
  };

  const handleTransactionAddDocumentFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setTransactionAddDocumentFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleTransactionEditFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setTransactionEditFormState((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'accountID' ? Number(value) : value
    }));

    if (name === 'category') setCategoryOption(value);
  };

  const handleTransactionAddManualModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (validDollarAmount(Number(transactionAddManualFormState.amount))) {
      onManualModalSubmit(transactionAddManualFormState);
      setTransactionAddManualFormState(initialManualModalData);
      setInvalidDollarAmount(false);
    } else {
      setInvalidDollarAmount(true);
    }
  };

  const handleTransactionAddDocumentModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onDocumentModalSubmit(transactionAddDocumentFormState);
    setTransactionAddDocumentFormState(initialDocumentModalData);
  };

  const handleTransactionEditModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (transaction) {
      if (validDollarAmount(Number(transactionEditFormState.amount))) {
        onEditModalSubmit(transaction.id, transactionEditFormState);
        setTransactionEditFormState(initialManualModalData);
        setInvalidDollarAmount(false);
      } else {
        setInvalidDollarAmount(true);
      }
    }
  };

  const handleTransactionDeleteModal = (): void => {
    if (transaction) onDeleteModalSubmit(transaction.id);
  };

  useEffect(() => {
    let newAccountOptions: SelectOption[] = [];
    accounts.forEach(account => {
      newAccountOptions.push({value: account.id, text: account.nickname});
    });
    setAccountOptions(newAccountOptions);
  }, [accounts]);

  useEffect(() => {
    if (transaction) {
      setTransactionEditFormState({
        accountID: String(transaction.account_id),
        date: reformatDate(transaction.date),
        amount: String(transaction.amount),
        category: transaction.category,
        description: transaction.description
      });
    }
  }, [transaction]);

  return (
    <Modal
      title={ type === TRANSACTION_ADD_MANUAL_MODAL_TYPE ? "Enter Transaction Information" :
              type === TRANSACTION_ADD_DOCUMENT_MODAL_TYPE ? "Upload Transaction Document" :
              type === TRANSACTION_EDIT_MODAL_TYPE ? "Edit Transaction Information" :
              "Are you sure you want to delete this transaction?" }
      isOpen={isOpen}
      onClose={handleClose}
    >
      
      { type === TRANSACTION_ADD_MANUAL_MODAL_TYPE ? (
        <form onSubmit={handleTransactionAddManualModalFormSubmit}>
          <Select onChange={handleTransactionAddManualFormInputChange} value={transactionAddManualFormState.accountID} id="accountID" name="accountID" label="Account Used" options={accountOptions}/>
          <Input onChange={handleTransactionAddManualFormInputChange} value={String(transactionAddManualFormState.date)} max={new Date().toJSON().slice(0, 10)} id="date" name="date" type="date" label="Date of Transaction"/>
          <Input onChange={handleTransactionAddManualFormInputChange} value={String(transactionAddManualFormState.amount)} id="amount" name="amount" type="number" label="Amount ($)" placeholder="Enter transaction amount"/>
          
          <Input onChange={handleTransactionAddManualFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" radioLabel="Category 1" checked={categoryOption == 'category1'} standalone={false}/>
          <Input onChange={handleTransactionAddManualFormInputChange} id="category2" name="category" type="radio" value="category2" radioLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleTransactionAddManualFormInputChange} id="category3" name="category" type="radio" value="category3" radioLabel="Category 3" checked={categoryOption === 'category3'}/>
          
          <Input onChange={handleTransactionAddManualFormInputChange} value={transactionAddManualFormState.description} id="description" name="description" type="text" label="Description" placeholder="Enter transaction description"/>
          
          <Warning isShown={invalidDollarAmount}>Please enter a valid dollar amount!</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === TRANSACTION_ADD_DOCUMENT_MODAL_TYPE ? (
        <form onSubmit={handleTransactionAddDocumentModalFormSubmit}>
          <Input onChange={handleTransactionAddDocumentFormInputChange} value={transactionAddDocumentFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button>
          </div>
        </form>
      ) : (type === TRANSACTION_EDIT_MODAL_TYPE ? (
        <form onSubmit={handleTransactionEditModalFormSubmit}>
          <Select onChange={handleTransactionEditFormInputChange} value={transactionEditFormState.accountID} id="accountID" name="accountID" label="Account Used" options={accountOptions}/>
          <Input onChange={handleTransactionEditFormInputChange} value={transactionEditFormState.date} max={new Date().toJSON().slice(0, 10)} id="date" name="date" type="date" label="Date of Transaction"/>
          <Input onChange={handleTransactionEditFormInputChange} value={String(transactionEditFormState.amount)} id="amount" name="amount" type="number" label="Amount ($)" placeholder="Enter transaction amount"/>
          
          <Input onChange={handleTransactionEditFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" radioLabel="Category 1" checked={categoryOption == 'category1'} standalone={false}/>
          <Input onChange={handleTransactionEditFormInputChange} id="category2" name="category" type="radio" value="category2" radioLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleTransactionEditFormInputChange} id="category3" name="category" type="radio" value="category3" radioLabel="Category 3" checked={categoryOption === 'category3'}/>
          
          <Input onChange={handleTransactionEditFormInputChange} value={transactionEditFormState.description} id="description" name="description" type="text" label="Description" placeholder="Enter transaction description"/>
          
          <Warning isShown={invalidDollarAmount}>Please enter a valid dollar amount!</Warning>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (
        <div className="flex flex-row justify-center gap-8">
          <Button onClick={handleTransactionDeleteModal} size="md">Delete Transaction</Button>
          <Button onClick={onClose} buttonType="neutral" size="md">Cancel</Button>
        </div>
      )))}
    </Modal>
  )
}
