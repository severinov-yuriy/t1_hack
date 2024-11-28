'use client';

import { type FC, type ReactNode, useLayoutEffect, useRef } from 'react';

import { Card, CardContent } from '../ui/card';

interface ChatContentProps {
  children?: ReactNode;
}
export const dynamic = 'force-dynamic';

export const ChatContent: FC<ChatContentProps> = (props) => {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, []);

  return (
    <Card ref={ref} className="h-full my-3 py-3 overflow-scroll">
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
};
