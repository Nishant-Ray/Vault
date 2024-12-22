'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import clsx from 'clsx';
import { fetchName, fetchMonthlySpending, fetchPercentChange, fetchYearlySpending, fetchRecentTransactions } from '@/app/lib/data';
import { getCurrentMonth, getPreviousMonth, getCurrentYear, formatDollarAmount, formatMonth, formatDate, formatMonthName } from '@/app/lib/utils';
import { Transaction, YearlySpending } from '@/app/lib/definitions';

export default function Page() {
  const [name, setName] = useState<string>('');
  const currMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth();
  const [monthlySpending, setMonthlySpending] = useState<string>('');
  const [percentChange, setPercentChange] = useState<string>('');
  const [positive, setPositive] = useState<boolean>(true);
  const currYear = getCurrentYear();
  const [yearlySpending, setYearlySpending] = useState<Array<YearlySpending>>([]);
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const fetchedName = await fetchName();
      if (fetchedName) setName(fetchedName);

      const fetchedSpending = await fetchMonthlySpending(currMonth);
      if (fetchedSpending) setMonthlySpending(formatDollarAmount(fetchedSpending));

      const fetchedPercentChange = await fetchPercentChange(currMonth, prevMonth);
      if (fetchedPercentChange) {
        setPercentChange(fetchedPercentChange);
        setPositive(fetchedPercentChange.charAt(0) === '↓');
      }

      const fetchedYearlySpending = await fetchYearlySpending(currYear);
      if (fetchedYearlySpending) setYearlySpending(fetchedYearlySpending);

      const fetchedTransactions = await fetchRecentTransactions();
      if (fetchedTransactions) setTransactions(fetchedTransactions);
    };

    fetchDashboardData();
  }, []);

  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>Welcome, {name}!</h1>
      
      <div className="flex flex-row flex-wrap items-start gap-8">
        <Card>
          <div className="flex flex-row gap-16">
            <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
            <h3 className="text-lg font-normal text-off_gray">{formatMonth(currMonth)}</h3>
          </div>
          
          <h2 className={`${dmSans.className} antialiased tracking-tight text-4xl font-semibold my-4`}>{monthlySpending}</h2>
        
          <div className="flex flex-row items-center gap-2">
            <div className={clsx("rounded-3xl flex items-center justify-center px-2 py-1", { "bg-positive": positive, "bg-negative": !positive })}>
              <p className={clsx("text-md font-medium", { "text-positive_text": positive, "text-negative_text": !positive })}>{percentChange}</p>
            </div>
            <h4 className="text-md font-normal text-gray-400">Compared to {formatMonth(prevMonth)}</h4>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row gap-72">
            <h3 className="text-lg font-medium text-off_black">Yearly Spending</h3>
            <h3 className="text-lg font-normal text-off_gray">{currYear}</h3>
          </div>

          {yearlySpending.map((yearlySpending) => {
              return (
                <div key={yearlySpending.month} className="flex flex-row items-center gap-8">
                  <h4 className="text-off_black font-normal text-md">{formatMonthName(yearlySpending.month)}</h4>
                  <h4 className="text-off_black font-normal text-md">{formatDollarAmount(yearlySpending.total)}</h4>
                </div>
              );
            })}
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-off_black">Recent Transactions</h3>
          
          <div className="mt-2 flex flex-col">
            <div className="flex flex-row items-center gap-16 mt-4">
              <h4 className="w-12 text-gray-400 font-normal text-md">Card</h4>
              <h4 className="w-24 text-gray-400 font-normal text-md">Date</h4>
              <h4 className="w-16 text-gray-400 font-normal text-md text-right">Amount</h4>
              <h4 className="w-42 text-gray-400 font-normal text-md">Description</h4>
            </div>

            {transactions.map((transaction, i) => {
              return (
                <div key={i} className="flex flex-row items-center gap-16 border-t-2 border-gray-200 my-2 pt-4">
                  <h4 className="w-12 text-off_black font-normal text-md">{transaction.account_id}</h4>
                  <h4 className="w-24 text-off_black font-normal text-md">{formatDate(transaction.date)}</h4>
                  <h4 className="w-16 text-off_black font-semibold text-md text-right">{formatDollarAmount(transaction.amount)}</h4>
                  <h4 className="w-42 text-off_black font-normal text-md truncate">{transaction.description}</h4>
                </div>
              );
            })}

          </div>
        </Card>
      </div>

    </main>
  );
}
