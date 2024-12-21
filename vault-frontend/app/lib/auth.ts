import { LoginFormElement } from '@/app/lib/definitions';
import { authRequest } from './utils';

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