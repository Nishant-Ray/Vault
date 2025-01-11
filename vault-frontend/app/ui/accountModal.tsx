import React, { useState } from 'react';
import { ACCOUNT_NICKNAME_MODAL_TYPE, ACCOUNT_REMOVE_MODAL_TYPE, AccountNicknameModalData, AccountAddModalData } from '@/app/lib/definitions';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Button from '@/app/ui/button';

const initialNicknameModalData: AccountNicknameModalData = {
  nickname: ''
};

const initialAddModalData: AccountAddModalData = {
  nickname: '',
  account_type: 'credit_card'
};

type AccountModalBaseProps = {
  modalType: number;
  isOpen: boolean;
  onClose: () => void;
}

type AccountOptionsModalProps = AccountModalBaseProps & {
  onNicknameSubmit: (data: AccountNicknameModalData) => void;
  onRemove: () => void;
  onAddSubmit?: never;
}

type AccountAddModalProps = AccountModalBaseProps & {
  onNicknameSubmit?: never;
  onRemove?: never;
  onAddSubmit: (data: AccountAddModalData) => void;
}

type AccountModalProps = AccountOptionsModalProps | AccountAddModalProps;

export default function AccountModal({ modalType, isOpen, onNicknameSubmit, onRemove, onAddSubmit, onClose }: AccountModalProps) {
  const [nicknameFormState, setNicknameFormState] = useState<AccountNicknameModalData>(initialNicknameModalData);
  const [addFormState, setAddFormState] = useState<AccountAddModalData>(initialAddModalData);
  const [addAccountType, setAddAccountType] = useState<string>(addFormState.account_type);

  const handleClose = () => {
    setNicknameFormState(initialNicknameModalData);
    setAddFormState(initialAddModalData);
    setAddAccountType(addFormState.account_type);
    onClose();
  }

  const handleNicknameFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setNicknameFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleAddFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setAddFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    if (name === 'account_type') {
      setAddAccountType(value);
    }
  };

  const handleNicknameModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (onNicknameSubmit) onNicknameSubmit(nicknameFormState);
    setNicknameFormState(initialNicknameModalData);
  };

  const handleAddModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (onAddSubmit) onAddSubmit(addFormState);
    setAddFormState(initialAddModalData);
  };

  return (
    <Modal title={ modalType === ACCOUNT_NICKNAME_MODAL_TYPE ? "Change account nickname" : (modalType === ACCOUNT_REMOVE_MODAL_TYPE ? "Are you sure you want to delete this account?" : "Add an account") } isOpen={isOpen} onClose={handleClose}>
      { modalType === ACCOUNT_NICKNAME_MODAL_TYPE ? (
        <form onSubmit={handleNicknameModalFormSubmit}>
          <Input onChange={handleNicknameFormInputChange} value={nicknameFormState.nickname} id="nickname" name="nickname" type="text" label="New Nickname" placeholder="Enter new account nickname"/>
          
          <div className="flex flex-row justify-center mt-8">
            <Button type="submit">Enter</Button> 
          </div>
        </form>
      ) : (modalType === ACCOUNT_REMOVE_MODAL_TYPE && onRemove ? (
        <div className="flex flex-row justify-center gap-8">
          <Button onClick={onRemove}>Delete Card</Button>
          <Button onClick={onClose} buttonType="neutral">Cancel</Button>
        </div>
      ) : (
        <form onSubmit={handleAddModalFormSubmit}>
          <Input onChange={handleAddFormInputChange} value={addFormState.nickname} id="nickname" name="nickname" type="text" label="Nickame" placeholder="Enter account nickname"/>
          
          <Input onChange={handleAddFormInputChange} id="credit_card" name="account_type" type="radio" value="credit_card" label="Account Type" radioLabel="Credit card" standalone={false} checked={addAccountType === 'credit_card'}/>
          <Input onChange={handleAddFormInputChange} id="bank_account" name="account_type" type="radio" value="bank_account" radioLabel="Bank account" checked={addAccountType === 'bank_account'}/>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit">Enter</Button> 
          </div>
        </form>
      ))}
    </Modal>
  )
}
