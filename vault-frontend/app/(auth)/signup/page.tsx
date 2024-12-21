import Input from '@/app/ui/input';
import AuthButton from '@/app/ui/authButton';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="bg-white-400 w-1/2">
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-5xl font-bold`}>Sign Up</h1>
      <p className="text-xl text-off_gray font-medium mt-4 mb-10">Create a new account.</p>

      <form>
        <Input id="email" type="email" label="Email" placeholder="johndoe@gmail.com"/>
        <Input id="name" type="name" label="Name" placeholder="John"/>
        <Input id="password" type="password" label="Password" placeholder="secure_password_123"/>
        <Input id="repeat-password" type="password" label="Repeat Password" placeholder="secure_password_123"/>
        
        <AuthButton type="submit">Sign Up</AuthButton>

        <p className="text-md text-off_black font-medium">Already have an account? <Link href={"/login"} className="text-primary hover:underline focus:underline focus:outline-none">Login</Link></p>
      </form>

    </main>
  );
}
