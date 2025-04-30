'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const isLoggedIn = Boolean(token);

    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isProtectedPage = pathname === '/dashboard' || pathname === '/admin';

    if (!isLoggedIn && isProtectedPage) {
      router.push('/login');
    }

    if (isLoggedIn && isAuthPage) {
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [pathname, router]);
}
