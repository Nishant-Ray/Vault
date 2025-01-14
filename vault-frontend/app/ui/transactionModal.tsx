import React, { useState, useEffect } from 'react';
import { Account, TransactionAddManualModalData, TransactionAddDocumentModalData, SelectOption } from '@/app/lib/definitions';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';

const initialManualModalData: TransactionAddManualModalData = {
  accountID: 0,
  date: '',
  amount: 0,
  category: 'category1',
  description: ''
};

const initialDocumentModalData: TransactionAddDocumentModalData = {
  nickname: ''
};

type TransactionAddModalProps = {
  isManualModal: boolean;
  isOpen: boolean;
  accounts: Account[];
  onManualModalSubmit: (data: TransactionAddManualModalData) => void;
  onDocumentModalSubmit: (data: TransactionAddDocumentModalData) => void;
  onClose: () => void;
}

export default function TransactionModal({ isManualModal, isOpen, accounts, onManualModalSubmit, onDocumentModalSubmit, onClose }: TransactionAddModalProps) {
  const [transactionAddManualFormState, setTransactionAddManualFormState] = useState<TransactionAddManualModalData>(initialManualModalData);
  const [transactionAddDocumentFormState, setTransactionAddDocumentFormState] = useState<TransactionAddDocumentModalData>(initialDocumentModalData);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
  const [categoryOption, setCategoryOption] = useState<string>(initialManualModalData.category);

  const handleClose = () => {
    setTransactionAddManualFormState(initialManualModalData);
    setTransactionAddDocumentFormState(initialDocumentModalData);
    setCategoryOption(initialManualModalData.category);
    onClose();
  }

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

  const handleTransactionAddManualModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (onManualModalSubmit) onManualModalSubmit(transactionAddManualFormState);
    setTransactionAddManualFormState(initialManualModalData);
  };

  const handleTransactionAddDocumentModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (onDocumentModalSubmit) onDocumentModalSubmit(transactionAddDocumentFormState);
    setTransactionAddDocumentFormState(initialDocumentModalData);
  };

  useEffect(() => {
    let newAccountOptions: SelectOption[] = [];
    accounts.forEach(account => {
      newAccountOptions.push({value: account.id, text: account.nickname});
    });
    setAccountOptions(newAccountOptions);
  }, [accounts]);

  return (
    <Modal title={ isManualModal ? "Enter Transaction Information" : "Upload Transaction Document" } isOpen={isOpen} onClose={handleClose}>
      { isManualModal ? (
        <form onSubmit={handleTransactionAddManualModalFormSubmit}>
          <Select onChange={handleTransactionAddManualFormInputChange} value={transactionAddManualFormState.accountID} id="accountID" name="accountID" label="Account Used" options={accountOptions}/>
          <Input onChange={handleTransactionAddManualFormInputChange} value={String(transactionAddManualFormState.date)} id="date" name="date" type="date" label="Date of Transaction"/>
          <Input onChange={handleTransactionAddManualFormInputChange} value={String(Math.round(transactionAddManualFormState.amount * 100) / 100.0)} id="amount" name="amount" type="number" label="Amount ($)" placeholder="Enter transaction amount"/>
          
          <Input onChange={handleTransactionAddManualFormInputChange} id="category1" name="category" type="radio" value="category1" label="Category" radioLabel="Category 1" checked={categoryOption == 'category1'} standalone={false}/>
          <Input onChange={handleTransactionAddManualFormInputChange} id="category2" name="category" type="radio" value="category2" radioLabel="Category 2" checked={categoryOption === 'category2'} standalone={false} />
          <Input onChange={handleTransactionAddManualFormInputChange} id="category3" name="category" type="radio" value="category3" radioLabel="Category 3" checked={categoryOption === 'category3'}/>
          
          <Input onChange={handleTransactionAddManualFormInputChange} value={transactionAddManualFormState.description} id="description" name="description" type="text" label="Description" placeholder="Enter transaction description"/>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit">Enter</Button> 
          </div>
        </form>
      ) : (
        <form onSubmit={handleTransactionAddDocumentModalFormSubmit}>
          <Input onChange={handleTransactionAddDocumentFormInputChange} value={transactionAddDocumentFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
          <div className="flex flex-row justify-center mt-8">
            <Button type="submit">Enter</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
