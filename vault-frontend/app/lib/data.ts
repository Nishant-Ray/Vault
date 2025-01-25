import { request } from '@/app/lib/api';
import { unformatDate } from '@/app/lib/utils';
import { IdData, NameData, MonthlySpendingData, YearlySpendingData, AccountsData, AccountAddModalData, AccountData, TransactionData, TransactionsData, TransactionAddManualModalData, TransactionEditModalData, BillData, BillsData, BillAddManualModalData, BillEditModalData, ResidenceData, ResidenceCreateModalData, ResidenceEditModalData, ResidentData, RemoveResidentData, ResidenceBillData, ResidenceBillsData, ResidenceBillEditModalData, ResidencePaymentsData, ResidencePaymentData, ResidenceMessageData, ResidenceMessagesData, ChatbotMessagesData, ChatbotMessageData, InsightsData } from '@/app/lib/definitions';

export async function fetchCurrentUserId() {
  try {
    const response = await request<IdData>('get_current_user_id', 'GET');
    return response.data?.id;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch user id.');
  }
}

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
    const response = await request<BillData>(`bills/add/${unformatDate(billData.dueDate)}/${billData.total}/${billData.category}/${encodeURIComponent(billData.name)}`, 'POST');
    return response.data?.bill;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add bill.');
  }
}

export async function editBill(id: number, billData: BillEditModalData) {
  try {
    await request<null>(`bills/edit/${id}/${unformatDate(billData.dueDate)}/${billData.total}/${billData.category}/${encodeURIComponent(billData.name)}`, 'PATCH');

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

export async function fetchResidenceInfo() {
  try {
    const response = await request<ResidenceData>('residences/get_info', 'GET');
    return response.data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch residence info.');
  }
}

export async function fetchResidenceName() {
  try {
    const response = await request<ResidenceData>('residences/get_info', 'GET');
    return response.data?.residence.name;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch residence name.');
  }
}

export async function createResidence(data: ResidenceCreateModalData) {
  try {
    await request<null>(`residences/create/${encodeURIComponent(data.name)}/${data.monthlyPayment}`, 'POST');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to create residence.');
  }
}

export async function editResidence(data: ResidenceEditModalData) {
  try {
    await request<null>(`residences/edit/${encodeURIComponent(data.name)}/${data.monthlyPayment}`, 'PATCH');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to edit residence.');
  }
}

export async function leaveResidence() {
  try {
    await request<null>(`residences/leave`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to leave residence.');
  }
}

export async function deleteResidence() {
  try {
    await request<null>(`residences/delete`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to delete residence.');
  }
}

export async function addResident(email: string) {
  try {
    const response = await request<ResidentData>(`residences/invite_resident/${encodeURIComponent(email)}`, 'PATCH');
    return response.data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add resident.');
  }
}

export async function removeResident(id: number) {
  try {
    const response = await request<RemoveResidentData>(`residences/remove_resident/${id}`, 'PATCH');
    return response.data?.new_message;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to remove resident.');
  }
}

export async function fetchUpcomingResidenceBills() {
  try {
    const response = await request<ResidenceBillsData>('residence_bills/get_upcoming', 'GET');
    return response.data?.residence_bills;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch upcoming residence bills.');
  }
}

export async function fetchAllResidenceBills() {
  try {
    const response = await request<ResidenceBillsData>('residence_bills/get_all', 'GET');
    return response.data?.residence_bills;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch all residence bills.');
  }
}

export async function addResidenceBill(billData: ResidenceBillEditModalData) {
  try {
    const response = await request<ResidenceBillData>(`residence_bills/add/${billData.total}/${billData.category}/${unformatDate(billData.dueDate)}`, 'POST');
    return response.data?.residence_bill;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add residence bill.');
  }
}

export async function editResidenceBill(id: number, billData: ResidenceBillEditModalData) {
  try {
    await request<null>(`residence_bills/edit/${id}/${billData.total}/${billData.category}/${unformatDate(billData.dueDate)}`, 'PATCH');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to edit residence bill.');
  }
}

export async function removeResidenceBill(id: number) {
  try {
    await request<null>(`residence_bills/remove/${id}`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to remove residence bill.');
  }
}

export async function fetchResidencePayments(id: number) {
  try {
    const response = await request<ResidencePaymentsData>(`residence_bills/get_payments/${id}`, 'GET');
    return response.data?.payments;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch residence bill payments.');
  }
}

export async function addResidencePayment(billId: number, payerId: number, payeeId: number | null, amount: number) {
  try {
    const response = await request<ResidencePaymentData>(`residence_payments/add/${billId}/${payerId}/${payeeId}/${amount}`, 'POST');
    return response.data?.residence_payment;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to add residence payment.');
  }
}

export async function editResidencePayment(paymentId: number, billId: number, payerId: number, payeeId: number | null, amount: number) {
  try {
    await request<null>(`residence_payments/edit/${paymentId}/${billId}/${payerId}/${payeeId}/${amount}`, 'PATCH');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to edit residence payment.');
  }
}

export async function deleteResidencePayment(paymentId: number) {
  try {
    await request<null>(`residence_payments/remove/${paymentId}`, 'DELETE');

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to edit residence payment.');
  }
}

export async function payResidencePayment(paymentId: number) {
  try {
    const response = await request<RemoveResidentData>(`residence_payments/pay/${paymentId}`, 'PATCH');
    return response.data?.new_message;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to pay residence payment.');
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

export async function fetchAllResidenceMessages() {
  try {
    const response = await request<ResidenceMessagesData>('residence_messages/get_all', 'GET');
    return response.data?.messages;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch all residence messages.');
  }
}

export async function createResidenceMessage(isUpdate: boolean, content: string) {
  try {
    const response = await request<ResidenceMessageData>(`residence_messages/create/${isUpdate}/${encodeURIComponent(content)}`, 'POST');
    return response.data?.message;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to create residence messages.');
  }
}

export async function fetchChatbotMessages() {
  try {
    const response = await request<ChatbotMessagesData>('chatbot_messages/get', 'GET');
    return response.data?.messages;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch all residence messages.');
  }
}

export async function createChatbotMessage(content: string) {
  try {
    const response = await request<ChatbotMessageData>(`chatbot_messages/ask/${encodeURIComponent(content)}`, 'POST');
    return response.data;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to create residence messages.');
  }
}

export async function fetchTransactionInsights() {
  try {
    const response = await request<InsightsData>('chatbot_messages/get_transaction_insights', 'GET');
    return response.data?.insights;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch transaction insights.');
  }
}

export async function fetchBillInsights() {
  try {
    const response = await request<InsightsData>('chatbot_messages/get_bill_insights', 'GET');
    return response.data?.insights;

  } catch (error) {
    console.error('Server error:', error);
    throw new Error('Failed to fetch bill insights.');
  }
}