import { request } from '@/app/lib/api';
import { NameData, MonthlySpendingData } from '@/app/lib/definitions';

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

export async function fetchRecentTransactions() {
  try {
    const response = await [
      {cardName: 'BoFA', date: '12/06/24', amount: '$56.01', description: 'UCLA STORE: THANK YOU FOR SHOPPING!'},
      {cardName: 'Amex', date: '12/02/24', amount: '$1.79', description: 'Amazon.com'},
      {cardName: 'Amex', date: '12/01/24', amount: '$233.34', description: 'In n Out'},
    ];
    return response;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}