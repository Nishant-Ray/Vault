'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import clsx from 'clsx';
import { fetchName, fetchMonthlySpending, fetchPercentChange, fetchAccounts, fetchRecentTransactions, fetchUpcomingBills, fetchResidenceName, fetchRecentResidenceMessages } from '@/app/lib/data';
import { getCurrentMonth, getPreviousMonth, getCurrentYear, formatDollarAmount, formatMonth, formatDate, formatTime } from '@/app/lib/utils';
import { Transaction, Bill, ResidenceMessage } from '@/app/lib/definitions';
import Button from '@/app/ui/button';
import SpendingGraph from '@/app/ui/spendingGraph';
import { billCategoryColors } from '@/app/lib/colors';

export default function Page() {
  const [name, setName] = useState<string>('');
  const currMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth();
  const [monthlySpending, setMonthlySpending] = useState<string>('$0');
  const [percentChange, setPercentChange] = useState<string>('↓ 0%');
  const [positive, setPositive] = useState<boolean>(true);
  const currYear = getCurrentYear();
  const [accountIDsToNicknames, setAccountIDsToNicknames] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [bills, setBills] = useState<Array<Bill>>([]);
  const [residenceName, setResidenceName] = useState<string>('');
  const [residenceMessages, setResidenceMessages] = useState<Array<ResidenceMessage>>([]);

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

      const fetchedBills = await fetchUpcomingBills();
      if (fetchedBills) setBills(fetchedBills);

      const fetchedResidenceName = await fetchResidenceName();
      if (fetchedResidenceName) {
        setResidenceName(fetchedResidenceName);
        const fetchedResidenceMessages = await fetchRecentResidenceMessages();
        if (fetchedResidenceMessages) setResidenceMessages(fetchedResidenceMessages);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>Welcome, {name}!</h1>
      
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8 w-2/5">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
              <h3 className="text-lg font-normal text-off_gray">{formatMonth(currMonth)}</h3>
            </div>

            <h2 className={`${dmSans.className} antialiased tracking-tight text-4xl font-semibold my-4`}>{monthlySpending}</h2>

            <div className="flex flex-row items-center gap-2">
              <div className={clsx("rounded-3xl flex items-center justify-center px-2 py-1", { "bg-positive": positive, "bg-negative": !positive })}>
                <p className={clsx("text-md font-semibold", { "text-positive_text": positive, "text-negative_text": !positive })}>{percentChange}</p>
              </div>
              <h4 className="text-md font-normal text-gray-400">Compared to {formatMonth(prevMonth)}</h4>
            </div>
          </Card>

          <Card>
            <div className="flex flex-row justify-between mb-6">
              <h3 className="text-lg font-medium text-off_black">Yearly Spending</h3>
              <h3 className="text-lg font-normal text-off_gray">{currYear}</h3>
            </div>

            <SpendingGraph year={currYear}/>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-off_black">Recent Residence Messages</h3>
            <div className="mt-2 mb-4 flex flex-col">
              {residenceName ? (
                <>
                  {residenceMessages.length ? (
                    <div className="bg-off_white px-4 py-2 rounded-lg flex flex-col gap-4">
                      {residenceMessages.map((message, i) => {
                        return (
                          <div key={i}>
                            <p className="ml-3 mb-1 text-xs font-normal text-off_gray">User {message.user_id}</p>
                            <h6 className="bg-white max-w-fit rounded-3xl px-3 py-1 text-md font-normal text-off_black">{message.content}</h6>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm font-normal text-off_gray">No recent messages</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-normal text-off_gray">Not part of a residence!</p>
              )}
            </div>

            <div className="flex flex-row justify-center">
              {residenceName ?
                <Button href="/residence" size="sm">Manage Residence</Button> :
                <Button href="/residence" size="sm">Create Residence</Button>
              }
            </div>
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

          <Card>
            <h3 className="text-lg font-medium text-off_black">Upcoming Bills</h3>
              <div className="my-6 flex flex-col">
                {bills.length ? (
                  <>
                    <div className="flex flex-row items-center gap-16 mb-2">
                      <h4 className="w-24 text-gray-400 font-normal text-md">Due Date</h4>
                      <h4 className="w-16 text-gray-400 font-normal text-md text-right">Total</h4>
                      <h4 className="w-24 text-gray-400 font-normal text-md">Category</h4>
                      <h4 className="w-36 text-gray-400 font-normal text-md">Name</h4>
                    </div>

                    {bills.map((bill, i) => {
                      const billCategoryColorArr = billCategoryColors.get(bill.category);
                      if (billCategoryColorArr) {
                        const bgColor = billCategoryColorArr[0];
                        const textColor = billCategoryColorArr[1];
                        return (
                          <div key={i} className="flex flex-row items-center h-12 gap-16 border-t border-gray-200">
                            <h4 className="w-24 text-red-700 font-semibold text-md">{formatDate(bill.due_date)}</h4>
                            <h4 className="w-16 text-off_black font-bold text-md text-right">{formatDollarAmount(bill.total)}</h4>
                            <div className="w-24">
                              <h4 className={`max-w-fit rounded-3xl px-3 py-1 font-semibold text-sm bg-[${bgColor}] text-[${textColor}]`}>{bill.category}</h4>
                            </div>
                            <h4 className="w-36 text-off_black font-medium text-md truncate">{bill.name}</h4>
                          </div>
                        );
                      }
                    })}
                  </>
                ) : (
                  <p className="text-sm font-normal text-off_gray">No upcoming bills!</p>
                )}
              </div>

              <div className="flex flex-row justify-center">
                <Button href="/bills" size="sm">See Bills</Button>
              </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-off_black">Chatbot</h3>
            <p className="text-lg font-normal text-off_gray mt-4 my-6">Have a specific question about your personal finances?</p>
            <div className="flex flex-row justify-center">
              <Button href="/chatbot" size="sm">Ask a Question</Button>
            </div>
          </Card>
        </div>
      </div>

    </main>
  );
}
