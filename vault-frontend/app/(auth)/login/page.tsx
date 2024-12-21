'use client';

import { useState } from 'react';
import { LoginFormElement } from '@/app/lib/definitions';
import { login } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Input from '@/app/ui/input';
import AuthButton from '@/app/ui/authButton';
import { dmSans } from '@/app/ui/fonts';
import clsx from 'clsx';
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
      <p className="text-xl text-off_gray font-medium mt-4">Sign into your existing account.</p>

      <p className={clsx("font-medium text-lg text-negative_text bg-negative text-center rounded-md py-2", { "visible mt-6 mb-6": loginFailed, "invisible m-0": !loginFailed })}>Incorrect email or password!</p>

      <form onSubmit={handleLogin}>
        <Input id="email" type="email" label="Email" placeholder="johndoe@gmail.com"/>
        <Input id="password" type="password" label="Password" placeholder="secure_password_123"/>
        
        <AuthButton type="submit">Login</AuthButton>

        <p className="text-md text-off_black font-medium">Don't have an account? <Link href={"/signup"} className="text-primary hover:underline focus:underline focus:outline-none">Sign up</Link></p>
      </form>

    </main>
  );
}
