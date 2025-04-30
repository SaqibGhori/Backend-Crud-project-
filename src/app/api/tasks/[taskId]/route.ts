import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/middleware/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  await dbConnect();

  const user = verifyToken(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { title, description, completed } = await request.json();

  const task = await Task.findOne({ _id: params.taskId, userId: user.userId });

  if (!task) {
    return NextResponse.json({ message: 'Task not found or not owned by user' }, { status: 404 });
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.completed = completed ?? task.completed;

  await task.save();

  return NextResponse.json({ message: 'Task updated successfully', task });
}
