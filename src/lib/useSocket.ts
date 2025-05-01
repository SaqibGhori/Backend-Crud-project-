// src/hooks/useSocket.ts
import { useEffect } from 'react';
import socket from './socket';

export function useSocket() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log('🌐 Connecting to Socket.IO...');
    }

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.warn('🔌 Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err);
    });

    return () => {
      // You can remove listeners but don’t disconnect globally
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  return socket;
}
