import type { Metadata } from 'next';
import { AppProvider } from '../src/context/AppContext';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Stray Stories',
  description: '每一个生命都值得被讲述',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
