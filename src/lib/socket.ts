import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: IOServer | null = null;

export function initSocket(server: HTTPServer) {
  if (!io) {
    io = new IOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
    });
  }

  return io;
}

export function getIO(): IOServer {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
