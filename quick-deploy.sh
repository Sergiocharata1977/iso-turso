#!/bin/bash

# Script de despliegue rápido para ISOFlow3
# Ejecutar en el servidor VPS de Hostinger

echo "🚀 Despliegue rápido de ISOFlow3 iniciado..."

# Variables
PROJECT_PATH="/var/www/isoflow3"
BACKUP_PATH="/var/backups/isoflow3"

# Crear directorios
mkdir -p $PROJECT_PATH
mkdir -p $BACKUP_PATH

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Actualizar sistema
log "📦 Actualizando sistema..."
apt update -y

# 2. Instalar Node.js si no está instalado
if ! command -v node &> /dev/null; then
    log "📥 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# 3. Instalar PM2 si no está instalado
if ! command -v pm2 &> /dev/null; then
    log "📥 Instalando PM2..."
    npm install -g pm2
fi

# 4. Instalar Nginx si no está instalado
if ! command -v nginx &> /dev/null; then
    log "📥 Instalando Nginx..."
    apt install -y nginx
fi

# 5. Backup si existe proyecto anterior
if [ -d "$PROJECT_PATH" ] && [ "$(ls -A $PROJECT_PATH)" ]; then
    log "📦 Creando backup..."
    tar -czf "$BACKUP_PATH/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C $PROJECT_PATH .
fi

# 6. Copiar archivos del proyecto (asumiendo que estás en el directorio del proyecto)
log "📁 Copiando archivos del proyecto..."
cp -r . $PROJECT_PATH/

# 7. Configurar permisos
log "🔐 Configurando permisos..."
chown -R www-data:www-data $PROJECT_PATH
chmod -R 755 $PROJECT_PATH

# 8. Instalar dependencias del backend
log "📦 Instalando dependencias del backend..."
cd $PROJECT_PATH
npm install

# 9. Instalar dependencias del frontend
log "📦 Instalando dependencias del frontend..."
cd $PROJECT_PATH/frontend
npm install

# 10. Construir frontend
log "🔨 Construyendo frontend..."
npm run build

# 11. Configurar Nginx
log "🌐 Configurando Nginx..."
cp $PROJECT_PATH/nginx.conf /etc/nginx/sites-available/isoflow3
ln -sf /etc/nginx/sites-available/isoflow3 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# 12. Configurar PM2
log "⚡ Configurando PM2..."
cd $PROJECT_PATH
pm2 delete isoflow3-backend 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 13. Configurar firewall básico
log "🔥 Configurando firewall..."
ufw allow ssh 2>/dev/null || true
ufw allow 80 2>/dev/null || true
ufw allow 443 2>/dev/null || true
ufw --force enable 2>/dev/null || true

# 14. Mostrar estado final
log "📊 Estado del despliegue:"
echo ""
echo "✅ Node.js: $(node --version)"
echo "✅ PM2: $(pm2 --version)"
echo "✅ Nginx: $(nginx -v 2>&1)"
echo ""
echo "🌐 URLs:"
echo "   - Frontend: http://$(hostname -I | awk '{print $1}')"
echo "   - Backend API: http://$(hostname -I | awk '{print $1}'):5000"
echo ""
echo "📋 Comandos útiles:"
echo "   - Ver logs: pm2 logs isoflow3-backend"
echo "   - Reiniciar: pm2 restart isoflow3-backend"
echo "   - Estado: pm2 status"
echo "   - Logs Nginx: tail -f /var/log/nginx/isoflow3_access.log"

log "🎉 ¡Despliegue completado!"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Configura las variables de entorno en $PROJECT_PATH/backend/.env"
echo "   2. Si tienes dominio, ejecuta: sudo certbot --nginx -d tu-dominio.com"
echo "   3. Verifica que la aplicación funcione correctamente" 