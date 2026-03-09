'use strict';

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '../.env.prod' : '../.env.dev'
});

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   Voltea Énergie — Créer un admin     ║');
  console.log('╚═══════════════════════════════════════╝\n');

  const name = await ask('Nom affiché : ');
  const email = await ask('Email : ');
  const password = await ask('Mot de passe (min 12 caractères) : ');

  if (password.length < 12) {
    console.error('\n✗ Le mot de passe doit faire au moins 12 caractères.');
    process.exit(1);
  }

  rl.close();

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Create tables if needed
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
      email         VARCHAR(255)    NOT NULL,
      password_hash VARCHAR(255)    NOT NULL,
      name          VARCHAR(100)    NOT NULL DEFAULT 'Admin',
      created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_admins_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
      admin_id    INT UNSIGNED    NOT NULL,
      token_hash  VARCHAR(255)    NOT NULL,
      expires_at  TIMESTAMP       NOT NULL,
      created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_refresh_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
      title         VARCHAR(500)    NOT NULL,
      slug          VARCHAR(500)    NOT NULL,
      excerpt       TEXT,
      content       LONGTEXT        NOT NULL,
      image_url     VARCHAR(255)    DEFAULT NULL,
      category      VARCHAR(100)    DEFAULT 'Actualité',
      is_published  TINYINT(1)      NOT NULL DEFAULT 0,
      published_at  TIMESTAMP       NULL DEFAULT NULL,
      created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_articles_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const hash = await bcrypt.hash(password, 12);

  const [existing] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
  if (existing.length) {
    await db.query('UPDATE admins SET password_hash=?, name=? WHERE email=?', [hash, name, email]);
    console.log(`\n✓ Compte admin mis à jour : ${email}`);
  } else {
    await db.query('INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)', [email, hash, name]);
    console.log(`\n✓ Compte admin créé : ${email}`);
  }

  await db.end();
  console.log('✓ Terminé. Connectez-vous sur /admin\n');
}

main().catch(err => {
  console.error('\n✗ Erreur:', err.message);
  process.exit(1);
});
