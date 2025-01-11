'use client';

import { useEffect, useState } from 'react';
import Loading from '@/app/ui/loading';
import Card from '@/app/ui/card';
import Button from '@/app/ui/button';
import { request } from '@/app/lib/api';
import { redirect } from 'next/navigation';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    request('logout', 'DELETE');
    redirect('/login');
  };

  useEffect(() => {
    const fetchSettingsData = async () => {
      setLoading(true);
      
      setLoading(false);
    };

    fetchSettingsData();
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <Card>
        <Button onClick={logout} size="xl">Logout</Button>
      </Card>
    </main>
  );
}
