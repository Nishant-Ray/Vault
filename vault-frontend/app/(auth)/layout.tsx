import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row">
      <div className="bg-white w-full h-screen flex items-center justify-center">{children}</div>
      <div className="bg-primary w-full h-screen flex items-center justify-center">
        <Image
          src="/auth.png"
          width={480}
          height={480}
          alt="Vault auth graphic"
          className="pointer-events-none"
          unoptimized={true}
        />
      </div>
    </div>
  );
}
