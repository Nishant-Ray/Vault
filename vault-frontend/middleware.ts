import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtRequest } from './app/lib/utils';

export async function middleware(request: NextRequest) {
  const publicPaths = new Set<string>(['/', '/login', '/signup']);
  const protectedPath = !publicPaths.has(request.nextUrl.pathname);

  const jwt = request.cookies.get('jwt');
  if (!jwt) {
    if (protectedPath) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  const status = await jwtRequest(jwt.value);

  if (status !== 200) {
    let response;
    if (protectedPath) response = NextResponse.redirect(new URL('/login', request.url));
    else response = NextResponse.next();
    
    response.cookies.delete('jwt');
    return response;
  }

  if (!protectedPath) return NextResponse.redirect(new URL('/dashboard', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard', '/spending', '/wallet', '/bills', '/residence', '/chatbot', '/settings']
};