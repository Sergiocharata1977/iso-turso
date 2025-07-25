#!/bin/bash

# Script de despliegue para ISOFlow3 en Hostinger VPS
# Ejecutar como root o con sudo

set -e

echo "🚀 Iniciando despliegue de ISOFlow3..."

# Variables de configuración
PROJECT_NAME="isoflow3"
PROJECT_PATH="/var/www/$PROJECT_NAME"
BACKUP_PATH="/var/backups/$PROJECT_NAME"
LOG_FILE="/var/log/isoflow3-deploy.log"

# Crear directorios si no existen
mkdir -p $PROJECT_PATH
mkdir -p $BACKUP_PATH
mkdir -p /var/log

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Función para hacer backup
backup() {
    if [ -d "$PROJECT_PATH" ]; then
        log "📦 Creando backup del proyecto actual..."
        tar -czf "$BACKUP_PATH/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C $PROJECT_PATH .
    fi
}

# Función para instalar dependencias del sistema
install_system_deps() {
    log "📦 Instalando dependencias del sistema..."
    
    # Actualizar sistema
    apt update
    
    # Instalar Node.js 18.x
    if ! command -v node &> /dev/null; then
        log "📥 Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # Instalar PM2 globalmente
    if ! command -v pm2 &> /dev/null; then
        log "📥 Instalando PM2..."
        npm install -g pm2
    fi
    
    # Instalar Nginx
    if ! command -v nginx &> /dev/null; then
        log "📥 Instalando Nginx..."
        apt-get install -y nginx
    fi
    
    # Instalar Certbot para SSL
    if ! command -v certbot &> /dev/null; then
        log "📥 Instalando Certbot..."
        apt-get install -y certbot python3-certbot-nginx
    fi
}

# Función para configurar el proyecto
setup_project() {
    log "🔧 Configurando proyecto..."
    
    # Copiar archivos del proyecto
    cp -r . $PROJECT_PATH/
    
    # Configurar permisos
    chown -R www-data:www-data $PROJECT_PATH
    chmod -R 755 $PROJECT_PATH
    
    # Instalar dependencias del backend
    log "📦 Instalando dependencias del backend..."
    cd $PROJECT_PATH
    npm install
    
    # Instalar dependencias del frontend
    log "📦 Instalando dependencias del frontend..."
    cd $PROJECT_PATH/frontend
    npm install
    
    # Construir frontend para producción
    log "🔨 Construyendo frontend..."
    npm run build
}

# Función para configurar Nginx
setup_nginx() {
    log "🌐 Configurando Nginx..."
    
    # Copiar configuración de Nginx
    cp $PROJECT_PATH/nginx.conf /etc/nginx/sites-available/isoflow3
    
    # Crear enlace simbólico
    ln -sf /etc/nginx/sites-available/isoflow3 /etc/nginx/sites-enabled/
    
    # Remover configuración por defecto
    rm -f /etc/nginx/sites-enabled/default
    
    # Verificar configuración
    nginx -t
    
    # Reiniciar Nginx
    systemctl restart nginx
    systemctl enable nginx
}

# Función para configurar PM2
setup_pm2() {
    log "⚡ Configurando PM2..."
    
    cd $PROJECT_PATH
    
    # Iniciar aplicación con PM2
    pm2 start ecosystem.config.js --env production
    
    # Guardar configuración de PM2
    pm2 save
    
    # Configurar PM2 para iniciar con el sistema
    pm2 startup
}

# Función para configurar firewall
setup_firewall() {
    log "🔥 Configurando firewall..."
    
    # Permitir SSH
    ufw allow ssh
    
    # Permitir HTTP y HTTPS
    ufw allow 80
    ufw allow 443
    
    # Habilitar firewall
    ufw --force enable
}

# Función para configurar SSL
setup_ssl() {
    log "🔒 Configurando SSL..."
    
    # Nota: El usuario debe ejecutar esto manualmente con su dominio
    echo "⚠️  IMPORTANTE: Para configurar SSL, ejecuta:"
    echo "sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com"
    echo "Reemplaza 'tu-dominio.com' con tu dominio real"
}

# Función para mostrar estado
show_status() {
    log "📊 Estado del despliegue:"
    
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
}

# Función principal
main() {
    log "🎯 Iniciando despliegue completo..."
    
    backup
    install_system_deps
    setup_project
    setup_nginx
    setup_pm2
    setup_firewall
    setup_ssl
    show_status
    
    log "🎉 ¡Despliegue completado exitosamente!"
    echo ""
    echo "🔗 Tu aplicación está disponible en:"
    echo "   http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. Configura tu dominio en el panel de Hostinger"
    echo "   2. Ejecuta: sudo certbot --nginx -d tu-dominio.com"
    echo "   3. Actualiza la configuración de Nginx con tu dominio"
}

# Ejecutar función principal
main "$@" 