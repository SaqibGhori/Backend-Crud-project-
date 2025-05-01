import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/middleware/auth';
import { Server } from 'socket.io';

export async function GET(request: NextRequest) {
  await dbConnect();

  const user = verifyToken(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const tasks = await Task.find({ userId: user.userId }).sort({ createdAt: -1 });

  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  await dbConnect();

  const user = verifyToken(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { title, description } = await request.json();

  const task = await Task.create({
    userId: user.userId,
    title,
    description,
    completed: false,
  });
  
  return NextResponse.json({ message: 'Task created', task });
}
