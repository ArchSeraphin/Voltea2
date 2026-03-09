'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/articles — liste des articles publiés
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 6);
    const offset = (page - 1) * limit;
    const category = req.query.category || null;

    let query = `SELECT id, title, slug, excerpt, image_url, category, published_at
                 FROM articles WHERE is_published = 1`;
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM articles WHERE is_published = 1${category ? ' AND category = ?' : ''}`,
      category ? [category] : []
    );

    res.json({ articles: rows, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/articles/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, slug, excerpt, content, image_url, category, published_at
       FROM articles WHERE slug = ? AND is_published = 1`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Article introuvable.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
