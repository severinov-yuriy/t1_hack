import type { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MainContainerProps {
  children?: ReactNode;
  className?: string;
}

export const MainContainer: FC<MainContainerProps> = (props) => {
  const { className, children } = props;

  return <div className={cn('max-w-7xl', className)}>{children}</div>;
};
