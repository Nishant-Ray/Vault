'use client';

import { useEffect, useState } from 'react';
import Loading from '@/app/ui/loading';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChatbotData = async () => {
      setLoading(true);
      
      setLoading(false);
    };

    fetchChatbotData();
  }, []);

  if (loading) return <Loading/>;
  
  return (
    <main>
      <h1>Chatbot page.</h1>
    </main>
  );
}
