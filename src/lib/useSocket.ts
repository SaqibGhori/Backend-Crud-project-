import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
      socketRef.current = io(socketUrl);

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected:', socketRef.current?.id);
      });
      
      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
      });
      
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}
