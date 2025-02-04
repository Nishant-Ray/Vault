'use client';

import { useEffect, useRef, useState } from 'react';
import Loading from '@/app/ui/loading';
import IconButton from '@/app/ui/iconButton';
import Card from '@/app/ui/card';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { shimmer } from '@/app/lib/constants';
import { ChatbotMessage } from '@/app/lib/definitions';
import { fetchChatbotMessages, createChatbotMessage } from '@/app/lib/data';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [chatbotMessages, setChatbotMessages] = useState<ChatbotMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleResidenceMessageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentMessage(event.currentTarget.value);
  };

  const handleChatbotMessageSend = async () => {
    const messages = [...chatbotMessages];

    const lastId = chatbotMessages.length > 0 ? chatbotMessages[chatbotMessages.length - 1].id : 0;
    const newUserMessage: ChatbotMessage = {
      id: lastId + 1,
      content: currentMessage,
      from_user: true,
      user_id: 0,
      created_at: '',
      updated_at: ''
    };
    const newChatbotMessage: ChatbotMessage = {
      id: lastId + 2,
      content: 'Chatbot is typing...',
      from_user: false,
      user_id: 0,
      created_at: '',
      updated_at: ''
    };
    
    setCurrentMessage('');
    setChatbotMessages([...chatbotMessages, newUserMessage, newChatbotMessage]);

    const data = await createChatbotMessage(currentMessage);
    if (data) {
      setChatbotMessages([...messages, data.user_message, data.chatbot_message]);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [chatbotMessages]);

  useEffect(() => {
    document.title = 'Chatbot | Vault';

    const fetchChatbotData = async () => {
      setLoading(true);

      const fetchedChatbotMessages = await fetchChatbotMessages();
      if (fetchedChatbotMessages) setChatbotMessages(fetchedChatbotMessages);
      
      setLoading(false);
    };

    fetchChatbotData();
  }, []);

  if (loading) return <Loading/>;
  
  return (
    <main>
      <Card>
        <h3 className="text-lg font-medium text-off_black">Chatbot</h3>
        <div className="mt-2 flex flex-col bg-off_white p-4 rounded-xl">
          <>
            {chatbotMessages.length ? (
              <div className="flex flex-col gap-4 pr-4 pb-4 items-start h-[27rem] overflow-y-auto" ref={containerRef}>
                {chatbotMessages.map((message) => {
                  return (
                    <div key={message.id} className={clsx({"self-end": message.from_user})}>
                      { !message.from_user && <p className="ml-3 mb-1 text-xs font-normal text-off_gray">Chatbot</p> }
                      <div className={clsx("max-w-3xl rounded-3xl px-4 py-2 overflow-hidden break-words",
                        {
                          "bg-white text-off_black": !message.from_user,
                          "bg-accent text-white": message.from_user
                        }
                      )}>
                        <p className={clsx("text-md font-normal",
                          {
                            "italic": message.content === 'Chatbot is typing...'
                          }
                        )}>{message.content}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef}/>
              </div>
            ) : (
              <div className="h-96"/>
            )}
          </>
          <form onSubmit={e => {e.preventDefault(); handleChatbotMessageSend();}} className="flex flex-row items-center gap-2 h-8">
            <input className="rounded-full bg-white border border-gray-200 w-full px-4 py-1 focus-visible:outline-none focus:border-gray-300 text-sm text-off_black font-normal" type="text" placeholder="Enter message" value={currentMessage} onChange={handleResidenceMessageChange}/>
            <IconButton className="h-8" icon={PaperAirplaneIcon} onClick={handleChatbotMessageSend}/>
          </form>
        </div>
      </Card>
    </main>
  );
}
