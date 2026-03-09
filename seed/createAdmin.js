'use strict';

const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '..', process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev')
});

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// ─── Compte de test ───────────────────────────────────────────
const TEST_ADMIN = {
  name:     'Admin Test',
  email:    'admin@voltea-energie.fr',
  password: 'Voltea2025!'
};

async function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   Voltea Énergie — Init base de données║');
  console.log('╚═══════════════════════════════════════╝\n');

  const db = await mysql.createConnection({
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('✓ Connecté à MySQL');

  // ─── Création des tables ──────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
      email         VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name          VARCHAR(100) NOT NULL DEFAULT 'Admin',
      created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_admins_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
      admin_id    INT UNSIGNED NOT NULL,
      token_hash  VARCHAR(255) NOT NULL,
      expires_at  TIMESTAMP    NOT NULL,
      created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_refresh_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title         VARCHAR(500) NOT NULL,
      slug          VARCHAR(500) NOT NULL,
      excerpt       TEXT,
      content       LONGTEXT     NOT NULL,
      image_url     VARCHAR(255) DEFAULT NULL,
      category      VARCHAR(100) DEFAULT 'Actualité',
      is_published  TINYINT(1)   NOT NULL DEFAULT 0,
      published_at  TIMESTAMP    NULL DEFAULT NULL,
      created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_articles_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('✓ Tables créées (ou déjà existantes)');

  // ─── Compte admin ─────────────────────────────────────────
  const hash = await bcrypt.hash(TEST_ADMIN.password, 12);
  const [existing] = await db.query('SELECT id FROM admins WHERE email = ?', [TEST_ADMIN.email]);

  if (existing.length) {
    await db.query('UPDATE admins SET password_hash=?, name=? WHERE email=?', [hash, TEST_ADMIN.name, TEST_ADMIN.email]);
    console.log(`✓ Compte admin mis à jour`);
  } else {
    await db.query('INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)', [TEST_ADMIN.email, hash, TEST_ADMIN.name]);
    console.log(`✓ Compte admin créé`);
  }

  await db.end();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Email    : ${TEST_ADMIN.email}`);
  console.log(`  Password : ${TEST_ADMIN.password}`);
  console.log(`  URL      : /admin/login`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  Pensez à changer ce mot de passe en production !\n');
}

main().catch(err => {
  console.error('\n✗ Erreur:', err.message);
  console.error('  → Vérifiez vos credentials MySQL dans .env.dev\n');
  process.exit(1);
});
