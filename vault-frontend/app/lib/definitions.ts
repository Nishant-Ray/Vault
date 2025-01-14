interface LoginFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

export interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginFormElements;
};

interface SignUpFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  name: HTMLInputElement;
  password: HTMLInputElement;
  repeatPassword: HTMLInputElement;
};

export interface SignUpFormElement extends HTMLFormElement {
  readonly elements: SignUpFormElements;
};

type LoginRequestBody = {
  email: string;
  password: string;
};

type SignUpRequestBody = {
  email: string;
  name: string;
  password: string;
};

export type AuthRequestBody = {
  user: LoginRequestBody | SignUpRequestBody;
};

export type AuthResponse = {
  success: boolean;
  jwt?: string | null;
};

export type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

type ResponseStatus = {
  code: number;
  message: string;
};

export type ResponseBody<TData> = {
  status: ResponseStatus;
  data?: TData;
};

export type NameData = {
  name: string;
};

export type MonthlySpendingData = {
  total: number;
};

export type YearlySpending = {
  month: number;
  total: number;
};

export type YearlySpendingData = {
  yearly_spending: YearlySpending[];
};

export type Account = {
  id: number;
  user_id: number;
  nickname: string;
  is_credit_card: boolean;
  created_at: string;
  updated_at: string;
};

export type AccountData = {
  account: Account;
};

export type AccountsData = {
  accounts: Account[];
};

export const ACCOUNT_NICKNAME_MODAL_TYPE = 0;
export const ACCOUNT_REMOVE_MODAL_TYPE = 1;
export const ACCOUNT_ADD_MODAL_TYPE = 2;

export type AccountNicknameModalData = {
  nickname: string;
};

export type AccountAddModalData = {
  nickname: string;
  account_type: string;
}

export type Transaction = {
  id: number;
  user_id: number;
  account_id: number;
  date: number;
  amount: number;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type TransactionData = {
  transaction: Transaction;
};

export type TransactionsData = {
  transactions: Transaction[];
};

export type TransactionAddManualModalData = {
  accountID: string;
  date: string;
  amount: number;
  category: string;
  description: string;
};

export type TransactionAddDocumentModalData = {
  nickname: string;
}

export type Bill = {
  id: number;
  user_id: number;
  name: string;
  category: string;
  due_date: number;
  shared: boolean;
  created_at: string;
  updated_at: string;
  residence_id: number | 'nil';
  total: number;
};

export type BillsData = {
  bills: Bill[];
};

type User = {
  id: number;
  name: string;
};

export type ResidenceInfoData = {
  name: string;
  users: User[];
}

export type ResidenceMessage = {
  content: string;
  is_update: boolean;
  created_at: string;
  updated_at: string;
  residence_id: number;
  user_id: number;
};

export type ResidenceMessagesData = {
  messages: ResidenceMessage[];
}

export type SelectOption = {
  value: number;
  text: string;
}