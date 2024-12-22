import { request } from '@/app/lib/api';
import { NameData, MonthlySpendingData, YearlySpendingData, TransactionsData } from '@/app/lib/definitions';

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
      return positive ? `↑${percentChange}%` : `↓{percentChange}%`;
    }
    
    return undefined;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}

export async function fetchYearlySpending(year: number) {
  try {
    const response = await request<YearlySpendingData>(`monthly_spendings/get_by_year/${year}`, 'GET');
    return response.data?.yearly_spending;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}

export async function fetchRecentTransactions() {
  try {
    const response = await request<TransactionsData>('transactions/get_recent', 'GET');
    return response.data?.transactions;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}