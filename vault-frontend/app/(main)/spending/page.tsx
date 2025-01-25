'use client';

import { useState, useRef, useEffect } from 'react';
import { dmSans } from '@/app/ui/fonts';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import TransactionCard from '@/app/ui/transactionCard';
import TransactionModal from '@/app/ui/transactionModal';
import Select from '@/app/ui/select';
import IconButton from '@/app/ui/iconButton';
import { PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { fetchMonthlySpending, fetchPercentChange, fetchAccounts, fetchMonthlyTransactions, addTransaction, editTransaction, removeTransaction, fetchTransactionInsights } from '@/app/lib/data';
import { formatDollarAmount, getLast12MonthsAsOptions, getCurrentMonth, getPreviousMonth, getPreviousMonthFromMonth, getLast5YearsAsOptions, getCurrentYear, getMonthFromDate, formatMonth, formatDate, unformatDate } from '@/app/lib/utils';
import { SelectOption, Account, Transaction, TransactionAddManualModalData, TransactionAddDocumentModalData, TransactionEditModalData, TRANSACTION_ADD_MANUAL_MODAL_TYPE, TRANSACTION_ADD_DOCUMENT_MODAL_TYPE, TRANSACTION_EDIT_MODAL_TYPE, TRANSACTION_DELETE_MODAL_TYPE } from '@/app/lib/definitions';
import SpendingGraph from '@/app/ui/spendingGraph';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const last12Months: SelectOption[] = getLast12MonthsAsOptions();
  const currMonth = getCurrentMonth();
  const [selectedMonthlySpendingMonth, setSelectedMonthlySpendingMonth] = useState<number>(currMonth);
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
  const [modalType, setModalType] = useState<number>(TRANSACTION_ADD_MANUAL_MODAL_TYPE);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [transactionSelected, setTransactionSelected] = useState<Transaction | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  const onSpendingMonthChange = async (month: number) => {
    setSelectedMonthlySpendingMonth(month);
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
    setModalType(TRANSACTION_ADD_MANUAL_MODAL_TYPE);
    setTransactionModalOpen(true);
  };

  function hopefulTransactionAdd(transaction: Transaction) {
    const month = getMonthFromDate(transaction.date);

    if (selectedTransactionMonth === month) {
      const newTransactions = [...transactions];
      const index = newTransactions.findIndex(item => item.date < transaction.date);
      if (index === -1) newTransactions.push(transaction);
      else newTransactions.splice(index, 0, transaction);
      setTransactions(newTransactions);
    }

    if (selectedMonthlySpendingMonth === month) {
      setMonthlySpending(monthlySpending + transaction.amount);
    }
  }

  const handleManualModalSubmit = async (data: TransactionAddManualModalData) => {
    const newTransaction = await addTransaction(data);
    if (newTransaction) hopefulTransactionAdd(newTransaction);

    setTransactionModalOpen(false);
  };

  const handleDocumentClick = () => {
    setModalType(TRANSACTION_ADD_DOCUMENT_MODAL_TYPE);
    setTransactionModalOpen(true);
  };

  const handleDocumentModalSubmit = () => {
    setTransactionModalOpen(false);
  };

  const handleEditClick = (id: number) => {
    const foundTransaction = transactions.find(transaction => transaction.id === id);
    if (foundTransaction) setTransactionSelected(foundTransaction);

    setModalType(TRANSACTION_EDIT_MODAL_TYPE);
    setTransactionModalOpen(true);
  };

  function hopefulTransactionEdit(id: number, data: TransactionEditModalData) {
    const newTransactions = [...transactions];

    const index = newTransactions.findIndex(item => item.id === id);
    const transaction = newTransactions[index];

    transaction.account_id = Number(data.accountID);
    const originalAmount = transaction.amount;
    transaction.amount = Number(data.amount);
    transaction.category = data.category;
    const newDate = unformatDate(data.date);
    transaction.description = data.description;

    if (transaction.date === newDate) {
      newTransactions[index] = transaction;
    } else {
      transaction.date = newDate;
      newTransactions.splice(index, 1);
      if (getMonthFromDate(transaction.date) === selectedTransactionMonth) {
        const newIndex = newTransactions.findIndex(item => item.date < transaction.date);
        if (newIndex === -1) newTransactions.push(transaction);
        else newTransactions.splice(newIndex, 0, transaction);
      }
    }

    setTransactions(newTransactions);

    if (selectedMonthlySpendingMonth === selectedTransactionMonth && getMonthFromDate(transaction.date) === selectedTransactionMonth) {
      setMonthlySpending(monthlySpending + (transaction.amount - originalAmount));
    }
  }

  const handleEditModalSubmit = async (id: number, data: TransactionEditModalData) => {
    await editTransaction(id, data);
    hopefulTransactionEdit(id, data);

    setTransactionModalOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    const foundTransaction = transactions.find(transaction => transaction.id === id);
    if (foundTransaction) setTransactionSelected(foundTransaction);
    
    setModalType(TRANSACTION_DELETE_MODAL_TYPE);
    setTransactionModalOpen(true);
  };

  const handleDeleteModalSubmit = async (id: number) => {
    const index = transactions.findIndex(item => item.id === id);
    if (getMonthFromDate(transactions[index].date) === selectedMonthlySpendingMonth) setMonthlySpending(monthlySpending - transactions[index].amount);
    setTransactions((prevTransactions) => prevTransactions.filter((_, i) => i !== index));
    await removeTransaction(id);

    setTransactionModalOpen(false);
  };

  const handleTransactionModalClose = () => {
    setTransactionModalOpen(false);
  };

  useEffect(() => {
    document.title = 'Spending | Vault';

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

      const fetchedInsights = await fetchTransactionInsights();
      if (fetchedInsights) {
        setInsights(fetchedInsights.split('|'));
      }

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
      <TransactionModal type={modalType} isOpen={transactionModalOpen} accounts={accounts} transaction={transactionSelected} onManualModalSubmit={handleManualModalSubmit} onDocumentModalSubmit={handleDocumentModalSubmit} onEditModalSubmit={handleEditModalSubmit} onDeleteModalSubmit={handleDeleteModalSubmit} onClose={handleTransactionModalClose}/>
      
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8 w-[28vw]">
          <Card>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
              <Select options={last12Months} onSelect={onSpendingMonthChange}/>
            </div>

            <h2 className={`${dmSans.className} antialiased text-black tracking-tight text-4xl font-semibold my-4`}>{formatDollarAmount(monthlySpending)}</h2>

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
            <h3 className="text-lg font-medium text-off_black">AI Insights</h3>
            { insights.length > 0 ? (
              <ul className="text-off_black text-md font-normal list-disc pl-5">
                { insights.map((insight, i) => {
                  return <li key={i}>{insight}</li>;
                })}
              </ul>
            ) : (
              <p className="text-md font-normal text-off_gray mt-1">No insights!</p>
            )}
            
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <Card className="min-w-96">
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
            <div>
              {transactions.length ? (
                <div className="flex flex-col mt-3 text-off_black">
                  <div className="flex flex-row items-center gap-12 bg-gray-100 rounded-md px-4 py-2 font-normal text-sm">
                    <h4 className="w-20 text-right">Amount</h4>
                    <h4 className="w-28">Category</h4>
                    <h4 className="w-24">Account</h4>
                    <h4 className="w-24 text-right">Date</h4>
                  </div>

                  {transactions.map((transaction) => {
                    return <TransactionCard key={transaction.id} id={transaction.id} amount={formatDollarAmount(transaction.amount)} date={formatDate(transaction.date)} account={accountIDsToNicknames[transaction.account_id]} category={transaction.category} description={transaction.description} onEdit={handleEditClick} onDelete={handleDeleteClick}/>
                  })}
                </div>
              ) : (
                <p className="text-md font-normal text-off_gray mt-1">No transactions!</p>
              )}
            </div>
          </Card>
        </div>
      </div>

    </main>
  );
}
