'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const hideHeader = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
}
