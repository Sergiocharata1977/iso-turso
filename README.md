# 🏢 ISOFlow3 - Sistema de Gestión de Calidad

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/tu-usuario/isoflow3)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![ISO](https://img.shields.io/badge/ISO-9001-red.svg)](https://www.iso.org/iso-9001-quality-management.html)

Sistema integral de gestión de calidad basado en ISO 9001 con arquitectura SaaS Multi-Tenant.

## 🎯 Descripción

ISOFlow3 es una solución completa para la gestión de calidad empresarial que permite a múltiples organizaciones gestionar sus procesos de calidad de manera independiente y segura. Desarrollado con tecnologías modernas y siguiendo los estándares ISO 9001.

### ✨ Características Principales

- 🏢 **Multi-Tenant**: Aislamiento total entre organizaciones
- 📋 **ISO 9001**: Cumplimiento completo de estándares de calidad
- 🔒 **Seguridad**: Autenticación JWT y control de acceso granular
- 📊 **Auditoría**: Registro completo de todas las actividades
- 🎨 **Interfaz moderna**: Diseño responsive y profesional
- 🔄 **Workflows**: Flujos de trabajo optimizados para calidad

## 🚀 Tecnologías

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** + **shadcn/ui**
- **React Router** + **Axios**

### Backend
- **Node.js** + **Express**
- **Turso** (SQLite distribuido)
- **JWT** + **bcrypt**

## 📚 Documentación

La documentación completa del proyecto está unificada en **5 documentos principales**:

### 📄 [PROYECTO_ISOFLOW3.md](PROYECTO_ISOFLOW3.md)
**Documento principal del proyecto**
- 🎯 Descripción general del sistema
- 📊 Estado actual y módulos implementados
- 🏗️ Arquitectura y stack tecnológico
- 📁 Estructura de archivos y organización
- 🔗 Relaciones del sistema y base de datos

### 📄 [CASOS_DE_USO.md](CASOS_DE_USO.md)
**Casos de uso del sistema**
- 👥 Actores y responsabilidades
- 📋 Casos de uso por módulo (39 casos documentados)
- 🔄 Flujos de trabajo detallados
- 🎯 Escenarios de uso reales
- 📊 Métricas y resultados esperados

### 📄 [NORMAS_Y_ESTANDARES.md](NORMAS_Y_ESTANDARES.md)
**Normas y estándares del proyecto**
- 🛡️ Protocolo multi-tenant obligatorio
- 🎨 Estándares de diseño y UI/UX
- 💻 Convenciones de código y desarrollo
- 🔒 Estándares de seguridad
- 📋 Checklist de implementación

### 📄 [FLUJOS_DE_TRABAJO.md](FLUJOS_DE_TRABAJO.md)
**Workflows y procesos del sistema**
- 📋 Flujo de capacitaciones (Sistema Kanban)
- 🔍 Flujo de hallazgos y acciones correctivas
- 📊 Procesos de calidad y mejora continua
- 🎓 Evaluaciones de personal
- 🔍 Auditorías internas

### 📄 [GUIA_DESPLIEGUE_VPS.md](GUIA_DESPLIEGUE_VPS.md)
**Guía de despliegue en VPS**
- 🚀 Despliegue automático sin conocimientos técnicos
- 📋 Requisitos y preparación del servidor
- 🔧 Comandos de mantenimiento
- 🆘 Solución de problemas
- 🔒 Configuración de seguridad

## 🏗️ Arquitectura

### Multi-Tenant
```
organizations (1) ←→ (N) usuarios
    ↓
Todos los datos aislados por organization_id
```

### Módulos Principales
- **👥 RRHH**: Personal, capacitaciones, evaluaciones
- **📊 Procesos**: Gestión de procesos, indicadores, objetivos
- **🔍 Calidad**: Hallazgos, acciones correctivas, auditorías
- **📋 Documentos**: Control documental, normas
- **🎯 Otros**: Productos, tickets, encuestas

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn
- Base de datos Turso

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/isoflow3.git
cd isoflow3

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar backend
cd ../backend
npm run dev

# Iniciar frontend (en otra terminal)
cd ../frontend
npm run dev
```

### Primer uso
1. Acceder a `http://localhost:3000`
2. Registrar primera organización
3. Crear usuario administrador
4. Configurar procesos iniciales

## 🔧 Desarrollo

### Estructura del proyecto
```
isoflow3/
├── backend/           # API y servidor
├── frontend/          # Aplicación React
├── docs/              # Documentación adicional
└── scripts/           # Scripts de utilidad
```

### Comandos útiles
```bash
# Backend
npm run dev          # Desarrollo
npm run start        # Producción
npm run test         # Tests

# Frontend
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview build
```

## 🛡️ Seguridad

- **Autenticación**: JWT con refresh tokens
- **Autorización**: Sistema de roles granular
- **Multi-tenancy**: Aislamiento completo de datos
- **Validación**: Sanitización de inputs
- **Auditoría**: Log completo de actividades

## 📊 Estado del Proyecto

### ✅ Completado
- [x] Arquitectura multi-tenant
- [x] Autenticación y autorización
- [x] Módulos principales (15)
- [x] Interfaz responsive
- [x] Documentación unificada

### 🔄 En desarrollo
- [ ] Reportes avanzados
- [ ] Notificaciones push
- [ ] Aplicación móvil
- [ ] Integración con APIs externas

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Antes de contribuir
- Leer [NORMAS_Y_ESTANDARES.md](NORMAS_Y_ESTANDARES.md)
- Seguir las convenciones de código
- Respetar el protocolo multi-tenant
- Incluir tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- 📧 Email: soporte@isoflow3.com
- 📝 Issues: [GitHub Issues](https://github.com/tu-usuario/isoflow3/issues)
- 📖 Wiki: [GitHub Wiki](https://github.com/tu-usuario/isoflow3/wiki)

---

**¡Gracias por usar ISOFlow3! 🎉** 