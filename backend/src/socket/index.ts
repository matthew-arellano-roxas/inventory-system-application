import { Server } from 'socket.io';
import http from 'http';
import { logger, serverConfig } from '@/config';

let io: Server; // shared instance

export function initSocketServer(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: serverConfig.ALLOWED_ORIGIN, // your frontend URL
      methods: ['GET', 'POST'],
      credentials: true, // optional if you need cookies
    },
  });

  io.on('connection', (socket) => {
    logger.info('User connected:', socket.id);

    socket.on('disconnect', () => {
      logger.info('User disconnected:', socket.id);
    });
  });

  return io;
}

// Accessor for other modules/services
export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
