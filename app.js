'use strict';

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'
});

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { apiLimiter } = require('./server/middleware/rateLimiter');

// Routes
const apiRoutes = require('./server/routes/api');
const authRoutes = require('./server/routes/auth');
const adminApiRoutes = require('./server/routes/adminApi');
const contactRoutes = require('./server/routes/contact');

const app = express();

// Plesk utilise Apache en reverse proxy devant Node — requis pour rate-limit et req.ip
app.set('trust proxy', 1);

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://voltea2.voilavoila.tv', 'https://voltea-energie.fr'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ─── Parsers ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// ─── Static Files ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true
}));

// Block access to sensitive paths
app.use(['/node_modules', '/.git', '/src', '/scripts', '/seed', '/server'], (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/articles', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminApiRoutes);
app.use('/api/contact', contactRoutes);

// ─── SPA Catch-all ───────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Une erreur est survenue.' : err.message;
  res.status(status).json({ error: message });
});

// ─── Start ───────────────────────────────────────────────────────────────────
// Toujours écouter — Passenger proxy vers ce port via $PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Voltea Énergie — port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
