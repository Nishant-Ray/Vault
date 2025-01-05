import { request } from '@/app/lib/api';
import { NameData, MonthlySpendingData, YearlySpendingData, AccountsData, AccountAddModalData, AccountData, TransactionsData, BillsData, ResidenceInfoData, ResidenceMessagesData } from '@/app/lib/definitions';

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
    return response.data?.total;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}

export async function fetchPercentChange(currMonth: number, prevMonth: number) {
  try {
    const currResponse = await request<MonthlySpendingData>(`monthly_spendings/get/${currMonth}`, 'GET');
    const currSpending = currResponse.data?.total;

    const prevResponse = await request<MonthlySpendingData>(`monthly_spendings/get/${prevMonth}`, 'GET');
    const prevSpending = prevResponse.data?.total;

    let positive = true

    if (currSpending && prevSpending) {
      if (currSpending <= prevSpending) {
        positive = false;
      }

      const percentChange = Math.round((Math.abs(currSpending - prevSpending) / prevSpending) * 1000) / 10;
      return positive ? `↑ ${percentChange}%` : `↓ {percentChange}%`;
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

export async function removeAccount(id: Number) {
  try {
    await request<null>(`accounts/remove/${id}`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch accounts.');
  }
}

export async function addAccount(accountData: AccountAddModalData) {
  try {
    const response = await request<AccountData>(`accounts/add/${accountData.account_type === 'credit_card'}/${encodeURIComponent(accountData.nickname)}`, 'POST');
    return response.data?.account;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch accounts.');
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

export async function fetchUpcomingBills() {
  try {
    const response = await request<BillsData>('bills/get_upcoming', 'GET');
    return response.data?.bills;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch upcoming bills.');
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