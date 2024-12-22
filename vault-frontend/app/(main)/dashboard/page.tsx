'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import clsx from 'clsx';
import { fetchName, fetchMonthlySpending, fetchPercentChange, fetchYearlySpending, fetchAccounts, fetchRecentTransactions } from '@/app/lib/data';
import { getCurrentMonth, getPreviousMonth, getCurrentYear, formatDollarAmount, formatMonth, formatDate, formatMonthName } from '@/app/lib/utils';
import { YearlySpending, Account, Transaction } from '@/app/lib/definitions';
import { CreditCardIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid';
import Button from '@/app/ui/button';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, BarController, Tooltip, ChartData, TooltipItem, ChartOptions } from 'chart.js';
Chart.register(LinearScale, CategoryScale, BarElement, BarController, Tooltip);
Chart.defaults.font.family = 'Outfit, sans-serif';

export default function Page() {
  const [name, setName] = useState<string>('');
  const currMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth();
  const [monthlySpending, setMonthlySpending] = useState<string>('');
  const [percentChange, setPercentChange] = useState<string>('');
  const [positive, setPositive] = useState<boolean>(true);
  const currYear = getCurrentYear();
  const [yearlySpending, setYearlySpending] = useState<Array<YearlySpending>>([]);
  const [barData, setBarData] = useState<ChartData<'bar'>>({labels: [], datasets: []});
  const [accounts, setAccounts] = useState<Array<Account>>([]);
  const [accountIDsToNicknames, setAccountIDsToNicknames] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);

  const barOptions: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 8,
          callback: function(value, index, ticks) {
            return '$' + value;
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
            label: function (context: TooltipItem<'bar'>) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: $${value}`;
            }
        }
    }
    }
  };

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
      if (fetchedYearlySpending) {
        setYearlySpending(fetchedYearlySpending);

        let newLabels = [];
        let newData = [];

        for (let i = 0; i < fetchedYearlySpending.length; i++) {
          const curr = fetchedYearlySpending[i];
          newLabels.push(formatMonthName(curr.month));
          newData.push(curr.total);
        }

        const newBarData = {
          labels: newLabels,
          datasets: [{
            label: 'Total Spent',
            data: newData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        };

        setBarData(newBarData);
      }

      const fetchedAccounts = await fetchAccounts();
      if (fetchedAccounts) {
        setAccounts(fetchedAccounts);

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
          <div className="flex flex-row gap-72 mb-6">
            <h3 className="text-lg font-medium text-off_black">Yearly Spending</h3>
            <h3 className="text-lg font-normal text-off_gray">{currYear}</h3>
          </div>

          {yearlySpending ? (<Bar data={barData} options={barOptions} />) : (
            <p className="text-sm font-normal text-off_gray">No yearly spending data available!</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-off_black">Wallet</h3>

          <div className="flex flex-col text-off_black pt-4 pb-6 gap-3">
            {accounts.map((account, i) => {
              if (account.is_credit_card) {
                return (
                  <div key={i} className="flex flex-row items-center gap-4 px-2 py-1 bg-gray-100 rounded-lg">
                    <CreditCardIcon className="w-8"/>
                    <h4 className="w-48 truncate text-off_black font-normal text-lg">{account.nickname}</h4>
                  </div>
                );
              } else {
                return (
                  <div key={i} className="flex flex-row items-center gap-4 px-2 py-1 bg-gray-100 rounded-lg">
                    <BuildingLibraryIcon className="w-8"/>
                    <h4 className="w-48 truncate text-off_black font-normal text-lg">{account.nickname}</h4>
                  </div>
                );
              }
              
            })}
          </div>

          <div className="flex flex-row justify-center">
            <Button href="/wallet" size="sm">Manage Wallet</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-off_black">Recent Transactions</h3>
          
          <div className="mt-2 flex flex-col">
            <div className="flex flex-row items-center gap-16 mt-4">
              <h4 className="w-24 text-gray-400 font-normal text-md">Account</h4>
              <h4 className="w-24 text-gray-400 font-normal text-md">Date</h4>
              <h4 className="w-16 text-gray-400 font-normal text-md text-right">Amount</h4>
              <h4 className="w-36 text-gray-400 font-normal text-md">Description</h4>
            </div>

            {transactions.map((transaction, i) => {
              return (
                <div key={i} className="flex flex-row items-center gap-16 border-t-2 border-gray-200 my-2 pt-4">
                  <h4 className="w-24 text-off_black font-normal text-md truncate">{accountIDsToNicknames[transaction.account_id]}</h4>
                  <h4 className="w-24 text-off_black font-normal text-md">{formatDate(transaction.date)}</h4>
                  <h4 className="w-16 text-off_black font-semibold text-md text-right">{formatDollarAmount(transaction.amount)}</h4>
                  <h4 className="w-36 text-off_black font-normal text-md truncate">{transaction.description}</h4>
                </div>
              );
            })}

          </div>
        </Card>
      </div>

    </main>
  );
}
