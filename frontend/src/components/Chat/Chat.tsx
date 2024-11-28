'use client';

import { useForm } from 'react-hook-form';
import { ChatContent } from './ChatContent';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { type FC, useState } from 'react';

interface ChatProps {
  id: string;
  initialMessages?: { sender: 'ai' | 'user'; message: string; contextFiles?: string[] }[];
}

const defaultTopK = 10;

export const Chat: FC<ChatProps> = (props) => {
  const { initialMessages, id } = props;
  const [messages, setMessages] = useState(initialMessages ?? []);
  const [message, setMessage] = useState('');
  const { handleSubmit } = useForm<{ message: string }>();

  const onSendMessage = async () => {
    setMessages((messages) => [...messages, { message, sender: 'user' }]);
    setMessage('');
    const chat: { id: string; name: string; modelType: string; apiKey: string; apiUrl: string } =
      JSON.parse(localStorage.getItem('chats') ?? '[]').find(
        (chat: { id: string }) => chat.id.toString() === id,
      );

    const response = await fetch('http://backend:8000/query', {
      method: 'POST',
      body: JSON.stringify({
        query: message,
        api_type: chat.modelType,
        api_key: chat.apiKey,
        api_url: chat.apiUrl,
        top_k: defaultTopK,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return;
    }
    const responseData = await response.json();
    setMessages((messages) => [
      ...messages,
      { message: responseData.answer, contextFiles: responseData.contextFiles, sender: 'ai' },
    ]);
  };

  return (
    <div className="h-[calc(100vh-150px)]">
      <ChatContent>
        {messages?.map((message, i) => (
          <ChatMessage
            key={`${message.message}-${i}`}
            contextFiles={message.contextFiles}
            fallback={message.sender === 'ai' ? 'AI' : 'Вы'}
            orientation={message.sender === 'ai' ? 'left' : 'right'}
          >
            {message.message}
          </ChatMessage>
        ))}
      </ChatContent>
      <form onSubmit={handleSubmit(onSendMessage)}>
        <ChatInput
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </form>
    </div>
  );
};
