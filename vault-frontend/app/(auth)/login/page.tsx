import Input from '@/app/ui/input';
import AuthButton from '@/app/ui/authButton';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="bg-white-400 w-1/2">
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-5xl font-bold`}>Login</h1>
      <p className="text-xl text-gray-500 font-medium mt-4 mb-10">Sign into your existing account.</p>

      <form>
        <Input id="email" type="email" label="Email" placeholder="johndoe@gmail.com"/>
        <Input id="password" type="password" label="Password" placeholder="secure_password_123"/>
        
        <AuthButton type="submit">Login</AuthButton>

        <p className="text-md text-off_black font-medium">Don't have an account? <Link href={"/signup"} className="text-primary hover:underline focus:underline focus:outline-none">Sign up</Link></p>
      </form>

    </main>
  );
}
