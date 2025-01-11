'use client';

import { useEffect, useState } from 'react';
import Loading from '@/app/ui/loading';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResidenceData = async () => {
      setLoading(true);
      
      setLoading(false);
    };

    fetchResidenceData();
  }, []);

  if (loading) return <Loading/>;
  
  return (
    <main>
      <h1>Residence page.</h1>
    </main>
  );
}
