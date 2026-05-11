'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../src/context/AppContext';
import Layout from '../../src/components/Layout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/register');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
