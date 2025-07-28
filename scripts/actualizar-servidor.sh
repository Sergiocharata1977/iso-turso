#!/bin/bash

# Script para actualizar el servidor VPS con los últimos cambios
# Ejecutar en el servidor VPS

echo "🚀 Iniciando actualización del servidor VPS..."

# 1. Navegar al directorio del proyecto
cd /var/www/isoflow3-master

# 2. Hacer backup de la configuración actual
echo "📦 Creando backup de configuración..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# 3. Obtener los últimos cambios del repositorio
echo "⬇️ Descargando últimos cambios de GitHub..."
git fetch origin
git reset --hard origin/main

# 4. Instalar/actualizar dependencias del backend
echo "📦 Actualizando dependencias del backend..."
cd backend
npm install

# 5. Verificar que las tablas de la base de datos estén actualizadas
echo "🗄️ Verificando estructura de base de datos..."
node scripts/verificar-base-datos-completa.js

# 6. Ejecutar migraciones si existen
echo "🔄 Ejecutando migraciones..."
if [ -f "scripts/migrations/run-migrations.js" ]; then
    node scripts/migrations/run-migrations.js
fi

# 7. Volver al directorio raíz e instalar dependencias del frontend
echo "📦 Actualizando dependencias del frontend..."
cd ../frontend
npm install

# 8. Construir el frontend para producción
echo "🔨 Construyendo frontend para producción..."
npm run build

# 9. Reiniciar servicios
echo "🔄 Reiniciando servicios..."
sudo systemctl restart isoflow3-backend
sudo systemctl restart nginx

# 10. Verificar estado de los servicios
echo "✅ Verificando estado de servicios..."
sudo systemctl status isoflow3-backend --no-pager
sudo systemctl status nginx --no-pager

echo "🎉 Actualización completada exitosamente!"
echo "📊 Servicios activos:"
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:80"
echo "   - Base de datos: Turso Cloud" 