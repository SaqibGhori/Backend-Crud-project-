'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(savedRole || '');
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <header className="w-full px-6 py-3 flex items-center justify-between border-b shadow-sm">
      <h1
        onClick={() => router.push('/')}
        className="text-xl font-bold cursor-pointer"
      >
        🧠 Task Manager
      </h1>

      <nav className="flex gap-4 items-center">
        {isLoggedIn && (
          <>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 underline"
            >
              Dashboard
            </button>

            {role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="text-purple-600 underline"
              >
                Admin
              </button>
            )}

            <button
              onClick={logout}
              className="text-red-600 underline font-medium"
            >
              Logout
            </button>
          </>
        )}

        {!isLoggedIn && (
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 underline"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
