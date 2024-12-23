'use client';

import { useEffect, useState } from 'react';
import Card from '@/app/ui/card';
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
      <h1>Wallet page.</h1>
      <Card>
        <h3 className="text-lg font-medium text-off_black">Wallet</h3>

        <div className="flex flex-col text-off_black pt-4 pb-6 gap-3">
          {accounts.length ? (accounts.map((account, i) => {
            if (account.is_credit_card) {
              return (
                <div key={i} className="flex flex-row items-center gap-4 px-2 py-1 bg-gray-100 rounded-lg shadow-sm">
                  <CreditCardIcon className="w-8"/>
                  <h4 className="w-48 truncate text-off_black font-medium text-lg">{account.nickname}</h4>
                </div>
              );
            } else {
              return (
                <div key={i} className="flex flex-row items-center gap-4 px-2 py-1 bg-gray-100 rounded-lg shadow-sm">
                  <BuildingLibraryIcon className="w-8"/>
                  <h4 className="w-48 truncate text-off_black font-medium text-lg">{account.nickname}</h4>
                </div>
              );
            }
            
          })) : (
            <p className="text-sm font-normal text-off_gray">Wallet is empty!</p>
          )}
        </div>

        <div className="flex flex-row justify-center">
          <Button href="/wallet" size="sm">Manage Wallet</Button>
        </div>
      </Card>
    </main>
  );
}
