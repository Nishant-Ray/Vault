export const metadata = { title: 'Vault' };

import { dmSans } from '@/app/ui/fonts';
import Button from '@/app/ui/button';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex flex-row">
      
      <div className="pl-16 bg-white w-full h-screen flex items-center justify-center">
        <Image
          src="/landing.png"
          width={1479}
          height={837}
          alt="Vault landing graphic"
          className="pointer-events-none transition-transform animate-wiggle"
          unoptimized={true}
        />
      </div>
      <div className="bg-white w-full h-screen flex items-center justify-center p-24">
        <div className="flex flex-col gap-y-4">
          <h1 className={`${dmSans.className} antialiased tracking-tighter text-8xl font-semibold text-off_black`}>Welcome to <span className="text-primary drop-shadow-xl">Vault</span></h1>
          
          <h6 className="text-2xl font-medium text-off_black">Track spendings and invest smartly to secure your financial future.</h6>
          
          <div className="flex flex-row justify-center mt-12 gap-x-6">
            <Button href="/login">Login</Button>
            <Button href="/signup">Sign Up</Button>
          </div>
        </div>
      </div>
      
    </main>
  );
}
