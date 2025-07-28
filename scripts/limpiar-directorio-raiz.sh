#!/bin/bash

# Script para limpiar archivos que no deberían estar en el directorio raíz
# Ejecutar en /var/www/isoflow3

echo "🧹 Limpiando directorio raíz del proyecto..."

# 1. Mover archivos de base de datos a backend/
if [ -f "data.db" ]; then
    echo "📦 Moviendo data.db a backend/"
    mv data.db backend/
fi

# 2. Mover node_modules a backend/ si está en la raíz
if [ -d "node_modules" ]; then
    echo "📦 Moviendo node_modules a backend/"
    mv node_modules backend/
fi

# 3. Mover package.json y package-lock.json a backend/
if [ -f "package.json" ]; then
    echo "📦 Moviendo package.json a backend/"
    mv package.json backend/
fi

if [ -f "package-lock.json" ]; then
    echo "📦 Moviendo package-lock.json a backend/"
    mv package-lock.json backend/
fi

# 4. Mover archivos de test a backend/
echo "📦 Moviendo archivos de test a backend/"
mv test-*.js backend/ 2>/dev/null || true
mv test-*.sql backend/ 2>/dev/null || true

# 5. Mover otros archivos de configuración
if [ -f "babel.config.js" ]; then
    echo "📦 Moviendo babel.config.js a backend/"
    mv babel.config.js backend/
fi

# 6. Mover archivos de actualización
if [ -f "update-personal-table.js" ]; then
    echo "📦 Moviendo update-personal-table.js a backend/scripts/"
    mv update-personal-table.js backend/scripts/
fi

# 7. Mover archivos SQL a db/
echo "📦 Moviendo archivos SQL a db/"
mv *.sql db/ 2>/dev/null || true

echo "✅ Limpieza completada!"
echo "📁 Estructura actual:"
ls -la 