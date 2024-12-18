import React from 'react';
import '@/app/ui/global.css';
import { outfit } from '@/app/ui/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-white`}>{children}</body>
    </html>
  );
}
