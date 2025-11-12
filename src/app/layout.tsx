import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import the Inter font

import './globals.css'; 

const inter = Inter({ subsets: ['latin'] }); // Initialize the font

export const metadata: Metadata = {
  title: 'Next.js Currency Viewer',
  description: 'View real-time and historical exchange rates powered by Alpha Vantage.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}