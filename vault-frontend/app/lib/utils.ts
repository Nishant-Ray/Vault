import { AuthRequestJSON, AuthResponse } from './definitions';
import { redirect } from 'next/navigation';

export async function jwtRequest(jwt: string): Promise<number> {
  const response = await fetch('http://localhost:3001/current_user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  });

  return response.status;
}

export async function authRequest(url: string, requestJSON: AuthRequestJSON): Promise<AuthResponse> {
  try {
    const response = await fetch(`http://localhost:3001/${url}`, {
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

export async function request<TResponse>(url: string, method: string): Promise<TResponse> {
  const jwt = document.cookie
    .split('; ')
    .find((row) => row.startsWith('jwt='))
    ?.split('=')[1];

  if (!jwt) redirect('/login');

  const response = await fetch(`http://localhost:3001/${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  });

  if (response.status === 401) redirect('/login');

  return response.json();
}