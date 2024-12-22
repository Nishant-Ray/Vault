interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

export interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
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

export type AccountsData = {
  accounts: Account[];
};

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

export type TransactionsData = {
  transactions: Transaction[];
};