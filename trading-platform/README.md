# 🚀 Trading Learning Platform

Eine moderne E-Learning-Plattform für Trading-Ausbildung mit React Frontend und Node.js Backend.

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Schnellstart](#-schnellstart)
- [Installation](#-installation)
- [Entwicklung](#-entwicklung)
- [Deployment](#-deployment)
- [API Dokumentation](#-api-dokumentation)
- [Struktur](#-projektstruktur)
- [Beitragen](#-beitragen)

## ✨ Features

### 🎓 Lern-Features
- **Interaktive Lektionen** mit Slides und Videos
- **Quiz-System** mit sofortiger Bewertung
- **Progress Tracking** mit detailliertem Fortschritt
- **Achievement System** mit Badges und Punkten
- **Adaptive Learning** basierend auf Lernfortschritt
- **Text-to-Speech** für Barrierefreiheit
- **Notizen & Bookmarks** für persönliche Anmerkungen

### 📊 Trading-Spezifisch
- **Trading Charts** mit interaktiven Beispielen
- **Market Structure** Analyse-Tools
- **Risk Management** Kalkulatoren
- **Performance Analytics** für Lernfortschritt
- **Trading Psychologie** Module

### 💻 Technische Features
- **Responsive Design** für alle Geräte
- **Progressive Web App** (PWA) Unterstützung
- **Real-time Updates** mit WebSocket-Integration
- **Offline-Fähigkeiten** für Mobile Learning
- **Multi-Language Support** (DE/EN)
- **Dark/Light Mode** für bessere UX

### 🔐 Admin & Management
- **User Management** mit Rollen-System
- **Content Management** für Lektionen
- **Analytics Dashboard** für Administratoren
- **Feedback System** für kontinuierliche Verbesserung
- **Backup & Recovery** Systeme

## 🛠 Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling Framework
- **React Router v6** - Client-side Routing
- **Zustand** - State Management
- **React Query** - Server State Management
- **Framer Motion** - Animations
- **Recharts** - Chart Library
- **Lucide React** - Icon Library

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **PostgreSQL** - Primary Database
- **Redis** - Caching & Sessions
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Winston** - Logging
- **Joi** - Input Validation
- **Multer** - File Uploads

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container Setup
- **GitHub Actions** - CI/CD Pipeline
- **Nginx** - Reverse Proxy
- **PM2** - Process Management
- **Helmet** - Security Middleware

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (empfohlen)

### Mit Docker (Empfohlen)

```bash
# Repository klonen
git clone https://github.com/your-username/trading-platform.git
cd trading-platform

# Mit Docker Compose starten
docker-compose --profile development up -d

# Warten bis alle Services ready sind (ca. 2-3 Minuten)
docker-compose logs -f backend

# Anwendung öffnen
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Database Admin: http://localhost:8080
# Redis Admin: http://localhost:8081
```

### Manuelle Installation

```bash
# 1. Repository klonen
git clone https://github.com/your-username/trading-platform.git
cd trading-platform

# 2. Backend Setup
cd backend
npm install
cp .env.example .env
# .env Datei mit Ihren Datenbank-Credentials bearbeiten

# Database Setup
npm run setup

# Backend starten
npm run dev

# 3. Frontend Setup (neues Terminal)
cd ../frontend
npm install
npm run dev
```

## 📦 Installation

### Backend Setup

```bash
cd backend

# Dependencies installieren
npm install

# Environment konfigurieren
cp .env.example .env
nano .env  # Ihre Datenbank-Credentials eintragen

# Datenbank initialisieren
npm run setup

# Development Server starten
npm run dev

# Oder Production Build
npm run build
npm start
```

### Frontend Setup

```bash
cd frontend

# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build
npm run preview
```

### Database Schema

Das Database Schema wird automatisch vom Setup-Script erstellt:

```bash
cd backend
npm run setup
```

Oder manuell:

```bash
psql -U postgres -d trading_platform < src/database/schema.sql
```

## 🔧 Entwicklung

### Backend Commands

```bash
# Development mit Hot-Reload
npm run dev

# Database Setup
npm run setup

# Database Migration
npm run migrate

# Tests ausführen
npm test

# Linting
npm run lint

# Production Build
npm run build
```

### Frontend Commands

```bash
# Development Server
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Tests ausführen
npm test

# Linting & Formatting
npm run lint
npm run format

# Type Checking
npm run type-check
```

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_platform
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Application
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
NODE_ENV=development
PORT=3001
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Trading Platform
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment

### Docker Production Deployment

```bash
# Production Build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Mit SSL/HTTPS
docker-compose --profile production up -d
```

### Manuelle Deployment

```bash
# Backend Production
cd backend
npm run build
NODE_ENV=production npm start

# Frontend Production
cd frontend
npm run build
# Deploy dist/ folder to web server
```

### Cloud Deployment

#### Railway/Render
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect GitHub repo to Railway/Render
# 3. Set environment variables
# 4. Deploy automatically
```

#### AWS/DigitalOcean
```bash
# 1. Setup Docker on server
# 2. Clone repository
# 3. Configure environment
# 4. Run docker-compose
```

## 📚 API Dokumentation

### Authentication Endpoints

```bash
POST /api/auth/register    # User Registration
POST /api/auth/login       # User Login
POST /api/auth/refresh     # Token Refresh
POST /api/auth/logout      # User Logout
GET  /api/auth/me          # Current User Info
```

### Lesson Endpoints

```bash
GET    /api/lessons              # Get All Lessons
GET    /api/lessons/:id          # Get Specific Lesson
POST   /api/lessons/:id/progress # Update Progress
POST   /api/lessons/:id/quiz     # Submit Quiz
```

### User Endpoints

```bash
GET    /api/users/profile        # Get User Profile
PUT    /api/users/profile        # Update Profile
POST   /api/users/avatar         # Upload Avatar
GET    /api/users/settings       # Get Settings
PUT    /api/users/settings       # Update Settings
```

### Admin Endpoints

```bash
GET    /api/admin/dashboard      # Admin Dashboard
GET    /api/admin/users          # All Users
POST   /api/admin/users          # Create User
PUT    /api/admin/users/:id      # Update User
DELETE /api/admin/users/:id      # Delete User
```

## 📁 Projektstruktur

```
trading-platform/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   │   ├── Layout/      # Layout Components
│   │   │   ├── UI/          # UI Components
│   │   │   ├── Forms/       # Form Components
│   │   │   ├── Charts/      # Chart Components
│   │   │   ├── Features/    # Feature Components
│   │   │   └── Templates/   # Page Templates
│   │   ├── pages/           # Page Components
│   │   ├── services/        # API Services
│   │   ├── hooks/           # Custom Hooks
│   │   ├── store/           # State Management
│   │   ├── utils/           # Utility Functions
│   │   └── styles/          # Global Styles
│   └── public/              # Static Assets
│
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── routes/          # API Routes
│   │   ├── controllers/     # Route Controllers
│   │   ├── middleware/      # Express Middleware
│   │   ├── models/          # Database Models
│   │   ├── services/        # Business Logic
│   │   ├── utils/           # Utility Functions
│   │   ├── config/          # Configuration
│   │   ├── validators/      # Input Validation
│   │   └── database/        # Database Scripts
│   ├── uploads/             # File Uploads
│   ├── logs/                # Application Logs
│   └── scripts/             # Utility Scripts
│
├── shared/                   # Shared Resources
│   ├── types/               # TypeScript Types
│   ├── constants/           # Shared Constants
│   └── utils/               # Shared Utilities
│
├── docker/                   # Docker Configuration
├── docs/                     # Documentation
├── tools/                    # Development Tools
└── deployment/               # Deployment Scripts
```

## 🔐 Standard Login-Daten

Nach dem Setup stehen folgende Test-Accounts zur Verfügung:

### Admin Account
- **Email:** admin@tradingplatform.com
- **Passwort:** admin123!

### Student Account
- **Email:** student@example.com
- **Passwort:** student123!

> ⚠️ **Wichtig:** Ändern Sie diese Passwörter in der Produktion!

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm test

# Frontend Tests
cd frontend
npm test

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

## 📈 Performance

### Optimierungen
- **Lazy Loading** für Components
- **Code Splitting** für bessere Load Times
- **Image Optimization** für schnellere Ladezeiten
- **API Caching** mit Redis
- **Database Indexing** für bessere Performance
- **CDN Integration** für statische Assets

### Monitoring
- **Health Checks** für alle Services
- **Error Tracking** mit Winston
- **Performance Metrics** in Analytics
- **Database Monitoring** für Queries

## 🤝 Beitragen

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Changes committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

### Code Style
- ESLint & Prettier für JavaScript/TypeScript
- Conventional Commits für Commit Messages
- Jest für Testing
- JSDoc für Code Documentation

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 📞 Support

- **Dokumentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/your-username/trading-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/trading-platform/discussions)

## 🙏 Danksagungen

- React Team für das großartige Framework
- Node.js Community für die exzellenten Tools
- Alle Contributors die dieses Projekt möglich gemacht haben

---

**Made with ❤️ for Trading Education**