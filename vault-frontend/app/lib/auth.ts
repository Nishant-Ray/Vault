import { LoginFormElement, SignUpFormElement } from '@/app/lib/definitions';
import { authRequest } from '@/app/lib/api';

export async function login(event: React.FormEvent<LoginFormElement>): Promise<boolean> {
  const email = event.currentTarget.elements.email.value;
  const password = event.currentTarget.elements.password.value;

  const requestJSON = { user: { email: email, password: password } };

  const response = await authRequest('login', requestJSON);
  if (response.success && response.jwt) {
    document.cookie = `jwt=${response.jwt}; path=/; Secure;`;
    return true;
  }

  return false;
}

export async function signUp(event: React.FormEvent<SignUpFormElement>): Promise<boolean> {
  const email = event.currentTarget.elements.email.value;
  const name = event.currentTarget.elements.name.value;
  const password = event.currentTarget.elements.password.value;

  const requestJSON = { user: { email: email, name: name, password: password } };

  const response = await authRequest('signup', requestJSON);
  if (response.success && response.jwt) {
    document.cookie = `jwt=${response.jwt}; path=/; Secure;`;
    return true;
  }

  return false;
}