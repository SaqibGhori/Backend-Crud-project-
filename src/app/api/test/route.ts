import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: 'MongoDB connected successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Connection failed' }, { status: 500 });
  }
}
