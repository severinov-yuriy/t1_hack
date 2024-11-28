import type { ComponentPropsWithRef, FC } from 'react';

import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps extends ComponentPropsWithRef<typeof Input> {
  className?: string;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
  const { className, ...otherProps } = props;

  return (
    <div className={cn('relative mb-4', className)}>
      <Input placeholder="Напишите сообщение" {...otherProps} />
      <Button className="absolute right-1 top-1/2 -translate-y-1/2" variant="link">
        <SendHorizonal />
      </Button>
    </div>
  );
};
