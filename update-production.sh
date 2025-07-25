#!/bin/bash

# Script para actualizar ISOFlow3 en producción
# Ejecutar cuando quieras actualizar la aplicación

echo "🔄 Iniciando actualización de ISOFlow3 en producción..."

# Variables
PROJECT_PATH="/var/www/isoflow3"
BACKUP_PATH="/var/backups/isoflow3"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Crear backup antes de actualizar
log "📦 Creando backup antes de actualizar..."
if [ -d "$PROJECT_PATH" ]; then
    tar -czf "$BACKUP_PATH/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C $PROJECT_PATH .
fi

# 2. Parar la aplicación
log "⏹️ Parando aplicación..."
cd $PROJECT_PATH
pm2 stop isoflow3-backend

# 3. Actualizar código (asumiendo que estás en el directorio del proyecto)
log "📥 Actualizando código..."
cp -r . $PROJECT_PATH/

# 4. Configurar permisos
log "🔐 Configurando permisos..."
chown -R www-data:www-data $PROJECT_PATH
chmod -R 755 $PROJECT_PATH

# 5. Instalar dependencias del backend
log "📦 Instalando dependencias del backend..."
cd $PROJECT_PATH
npm install

# 6. Instalar dependencias del frontend
log "📦 Instalando dependencias del frontend..."
cd $PROJECT_PATH/frontend
npm install

# 7. Construir frontend
log "🔨 Construyendo frontend..."
npm run build

# 8. Reiniciar aplicación
log "🔄 Reiniciando aplicación..."
cd $PROJECT_PATH
pm2 restart isoflow3-backend

# 9. Verificar estado
log "📊 Verificando estado..."
pm2 status
pm2 logs isoflow3-backend --lines 10

log "✅ ¡Actualización completada!"
echo ""
echo "🌐 URLs:"
echo "   - Frontend: http://$(hostname -I | awk '{print $1}')"
echo "   - Backend API: http://$(hostname -I | awk '{print $1}'):5000"
echo ""
echo "📋 Comandos útiles:"
echo "   - Ver logs: pm2 logs isoflow3-backend"
echo "   - Estado: pm2 status"
echo "   - Rollback: pm2 restart isoflow3-backend" 