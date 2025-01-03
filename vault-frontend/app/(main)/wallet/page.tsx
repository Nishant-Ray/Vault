'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import AccountCard from '@/app/ui/accountCard';
import Button from '@/app/ui/button';
import { Account } from '@/app/lib/definitions';
import { fetchName, fetchAccounts } from '@/app/lib/data';

export default function Page() {
  const [name, setName] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      const fetchedName = await fetchName();
      if (fetchedName) setName(fetchedName.toUpperCase());

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);
    };

    fetchWalletData();
  }, []);

  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>Your Accounts</h1>
      <Card>
        <div className="flex flex-col text-off_black gap-8">
          <div className="flex flex-row flex-wrap gap-8 justify-center">
            { accounts.length ? (
              accounts.map((account, i) => {
                return <AccountCard key={i} name={name} nickname={account.nickname} isCredit={account.is_credit_card}/>;
              })
            ) : (
              <p className="text-2xl font-normal text-off_gray">Wallet is empty!</p>
            )}
          </div>

          <div className="w-full flex justify-center">
            <Button href='/'>
              Add Account
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
