import { request } from '@/app/lib/api';
import { unformatDate } from '@/app/lib/utils';
import { NameData, MonthlySpendingData, YearlySpendingData, AccountsData, AccountAddModalData, AccountData, TransactionData, TransactionsData, TransactionAddManualModalData, TransactionEditModalData, BillData, BillsData, BillAddManualModalData, BillEditModalData, ResidenceInfoData, ResidenceMessagesData } from '@/app/lib/definitions';

export async function fetchName() {
  try {
    const response = await request<NameData>('get_current_user_name', 'GET');
    return response.data?.name;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch user name.');
  }
}

export async function fetchMonthlySpending(month: number) {
  try {
    const response = await request<MonthlySpendingData>(`monthly_spendings/get/${month}`, 'GET');
    return Number(response.data?.total);

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}

export async function fetchPercentChange(currMonth: number, prevMonth: number) {
  try {
    const currResponse = await request<MonthlySpendingData>(`monthly_spendings/get/${currMonth}`, 'GET');
    const currSpending = Number(currResponse.data?.total);

    const prevResponse = await request<MonthlySpendingData>(`monthly_spendings/get/${prevMonth}`, 'GET');
    const prevSpending = Number(prevResponse.data?.total);

    let positive = true;

    if (currSpending || prevSpending) {

      if (currSpending && !prevSpending) {
        return '↑ ∞%';
      } else if (!currSpending && prevSpending) {
        return '↓ ∞%';
      }

      if (currSpending && prevSpending) {
        if (currSpending <= prevSpending) positive = false;

        const percentChange = Math.round((Math.abs(currSpending - prevSpending) / prevSpending) * 1000) / 10;
        return positive ? `↑ ${percentChange}%` : `↓ ${percentChange}%`;
      }
    }
    
    return undefined;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending percent change.');
  }
}

export async function fetchYearlySpending(year: number) {
  try {
    const response = await request<YearlySpendingData>(`monthly_spendings/get_by_year/${year}`, 'GET');
    return response.data?.yearly_spending;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch yearly spending.');
  }
}

export async function fetchAccounts() {
  try {
    const response = await request<AccountsData>('accounts/get_all', 'GET');
    return response.data?.accounts;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch accounts.');
  }
}

export async function changeAccountNickname(id: number, newNickname: string) {
  try {
    await request<null>(`accounts/change_nickname/${id}/${encodeURIComponent(newNickname)}`, 'PATCH');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch accounts.');
  }
}

export async function removeAccount(id: number) {
  try {
    await request<null>(`accounts/remove/${id}`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to remove account.');
  }
}

export async function addAccount(accountData: AccountAddModalData) {
  try {
    const response = await request<AccountData>(`accounts/add/${accountData.account_type === 'credit_card'}/${encodeURIComponent(accountData.nickname)}`, 'POST');
    return response.data?.account;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add account.');
  }
}

export async function fetchRecentTransactions() {
  try {
    const response = await request<TransactionsData>('transactions/get_recent', 'GET');
    return response.data?.transactions;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch recent transactions.');
  }
}

export async function fetchMonthlyTransactions(month: number) {
  try {
    const response = await request<TransactionsData>(`transactions/get_by_month/${month}`, 'GET');
    return response.data?.transactions;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly transactions.');
  }
}

export async function addTransaction(transactionData: TransactionAddManualModalData) {
  try {
    const response = await request<TransactionData>(`transactions/add/${transactionData.accountID}/${unformatDate(transactionData.date)}/${transactionData.amount}/${transactionData.category}/${encodeURIComponent(transactionData.description)}`, 'POST');
    return response.data?.transaction;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add transaction.');
  }
}

export async function editTransaction(id: number, transactionData: TransactionEditModalData) {
  try {
    await request<null>(`transactions/edit/${id}/${transactionData.accountID}/${unformatDate(transactionData.date)}/${transactionData.amount}/${transactionData.category}/${encodeURIComponent(transactionData.description)}`, 'PATCH');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to edit transaction.');
  }
}

export async function removeTransaction(id: number) {
  try {
    await request<null>(`transactions/remove/${id}`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to remove transaction.');
  }
}

export async function fetchUpcomingBills() {
  try {
    const response = await request<BillsData>('bills/get_upcoming', 'GET');
    return response.data?.bills;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch upcoming bills.');
  }
}

export async function fetchAllBills() {
  try {
    const response = await request<BillsData>('bills/get_all', 'GET');
    return response.data?.bills;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch all bills.');
  }
}

export async function addBill(billData: BillAddManualModalData) {
  try {
    const response = await request<BillData>(`bills/add/${unformatDate(billData.dueDate)}/${billData.total}/false/${billData.category}/${encodeURIComponent(billData.name)}`, 'POST');
    return response.data?.bill;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add bill.');
  }
}

export async function editBill(id: number, billData: BillEditModalData) {
  try {
    await request<null>(`bills/edit/${id}/${unformatDate(billData.dueDate)}/${billData.total}/false/${billData.category}/${encodeURIComponent(billData.name)}`, 'PATCH');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to edit bill.');
  }
}

export async function removeBill(id: number) {
  try {
    await request<null>(`bills/remove/${id}`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to remove bill.');
  }
}

export async function fetchResidenceName() {
  try {
    const response = await request<ResidenceInfoData>('residences/get_info', 'GET');
    return response.data?.name;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch residence name.');
  }
}

export async function fetchRecentResidenceMessages() {
  try {
    const response = await request<ResidenceMessagesData>('residence_messages/get_recent', 'GET');
    return response.data?.messages;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch recent residence messages.');
  }
}