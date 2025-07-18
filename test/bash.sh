# ============================================
# DATABASE CONNECTION FIX - SCHRITT FÜR SCHRITT
# ============================================

# 1. Alle Container stoppen
docker-compose down

# 2. Environment Datei prüfen (WICHTIG!)
cd backend
cat .env

# Die .env Datei sollte folgende Werte haben:
echo "Überprüfe Backend .env Datei:"
echo "DB_HOST=postgres"          # NICHT localhost!
echo "DB_USER=postgres"
echo "DB_PASSWORD=postgres"       # Standard Passwort
echo "DB_NAME=trading_platform"
echo "DB_PORT=5432"

# 3. Falls .env nicht existiert, erstellen:
if [ ! -f .env ]; then
    echo "Erstelle .env Datei..."
    cat << 'EOF' > .env
# Database Configuration
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=trading_platform
DB_PORT=5432

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Redis (optional)
REDIS_URL=redis://redis:6379
EOF
    echo "✅ .env Datei erstellt!"
fi

# 4. Docker Volumes bereinigen (falls corrupted)
docker volume prune -f

# 5. Container mit fresh setup neu starten
docker-compose --profile development up -d

# 6. Warten bis Postgres ready ist
echo "⏳ Warte 30 Sekunden bis Postgres ready ist..."
sleep 30

# 7. Database Setup durchführen
echo "🛠️ Database Setup starten..."
docker exec -it trading-platform-backend-1 npm run setup

# 8. Verbindung testen
echo "🔌 Database Verbindung testen..."
docker exec -it trading-platform-postgres-1 psql -U postgres -d trading_platform -c "\dt"

# 9. Admin User erstellen (falls nötig)
echo "👤 Admin User erstellen..."
docker exec -it trading-platform-backend-1 node -e "
const bcrypt = require('bcryptjs');
const { query } = require('./src/config/database.js');

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123!', 12);
    const result = await query(\`
      INSERT INTO users (name, email, password, role, status, email_verified) 
      VALUES (\$1, \$2, \$3, \$4, \$5, \$6) 
      ON CONFLICT (email) DO UPDATE SET 
        password = EXCLUDED.password,
        role = EXCLUDED.role
      RETURNING id, email, role
    \`, ['Admin User', 'admin@tradingplatform.com', hashedPassword, 'admin', 'active', true]);
    
    console.log('✅ Admin User created:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

createAdmin();
"

echo ""
echo "🎉 Setup abgeschlossen!"
echo ""
echo "🌐 URLs zum Testen:"
echo "Frontend: http://localhost:5173"
echo "Backend Health: http://localhost:3001/health"
echo "Admin Login: admin@tradingplatform.com / admin123!"