'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-3xl font-bold text-center">🧠 Task Manager Dashboard</h1>
      <p className="text-gray-600 text-center max-w-md">
        This is your entry point to the full-stack task manager application. Choose where to go:
      </p>

      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push('/admin')}
          className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
        >
          Admin Panel
        </button>
      </div>
    </main>
  );
}
