'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthRedirect } from '@/lib/useAuthRedirect';

export default function RegisterPage() {
    useAuthRedirect();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Account created! Now log in.');
      router.push('/login');
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">📝 Sign Up for an Account</h1>

      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={() => router.push('/login')}
        className="text-sm text-blue-600 underline"
      >
        Already have an account? Log in →
      </button>

      <button
        onClick={() => router.push('/')}
        className="mt-2 text-gray-500 underline text-sm"
      >
        ← Back to Home
      </button>
    </main>
  );
}
