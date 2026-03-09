'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { body, param, validationResult } = require('express-validator');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// Toutes les routes admin requièrent l'authentification
router.use(requireAuth);

// ─── Upload Configuration ─────────────────────────────────────────────────
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Type de fichier non autorisé.'));
  }
});

// Génère un slug à partir d'un titre
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Articles ────────────────────────────────────────────────────────────────

// GET /api/admin/articles
router.get('/articles', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT id, title, slug, category, is_published, published_at, created_at, updated_at
       FROM articles ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM articles');
    res.json({ articles: rows, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/admin/articles/:id
router.get('/articles/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Article introuvable.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/admin/articles
router.post('/articles', upload.single('image'), [
  body('title').trim().notEmpty().isLength({ max: 500 }),
  body('content').trim().notEmpty(),
  body('excerpt').trim().optional().isLength({ max: 1000 }),
  body('category').trim().optional().isLength({ max: 100 }),
  body('is_published').optional().isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, content, excerpt, category, is_published } = req.body;
    let slug = slugify(title);

    // Ensure slug uniqueness
    const [existing] = await db.query('SELECT id FROM articles WHERE slug LIKE ?', [`${slug}%`]);
    if (existing.length) slug = `${slug}-${Date.now()}`;

    const published = is_published === 'true' || is_published === true || is_published === '1';
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO articles (title, slug, excerpt, content, image_url, category, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt || null, content, image_url, category || 'Actualité', published ? 1 : 0,
       published ? new Date() : null]
    );

    res.status(201).json({ id: result.insertId, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// PUT /api/admin/articles/:id
router.put('/articles/:id', upload.single('image'), [
  body('title').trim().notEmpty().isLength({ max: 500 }),
  body('content').trim().notEmpty(),
  body('excerpt').trim().optional().isLength({ max: 1000 }),
  body('category').trim().optional().isLength({ max: 100 }),
  body('is_published').optional().isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Article introuvable.' });

    const { title, content, excerpt, category, is_published } = req.body;
    const published = is_published === 'true' || is_published === true || is_published === '1';
    const prev = existing[0];

    let image_url = prev.image_url;
    if (req.file) {
      // Remove old file
      if (prev.image_url) {
        const oldPath = path.join(UPLOAD_DIR, path.basename(prev.image_url));
        fs.unlink(oldPath, () => {});
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const publishedAt = published
      ? (prev.is_published ? prev.published_at : new Date())
      : null;

    await db.query(
      `UPDATE articles SET title=?, excerpt=?, content=?, image_url=?, category=?, is_published=?, published_at=?
       WHERE id=?`,
      [title, excerpt || null, content, image_url, category || 'Actualité', published ? 1 : 0, publishedAt, id]
    );

    res.json({ message: 'Article mis à jour.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// DELETE /api/admin/articles/:id
router.delete('/articles/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT image_url FROM articles WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Article introuvable.' });

    if (rows[0].image_url) {
      const imgPath = path.join(UPLOAD_DIR, path.basename(rows[0].image_url));
      fs.unlink(imgPath, () => {});
    }

    await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Article supprimé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// PATCH /api/admin/articles/:id/publish
router.patch('/articles/:id/publish', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT is_published FROM articles WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Article introuvable.' });

    const newStatus = rows[0].is_published ? 0 : 1;
    await db.query(
      'UPDATE articles SET is_published=?, published_at=? WHERE id=?',
      [newStatus, newStatus ? new Date() : null, req.params.id]
    );

    res.json({ is_published: !!newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
