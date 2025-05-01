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
    <div className="mt-10">
    <h2 className="text-lg font-bold mb-4 text-red-500">⏰ Overdue Tasks (24+ hrs)</h2>
    <ul className="space-y-4">
      {overdueTasks.map((task) => (
        <li
          key={task._id}
          className="bg-white dark:bg-red-100 text-black dark:text-gray-800 p-4 rounded-lg shadow-md border-l-4 border-red-500"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">{task.title}</h3>
            <span className="text-sm text-red-600 font-medium">
              {task.completed ? '✅ Completed' : '❗ Pending'}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{task.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            <strong>Created:</strong>{' '}
            {new Date(task.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </li>
      ))}
    </ul>
  </div>
  
  );
}
