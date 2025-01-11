import React, { useState } from 'react';
import { TransactionAddManualModalData, TransactionAddDocumentModalData } from '@/app/lib/definitions';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Button from '@/app/ui/button';

const initialManualModalData: TransactionAddManualModalData = {
  nickname: ''
};

const initialDocumentModalData: TransactionAddDocumentModalData = {
  nickname: ''
};

type TransactionAddModalProps = {
  isManualModal: boolean;
  isOpen: boolean;
  onManualModalSubmit: (data: TransactionAddManualModalData) => void;
  onDocumentModalSubmit: (data: TransactionAddDocumentModalData) => void;
  onClose: () => void;
}

export default function TransactionModal({ isManualModal, isOpen, onManualModalSubmit, onDocumentModalSubmit, onClose }: TransactionAddModalProps) {
  const [transactionAddManualFormState, setTransactionAddManualFormState] = useState<TransactionAddManualModalData>(initialManualModalData);
  const [transactionAddDocumentFormState, setTransactionAddDocumentFormState] = useState<TransactionAddDocumentModalData>(initialDocumentModalData);

  const handleClose = () => {
    setTransactionAddManualFormState(initialManualModalData);
    setTransactionAddDocumentFormState(initialDocumentModalData);
    onClose();
  }

  const handleTransactionAddManualFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setTransactionAddManualFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
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

  return (
    <Modal title={ isManualModal ? "Enter Transaction Information" : "Upload Transaction Document" } isOpen={isOpen} onClose={handleClose}>
      { isManualModal ? (
        <form onSubmit={handleTransactionAddManualModalFormSubmit}>
          <Input onChange={handleTransactionAddManualFormInputChange} value={transactionAddManualFormState.nickname} id="nickname" name="nickname" type="text" label="New Nickname" placeholder="Enter new account nickname"/>
          
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
