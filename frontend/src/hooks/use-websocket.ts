'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const tokens = useAuthStore((state) => state.tokens);

  useEffect(() => {
    if (!tokens?.accessToken) return;

    const socket = io(WS_URL, {
      auth: { token: tokens.accessToken },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[WS] Connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
    });

    socket.on('error', (error) => {
      console.error('[WS] Error:', error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [tokens?.accessToken]);

  const subscribe = useCallback((channel: string, event: string, handler: (data: any) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};

    const room = `${channel}:join`;
    socket.emit(room, event);
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { subscribe, emit, socket: socketRef.current };
}
