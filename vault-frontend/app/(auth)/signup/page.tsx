'use client';

import { useState, useEffect } from 'react';
import { SignUpFormElement } from '@/app/lib/definitions';
import { signUp } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Input from '@/app/ui/input';
import Button from '@/app/ui/button';
import Warning from '@/app/ui/warning';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Page() {
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const handleSignUp = async (event: React.FormEvent<SignUpFormElement>) => {
    event.preventDefault();
    setSignUpFailed(false);
    setPasswordMatch(true);

    const password1 = event.currentTarget.elements.password.value;
    const password2 = event.currentTarget.elements.repeatPassword.value;

    if (password1 !== password2) {
      setSignUpFailed(true);
      setPasswordMatch(false);
      return;
    }

    if (await signUp(event)) {
      redirect('/dashboard');
    }

    setSignUpFailed(true);
  };

  useEffect(() => {
    document.title = 'Sign Up | Vault';
  }, []);

  return (
    <main className="bg-white-400 w-1/2">
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-5xl font-bold`}>Sign Up</h1>
      <p className="text-xl text-gray font-medium my-4">Create a new account.</p>
      
      <Warning isShown={signUpFailed}>{passwordMatch ? 'User already exists with that email!' : 'Please ensure passwords match!'}</Warning>

      <form onSubmit={handleSignUp}>
        <Input id="email" name="email" type="email" label="Email" placeholder="johndoe@gmail.com"/>
        <Input id="name" name="name" type="name" label="Name" placeholder="John"/>
        <Input id="password" name="password" type="password" label="Password" placeholder="secure_password_123"/>
        <Input id="repeatPassword" name="repeatPassword" type="password" label="Repeat Password" placeholder="secure_password_123"/>
        
        <Button type="submit" size="lg" buttonType="auth">Sign Up</Button>

        <p className="text-md text-off_black font-medium">Already have an account? <Link href={"/login"} className="text-primary hover:underline focus:underline focus-visible:outline-none">Login</Link></p>
      </form>

    </main>
  );
}
