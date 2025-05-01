import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socketUrl =  'https://backend-crud-project-2bev-lrygy5w2o-saqibs-projects-20f58ce3.vercel.app/';
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
