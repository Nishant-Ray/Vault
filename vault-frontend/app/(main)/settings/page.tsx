'use client';

import Card from '@/app/ui/card';
import Button from '@/app/ui/button';
import { request } from '@/app/lib/api';
import { redirect } from 'next/navigation';

export default function Page() {

  const logout = () => {
    request('logout', 'DELETE');
    redirect('/login');
  };

  return (
    <main>
      <Card>
        <Button onClick={logout} size="xl">Logout</Button>
      </Card>
    </main>
  );
}
