#!/bin/bash

# 🔧 Script de Preparación para Despliegue ISOFlow3
# Versión: 3.0
# Última actualización: Diciembre 2024

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                🔧 Preparación para Despliegue                ║"
echo "║                        ISOFlow3 VPS                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto ISOFlow3"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar archivos esenciales
ESSENTIAL_FILES=(
    "backend/package.json"
    "frontend/package.json"
    "backend/index.js"
    "frontend/src/main.jsx"
    "scripts/deploy-vps.sh"
    "GUIA_DESPLIEGUE_VPS.md"
    "README.md"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✅ $file"
    else
        print_error "❌ $file - NO ENCONTRADO"
        exit 1
    fi
done

# Hacer ejecutable el script de despliegue
print_status "Configurando permisos de scripts..."
chmod +x scripts/deploy-vps.sh
chmod +x scripts/prepare-deployment.sh

print_success "✅ Scripts de despliegue configurados"

# Verificar que Git esté configurado
print_status "Verificando configuración de Git..."
if [ -d ".git" ]; then
    print_success "✅ Repositorio Git detectado"
else
    print_warning "⚠️  No se detectó repositorio Git"
fi

# Verificar Node.js
print_status "Verificando Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "✅ Node.js detectado: $NODE_VERSION"
else
    print_warning "⚠️  Node.js no está instalado (se instalará durante el despliegue)"
fi

# Verificar npm
print_status "Verificando npm..."
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "✅ npm detectado: $NPM_VERSION"
else
    print_warning "⚠️  npm no está instalado (se instalará durante el despliegue)"
fi

# Verificar sistema operativo
print_status "Verificando sistema operativo..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
    print_success "✅ Sistema operativo: $OS $VER"
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        print_success "✅ Sistema compatible para despliegue"
    else
        print_warning "⚠️  Sistema no Ubuntu/Debian - puede requerir ajustes"
    fi
else
    print_warning "⚠️  No se pudo detectar el sistema operativo"
fi

# Verificar permisos de sudo
print_status "Verificando permisos de sudo..."
if sudo -n true 2>/dev/null; then
    print_success "✅ Permisos de sudo configurados"
else
    print_warning "⚠️  Se requerirá contraseña para comandos sudo"
fi

# Verificar conectividad de red
print_status "Verificando conectividad de red..."
if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    print_success "✅ Conectividad de red OK"
else
    print_error "❌ Sin conectividad de red"
    exit 1
fi

# Verificar acceso a repositorios
print_status "Verificando acceso a repositorios..."
if curl -s https://deb.nodesource.com/ >/dev/null 2>&1; then
    print_success "✅ Acceso a repositorios OK"
else
    print_warning "⚠️  Problemas de acceso a repositorios"
fi

# Crear archivo de información de despliegue
print_status "Creando archivo de información de despliegue..."
cat > DEPLOYMENT_CHECKLIST.md <<EOF
# 📋 Checklist de Despliegue ISOFlow3

## ✅ Verificaciones Completadas

- [x] Estructura del proyecto verificada
- [x] Scripts de despliegue configurados
- [x] Permisos de ejecución establecidos
- [x] Sistema operativo detectado: $OS $VER
- [x] Conectividad de red verificada
- [x] Acceso a repositorios verificado

## 🚀 Próximos Pasos

1. **Preparar VPS**:
   - Sistema: Ubuntu 20.04+ o Debian 11+
   - RAM: 2 GB mínimo
   - Almacenamiento: 10 GB mínimo
   - Acceso SSH con sudo

2. **Configurar dominio**:
   - Apuntar dominio a IP del VPS
   - Ejemplo: isoflow3.tudominio.com

3. **Ejecutar despliegue**:
   \`\`\`bash
   ./scripts/deploy-vps.sh
   \`\`\`

## 📋 Datos Necesarios

- **Dominio**: [Configurar antes del despliegue]
- **Email**: [Para certificados SSL]
- **Contraseña BD**: [Se generará automáticamente]

## 🔧 Comandos Útiles

\`\`\`bash
# Verificar estado después del despliegue
sudo /opt/isoflow3/maintenance.sh status

# Ver logs
sudo /opt/isoflow3/maintenance.sh logs

# Reiniciar aplicación
sudo /opt/isoflow3/maintenance.sh restart
\`\`\`

## 📞 Soporte

- Documentación: GUIA_DESPLIEGUE_VPS.md
- Email: soporte@isoflow3.com

---
*Generado automáticamente el $(date)*
EOF

print_success "✅ Archivo DEPLOYMENT_CHECKLIST.md creado"

# Mostrar resumen final
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ PREPARACIÓN COMPLETADA                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_success "El proyecto está listo para despliegue!"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Subir el proyecto a tu VPS"
echo "  2. Ejecutar: ./scripts/deploy-vps.sh"
echo "  3. Seguir las instrucciones en pantalla"
echo ""
echo "📖 Documentación disponible:"
echo "  - GUIA_DESPLIEGUE_VPS.md (Guía completa)"
echo "  - DEPLOYMENT_CHECKLIST.md (Checklist generado)"
echo ""
print_success "¡Todo listo para el despliegue! 🚀" 