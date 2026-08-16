import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import menuRoutes from './routes/menu.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import orderRoutes from './routes/order.routes.js';
import { globalApiLimiter, sanitizeInputs, requestLogger } from './middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows CDN scripts (Tailwind, Lucide, Google Fonts) for the integrated frontend
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(requestLogger);
app.use(sanitizeInputs);
app.use('/api', globalApiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'Bistro & Stack / Bistro & Slice Delivery Engine'
  });
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);

// Serve static frontend files
app.use(express.static(ROOT_DIR));

// Default root redirect to burger_delivery_hub.html
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'burger_delivery_hub.html'));
});

// 404 API Not Found Handler
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API Endpoint "${req.method} ${req.originalUrl}" does not exist.`
  });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Server error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🔥 =================================================`);
  console.log(`🚀 BISTRO & STACK REST API SERVER RUNNING!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Security: Helmet, CORS, Rate Limiters Active`);
  console.log(`📂 Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/menu?mode=burger|pizza`);
  console.log(`   - POST /api/coupons/validate`);
  console.log(`   - POST /api/orders`);
  console.log(`   - GET  /api/orders/:orderId/track`);
  console.log(`=================================================\n`);
});
