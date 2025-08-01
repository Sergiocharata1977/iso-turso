#!/bin/bash

echo "🔧 CORRECCIÓN DE PACKAGE.JSON EN VPS"
echo "====================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -d "backend" ]; then
    print_error "No se encuentra el directorio backend. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando package.json del backend..."

# Crear backup del package.json actual
if [ -f "backend/package.json" ]; then
    cp backend/package.json backend/package.json.backup
    print_status "Backup creado: backend/package.json.backup"
fi

# Crear un package.json limpio para el backend
cat > backend/package.json << 'EOF'
{
  "name": "isoflow-backend",
  "version": "1.0.0",
  "description": "Backend para Sistema de Gestión de Calidad ISO 9001",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "security-check": "npm audit",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "express-session": "^1.17.3",
    "connect-sqlite3": "^0.9.13",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "express-brute": "^1.0.1",
    "express-brute-redis": "^0.0.1",
    "sqlite3": "^5.1.6",
    "turso": "^0.0.15"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "supertest": "^6.3.3"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [
    "iso9001",
    "quality-management",
    "express",
    "nodejs",
    "sqlite",
    "turso"
  ],
  "author": "Tu Nombre",
  "license": "MIT"
}
EOF

print_status "Package.json del backend corregido"

# Verificar que el JSON es válido
if node -e "JSON.parse(require('fs').readFileSync('backend/package.json', 'utf8')); console.log('✅ JSON válido')" 2>/dev/null; then
    print_status "✅ Package.json del backend es válido"
else
    print_error "❌ Package.json del backend aún tiene errores"
    exit 1
fi

# Limpiar node_modules y reinstalar
print_status "Limpiando dependencias anteriores..."
cd backend
rm -rf node_modules package-lock.json

print_status "Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    print_status "✅ Dependencias instaladas correctamente"
else
    print_error "❌ Error al instalar dependencias"
    exit 1
fi

cd ..

# Verificar estado de PM2
print_status "Verificando estado de PM2..."
pm2 status

print_status "Reiniciando proceso..."
pm2 restart isoflow3-backend

if [ $? -eq 0 ]; then
    print_status "✅ Proceso reiniciado correctamente"
else
    print_warning "⚠️ No se pudo reiniciar el proceso. Verificando si existe..."
    pm2 list
fi

echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Verificar logs: pm2 logs isoflow3-backend --lines 20"
echo "2. Verificar estado: pm2 status"
echo "3. Si hay problemas: pm2 delete isoflow3-backend && pm2 start backend/index.js --name isoflow3-backend"
echo ""
print_status "¡Corrección completada!" 