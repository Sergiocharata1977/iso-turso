#!/bin/bash

# 🚀 Script de Despliegue ISOFlow3 para VPS
# Versión: 3.0
# Última actualización: Diciembre 2024

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para obtener input del usuario
get_input() {
    local prompt="$1"
    local default="$2"
    local input
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        echo "${input:-$default}"
    else
        read -p "$prompt: " input
        echo "$input"
    fi
}

# Función para confirmar acción
confirm() {
    local prompt="$1"
    local response
    
    read -p "$prompt (y/N): " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Banner de inicio
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🏢 ISOFlow3 - Despliegue VPS              ║"
echo "║                        Versión 3.0                           ║"
echo "║              Sistema de Gestión de Calidad ISO 9001          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_status "Iniciando proceso de despliegue..."

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto ISOFlow3"
    exit 1
fi

# Variables de configuración
DOMAIN=$(get_input "Ingrese el dominio del servidor (ej: isoflow3.tudominio.com)" "")
EMAIL=$(get_input "Ingrese su email para certificados SSL" "")
DB_NAME=$(get_input "Nombre de la base de datos" "isoflow3_prod")
DB_USER=$(get_input "Usuario de la base de datos" "isoflow3_user")
DB_PASS=$(get_input "Contraseña de la base de datos" "")

# Verificar que se proporcionaron los datos necesarios
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ] || [ -z "$DB_PASS" ]; then
    print_error "Todos los campos son obligatorios"
    exit 1
fi

print_status "Configuración capturada:"
echo "  - Dominio: $DOMAIN"
echo "  - Email: $EMAIL"
echo "  - Base de datos: $DB_NAME"

if ! confirm "¿Desea continuar con esta configuración?"; then
    print_warning "Despliegue cancelado por el usuario"
    exit 0
fi

# Verificar sistema operativo
print_status "Verificando sistema operativo..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    print_error "No se pudo detectar el sistema operativo"
    exit 1
fi

print_success "Sistema operativo detectado: $OS $VER"

# Verificar si es Ubuntu/Debian
if [[ "$OS" != *"Ubuntu"* ]] && [[ "$OS" != *"Debian"* ]]; then
    print_warning "Este script está optimizado para Ubuntu/Debian. Otros sistemas pueden requerir ajustes."
fi

# Actualizar sistema
print_status "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependencias del sistema
print_status "Instalando dependencias del sistema..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Verificar Node.js
print_status "Verificando Node.js..."
if ! command_exists node; then
    print_status "Instalando Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    NODE_VERSION=$(node --version)
    print_success "Node.js ya está instalado: $NODE_VERSION"
fi

# Verificar npm
if ! command_exists npm; then
    print_error "npm no está instalado"
    exit 1
fi

# Instalar PM2 para gestión de procesos
print_status "Instalando PM2..."
if ! command_exists pm2; then
    sudo npm install -g pm2
else
    print_success "PM2 ya está instalado"
fi

# Instalar Nginx
print_status "Instalando Nginx..."
if ! command_exists nginx; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    print_success "Nginx ya está instalado"
fi

# Instalar Certbot para SSL
print_status "Instalando Certbot para SSL..."
if ! command_exists certbot; then
    sudo apt install -y certbot python3-certbot-nginx
else
    print_success "Certbot ya está instalado"
fi

# Crear usuario para la aplicación
print_status "Creando usuario para la aplicación..."
if ! id "isoflow3" &>/dev/null; then
    sudo useradd -m -s /bin/bash isoflow3
    sudo usermod -aG sudo isoflow3
    print_success "Usuario isoflow3 creado"
else
    print_success "Usuario isoflow3 ya existe"
fi

# Crear directorio de la aplicación
APP_DIR="/opt/isoflow3"
print_status "Creando directorio de la aplicación: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown isoflow3:isoflow3 $APP_DIR

