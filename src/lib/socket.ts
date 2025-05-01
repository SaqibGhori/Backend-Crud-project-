// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

const socket: Socket = io(socketUrl, {
  autoConnect: false, // so you control when it connects
});

export default socket;
