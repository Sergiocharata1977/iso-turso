#!/bin/bash

# Script de diagnóstico para identificar problemas del servidor
# Ejecutar en /var/www/isoflow3

echo "🔍 Iniciando diagnóstico del servidor..."

# Variables
PROJECT_PATH="/var/www/isoflow3"
BACKEND_PORT=5000
FRONTEND_PORT=80

# 1. Verificar estructura del proyecto
echo "📁 Verificando estructura del proyecto..."
echo "Directorio actual: $(pwd)"
ls -la

# 2. Verificar backend
echo "🔧 Verificando backend..."
cd backend
echo "Backend package.json existe: $([ -f "package.json" ] && echo "✅" || echo "❌")"
echo "Backend node_modules existe: $([ -d "node_modules" ] && echo "✅" || echo "❌")"

# 3. Verificar frontend
echo "🎨 Verificando frontend..."
cd ../frontend
echo "Frontend package.json existe: $([ -f "package.json" ] && echo "✅" || echo "❌")"
echo "Frontend node_modules existe: $([ -d "node_modules" ] && echo "✅" || echo "❌")"
echo "Frontend dist existe: $([ -d "dist" ] && echo "✅" || echo "❌")"

if [ -d "dist" ]; then
    echo "📦 Contenido de dist/:"
    ls -la dist/
fi

# 4. Verificar PM2
echo "⚡ Verificando PM2..."
cd ..
pm2 status
pm2 logs isoflow3-backend --lines 10

# 5. Verificar nginx
echo "🌐 Verificando nginx..."
systemctl status nginx --no-pager
nginx -t

# 6. Verificar puertos
echo "🔌 Verificando puertos..."
netstat -tlnp | grep :$BACKEND_PORT
netstat -tlnp | grep :$FRONTEND_PORT

# 7. Verificar configuración de nginx
echo "📋 Configuración de nginx:"
if [ -f "/etc/nginx/sites-enabled/isoflow3" ]; then
    cat /etc/nginx/sites-enabled/isoflow3
else
    echo "❌ Configuración de nginx no encontrada"
    ls -la /etc/nginx/sites-enabled/
fi

# 8. Verificar logs
echo "📝 Últimos logs de nginx:"
tail -10 /var/log/nginx/error.log 2>/dev/null || echo "❌ No se pueden leer logs de nginx"

echo "🔍 Diagnóstico completado!" 