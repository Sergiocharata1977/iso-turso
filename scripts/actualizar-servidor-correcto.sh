#!/bin/bash

# Script para actualizar el servidor VPS con los últimos cambios
# Basado en la configuración real del proyecto

echo "🚀 Iniciando actualización del servidor VPS..."

# Variables correctas según los archivos de despliegue
PROJECT_PATH="/var/www/isoflow3"
BACKUP_PATH="/var/backups/isoflow3"

# 1. Verificar que el directorio existe
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Error: El directorio $PROJECT_PATH no existe"
    echo "🔍 Buscando el proyecto..."
    find / -name "isoflow3*" -type d 2>/dev/null | head -5
    exit 1
fi

# 2. Navegar al directorio del proyecto
echo "📁 Navegando a $PROJECT_PATH"
cd $PROJECT_PATH

# 3. Hacer backup de la configuración actual
echo "📦 Creando backup de configuración..."
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# 4. Verificar si es un repositorio git
if [ ! -d ".git" ]; then
    echo "❌ Error: No es un repositorio git"
    echo "🔧 Inicializando repositorio..."
    git init
    git remote add origin https://github.com/Sergiocharata1977/iso-turso.git
fi

# 5. Obtener los últimos cambios del repositorio
echo "⬇️ Descargando últimos cambios de GitHub..."
git fetch origin
git reset --hard origin/main

# 6. Instalar/actualizar dependencias del backend
echo "📦 Actualizando dependencias del backend..."
cd backend
npm install

# 7. Verificar que las tablas de la base de datos estén actualizadas
echo "🗄️ Verificando estructura de base de datos..."
if [ -f "scripts/verificar-base-datos-completa.js" ]; then
    node scripts/verificar-base-datos-completa.js
else
    echo "⚠️ Script de verificación no encontrado, continuando..."
fi

# 8. Volver al directorio raíz e instalar dependencias del frontend
echo "📦 Actualizando dependencias del frontend..."
cd ../frontend
npm install

# 9. Construir el frontend para producción
echo "🔨 Construyendo frontend para producción..."
npm run build

# 10. Volver al directorio raíz
cd ..

# 11. Reiniciar servicios usando PM2
echo "🔄 Reiniciando servicios..."
pm2 restart isoflow3-backend
pm2 save

# 12. Reiniciar nginx
echo "🔄 Reiniciando nginx..."
systemctl restart nginx

# 13. Verificar estado de los servicios
echo "✅ Verificando estado de servicios..."
pm2 status
systemctl status nginx --no-pager

echo "🎉 Actualización completada exitosamente!"
echo "📊 Servicios activos:"
echo "   - Backend: http://localhost:5000 (PM2)"
echo "   - Frontend: http://localhost:80 (Nginx)"
echo "   - Base de datos: Turso Cloud" 