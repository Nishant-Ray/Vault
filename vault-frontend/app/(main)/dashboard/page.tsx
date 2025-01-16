'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import TransactionCard from '@/app/ui/transactionCard';
import clsx from 'clsx';
import { fetchName, fetchMonthlySpending, fetchPercentChange, fetchAccounts, fetchRecentTransactions, fetchUpcomingBills, fetchResidenceName, fetchRecentResidenceMessages } from '@/app/lib/data';
import { getLast12MonthsAsOptions, getCurrentMonth, getPreviousMonth, getPreviousMonthFromMonth, getLast5YearsAsOptions, getCurrentYear, formatDollarAmount, formatMonth, formatDate } from '@/app/lib/utils';
import { SelectOption, Transaction, Bill, ResidenceMessage } from '@/app/lib/definitions';
import SpendingGraph from '@/app/ui/spendingGraph';
import { billCategoryColors } from '@/app/lib/colors';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const last12Months: SelectOption[] = getLast12MonthsAsOptions();
  const currMonth = getCurrentMonth();
  const [prevSelectedMonth, setPrevSelectedMonth] = useState<number>(getPreviousMonth());
  const [monthlySpending, setMonthlySpending] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<string>('↓ 0%');
  const [positive, setPositive] = useState<boolean>(true);
  const last5Years: SelectOption[] = getLast5YearsAsOptions();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear);
  const [accountIDsToNicknames, setAccountIDsToNicknames] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [residenceName, setResidenceName] = useState<string>('');
  const [residenceMessages, setResidenceMessages] = useState<ResidenceMessage[]>([]);

  const onMonthChange = async (month: number) => {
    const prevMonth = getPreviousMonthFromMonth(month);
    setPrevSelectedMonth(prevMonth);

    const fetchedSpending = await fetchMonthlySpending(month);
    if (fetchedSpending) setMonthlySpending(fetchedSpending);
    else setMonthlySpending(0);

    const fetchedPercentChange = await fetchPercentChange(month, prevMonth);
    if (fetchedPercentChange) {
      setPercentChange(fetchedPercentChange);
      setPositive(fetchedPercentChange.charAt(0) === '↓');
    } else {
      setPercentChange('↓ 0%');
      setPositive(true);
    }
  };

  const onYearChange = (year: number) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const fetchedName = await fetchName();
      if (fetchedName) setName(fetchedName);

      const fetchedSpending = await fetchMonthlySpending(currMonth);
      if (fetchedSpending) setMonthlySpending(fetchedSpending);

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

      const fetchedBills = await fetchUpcomingBills();
      if (fetchedBills) setBills(fetchedBills);

      const fetchedResidenceName = await fetchResidenceName();
      if (fetchedResidenceName) {
        setResidenceName(fetchedResidenceName);
        const fetchedResidenceMessages = await fetchRecentResidenceMessages();
        if (fetchedResidenceMessages) setResidenceMessages(fetchedResidenceMessages);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>Welcome, {name}!</h1>
      
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8 w-2/5">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
              <Select options={last12Months} onSelect={onMonthChange}/>
            </div>

            <h2 className={`${dmSans.className} antialiased tracking-tight text-black text-4xl font-semibold my-4`}>{formatDollarAmount(monthlySpending)}</h2>

            <div className="flex flex-row items-center gap-2">
              <div className={clsx("rounded-3xl flex items-center justify-center px-2 py-1", { "bg-positive": positive, "bg-negative": !positive })}>
                <p className={clsx("text-md font-semibold", { "text-positive_text": positive, "text-negative_text": !positive })}>{percentChange}</p>
              </div>
              <h4 className="text-md font-normal text-gray-400">Compared to {formatMonth(prevSelectedMonth)}</h4>
            </div>
          </Card>

          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Yearly Spending</h3>
              <Select options={last5Years} onSelect={onYearChange}/>
            </div>

            <SpendingGraph year={selectedYear} flag={monthlySpending}/>
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
            <div className="flex flex-col">
              {transactions.length ? (
                <div className="flex flex-col my-3 text-off_black">
                  <div className="flex flex-row items-center gap-8 mb-4 bg-gray-100 rounded-md px-8 py-2">
                    <h4 className="w-24 font-normal text-sm">Account</h4>
                    <h4 className="w-24 font-normal text-sm text-right">Date</h4>
                    <h4 className="w-20 font-normal text-sm text-right">Amount</h4>
                    <h4 className="w-36 font-normal text-sm">Description</h4>
                  </div>

                  {transactions.map((transaction) => {
                    return <TransactionCard key={transaction.id} full={false} id={transaction.id} amount={formatDollarAmount(transaction.amount)} date={formatDate(transaction.date)} account={accountIDsToNicknames[transaction.account_id]} description={transaction.description}/>
                  })}
                </div>
              ) : (
                <p className="text-md font-normal text-off_gray mt-1 mb-4">No recent transactions!</p>
              )}
            </div>

            <div className="flex flex-row justify-center">
              <Button href="/spending" size="sm">All Transactions</Button>
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
              <Button href="/bills" size="sm">All Bills</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-off_black">Chatbot</h3>
            <p className="text-md font-normal text-off_gray mt-1 mb-4">Have a specific question about your personal finances?</p>
            <div className="flex flex-row justify-center">
              <Button href="/chatbot" size="sm">Ask a Question</Button>
            </div>
          </Card>
        </div>
      </div>

    </main>
  );
}
