'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import AccountCard from '@/app/ui/accountCard';
import Button from '@/app/ui/button';
import { Account } from '@/app/lib/definitions';
import { fetchAccounts } from '@/app/lib/data';
import { CreditCardIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid';

export default function Page() {
  const [accounts, setAccounts] = useState<Array<Account>>([]);

  useEffect(() => {
    const fetchAccountsData = async () => {
      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) setAccounts(fetchedAccounts);
    };

    fetchAccountsData();
  }, []);

  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>Your Accounts</h1>
      <Card>
        <div className="flex flex-col text-off_black gap-4">
          { accounts.length ? (accounts.map((account, i) => {

            return (
              <AccountCard key={i} className="px-4 py-4 border rounded-lg">
                { account.is_credit_card ? <CreditCardIcon className="w-8"/> : <BuildingLibraryIcon className="w-8"/> }
                <h4 className="w-48 truncate font-medium text-lg">{account.nickname}</h4>
              </AccountCard>
            );
            
          })) : (
            <p className="text-sm font-normal text-off_gray">Wallet is empty!</p>
          )}
        </div>
      </Card>
    </main>
  );
}
