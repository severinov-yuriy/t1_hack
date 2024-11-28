'use client';

import { useForm } from 'react-hook-form';
import { ChatContent } from './ChatContent';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { type FC, useState } from 'react';

interface ChatProps {
  id: string;
  initialMessages?: { sender: 'ai' | 'user'; message: string }[];
}
export const Chat: FC<ChatProps> = (props) => {
  const { id, initialMessages } = props;
  const [messages, setMessages] = useState(initialMessages);
  const { handleSubmit } = useForm<{ message: string }>();

  const onSendMessage = (data: { message: string }) => {
    // setMessages((messages) => [...messages, { message: data.message, sender: 'user' }]);
    // const response = await fetch('/api/chat/send', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     message: data.message,
    //     chatId: id,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    // const data = await response.json();
    // setMessages((messages) => [...messages, { message: data.message, sender: 'ai' }]);

    // if (!response.ok) {
    //   return;
    // }

    console.log(data, id, setMessages);
  };

  return (
    <div className="h-[calc(100vh-150px)]">
      <ChatContent>
        {messages?.map((message, i) => (
          <ChatMessage
            key={`${message.message}-${i}`}
            orientation={message.sender === 'ai' ? 'left' : 'right'}
          >
            {message.message}
          </ChatMessage>
        ))}
      </ChatContent>
      <form onSubmit={handleSubmit(onSendMessage)}>
        <ChatInput />
      </form>
    </div>
  );
};
