import Input from '@/app/ui/input';
import Button from '@/app/ui/button';
import { dmSans } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="bg-white-400 w-1/2">
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-5xl font-bold`}>Sign Up</h1>
      <p className="text-xl text-gray font-medium mt-4 mb-10">Create a new account.</p>

      <form>
        <Input id="email" name="email" type="email" label="Email" placeholder="johndoe@gmail.com"/>
        <Input id="name" name="name" type="name" label="Name" placeholder="John"/>
        <Input id="password" name="password" type="password" label="Password" placeholder="secure_password_123"/>
        <Input id="repeat-password" name="repeat-password" type="password" label="Repeat Password" placeholder="secure_password_123"/>
        
        <Button type="submit" size="lg" buttonType="auth">Sign Up</Button>

        <p className="text-md text-off_black font-medium">Already have an account? <Link href={"/login"} className="text-primary hover:underline focus:underline focus:outline-none">Login</Link></p>
      </form>

    </main>
  );
}
