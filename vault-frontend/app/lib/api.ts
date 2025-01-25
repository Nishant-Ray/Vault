import { AuthRequestBody, AuthResponse, RequestMethod, ResponseBody } from './definitions';
import { redirect } from 'next/navigation';

export async function jwtRequest(jwt: string): Promise<number> {
  const response = await fetch('https://vault-rails.onrender.com/current_user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  });

  return response.status;
}

export async function authRequest(url: string, requestJSON: AuthRequestBody): Promise<AuthResponse> {
  try {
    const response = await fetch(`https://vault-rails.onrender.com/${url}`, {
      method: 'POST',
      body: JSON.stringify(requestJSON),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) return { success: true, jwt: response.headers.get('authorization') };
    return { success: false };

  } catch (error) {
    return { success: false };
  }
}

export async function request<TData>(url: string, method: RequestMethod): Promise<ResponseBody<TData>> {
  const jwt = document.cookie
    .split('; ')
    .find((row) => row.startsWith('jwt='))
    ?.split('=')[1];

  if (!jwt) redirect('/login');

  const response = await fetch(`https://vault-rails.onrender.com/${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  });

  if (response.status === 401) {
    document.cookie = `jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure`;
    redirect('/login');
  }

  return response.json();
}