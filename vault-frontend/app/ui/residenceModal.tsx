import React, { useState, useEffect } from 'react';
import { User, ResidenceData, ResidenceCreateModalData, ResidenceEditModalData, RESIDENCE_CREATE_MODAL_TYPE, RESIDENCE_EDIT_MODAL_TYPE, RESIDENCE_LEAVE_MODAL_TYPE, RESIDENCE_DELETE_MODAL_TYPE, ResidenceMessage } from '@/app/lib/definitions';
import Modal from '@/app/ui/modal';
import Input from '@/app/ui/input';
import Warning from '@/app/ui/warning';
import Button from '@/app/ui/button';
import IconButton from '@/app/ui/iconButton';
import { UserCircleIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import { addResident, removeResident } from '@/app/lib/data';

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
  residenceData: ResidenceData | null;
  currentUserId: number;
  onCreateModalSubmit: (data: ResidenceCreateModalData) => void;
  onEditModalSubmit: (data: ResidenceEditModalData) => void;
  onLeaveModalSubmit: () => void;
  onDeleteModalSubmit: () => void;
  onClose: () => void;
  onResidentAdd: (resident: User, newMessage: ResidenceMessage) => void;
  onResidentRemove: (id: number, newMessage: ResidenceMessage) => void;
}

export default function ResidenceModal({ type, isOpen, residenceData, currentUserId, onCreateModalSubmit, onEditModalSubmit, onLeaveModalSubmit, onDeleteModalSubmit, onClose, onResidentAdd, onResidentRemove }: ResidenceModalProps) {
  const [residenceCreateFormState, setResidenceCreateFormState] = useState<ResidenceCreateModalData>(initialCreateModalData);
  const [residenceEditFormState, setResidenceEditFormState] = useState<ResidenceEditModalData>(initialEditModalData);
  const [monthlyPaymentOption, setMonthlyPaymentOption] = useState<string>(initialCreateModalData.monthlyPayment);
  const [residents, setResidents] = useState<User[]>([]);
  const [newResidentEmail, setNewResidentEmail] = useState<string>('');
  const [newResidentWarning, setNewResidentWarning] = useState<boolean>(false);

  const handleClose = () => {
    setResidenceCreateFormState(initialCreateModalData);
    if (type === RESIDENCE_CREATE_MODAL_TYPE) setMonthlyPaymentOption(initialCreateModalData.monthlyPayment);
    setNewResidentEmail('');
    setNewResidentWarning(false);
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

  const handleAddResidentInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewResidentEmail(event.currentTarget.value);
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
    setNewResidentEmail('');
    setNewResidentWarning(false);
  };

  const handleRemoveResident = async (id: number) => {
    const newMessage = await removeResident(id);
    if (newMessage) {
      setResidents(residents.filter((resident) => resident.id !== id));
      onResidentRemove(id, newMessage);
    }
  };

  const handleAddResident = async () => {
    setNewResidentWarning(false);
    const data = await addResident(newResidentEmail);
    if (data) {
      setResidents([...residents, data.resident]);
      onResidentAdd(data.resident, data.new_message);
    }
    else setNewResidentWarning(true);
  };

  const handleResidenceLeaveModal = (): void => {
    onLeaveModalSubmit();
  };

  const handleResidenceDeleteModal = (): void => {
    onDeleteModalSubmit();
  };

  useEffect(() => {
    if (residenceData) {
      const monthlyPayment = residenceData.residence.monthly_payment;

      setResidenceEditFormState({
        name: residenceData.residence.name,
        monthlyPayment: monthlyPayment
      });

      setMonthlyPaymentOption(monthlyPayment);
      setResidents(residenceData.users);
    }
  }, [residenceData]);

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

          <div className="mb-2">
            <p className="block mb-2 text-lg font-medium text-off_black pl-2">Residents</p>
            <div className="bg-gray-100 rounded-md w-full flex flex-row justify-center items-center gap-10 px-4 py-2">
              <p className="w-44 text-sm font-normal text-off_black">Name</p>
              <p className="w-52 text-sm font-normal text-off_black">Email</p>
              <div className="w-7"></div>
            </div>
            <div className="flex flex-col gap-1">
              { residents.map((user) => {
                return (
                  <div key={user.id} className="w-full flex flex-row justify-center items-center gap-10 h-12">
                    <div className="w-44 flex flex-row items-center gap-1">
                      <UserCircleIcon className="w-7 h-7 text-gray-300"/>
                      <p className="text-md text-off_black font-normal truncate">{user.name}<span className="text-xs text-off_gray">{user.id === currentUserId ? ' (YOU)' : ''}</span></p>
                    </div>

                    <p className="w-52 text-md text-off_black font-normal truncate">{user.email}</p>

                    { user.id !== currentUserId ? <IconButton icon={XMarkIcon} onClick={() => handleRemoveResident(user.id)} blank={false}/> : <div className="w-8 h-8"/> }
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="block mb-2 text-lg font-medium text-off_black pl-2">Add Resident</p>
            <div className="w-full flex flex-row justify-start items-center gap-2">
              <input className="w-full bg-gray-100 rounded-md text-sm font-normal text-off_black px-4 h-8 focus:outline-none" placeholder="Enter resident email" onChange={handleAddResidentInputChange} value={newResidentEmail}/>
              <IconButton icon={PlusIcon} onClick={handleAddResident} blank={false}/>
            </div>

            <Warning isShown={newResidentWarning}>Unable to add resident!</Warning>
          </div>

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
