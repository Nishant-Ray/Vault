import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtRequest } from './app/lib/utils';

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt');
  if (!jwt) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const status = await jwtRequest(jwt.value);

  if (status !== 200) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('jwt');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/spending', '/wallet', '/bills', '/residence', '/chatbot', '/settings']
};