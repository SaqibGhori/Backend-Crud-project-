import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

let io: SocketIOServer | undefined;

export async function GET() {
  if (!io) {
    
    // @ts-ignore

    const res = globalThis as any;

    if (!res.server) {
      return NextResponse.json({ message: 'No server found' }, { status: 500 });
    }

    io = new SocketIOServer(res.server, {
      path: '/socket.io',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('✅ Socket connected:', socket.id);
    });

    (global as any).io = io;
  }

  return NextResponse.json({ message: 'Socket.IO initialized' });
}
