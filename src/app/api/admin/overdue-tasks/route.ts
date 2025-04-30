import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); 

  const overdueTasks = await Task.find({
    completed: false,
    createdAt: { $lt: cutoff },
  });

  return NextResponse.json({ overdue: overdueTasks });
}
