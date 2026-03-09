'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { loginLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth');

const REFRESH_COOKIE = 'vt_refresh';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

function generateTokens(admin) {
  const accessToken = jwt.sign(
    { sub: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return { accessToken, refreshToken };
}

// POST /api/auth/login
router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ max: 128 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Identifiants invalides.' });

  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT id, email, password_hash, name FROM admins WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Identifiants incorrects.' });

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Identifiants incorrects.' });

    const { accessToken, refreshToken } = generateTokens(admin);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.query(
      'INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [admin.id, tokenHash, expiresAt]
    );

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTS);
    res.json({ accessToken, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE];
  if (!refreshToken) return res.status(401).json({ error: 'Session expirée.' });

  try {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const [rows] = await db.query(
      `SELECT rt.id, rt.admin_id, rt.expires_at, a.email, a.name
       FROM refresh_tokens rt JOIN admins a ON a.id = rt.admin_id
       WHERE rt.token_hash = ? AND rt.expires_at > NOW()`,
      [tokenHash]
    );

    if (!rows.length) {
      res.clearCookie(REFRESH_COOKIE);
      return res.status(401).json({ error: 'Session invalide.' });
    }

    const row = rows[0];
    const admin = { id: row.admin_id, email: row.email, name: row.name };
    const { accessToken, refreshToken: newRefresh } = generateTokens(admin);
    const newHash = crypto.createHash('sha256').update(newRefresh).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.query('DELETE FROM refresh_tokens WHERE id = ?', [row.id]);
    await db.query(
      'INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [admin.id, newHash, expiresAt]
    );

    res.cookie(REFRESH_COOKIE, newRefresh, COOKIE_OPTS);
    res.json({ accessToken, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE];
  if (refreshToken) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await db.query('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]).catch(() => {});
  }
  res.clearCookie(REFRESH_COOKIE);
  res.json({ message: 'Déconnecté.' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
