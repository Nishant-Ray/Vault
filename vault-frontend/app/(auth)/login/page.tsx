'use client';

import { useState } from 'react';
import { LoginFormElement } from '@/app/lib/definitions';
import { login } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Input from '@/app/ui/input';
import Button from '@/app/ui/button';
import Warning from '@/app/ui/warning';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Page() {
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = async (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    setLoginFailed(false);

    if (await login(event)) {
      redirect('/dashboard');
    }

    setLoginFailed(true);
  };

  return (
    <main className="bg-white-400 w-1/2">
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-5xl font-bold`}>Login</h1>
      <p className="text-xl text-off_gray font-medium my-4">Sign into your existing account.</p>

      <Warning isShown={loginFailed}>Incorrect email or password!</Warning>

      <form onSubmit={handleLogin}>
        <Input id="email" name="email" type="email" label="Email" placeholder="johndoe@gmail.com"/>
        <Input id="password" name="password" type="password" label="Password" placeholder="secure_password_123"/>
        
        <Button type="submit" size="lg" buttonType="auth">Login</Button>

        <p className="text-md text-off_black font-medium">Don't have an account? <Link href={"/signup"} className="text-primary hover:underline focus:underline focus:outline-none">Sign up</Link></p>
      </form>

    </main>
  );
}
