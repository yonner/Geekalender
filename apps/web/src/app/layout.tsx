import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Geekalender',
  description: 'A calendar of geek-culture events and dates.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/">Geekalender</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