# Copiar archivos del proyecto
print_status "Copiando archivos del proyecto..."
sudo cp -r . $APP_DIR/
sudo chown -R isoflow3:isoflow3 $APP_DIR

# Configurar variables de entorno
print_status "Configurando variables de entorno..."
sudo -u isoflow3 tee $APP_DIR/backend/.env > /dev/null <<EOF
# Configuración de Base de Datos
DB_URL=file:$APP_DIR/data.db

# Configuración del Servidor
PORT=3001
NODE_ENV=production

# Configuración JWT
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

# Configuración de la Aplicación
FRONTEND_URL=https://$DOMAIN
API_URL=https://$DOMAIN/api

# Configuración de CORS
CORS_ORIGIN=https://$DOMAIN

# Configuración de Logs
LOG_LEVEL=info
EOF

# Instalar dependencias del backend
print_status "Instalando dependencias del backend..."
cd $APP_DIR/backend
sudo -u isoflow3 npm install --production

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
cd $APP_DIR/frontend
sudo -u isoflow3 npm install --production

# Construir frontend para producción
print_status "Construyendo frontend para producción..."
sudo -u isoflow3 npm run build

# Configurar PM2
print_status "Configurando PM2..."
sudo -u isoflow3 tee $APP_DIR/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [
    {
      name: 'isoflow3-backend',
      cwd: '$APP_DIR/backend',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '$APP_DIR/logs/backend-error.log',
      out_file: '$APP_DIR/logs/backend-out.log',
      log_file: '$APP_DIR/logs/backend-combined.log',
      time: true
    }
  ]
};
EOF

# Crear directorio de logs
sudo mkdir -p $APP_DIR/logs
sudo chown isoflow3:isoflow3 $APP_DIR/logs

# Configurar Nginx
print_status "Configurando Nginx..."
sudo tee /etc/nginx/sites-available/isoflow3 > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirigir a HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # Configuración SSL (se configurará con Certbot)
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Configuración de archivos estáticos
    location / {
        root $APP_DIR/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache para archivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Configuración de la API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Configuración de uploads
    location /uploads {
        alias $APP_DIR/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Configuración de logs
    access_log /var/log/nginx/isoflow3_access.log;
    error_log /var/log/nginx/isoflow3_error.log;
}
EOF

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/isoflow3 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración de Nginx
print_status "Verificando configuración de Nginx..."
sudo nginx -t

# Reiniciar Nginx
print_status "Reiniciando Nginx..."
sudo systemctl restart nginx

# Inicializar base de datos
print_status "Inicializando base de datos..."
cd $APP_DIR/backend
sudo -u isoflow3 node init-db.js

# Iniciar aplicación con PM2
print_status "Iniciando aplicación con PM2..."
cd $APP_DIR
sudo -u isoflow3 pm2 start ecosystem.config.js
sudo -u isoflow3 pm2 save
sudo -u isoflow3 pm2 startup

# Configurar SSL con Certbot
print_status "Configurando SSL con Certbot..."
sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Configurar renovación automática de SSL
print_status "Configurando renovación automática de SSL..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

# Crear script de mantenimiento
print_status "Creando script de mantenimiento..."
sudo tee $APP_DIR/maintenance.sh > /dev/null <<EOF
#!/bin/bash

# Script de mantenimiento ISOFlow3
# Uso: sudo ./maintenance.sh [comando]

case "\$1" in
    "restart")
        echo "Reiniciando aplicación..."
        sudo -u isoflow3 pm2 restart all
        ;;
    "stop")
        echo "Deteniendo aplicación..."
        sudo -u isoflow3 pm2 stop all
        ;;
    "start")
        echo "Iniciando aplicación..."
        sudo -u isoflow3 pm2 start all
        ;;
    "logs")
        echo "Mostrando logs..."
        sudo -u isoflow3 pm2 logs
        ;;
    "status")
        echo "Estado de la aplicación..."
        sudo -u isoflow3 pm2 status
        ;;
    "update")
        echo "Actualizando aplicación..."
        cd $APP_DIR
        sudo -u isoflow3 git pull
        cd backend && sudo -u isoflow3 npm install --production
        cd ../frontend && sudo -u isoflow3 npm install --production
        sudo -u isoflow3 npm run build
        sudo -u isoflow3 pm2 restart all
        ;;
    *)
        echo "Comandos disponibles:"
        echo "  restart  - Reiniciar aplicación"
        echo "  stop     - Detener aplicación"
        echo "  start    - Iniciar aplicación"
        echo "  logs     - Ver logs"
        echo "  status   - Ver estado"
        echo "  update   - Actualizar aplicación"
        ;;
