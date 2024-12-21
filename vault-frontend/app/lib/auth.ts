import { LoginFormElement } from '@/app/lib/definitions';
import { authRequest } from './utils';
import { redirect } from 'next/navigation';

export async function login(event: React.FormEvent<LoginFormElement>) {
  event.preventDefault();
  const email = event.currentTarget.elements.email.value;
  const password = event.currentTarget.elements.password.value;

  const requestJSON = { user: { email: email, password: password } };

  const response = await authRequest('login', requestJSON);
  if (response.success && response.jwt) {
    //localStorage.setItem('jwt', response.jwt);
    document.cookie = `jwt=${response.jwt}; path=/; Secure;`;
    redirect('/dashboard');
  } else {
    alert("Incorrect email or password!");
  }
}