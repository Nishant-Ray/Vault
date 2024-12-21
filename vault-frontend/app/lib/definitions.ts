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

export type AuthRequestJSON = {
  user: LoginRequestBody | SignUpRequestBody;
}

export type AuthResponse = {
  success: boolean;
  jwt?: string | null;
}

export type Transaction = {
  cardName: string;
  date: string;
  amount: string;
  description: string;
};