'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import AccountModal from '@/app/ui/accountModal';
import AccountCard from '@/app/ui/accountCard';
import Button from '@/app/ui/button';
import { Account, ACCOUNT_ADD_MODAL_TYPE, AccountAddModalData } from '@/app/lib/definitions';
import { fetchName, fetchAccounts, addAccount } from '@/app/lib/data';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);

  const handleRemoveAccount = (id: number) => {
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
  }

  const handleAddAccount = () => {
    setIsAddAccountModalOpen(true);
  };

  const handleAccountAddModalClose = () => {
    setIsAddAccountModalOpen(false);
  };

  const handleAccountAddFormSubmit = async (data: AccountAddModalData) => {
    const newAccount = await addAccount(data);
    if (newAccount) setAccounts([newAccount, ...accounts]);
    setIsAddAccountModalOpen(false);
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);

      const fetchedName = await fetchName();
      if (fetchedName) setName(fetchedName.toUpperCase());

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);
      
      setLoading(false);
    };

    fetchWalletData();
  }, []);
  
  if (loading) return <Loading/>;
  
  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>My Accounts</h1>
      <Card>
        <AccountModal modalType={ACCOUNT_ADD_MODAL_TYPE} isOpen={isAddAccountModalOpen} existingNickname={null} onAddSubmit={handleAccountAddFormSubmit} onClose={handleAccountAddModalClose}></AccountModal>

        <div className="flex flex-col text-off_black gap-8">
          <div className="flex flex-row flex-wrap gap-8 justify-center">
            { accounts.length ? (
              accounts.map((account) => {
                return <AccountCard key={account.id} name={name} id={account.id} nickname={account.nickname} isCredit={account.is_credit_card} onRemove={handleRemoveAccount}/>;
              })
            ) : (
              <p className="text-2xl font-normal text-off_gray">Wallet is empty!</p>
            )}
          </div>

          <div className="w-full flex justify-center">
            <Button onClick={handleAddAccount}>
              Add Account
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
