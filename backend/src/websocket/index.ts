import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../services/prisma';

interface AuthenticatedSocket {
  userId: string;
  organizationId: string;
  userRole: string;
}

let io: SocketServer;

export function initWebSocket(httpServer: HTTPServer) {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token as string, config.jwt.secret) as any;
      (socket as any).userId = decoded.userId;
      (socket as any).organizationId = decoded.organizationId;
      (socket as any).userRole = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { userId, organizationId } = socket as unknown as AuthenticatedSocket;
    socket.join(`org:${organizationId}`);

    socket.on('conversation:join', async (conversationId: string) => {
      const canAccess = await canAccessConversation(conversationId, organizationId);
      if (canAccess) {
        socket.join(`conversation:${conversationId}`);
      } else {
        socket.emit('error', { message: 'Access denied to this conversation' });
      }
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('chatbot:subscribe', async (chatbotId: string) => {
      const canAccess = await canAccessChatbot(chatbotId, organizationId);
      if (canAccess) {
        socket.join(`chatbot:${chatbotId}`);
      } else {
        socket.emit('error', { message: 'Access denied to this chatbot' });
      }
    });

    socket.on('disconnect', () => {});
  });

  return io;
}

async function canAccessConversation(conversationId: string, organizationId: string): Promise<boolean> {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { chatbot: { select: { organizationId: true } } },
    });
    return conversation?.chatbot?.organizationId === organizationId;
  } catch {
    return false;
  }
}

async function canAccessChatbot(chatbotId: string, organizationId: string): Promise<boolean> {
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      select: { organizationId: true },
    });
    return chatbot?.organizationId === organizationId;
  } catch {
    return false;
  }
}

export function getIO(): SocketServer {
  if (!io) throw new Error('WebSocket not initialized');
  return io;
}

export function emitToOrganization(orgId: string, event: string, data: any) {
  io?.to(`org:${orgId}`).emit(event, data);
}

export function emitToConversation(conversationId: string, event: string, data: any) {
  io?.to(`conversation:${conversationId}`).emit(event, data);
}

export function emitToChatbot(chatbotId: string, event: string, data: any) {
  io?.to(`chatbot:${chatbotId}`).emit(event, data);
}
