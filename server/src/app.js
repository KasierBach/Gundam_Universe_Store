const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const env = require('./config/env');
const { apiLimiter } = require('./shared/middlewares/rateLimiter.middleware');
const { errorHandler } = require('./shared/middlewares/errorHandler.middleware');
const logger = require('./shared/utils/logger');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const categoryRoutes = require('./modules/product/category.routes');
const productRoutes = require('./modules/product/product.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const orderRoutes = require('./modules/order/order.routes');
const reviewRoutes = require('./modules/review/review.routes');
const tradeRoutes = require('./modules/trade/trade.routes');
const chatRoutes = require('./modules/chat/chat.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const wishlistRoutes = require('./modules/wishlist/wishlist.routes');
const sellerRoutes = require('./modules/seller/seller.routes');
const reportRoutes = require('./modules/report/report.routes');
const notificationRoutes = require('./modules/notification/notification.routes');



const app = express();

// ============ GENERAL MIDDLEWARES ============
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression()); // Gzip compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============ SECURITY MIDDLEWARES ============
app.use(helmet()); // Security headers
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  next();
}); // Prevent NoSQL injection in body safely for Express 5
app.use(hpp()); // Prevent HTTP parameter pollution

// Logging
if (env.isDevelopment()) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// ============ RATE LIMITING ============
app.use('/api', apiLimiter);

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);



// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Gundam Universe API is running 🤖', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ============ ERROR HANDLER (must be last) ============
app.use(errorHandler);

module.exports = app;
