import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  await dbConnect();

  const user = verifyToken(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Access denied. Admins only.' }, { status: 403 });
  }

  const tasks = await Task.find().sort({ createdAt: -1 });

  return NextResponse.json({ tasks });
}