esac
EOF

sudo chmod +x $APP_DIR/maintenance.sh

# Crear documentación de despliegue
print_status "Creando documentación de despliegue..."
sudo tee $APP_DIR/DEPLOYMENT_INFO.md > /dev/null <<EOF
# 🚀 Información de Despliegue ISOFlow3

## 📋 Datos del Servidor
- **Dominio**: $DOMAIN
- **Email**: $EMAIL
- **Directorio**: $APP_DIR
- **Usuario**: isoflow3

## 🔧 Comandos de Mantenimiento

### Reiniciar aplicación
\`\`\`bash
sudo $APP_DIR/maintenance.sh restart
\`\`\`

### Ver logs
\`\`\`bash
sudo $APP_DIR/maintenance.sh logs
\`\`\`

### Ver estado
\`\`\`bash
sudo $APP_DIR/maintenance.sh status
\`\`\`

### Actualizar aplicación
\`\`\`bash
sudo $APP_DIR/maintenance.sh update
\`\`\`

## 📊 Monitoreo
- **PM2**: \`pm2 status\`
- **Nginx**: \`sudo systemctl status nginx\`
- **Logs**: \`$APP_DIR/logs/\`

## 🔒 Seguridad
- SSL configurado con Let's Encrypt
- Renovación automática configurada
- Firewall recomendado: \`sudo ufw enable\`

## 📞 Soporte
En caso de problemas, revisar:
1. Logs de PM2: \`pm2 logs\`
2. Logs de Nginx: \`sudo tail -f /var/log/nginx/isoflow3_error.log\`
3. Estado de servicios: \`sudo systemctl status nginx\`
EOF

# Configurar firewall básico
print_status "Configurando firewall básico..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Verificar instalación
print_status "Verificando instalación..."
sleep 5

# Verificar que la aplicación esté corriendo
if sudo -u isoflow3 pm2 list | grep -q "online"; then
    print_success "✅ Aplicación iniciada correctamente"
else
    print_error "❌ Error al iniciar la aplicación"
    exit 1
fi

# Verificar que Nginx esté corriendo
if sudo systemctl is-active --quiet nginx; then
    print_success "✅ Nginx funcionando correctamente"
else
    print_error "❌ Error con Nginx"
    exit 1
fi

# Mostrar información final
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🎉 DESPLIEGUE COMPLETADO                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_success "ISOFlow3 ha sido desplegado exitosamente!"
echo ""
echo "📋 Información importante:"
echo "  🌐 URL de acceso: https://$DOMAIN"
echo "  📁 Directorio: $APP_DIR"
echo "  👤 Usuario: isoflow3"
echo "  📖 Documentación: $APP_DIR/DEPLOYMENT_INFO.md"
echo ""
echo "🔧 Comandos útiles:"
echo "  - Ver estado: sudo $APP_DIR/maintenance.sh status"
echo "  - Ver logs: sudo $APP_DIR/maintenance.sh logs"
echo "  - Reiniciar: sudo $APP_DIR/maintenance.sh restart"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  - Configure un usuario administrador en la aplicación"
echo "  - Revise la documentación de despliegue"
echo "  - Configure backups regulares de la base de datos"
echo ""
print_success "¡El sistema está listo para usar!" 