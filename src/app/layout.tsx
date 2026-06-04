import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio - Personal Site',
  description: 'A minimal, Apple-style personal portfolio built with Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
