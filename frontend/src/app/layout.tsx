import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';
import Link from 'next/link';
import { MainContainer } from '@/components/MainContainer';
import { Button } from '@/components/ui/button';
import { router } from '@/lib/router';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html className="h-full" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full dark`}>
        <header className="flex justify-center items-center border-b border-border bg-transparent px-4 py-2 backdrop-blur">
          <MainContainer className="flex justify-center gap-7 flex-1">
            <Link className="text-2xl font-bold tracking-tight" href="/">
              Home
            </Link>
            <Link className="text-2xl font-bold tracking-tight" href={router.newChat()}>
              Новый чат
            </Link>
            <Link className="text-2xl font-bold tracking-tight" href="/">
              Get started
            </Link>
            <Link className="text-2xl font-bold tracking-tight" href="/">
              About
            </Link>
          </MainContainer>
          <Button variant="outline">
            <Link href={router.signIn()}>Sign in</Link>
          </Button>
        </header>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
