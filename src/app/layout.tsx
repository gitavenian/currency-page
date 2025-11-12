import type { Metadata } from 'next';

import './globals.css'; 

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
      <body>
        {children}
      </body>
    </html>
  );
}