import { cn } from '@/lib/utils';
import type { FC, ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader } from '../ui/card';

interface ChatMessageProps {
  avatar?: string;
  children: ReactNode;
  className?: string;
  contextFiles?: string[];
  fallback?: string;
  orientation?: 'left' | 'right';
}

export const ChatMessage: FC<ChatMessageProps> = (props) => {
  const { className, children, avatar, fallback, orientation, contextFiles } = props;

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        orientation === 'right' ? `flex-row-reverse` : ' flex-row',
        className,
      )}
    >
      <Avatar>
        {avatar && <AvatarImage src={avatar} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <Card className="w-fit max-w-2/3 h-fit">
        {contextFiles && contextFiles.length > 0 && (
          <CardHeader>
            {contextFiles.map(
              (file) => `${file.split('\\\\').at(-2)}/${file.split('\\\\').at(-1)}`,
            )}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
