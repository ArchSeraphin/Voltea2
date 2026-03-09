# Voltea Énergie — Site vitrine + Dashboard Admin

## Stack technique

- **Backend** : Express.js (Node.js 18+) — compatible Passenger (Plesk)
- **Frontend** : React 18 (Vite, SPA)
- **Base de données** : MySQL 8
- **Sécurité** : Helmet, bcryptjs, JWT, express-rate-limit, express-validator

---

## Installation sur Plesk

### 1. Cloner le dépôt
```bash
git clone https://github.com/ArchSeraphin/Voltea2.git
cd Voltea2
```

### 2. Créer les fichiers .env
```bash
cp .env.example .env.dev
nano .env.dev  # Remplir les variables
```

Variables obligatoires à renseigner :
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (64+ caractères aléatoires)
- `JWT_REFRESH_SECRET` (64+ caractères aléatoires)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`

Générer des secrets JWT :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Configurer MySQL dans Plesk
1. Créer une base de données dans Plesk → Bases de données
2. Créer un utilisateur MySQL dédié
3. Renseigner les credentials dans `.env.dev` / `.env.prod`

### 4. Installer les dépendances et builder
```bash
npm install
npm run build   # Installe les dépendances client + build React
```

### 5. Créer le premier compte admin
```bash
cd seed && node createAdmin.js
```

### 6. Configurer l'application Node.js dans Plesk
1. Aller dans **Domaines → voltea2.voilavoila.tv → Node.js**
2. Activer Node.js
3. **Startup file** : `app.js`
4. **Application mode** : `production`
5. **Document root** : `/httpdocs`
6. Redémarrer l'application

---

## Workflow GitHub → Déploiement automatique

1. Push sur `main` → GitHub
2. Webhook Plesk déclenche un `git pull` automatique
3. Relancer l'app Node.js si besoin (ou configurer un hook post-receive)

Configuration webhook dans Plesk :
- **Domaines → Git → Répertoire distant** : https://github.com/ArchSeraphin/Voltea2
- **Branch** : main
- **Actions à l'arrivée** : `npm install && npm run build`

---

## Structure du projet

```
Voltea2/
├── app.js                     # Point d'entrée Passenger
├── package.json               # Dépendances serveur
├── .env.dev                   # Variables de dev (non versionné)
├── .env.prod                  # Variables de prod (non versionné)
├── .env.example               # Template documenté
├── .gitignore
├── .htaccess                  # Config Apache + blocage fichiers sensibles
├── robots.txt
├── sitemap.xml
├── server/
│   ├── config/
│   │   ├── db.js             # Pool MySQL
│   │   └── schema.sql        # Schéma complet
│   ├── middleware/
│   │   ├── auth.js           # Middleware JWT
│   │   └── rateLimiter.js    # Rate limiting
│   └── routes/
│       ├── api.js            # Articles publics
│       ├── auth.js           # Authentification
│       ├── adminApi.js       # CRUD admin (protégé)
│       └── contact.js        # Formulaire de contact
├── seed/
│   └── createAdmin.js        # Script création compte admin
├── client/                    # Source React (non servi directement)
│   ├── public/images/         # Images statiques
│   ├── src/
│   │   ├── pages/            # Pages publiques
│   │   ├── pages/admin/      # Pages dashboard admin
│   │   ├── components/       # Composants partagés
│   │   ├── context/          # AuthContext (JWT)
│   │   └── styles/           # CSS global
│   └── vite.config.js
└── public/                    # Build React (généré, non versionné)
```

---

## Routes

| URL | Description |
|-----|-------------|
| `/` | Accueil |
| `/a-propos` | À propos / Équipe |
| `/services` | Services détaillés |
| `/collectivites` | Offre collectivités |
| `/actualites` | Liste des articles |
| `/actualites/:slug` | Article détail |
| `/contact` | Formulaire de contact |
| `/mentions-legales` | Mentions légales |
| `/cgv` | CGV |
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard admin |
| `/admin/actualites` | Liste articles (CRUD) |
| `/admin/actualites/nouveau` | Créer un article |
| `/admin/actualites/:id/modifier` | Modifier un article |

---

## API

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/articles` | GET | Non | Articles publiés |
| `/api/articles/:slug` | GET | Non | Article par slug |
| `/api/auth/login` | POST | Non | Connexion admin |
| `/api/auth/logout` | POST | Oui | Déconnexion |
| `/api/auth/refresh` | POST | Cookie | Refresh token |
| `/api/auth/me` | GET | Oui | Profil admin |
| `/api/admin/articles` | GET | Oui | Tous les articles |
| `/api/admin/articles` | POST | Oui | Créer article |
| `/api/admin/articles/:id` | PUT | Oui | Modifier article |
| `/api/admin/articles/:id` | DELETE | Oui | Supprimer article |
| `/api/admin/articles/:id/publish` | PATCH | Oui | Toggle publication |
| `/api/contact` | POST | Non | Formulaire contact |

---

## Vidéo Hero

Déposer une vidéo `hero.mp4` dans `client/public/video/` puis rebuilder (`npm run build`).
Si aucune vidéo n'est fournie, le hero affiche un fond dégradé animé.

---

## Domaines

| Environnement | URL |
|---------------|-----|
| Développement | https://voltea2.voilavoila.tv |
| Production | https://voltea-energie.fr |
