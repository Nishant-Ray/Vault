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
    document.title = 'Settings | Vault';

    const fetchSettingsData = async () => {
      setLoading(true);
      
      setLoading(false);
    };

    fetchSettingsData();
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <Card className="w-2/5">
        <h3 className="text-lg font-medium text-off_black mb-4">Account Settings</h3>
        <Button onClick={logout} size="md">Logout</Button>
      </Card>
    </main>
  );
}
