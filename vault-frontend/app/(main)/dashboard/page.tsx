'use client';

import { useEffect, useState } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import TransactionCard from '@/app/ui/transactionCard';
import BillCard from '@/app/ui/billCard';
import clsx from 'clsx';
import { fetchCurrentUserId, fetchName, fetchMonthlySpending, fetchPercentChange, fetchAccounts, fetchRecentTransactions, fetchUpcomingBills, fetchResidenceInfo, fetchUpcomingResidenceBills, fetchRecentResidenceMessages } from '@/app/lib/data';
import { getLast12MonthsAsOptions, getCurrentMonth, getPreviousMonth, getPreviousMonthFromMonth, getLast5YearsAsOptions, getCurrentYear, formatDollarAmount, formatMonth, formatDate, isBill } from '@/app/lib/utils';
import { SelectOption, Transaction, Bill, ResidenceBill, ResidenceMessage } from '@/app/lib/definitions';
import SpendingGraph from '@/app/ui/spendingGraph';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
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
  const [combinedBills, setCombinedBills] = useState<(Bill | ResidenceBill)[]>([]);
  const [residenceName, setResidenceName] = useState<string>('');
  const [residentIdMapping, setResidentIdMapping] = useState<Record<number, string>>({});
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

      const fetchedUserId = await fetchCurrentUserId();
      if (fetchedUserId) setCurrentUserId(fetchedUserId);

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

      const fetchedResidenceInfo = await fetchResidenceInfo();
      if (fetchedResidenceInfo) {
        setResidenceName(fetchedResidenceInfo.residence.name);

        let newResidentIdMapping: Record<number, string> = {};
        fetchedResidenceInfo.users.forEach(user => {
          newResidentIdMapping[user.id] = user.name;
        });
        setResidentIdMapping(newResidentIdMapping);

        const fetchedResidenceBills = await fetchUpcomingResidenceBills();

        if (fetchedBills && fetchedResidenceBills) {
          const newCombinedBills = [];
          let i = 0;
          let j = 0;
          while (i < fetchedBills.length || j < fetchedResidenceBills.length) {
            if (i < fetchedBills.length && j < fetchedResidenceBills.length) {
              if (fetchedBills[i].due_date <= fetchedResidenceBills[j].due_date) newCombinedBills.push(fetchedBills[i++]);
              else newCombinedBills.push(fetchedResidenceBills[j++]);
            } else if (i < fetchedBills.length) newCombinedBills.push(fetchedBills[i++]);
            else newCombinedBills.push(fetchedResidenceBills[j++]);
          }
          setCombinedBills(newCombinedBills);
        } else if (fetchedBills) setCombinedBills(fetchedBills);
        else if (fetchedResidenceBills) setCombinedBills(fetchedResidenceBills);

        const fetchedResidenceMessages = await fetchRecentResidenceMessages();
        if (fetchedResidenceMessages) setResidenceMessages(fetchedResidenceMessages);
      } else if (fetchedBills) setCombinedBills(fetchedBills);

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
              <div className={clsx("rounded-full flex items-center justify-center px-2 py-1", { "bg-positive": positive, "bg-negative": !positive })}>
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
                    <div className="flex flex-col gap-4 pr-4 pb-4 items-start max-h-72">
                      {residenceMessages.map((message) => {
                        if (message.is_update) {
                          return (
                            <div key={message.id} className="self-center">
                              <h6 className="text-sm font-normal text-off_gray text-center">{message.content}</h6>
                            </div>
                          );
                        }

                        return (
                          <div key={message.id} className={clsx({"self-end": message.user_id === currentUserId})}>
                            { message.user_id !== currentUserId && <p className="ml-3 mb-1 text-xs font-normal text-off_gray">{residentIdMapping[message.user_id]}</p> }
                            <h6 className={clsx("max-w-fit rounded-full px-3 py-1 text-md font-normal",
                              {
                                "bg-white text-off_black": message.user_id !== currentUserId,
                                "bg-accent text-white": message.user_id === currentUserId
                              }
                            )}>{message.content}</h6>
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
                <div className="flex flex-col mt-3 mb-6 text-off_black">
                  <div className="flex flex-row items-center gap-12 bg-gray-100 rounded-md px-4 py-2 font-normal text-sm">
                    <h4 className="w-20 text-right">Amount</h4>
                    <h4 className="w-28">Category</h4>
                    <h4 className="w-24">Account</h4>
                    <h4 className="w-24 text-right">Date</h4>
                  </div>

                  {transactions.map((transaction) => {
                    return <TransactionCard key={transaction.id} full={false} id={transaction.id} amount={formatDollarAmount(transaction.amount)} date={formatDate(transaction.date)} account={accountIDsToNicknames[transaction.account_id]} category={transaction.category} description={transaction.description}/>
                  })}
                </div>
              ) : (
                <p className="text-md font-normal text-off_gray mt-1">No recent transactions!</p>
              )}
            </div>

            <div className="flex flex-row justify-center">
              <Button href="/spending" size="sm">All Transactions</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-off_black">Upcoming Bills</h3>
            <div className="flex flex-col">
              {combinedBills.length ? (
                <div className="flex flex-col mt-3 mb-6 text-off_black">
                  <div className="flex flex-row items-center gap-12 bg-gray-100 rounded-md px-4 py-2 font-normal text-sm">
                    <h4 className="w-24 text-right">Total</h4>
                    <h4 className="w-28">Category</h4>
                    <h4 className="w-24">Name</h4>
                    <h4 className="w-24 text-right">Due Date</h4>
                  </div>

                  {combinedBills.map((bill) => {
                    if (isBill(bill)) return <BillCard full={false} key={bill.id} id={bill.id} name={(bill as Bill).name} category={bill.category} dueDate={formatDate(bill.due_date)} total={formatDollarAmount(bill.total)}/>
                    return <BillCard key={bill.id} full={false} isResidenceBill={true} id={bill.id} name={bill.category} category="Residence" dueDate={formatDate(bill.due_date)} total={formatDollarAmount(bill.total)}/>
                  })}
                </div>
              ) : (
                <p className="text-md font-normal text-off_gray mt-1">No upcoming bills!</p>
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
