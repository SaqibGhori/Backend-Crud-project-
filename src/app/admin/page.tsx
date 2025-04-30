'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/useSocket';
import { useAuthRedirect } from '@/lib/useAuthRedirect';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  useAuthRedirect();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const socket = useSocket();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must log in as admin');
      return;
    }

    fetch('/api/admin/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []));

    fetch('/api/admin/overdue-tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOverdueTasks(data.overdue || []));

    if (!socket) return;

    socket.on('newTask', (task: Task) => {
      console.log('🆕 New Task:', task);
      setTasks((prev) => [task, ...prev]);
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      console.log('🔁 Task Updated:', updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    return () => {
      socket.off('newTask');
      socket.off('taskUpdated');
    };
  }, [socket]);

  return (
    <div className="p-6 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-4">👑 Admin Task Feed (Live)</h1>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task._id} className="border p-3 rounded">
              <strong>{task.title}</strong> — {task.completed ? '✅ Done' : '⏳ Pending'}
              <p>{task.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-10 mb-3">🕒 Overdue Tasks (24+ hrs)</h2>
        {overdueTasks.length === 0 ? (
          <p className="text-green-600">🎉 No overdue tasks</p>
        ) : (
          <ul className="space-y-3">
            {overdueTasks.map((task) => (
              <li key={task._id} className="border p-3 rounded bg-red-50">
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
