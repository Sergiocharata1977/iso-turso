# 🚀 COMANDOS PARA EJECUTAR EN EL VPS

## PASO 1: Verificar el problema actual
```bash
# Ver estado de PM2
pm2 status

# Ver logs del proceso
pm2 logs isoflow3-backend --lines 20

# Verificar si el package.json tiene errores
node -e "try { JSON.parse(require('fs').readFileSync('backend/package.json', 'utf8')); console.log('✅ JSON válido'); } catch(e) { console.log('❌ Error:', e.message); }"
```

## PASO 2: Corregir el package.json del backend
```bash
# Crear backup
cp backend/package.json backend/package.json.backup

# Crear package.json limpio
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
```

## PASO 3: Reinstalar dependencias
```bash
# Ir al directorio backend
cd backend

# Limpiar dependencias anteriores
rm -rf node_modules package-lock.json

# Instalar dependencias
npm install

# Volver al directorio raíz
cd ..
```

## PASO 4: Reiniciar el proceso
```bash
# Reiniciar el proceso con PM2
pm2 restart isoflow3-backend

# Si no funciona, eliminar y recrear
pm2 delete isoflow3-backend
pm2 start backend/index.js --name isoflow3-backend
```

## PASO 5: Verificar que todo funciona
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs isoflow3-backend --lines 10

# Verificar que el servidor responde
curl http://localhost:3000/api/health
```

## COMANDO COMPLETO (copia y pega todo junto):
```bash
# Crear backup y corregir package.json
cp backend/package.json backend/package.json.backup && cat > backend/package.json << 'EOF'
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

# Reinstalar dependencias
cd backend && rm -rf node_modules package-lock.json && npm install && cd ..

# Reiniciar proceso
pm2 restart isoflow3-backend

# Verificar
pm2 status && pm2 logs isoflow3-backend --lines 5
```

## 🆘 SI NADA FUNCIONA:
```bash
# Eliminar proceso y crear uno nuevo
pm2 delete isoflow3-backend
pm2 start backend/index.js --name isoflow3-backend

# O ejecutar directamente para ver errores
cd backend && npm start
``` 