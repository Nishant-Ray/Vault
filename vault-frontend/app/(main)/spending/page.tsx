'use client';

import { useState, useRef, useEffect } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import Select from '@/app/ui/select';
import Button from '@/app/ui/button';
import IconButton from '@/app/ui/iconButton';
import TransactionModal from '@/app/ui/transactionModal';
import { PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { fetchMonthlySpending, fetchPercentChange, fetchAccounts, fetchMonthlyTransactions, addTransaction } from '@/app/lib/data';
import { formatDollarAmount, getLast12MonthsAsOptions, getCurrentMonth, getPreviousMonth, getPreviousMonthFromMonth, getLast5YearsAsOptions, getCurrentYear, getMonthFromDate, formatMonth, formatDate } from '@/app/lib/utils';
import { SelectOption, Account, Transaction, TransactionAddManualModalData, TransactionAddDocumentModalData } from '@/app/lib/definitions';
import SpendingGraph from '@/app/ui/spendingGraph';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const last12Months: SelectOption[] = getLast12MonthsAsOptions();
  const currMonth = getCurrentMonth();
  const [prevSelectedMonth, setPrevSelectedMonth] = useState<number>(getPreviousMonth());
  const [monthlySpending, setMonthlySpending] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<string>('↓ 0%');
  const [positive, setPositive] = useState<boolean>(true);
  const last5Years: SelectOption[] = getLast5YearsAsOptions();
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountIDsToNicknames, setAccountIDsToNicknames] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedTransactionMonth, setSelectedTransactionMonth] = useState<number>(currMonth);
  const [transactionAddOptionsOpen, setTransactionAddOptionsOpen] = useState<boolean>(false);
  const [manualModal, setManualModal] = useState<boolean>(true);
  const [transactionAddModalOpen, setTransactionAddModalOpen] = useState<boolean>(false);

  const onSpendingMonthChange = async (month: number) => {
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

  const onTransactionMonthChange = async (month: number) => {
    setSelectedTransactionMonth(month);
    const fetchedTransactions = await fetchMonthlyTransactions(month);
    if (fetchedTransactions) setTransactions(fetchedTransactions);
    else setTransactions([]);
  };

  const openTransactionAddOptions = () => {
    setTransactionAddOptionsOpen(true);
  };

  const handleManualClick = () => {
    setManualModal(true);
    setTransactionAddModalOpen(true);
  };

  const handleDocumentClick = () => {
    setManualModal(false);
    setTransactionAddModalOpen(true);
  };

  function hopefulTransactionAdd(transaction: Transaction) {
    if (selectedTransactionMonth === getMonthFromDate(transaction.date)) {
      setTransactions([transaction, ...transactions]);
      const newTransactions = [...transactions];
      const index = newTransactions.findIndex(item => item.date < transaction.date);
      if (index === -1) newTransactions.push(transaction);
      else newTransactions.splice(index, 0, transaction);
      setTransactions(newTransactions);

      setMonthlySpending(monthlySpending + transaction.amount);
    }
  }

  const handleManualModalSubmit = async (data: TransactionAddManualModalData) => {
    const newTransaction = await addTransaction(data);
    if (newTransaction) {
      hopefulTransactionAdd(newTransaction);
    }
    setTransactionAddModalOpen(false);
  };

  const handleDocumentModalSubmit = (_data: TransactionAddDocumentModalData) => {
    setTransactionAddModalOpen(false);
  };

  const handleTransactionAddModalClose = () => {
    setTransactionAddModalOpen(false);
  };

  useEffect(() => {
    const fetchSpendingData = async () => {
      setLoading(true);
      
      const fetchedSpending = await fetchMonthlySpending(currMonth);
      if (fetchedSpending) setMonthlySpending(fetchedSpending);

      const fetchedPercentChange = await fetchPercentChange(currMonth, prevSelectedMonth);
      if (fetchedPercentChange) {
        setPercentChange(fetchedPercentChange);
        setPositive(fetchedPercentChange.charAt(0) === '↓');
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

      const fetchedTransactions = await fetchMonthlyTransactions(currMonth);
      if (fetchedTransactions) setTransactions(fetchedTransactions);

      setLoading(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setTransactionAddOptionsOpen(false);
      }
    };

    fetchSpendingData();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
    
  if (loading) return <Loading/>;

  return (
    <main>
      <TransactionModal isManualModal={manualModal} isOpen={transactionAddModalOpen} accounts={accounts} onManualModalSubmit={handleManualModalSubmit} onDocumentModalSubmit={handleDocumentModalSubmit} onClose={handleTransactionAddModalClose}/>
      
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8 w-2/5">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
              <Select options={last12Months} onSelect={onSpendingMonthChange}/>
            </div>

            <h2 className={`${dmSans.className} antialiased text-black tracking-tight text-4xl font-semibold my-4`}>{formatDollarAmount(monthlySpending)}</h2>

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
        </div>

        <div className="flex flex-col gap-8 w-3/5">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Transactions</h3>

              <div className="flex flex-row gap-3">
                <IconButton icon={PlusIcon} onClick={openTransactionAddOptions} ref={buttonRef}/>
                { transactionAddOptionsOpen && 
                  <div className="mt-8 ml-0 absolute w-44 flex flex-col border border-gray-100 bg-white text-off_black text-md font-normal rounded-md shadow-lg">
                    <p onClick={handleManualClick} className="cursor-pointer px-4 py-2 rounded-t-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Manually enter</p>
                    <p onClick={handleDocumentClick} className="cursor-pointer px-4 py-2 rounded-b-md hover:bg-gray-100 transition-all duration-150 ease-in-out">Upload document</p>
                  </div>
                }
                <Select options={last12Months} onSelect={onTransactionMonthChange}/>
              </div>
            </div>
            <div className="flex flex-col">
              {transactions.length ? (
                <div className="my-3">
                  <div className="flex flex-row items-center gap-16 mb-2">
                    <h4 className="w-24 text-gray-400 font-normal text-md">Account</h4>
                    <h4 className="w-24 text-gray-400 font-normal text-md">Date</h4>
                    <h4 className="w-16 text-gray-400 font-normal text-md text-right">Amount</h4>
                    <h4 className="w-36 text-gray-400 font-normal text-md">Description</h4>
                  </div>

                  {transactions.map((transaction, i) => {
                    return (
                      <div key={transaction.id} className="flex flex-row items-center h-12 gap-16 border-t border-gray-200">
                        <h4 className="w-24 text-off_black font-medium text-md truncate">{accountIDsToNicknames[transaction.account_id]}</h4>
                        <h4 className="w-24 text-off_black font-medium text-md">{formatDate(transaction.date)}</h4>
                        <h4 className="w-16 text-off_black font-bold text-md text-right">{formatDollarAmount(transaction.amount)}</h4>
                        <h4 className="w-36 text-off_black font-medium text-md truncate">{transaction.description}</h4>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-md font-normal text-off_gray mt-1 mb-4">No transactions!</p>
              )}
            </div>
          </Card>
        </div>
      </div>

    </main>
  );
}
