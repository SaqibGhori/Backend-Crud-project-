import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/middleware/auth';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params;

  await dbConnect();

  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, completed } = await req.json();

  const task = await Task.findOne({ _id: taskId, userId: user.userId });

  if (!task) {
    return NextResponse.json({ message: 'Task not found or not owned by user' }, { status: 404 });
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.completed = completed ?? task.completed;

  await task.save();

  return NextResponse.json({ message: 'Task updated successfully', task });
}
