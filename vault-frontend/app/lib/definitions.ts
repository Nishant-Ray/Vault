interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

export interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

type LoginRequestBody = {
  email: string;
  password: string;
}

type SignUpRequestBody = {
  email: string;
  name: string;
  password: string;
}

export type AuthRequestBody = {
  user: LoginRequestBody | SignUpRequestBody;
}

export type AuthResponse = {
  success: boolean;
  jwt?: string | null;
}

export type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

type ResponseStatus = {
  code: number;
  message: string;
}

export type ResponseBody<TData> = {
  status: ResponseStatus;
  data?: TData;
}

export type NameData = {
  name: string;
}

export type MonthlySpendingData = {
  total: number;
}

export type Transaction = {
  cardName: string;
  date: string;
  amount: string;
  description: string;
};