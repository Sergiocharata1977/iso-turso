# 🚀 Guía de Despliegue - ISOFlow3 en Hostinger VPS

Esta guía te ayudará a desplegar tu aplicación ISOFlow3 en un servidor VPS de Hostinger.

## 📋 Prerrequisitos

- VPS de Hostinger con Ubuntu 24.04 LTS
- Acceso SSH al servidor
- Dominio configurado (opcional para SSL)
- Base de datos Turso configurada

## 🔧 Paso 1: Preparación del Servidor

### 1.1 Conectar al servidor
```bash
ssh root@31.97.162.229
```

### 1.2 Actualizar el sistema
```bash
apt update && apt upgrade -y
```

### 1.3 Instalar dependencias básicas
```bash
apt install -y curl wget git unzip software-properties-common
```

## 📦 Paso 2: Instalar Node.js y PM2

### 2.1 Instalar Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### 2.2 Verificar instalación
```bash
node --version
npm --version
```

### 2.3 Instalar PM2 globalmente
```bash
npm install -g pm2
```

## 🌐 Paso 3: Instalar y Configurar Nginx

### 3.1 Instalar Nginx
```bash
apt install -y nginx
```

### 3.2 Configurar Nginx
```bash
# Copiar la configuración del proyecto
cp nginx.conf /etc/nginx/sites-available/isoflow3

# Crear enlace simbólico
ln -sf /etc/nginx/sites-available/isoflow3 /etc/nginx/sites-enabled/

# Remover configuración por defecto
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx
```

## 🔒 Paso 4: Configurar SSL (Opcional)

### 4.1 Instalar Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### 4.2 Obtener certificado SSL
```bash
# Reemplaza 'tu-dominio.com' con tu dominio real
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

## 📁 Paso 5: Desplegar la Aplicación

### 5.1 Crear directorio del proyecto
```bash
mkdir -p /var/www/isoflow3
cd /var/www
```

### 5.2 Subir archivos del proyecto
```bash
# Opción 1: Usando Git (recomendado)
git clone https://github.com/tu-usuario/isoflow3.git

# Opción 2: Subir archivos manualmente
# Usa SCP o SFTP para subir los archivos desde tu máquina local
```

### 5.3 Configurar variables de entorno
```bash
cd /var/www/isoflow3/backend
cp env.example .env

# Editar el archivo .env con tus configuraciones reales
nano .env
```

### 5.4 Instalar dependencias
```bash
# Dependencias del backend
cd /var/www/isoflow3
npm install

# Dependencias del frontend
cd /var/www/isoflow3/frontend
npm install
```

### 5.5 Construir frontend
```bash
cd /var/www/isoflow3/frontend
npm run build
```

## ⚡ Paso 6: Configurar PM2

### 6.1 Iniciar aplicación con PM2
```bash
cd /var/www/isoflow3
pm2 start ecosystem.config.js --env production
```

### 6.2 Guardar configuración de PM2
```bash
pm2 save
pm2 startup
```

### 6.3 Verificar estado
```bash
pm2 status
pm2 logs isoflow3-backend
```

## 🔥 Paso 7: Configurar Firewall

### 7.1 Configurar UFW
```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

## 📊 Paso 8: Verificar el Despliegue

### 8.1 Verificar servicios
```bash
# Verificar Nginx
systemctl status nginx

# Verificar PM2
pm2 status

# Verificar puertos
netstat -tlnp | grep :80
netstat -tlnp | grep :443
netstat -tlnp | grep :5000
```

### 8.2 Probar la aplicación
```bash
# Frontend
curl -I http://localhost

# Backend
curl -I http://localhost:5000
```

## 🔧 Comandos Útiles

### Gestión de la aplicación
```bash
# Ver logs
pm2 logs isoflow3-backend

# Reiniciar aplicación
pm2 restart isoflow3-backend

# Parar aplicación
pm2 stop isoflow3-backend

# Ver estado
pm2 status

# Ver logs de Nginx
tail -f /var/log/nginx/isoflow3_access.log
tail -f /var/log/nginx/isoflow3_error.log
```

### Actualizaciones
```bash
# Actualizar código
cd /var/www/isoflow3
git pull origin main

# Reinstalar dependencias (si es necesario)
npm install
cd frontend && npm install

# Reconstruir frontend
cd /var/www/isoflow3/frontend
npm run build

# Reiniciar aplicación
pm2 restart isoflow3-backend
```

### Backup
```bash
# Crear backup
tar -czf /var/backups/isoflow3-$(date +%Y%m%d-%H%M%S).tar.gz -C /var/www/isoflow3 .

# Restaurar backup
tar -xzf /var/backups/isoflow3-backup.tar.gz -C /var/www/isoflow3/
```

## 🚨 Solución de Problemas

### Error de permisos
```bash
chown -R www-data:www-data /var/www/isoflow3
chmod -R 755 /var/www/isoflow3
```

### Error de puerto ocupado
```bash
# Ver qué proceso usa el puerto
lsof -i :5000

# Matar proceso si es necesario
kill -9 PID
```

### Error de base de datos
```bash
# Verificar conexión a Turso
cd /var/www/isoflow3/backend
node -e "const { testConnection } = require('./lib/tursoClient.js'); testConnection();"
```

### Logs de errores
```bash
# Logs de PM2
pm2 logs isoflow3-backend --lines 100

# Logs de Nginx
tail -f /var/log/nginx/isoflow3_error.log

# Logs del sistema
journalctl -u nginx -f
```

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs de error
2. Verifica la configuración de variables de entorno
3. Asegúrate de que todos los servicios estén funcionando
4. Verifica la conectividad de red y firewall

## 🎯 Próximos Pasos

1. **Configurar dominio**: Apunta tu dominio al IP del servidor
2. **Configurar SSL**: Ejecuta Certbot con tu dominio
3. **Configurar backups automáticos**: Configura cron jobs para backups
4. **Monitoreo**: Configura herramientas de monitoreo como UptimeRobot
5. **Optimización**: Configura CDN y optimizaciones de rendimiento

---

¡Tu aplicación ISOFlow3 debería estar funcionando en producción! 🎉 