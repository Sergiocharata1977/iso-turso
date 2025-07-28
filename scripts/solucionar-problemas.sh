#!/bin/bash

# Script para solucionar problemas comunes del servidor
# Ejecutar en /var/www/isoflow3

echo "🔧 Iniciando solución de problemas..."

# Variables
PROJECT_PATH="/var/www/isoflow3"

# 1. Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: No estamos en el directorio correcto del proyecto"
    exit 1
fi

# 2. Reinstalar dependencias del backend
echo "📦 Reinstalando dependencias del backend..."
cd backend
rm -rf node_modules package-lock.json
npm install

# 3. Verificar que el backend funcione
echo "🔧 Verificando backend..."
if [ -f "index.js" ]; then
    echo "✅ index.js encontrado"
else
    echo "❌ index.js no encontrado"
    ls -la
fi

# 4. Reinstalar dependencias del frontend
echo "📦 Reinstalando dependencias del frontend..."
cd ../frontend
rm -rf node_modules package-lock.json dist
npm install

# 5. Construir frontend
echo "🔨 Construyendo frontend..."
npm run build

# 6. Verificar que se creó el directorio dist
if [ -d "dist" ]; then
    echo "✅ Frontend construido correctamente"
    ls -la dist/
else
    echo "❌ Error: No se creó el directorio dist"
    exit 1
fi

# 7. Volver al directorio raíz
cd ..

# 8. Reiniciar PM2
echo "⚡ Reiniciando PM2..."
pm2 delete isoflow3-backend 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

# 9. Verificar configuración de nginx
echo "🌐 Verificando configuración de nginx..."
if [ ! -f "/etc/nginx/sites-enabled/isoflow3" ]; then
    echo "❌ Configuración de nginx no encontrada, creando..."
    
    # Crear configuración básica de nginx
    cat > /etc/nginx/sites-available/isoflow3 << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/isoflow3/frontend/dist;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Logs
    access_log /var/log/nginx/isoflow3_access.log;
    error_log /var/log/nginx/isoflow3_error.log;
}
EOF

    # Habilitar configuración
    ln -sf /etc/nginx/sites-available/isoflow3 /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
fi

# 10. Verificar configuración de nginx
nginx -t

# 11. Reiniciar nginx
echo "🔄 Reiniciando nginx..."
systemctl restart nginx

# 12. Verificar servicios
echo "✅ Verificando servicios..."
pm2 status
systemctl status nginx --no-pager

# 13. Probar endpoints
echo "🧪 Probando endpoints..."
sleep 3
curl -I http://localhost:5000/api/health 2>/dev/null || echo "❌ Backend no responde"
curl -I http://localhost 2>/dev/null || echo "❌ Frontend no responde"

echo "🎉 Solución de problemas completada!"
echo "🌐 Tu aplicación debería estar disponible en: http://31.97.162.229" 