-- Voltea Énergie — Schéma MySQL
-- Encodage : utf8mb4

CREATE DATABASE IF NOT EXISTS voltea_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE voltea_db;

-- ─── Admins ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  name          VARCHAR(100)    NOT NULL DEFAULT 'Admin',
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Refresh Tokens ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  admin_id    INT UNSIGNED    NOT NULL,
  token_hash  VARCHAR(255)    NOT NULL,
  expires_at  TIMESTAMP       NOT NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_refresh_admin (admin_id),
  KEY idx_refresh_expires (expires_at),
  CONSTRAINT fk_refresh_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Articles ────────────────────────────────────────────────────────────────
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
  UNIQUE KEY uq_articles_slug (slug),
  KEY idx_articles_published (is_published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
