const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const deliveryRoutes = require('./routes/delivery');
const cartRoutes = require('./routes/cart');
const restaurant = require('./routes/restaurant');
const payoutRoutes = require('./routes/payout');
const couponRoutes = require('./routes/coupon');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://whimsical-horse-437514.netlify.app"
    ],
    credentials: true
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Performance Middlewares
app.use(compression());
app.use(morgan('combined')); // Production-grade logging

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/restaurants', restaurant);
app.use('/api/payouts', payoutRoutes);
app.use('/api/coupons', couponRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'up', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[Error] ${err.message}`, !isProduction ? err.stack : '');

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(!isProduction && { stack: err.stack })
  });
});

module.exports = app;
