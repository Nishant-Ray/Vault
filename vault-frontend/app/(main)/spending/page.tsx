'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import Dropdown from '@/app/ui/dropdown';
import Button from '@/app/ui/button';
import clsx from 'clsx';
import { fetchMonthlySpending, fetchPercentChange, fetchAccounts, fetchRecentTransactions } from '@/app/lib/data';
import { getLast12Months, getCurrentMonth, getPreviousMonth, getPreviousMonthFromMonth, getLast5Years, getCurrentYear, formatDollarAmount, formatMonth, formatDate } from '@/app/lib/utils';
import { Transaction } from '@/app/lib/definitions';
import SpendingGraph from '@/app/ui/spendingGraph';

export default function Page() {
  const last12Months = getLast12Months();
  const currMonth = getCurrentMonth();
  const [prevSelectedMonth, setPrevSelectedMonth] = useState<number>(getPreviousMonth());
  const [monthlySpending, setMonthlySpending] = useState<string>('$0');
  const [percentChange, setPercentChange] = useState<string>('↓ 0%');
  const [positive, setPositive] = useState<boolean>(true);
  const last5Years = getLast5Years();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear);
  const [accountIDsToNicknames, setAccountIDsToNicknames] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const onMonthChange = async (monthIndex: number) => {
      const month = last12Months[monthIndex];
      const prevMonth = getPreviousMonthFromMonth(month);
      setPrevSelectedMonth(prevMonth);
  
      const fetchedSpending = await fetchMonthlySpending(month);
      if (fetchedSpending) setMonthlySpending(formatDollarAmount(fetchedSpending));
      else setMonthlySpending('$0');
  
      const fetchedPercentChange = await fetchPercentChange(month, prevMonth);
      if (fetchedPercentChange) {
        setPercentChange(fetchedPercentChange);
        setPositive(fetchedPercentChange.charAt(0) === '↓');
      } else {
        setPercentChange('↓ 0%');
        setPositive(true);
      }
    };
  
    const onYearChange = (yearIndex: number) => {
      setSelectedYear(last5Years[yearIndex]);
    };

  useEffect(() => {
    const fetchSpendingData = async () => {
      const fetchedSpending = await fetchMonthlySpending(currMonth);
      if (fetchedSpending) setMonthlySpending(formatDollarAmount(fetchedSpending));

      const fetchedPercentChange = await fetchPercentChange(currMonth, prevSelectedMonth);
      if (fetchedPercentChange) {
        setPercentChange(fetchedPercentChange);
        setPositive(fetchedPercentChange.charAt(0) === '↓');
      }

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) {
        for (let i = 0; i < fetchedAccounts.length; i++) {
          const account = fetchedAccounts[i];
          setAccountIDsToNicknames((prevState) => ({
            ...prevState,
            [account.id]: account.nickname,
          }));
        }
      }

      const fetchedTransactions = await fetchRecentTransactions();
      if (fetchedTransactions) setTransactions(fetchedTransactions);
    };

    fetchSpendingData();
  }, []);

  return (
    <main>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8 w-2/5">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
              <Dropdown list={last12Months.map((month) => formatMonth(month))} onUpdate={onMonthChange}/>
            </div>

            <h2 className={`${dmSans.className} antialiased text-black tracking-tight text-4xl font-semibold my-4`}>{monthlySpending}</h2>

            <div className="flex flex-row items-center gap-2">
              <div className={clsx("rounded-3xl flex items-center justify-center px-2 py-1", { "bg-positive": positive, "bg-negative": !positive })}>
                <p className={clsx("text-md font-semibold", { "text-positive_text": positive, "text-negative_text": !positive })}>{percentChange}</p>
              </div>
              <h4 className="text-md font-normal text-gray-400">Compared to {formatMonth(prevSelectedMonth)}</h4>
            </div>
          </Card>

          <Card>
            <div className="flex flex-row justify-between mb-6">
              <h3 className="text-lg font-medium text-off_black">Yearly Spending</h3>
              <Dropdown list={last5Years.map((year) => String(year))} onUpdate={onYearChange}/>
            </div>

            <SpendingGraph year={selectedYear}/>
          </Card>
        </div>

        <div className="flex flex-col gap-8 w-3/5">
          <Card>
            <h3 className="text-lg font-medium text-off_black">Recent Transactions</h3>
              <div className="my-6 flex flex-col">
                {transactions.length ? (
                  <>
                    <div className="flex flex-row items-center gap-16 mb-2">
                      <h4 className="w-24 text-gray-400 font-normal text-md">Account</h4>
                      <h4 className="w-24 text-gray-400 font-normal text-md">Date</h4>
                      <h4 className="w-16 text-gray-400 font-normal text-md text-right">Amount</h4>
                      <h4 className="w-36 text-gray-400 font-normal text-md">Description</h4>
                    </div>

                    {transactions.map((transaction, i) => {
                      return (
                        <div key={i} className="flex flex-row items-center h-12 gap-16 border-t border-gray-200">
                          <h4 className="w-24 text-off_black font-medium text-md truncate">{accountIDsToNicknames[transaction.account_id]}</h4>
                          <h4 className="w-24 text-off_black font-medium text-md">{formatDate(transaction.date)}</h4>
                          <h4 className="w-16 text-off_black font-bold text-md text-right">{formatDollarAmount(transaction.amount)}</h4>
                          <h4 className="w-36 text-off_black font-medium text-md truncate">{transaction.description}</h4>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p className="text-sm font-normal text-off_gray">No recent transactions!</p>
                )}
              </div>

              <div className="flex flex-row justify-center">
                <Button href="/spending" size="sm">See Transactions</Button>
              </div>
          </Card>
        </div>
      </div>

    </main>
  );
}
