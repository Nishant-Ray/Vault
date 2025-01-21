import React, { useState, useEffect } from 'react';
import { Residence, ResidenceCreateModalData, ResidenceEditModalData, RESIDENCE_CREATE_MODAL_TYPE, RESIDENCE_EDIT_MODAL_TYPE, RESIDENCE_LEAVE_MODAL_TYPE, RESIDENCE_DELETE_MODAL_TYPE } from '@/app/lib/definitions';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Button from '@/app/ui/button';

const initialCreateModalData: ResidenceCreateModalData = {
  name: '',
  monthlyPayment: 'rent'
};

const initialEditModalData: ResidenceEditModalData = {
  name: '',
  monthlyPayment: 'rent'
};

type ResidenceModalProps = {
  type: number;
  isOpen: boolean;
  residence: Residence | null;
  onCreateModalSubmit: (data: ResidenceCreateModalData) => void;
  onEditModalSubmit: (data: ResidenceEditModalData) => void;
  onLeaveModalSubmit: () => void;
  onDeleteModalSubmit: () => void;
  onClose: () => void;
}

export default function ResidenceModal({ type, isOpen, residence, onCreateModalSubmit, onEditModalSubmit, onLeaveModalSubmit, onDeleteModalSubmit, onClose }: ResidenceModalProps) {
  const [residenceCreateFormState, setResidenceCreateFormState] = useState<ResidenceCreateModalData>(initialCreateModalData);
  const [residenceEditFormState, setResidenceEditFormState] = useState<ResidenceEditModalData>(initialEditModalData);
  const [monthlyPaymentOption, setMonthlyPaymentOption] = useState<string>(initialCreateModalData.monthlyPayment);

  const handleClose = () => {
    setResidenceCreateFormState(initialCreateModalData);
    if (type === RESIDENCE_CREATE_MODAL_TYPE) setMonthlyPaymentOption(initialCreateModalData.monthlyPayment);
    onClose();
  };

  const handleResidenceCreateFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceCreateFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'monthlyPayment') setMonthlyPaymentOption(value);
  };

  const handleResidenceEditFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setResidenceEditFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'monthlyPayment') setMonthlyPaymentOption(value);
  };

  const handleResidenceCreateModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onCreateModalSubmit(residenceCreateFormState);
    setResidenceCreateFormState(initialCreateModalData);
  };

  const handleResidenceEditModalFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onEditModalSubmit(residenceEditFormState);
    setResidenceEditFormState(initialEditModalData);
  };

  const handleResidenceLeaveModal = (): void => {
    onLeaveModalSubmit();
  };

  const handleResidenceDeleteModal = (): void => {
    onDeleteModalSubmit();
  };

  useEffect(() => {
    if (residence) {
      const monthlyPayment = residence.monthly_payment;

      setResidenceEditFormState({
        name: residence.name,
        monthlyPayment: monthlyPayment
      });

      setMonthlyPaymentOption(monthlyPayment);
    }
  }, [residence]);

  return (
    <Modal
      title={ type === RESIDENCE_CREATE_MODAL_TYPE ? "Enter Residence Information" :
              type === RESIDENCE_EDIT_MODAL_TYPE ? "Edit Residence Information" :
              type === RESIDENCE_LEAVE_MODAL_TYPE ? "Are you sure you want to leave this residence?" :
              "Are you sure you want to delete this residence?" }
      isOpen={isOpen}
      onClose={handleClose}
    >
      
      { type === RESIDENCE_CREATE_MODAL_TYPE ? (
        <form onSubmit={handleResidenceCreateModalFormSubmit}>
          <Input onChange={handleResidenceCreateFormInputChange} value={residenceCreateFormState.name} id="name" name="name" type="text" label="Name" placeholder="Enter residence name"/>

          <Input onChange={handleResidenceEditFormInputChange} id="rent" name="monthlyPayment" type="radio" value="rent" label="Monthly Payment Type" sideLabel="Rent" checked={monthlyPaymentOption === 'rent'} standalone={false}/>
          <Input onChange={handleResidenceEditFormInputChange} id="mortgage" name="monthlyPayment" type="radio" value="mortgage" sideLabel="Mortgage" checked={monthlyPaymentOption === 'mortgage'} standalone={false} />
          <Input onChange={handleResidenceEditFormInputChange} id="none" name="monthlyPayment" type="radio" value="none" sideLabel="None" checked={monthlyPaymentOption === 'none'}/>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === RESIDENCE_EDIT_MODAL_TYPE ? (
        <form onSubmit={handleResidenceEditModalFormSubmit}>
          <Input onChange={handleResidenceEditFormInputChange} value={residenceEditFormState.name} id="name" name="name" type="text" label="Name" placeholder="Enter residence name"/>

          <Input onChange={handleResidenceEditFormInputChange} id="rent" name="monthlyPayment" type="radio" value="rent" label="Monthly Payment Type" sideLabel="Rent" checked={monthlyPaymentOption === 'rent'} standalone={false}/>
          <Input onChange={handleResidenceEditFormInputChange} id="mortgage" name="monthlyPayment" type="radio" value="mortgage" sideLabel="Mortgage" checked={monthlyPaymentOption === 'mortgage'} standalone={false} />
          <Input onChange={handleResidenceEditFormInputChange} id="none" name="monthlyPayment" type="radio" value="none" sideLabel="None" checked={monthlyPaymentOption === 'none'}/>

          <div className="flex flex-row justify-center mt-8">
            <Button type="submit" size="md">Enter</Button> 
          </div>
        </form>
      ) : (type === RESIDENCE_LEAVE_MODAL_TYPE ? (
        <div className="flex flex-row justify-center gap-8">
          <Button onClick={handleResidenceLeaveModal} size="md">Leave Residence</Button>
          <Button onClick={onClose} buttonType="neutral" size="md">Cancel</Button>
        </div>
      ) : (
        <div className="flex flex-row justify-center gap-8">
          <Button onClick={handleResidenceDeleteModal} size="md">Delete Residence</Button>
          <Button onClick={onClose} buttonType="neutral" size="md">Cancel</Button>
        </div>
      )))}
    </Modal>
  )
}
