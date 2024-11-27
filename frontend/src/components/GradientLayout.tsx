'use client';

import { type FC, type ReactNode, useEffect, useState } from 'react';

interface GradientLayoutProps {
  children?: ReactNode;
  className?: string;
}

export const GradientLayout: FC<GradientLayoutProps> = (props) => {
  const { className, children } = props;
  const [{ x, y }, setMousePosition] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMousePosition({ x: Math.round((e.pageX / w) * 100), y: Math.round((e.pageY / h) * 100) });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        background: `radial-gradient(at ${x}% ${y}%, hsl(0, 0%, 29%), hsl(var(--background)))`,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
