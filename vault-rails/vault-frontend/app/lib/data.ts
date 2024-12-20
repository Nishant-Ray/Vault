export async function fetchName() {
  try {

    const data = await "John";
    return data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch name.');
  }
}

export async function fetchMonthlySpending(month: string) {
  try {

    const data = await (month === 'Dec 2024' ? '$1,522.76' : '$0');
    return data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}

export async function fetchPercentChange(month: string) {
  try {

    const data = await (month === 'Dec 2024' ? '↑16.3%' : '↓16.3%');
    return data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}

export async function fetchRecentTransactions() {
  try {

    const data = await [
      {cardName: 'BoFA', date: '12/06/24', amount: '$56.01', description: 'UCLA STORE: THANK YOU FOR SHOPPING!'},
      {cardName: 'Amex', date: '12/02/24', amount: '$1.79', description: 'Amazon.com'},
      {cardName: 'Amex', date: '12/01/24', amount: '$233.34', description: 'In n Out'},
    ];
    return data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch monthly spending.');
  }
}