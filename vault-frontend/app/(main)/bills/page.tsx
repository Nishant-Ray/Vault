'use client';

import { useEffect, useState } from 'react';
import Loading from '@/app/ui/loading';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBillsData = async () => {
      setLoading(true);
      
      setLoading(false);
    };

    fetchBillsData();
  }, []);

  if (loading) return <Loading/>;

  return (
    <main>
      <h1>Bills page.</h1>
    </main>
  );
}
