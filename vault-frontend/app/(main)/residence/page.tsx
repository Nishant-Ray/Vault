'use client';

import { useEffect, useState } from 'react';
import Loading from '@/app/ui/loading';
import Button from '@/app/ui/button';
import IconButton from '@/app/ui/iconButton';
import Card from '@/app/ui/card';
import Select from '@/app/ui/select';
import ResidenceModal from '@/app/ui/residenceModal';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { dmSans } from '@/app/ui/fonts';
import clsx from 'clsx';
import { fetchResidenceInfo, createResidence, editResidence, leaveResidence, deleteResidence, fetchRecentResidenceMessages } from '@/app/lib/data';
import { ResidenceData, RESIDENCE_CREATE_MODAL_TYPE, RESIDENCE_EDIT_MODAL_TYPE, RESIDENCE_LEAVE_MODAL_TYPE, RESIDENCE_DELETE_MODAL_TYPE, ResidenceCreateModalData, ResidenceEditModalData, SelectOption, ResidenceMessage } from '@/app/lib/definitions';
import { formatDollarAmount, getLast12MonthsAsOptions } from '@/app/lib/utils';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [residenceData, setResidenceData] = useState<ResidenceData | null>(null);
  const [modalType, setModalType] = useState<number>(RESIDENCE_CREATE_MODAL_TYPE);
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const [monthlyPayment, setMonthlyPayment] = useState({ total: 4300, dueDate: 20250131, paid: false });
  const last12Months: SelectOption[] = getLast12MonthsAsOptions();
  const monthlyPaymentVsUtilities: SelectOption[] = [{ value: 0, text: 'Last 3 months'}, { value: 0, text: 'Last 6 months'}, { value: 0, text: 'Last 12 months'}];
  const [residenceMessages, setResidenceMessages] = useState<ResidenceMessage[]>([]);

  const handleCreateResidenceClick = () => {
    setModalType(RESIDENCE_CREATE_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const handleEditResidenceClick = () => {
    setModalType(RESIDENCE_EDIT_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const handleLeaveResidenceClick = () => {
    setModalType(RESIDENCE_LEAVE_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const handleDeleteResidenceClick = () => {
    setModalType(RESIDENCE_LEAVE_MODAL_TYPE);
    setResidenceModalOpen(true);
  };

  const hopefulResidenceCreate = (data: ResidenceCreateModalData) => {
    setResidenceData({
      residence: {
        name: data.name,
        monthly_payment: data.monthlyPayment
      },
      users: []
    });
  };

  const handleCreateModalSubmit = async (data: ResidenceCreateModalData) => {
    await createResidence(data);
    hopefulResidenceCreate(data);

    setResidenceModalOpen(false);
  };

  const hopefulResidenceEdit = (data: ResidenceEditModalData) => {
    setResidenceData({
      residence: {
        name: data.name,
        monthly_payment: data.monthlyPayment
      },
      users: residenceData!.users || []
    });
  };

  const handleEditModalSubmit = async (data: ResidenceEditModalData) => {
    await editResidence(data);
    hopefulResidenceEdit(data);

    setResidenceModalOpen(false);
  };

  const handleLeaveModalSubmit = async () => {
    await leaveResidence();
    setResidenceData(null);

    setResidenceModalOpen(false);
  };

  const handleDeleteModalSubmit = async () => {
    await deleteResidence();
    setResidenceData(null);

    setResidenceModalOpen(false);
  };

  const handleResidenceModalClose = () => {
    setResidenceModalOpen(false);
  };

  useEffect(() => {
    const fetchResidenceData = async () => {
      setLoading(true);

      const fetchedResidenceInfo = await fetchResidenceInfo();
      if (fetchedResidenceInfo) setResidenceData(fetchedResidenceInfo);

      const fetchedResidenceMessages = await fetchRecentResidenceMessages();
      if (fetchedResidenceMessages) setResidenceMessages(fetchedResidenceMessages);
      
      setLoading(false);
    };

    fetchResidenceData();
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <ResidenceModal type={modalType} isOpen={residenceModalOpen} residence={residenceData?.residence || null} onCreateModalSubmit={handleCreateModalSubmit} onEditModalSubmit={handleEditModalSubmit} onLeaveModalSubmit={handleLeaveModalSubmit} onDeleteModalSubmit={handleDeleteModalSubmit} onClose={handleResidenceModalClose}/>

      { !residenceData ? (
        <div className="absolute top-20 left-60 right-0 bottom-0 flex flex-col justify-center items-center gap-2 text-center">
          <h3 className={`${dmSans.className} antialiased tracking-tight text-off_black font-semibold text-5xl`}>You're not part of a residence!</h3>
          <p className="mb-8 text-off_gray text-md leading-tight">Create a residence or accept an invite to join an existing residence.</p>
          <Button onClick={handleCreateResidenceClick}>Create a Residence</Button>
        </div>
      ) : (
        <div>
          <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>{residenceData.residence.name}</h1>

          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-8 w-2/5">
              <Card>
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-medium text-off_black">Monthly { residenceData.residence.monthly_payment === 'rent' ? 'Rent' : 'Mortgage' }</h3>
                  <Select options={last12Months} onSelect={() => {}}/>
                </div>
    
                <h2 className={`${dmSans.className} antialiased text-black tracking-tight text-4xl font-semibold my-4`}>{formatDollarAmount(monthlyPayment.total)}</h2>

                <div className={clsx("max-w-fit rounded-full px-3 py-1", { "bg-positive": monthlyPayment.paid, "bg-negative": !monthlyPayment.paid })}>
                  <p className={clsx("text-md font-medium", { "text-positive_text": monthlyPayment.paid, "text-negative_text": !monthlyPayment.paid })}>{monthlyPayment.paid ? 'Paid' : 'Not paid'}</p>
                </div>

                <p>John paid you, Bob paid John</p>
              </Card>

              <Card>
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-medium text-off_black">{ residenceData.residence.monthly_payment === 'rent' ? 'Rent' : 'Mortgage' } vs. Utilities</h3>
                  <Select options={monthlyPaymentVsUtilities} onSelect={() => {}}/>
                </div>

                <p>Rent vs utilities graph</p>
              </Card>

              <Card>
              <h3 className="text-lg font-medium text-off_black">Manage Residence</h3>
                <div className="flex flex-col mt-4 gap-2">
                  <Button onClick={handleEditResidenceClick} size="md">Edit Residence</Button>
                  <Button onClick={handleLeaveResidenceClick} size="md">Leave Residence</Button>
                  <Button onClick={handleDeleteResidenceClick} size="md">Delete Residence</Button>
                </div>
              </Card>
              
            </div>

            <div className="flex flex-col gap-8 w-3/5">
              <Card>
                <h3 className="text-lg font-medium text-off_black">Residence Messages</h3>
                <div className="mt-2 flex flex-col bg-off_white p-4 rounded-xl">
                  <>
                    {residenceMessages.length ? (
                      <div className="flex flex-col gap-4 pb-4 max-h-72">
                        {residenceMessages.map((message, i) => {
                          return (
                            <div key={i}>
                              <p className="ml-3 mb-1 text-xs font-normal text-off_gray">User {message.user_id}</p>
                              <h6 className="bg-white max-w-fit rounded-full px-3 py-1 text-md font-normal text-off_black">{message.content}</h6>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm font-normal text-off_gray">No recent messages</p>
                    )}
                  </>
                  <form className="flex flex-row items-center gap-2 h-8">
                    <input className="rounded-full bg-white border border-gray-200 w-full px-3 py-1" type="text" placeholder="Enter message"/>
                    <IconButton className="h-8" icon={PaperAirplaneIcon} onClick={() => {}}></IconButton>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) }
    </main>
  )
}
