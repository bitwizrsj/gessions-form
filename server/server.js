import './config/env.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import formRoutes from './routes/forms.js';
import responseRoutes from './routes/responses.js';
import exportRoutes from './routes/exports.js';
import folderRoutes from './routes/folders.js';
import authRoutes from './routes/auth.js';
import integrationRoutes from './routes/integrations.js';
import uploadRoutes from './routes/upload.js';
import collabRoutes from './routes/collab.js';
import adminRoutes from './routes/admin.js';
import { createRateLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable X-Powered-By
app.disable('x-powered-by');

// Security: Standard HTTP Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// ✅ CORS: fixed origins + any extra origins from CORS_ORIGINS env var (comma-separated)
const BASE_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://forms-by-gessions.vercel.app',
  'https://forms.GESSIONStech.com',
  'https://nb0fzghw-5173.inc1.devtunnels.ms',
  'http://72.62.248.59',
];
const extraOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : [];
const allowedOrigins = [...new Set([...BASE_ORIGINS, ...extraOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: Rate Limiters
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});

const submissionLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many form submissions. Please slow down.'
});

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', submissionLimiter, responseRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Forms by Gessions API is running' });
});

// Centralized Error Handling Middleware (prevents stack trace leakage)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Internal Server Error'
    : err.message || 'An unexpected error occurred';
  res.status(status).json({ error: message });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

export default app;
