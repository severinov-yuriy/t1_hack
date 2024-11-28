'use client';
import { type FC, useEffect, useLayoutEffect, useState } from 'react';

import style from './ChatList.module.scss';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { router } from '@/lib/router';

export const ChatList = () => {
  const [chats, setChats] = useState<Array<{ id: string; name: string }>>([]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('chats') ?? '[]');
    setChats(data);
  }, []);
  return (
    <div className="flex flex-wrap gap-4">
      {chats.map((chat) => (
        <Link key={chat.id} href={router.chat(chat.id)}>
          <Card className="flex items-center justify-center h-10 w-10">{chat.name}</Card>
        </Link>
      ))}
      <Link href={router.newChat()}>
        <Card className="flex items-center justify-center h-10 w-10">
          <Plus size="24" />
        </Card>
      </Link>
    </div>
  );
};
