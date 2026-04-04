const { Server } = require('socket.io');
const env = require('./env');
const logger = require('../shared/utils/logger');

let io = null;

/**
 * Initialize Socket.io server
 * @param {import('http').Server} httpServer
 * @returns {Server}
 */
const initializeSocket = (httpServer) => {
  const jwt = require('jsonwebtoken');
  const User = require('../modules/user/user.model');

  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGINS,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware for Authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.displayName} (${socket.id})`);

    // User joins their own room for notifications
    socket.join(socket.user._id.toString());

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      logger.info(`User ${socket.user.displayName} joined conversation: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      logger.info(`User ${socket.user.displayName} left conversation: ${conversationId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} - ${reason}`);
    });
  });

  logger.info('Socket.io initialized');
  return io;
};

/**
 * Get Socket.io instance
 * @returns {Server}
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
