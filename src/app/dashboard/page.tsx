'use client';

import { useEffect, useState } from 'react';
import { useAuthRedirect } from '@/lib/useAuthRedirect';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function DashboardPage() {
    useAuthRedirect(); 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch tasks
  useEffect(() => {
    if (!token) {
      alert('Please login first');
      return;
    }

    fetch('/api/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (res.ok) {
      setTasks((prev) => [data.task, ...prev]);
      setTitle('');
      setDescription('');
    } else {
      alert(data.message || 'Failed to create task');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Tasks</h1>

      {/* Create Task Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="border p-3 rounded">
            <strong>{task.title}</strong> — {task.completed ? '✅ Done' : '⏳ Pending'}
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
