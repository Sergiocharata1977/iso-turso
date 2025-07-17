# 🤝 Contribuir a ISOFlow3

¡Gracias por tu interés en contribuir a ISOFlow3! Este documento proporciona las pautas para contribuir al proyecto.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#-código-de-conducta)
2. [Cómo Contribuir](#-cómo-contribuir)
3. [Proceso de Desarrollo](#-proceso-de-desarrollo)
4. [Estándares de Código](#-estándares-de-código)
5. [Guía de Commits](#-guía-de-commits)
6. [Proceso de Pull Request](#-proceso-de-pull-request)
7. [Reportar Problemas](#-reportar-problemas)
8. [Configuración del Entorno](#-configuración-del-entorno)

## 🤝 Código de Conducta

Este proyecto y todos los participantes se rigen por nuestro Código de Conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables.

### Principios Básicos:
- 🌟 **Sé respetuoso**: Trata a todos con respeto y cortesía
- 🤝 **Sé colaborativo**: Trabaja en equipo y ayuda a otros
- 📚 **Sé constructivo**: Proporciona feedback útil y constructivo
- 🔒 **Respeta la privacidad**: No compartas información confidencial

## 🚀 Cómo Contribuir

### Tipos de Contribuciones Bienvenidas:

#### 🐛 Reportar Bugs
- Usa el [template de bug report](.github/ISSUE_TEMPLATE.md)
- Incluye pasos para reproducir el problema
- Proporciona información del sistema
- Especifica el módulo afectado

#### ✨ Solicitar Nuevas Funcionalidades
- Usa el [template de feature request](.github/FEATURE_REQUEST_TEMPLATE.md)
- Explica el problema que resuelve
- Considera el impacto en multi-tenancy
- Incluye mockups si es posible

#### 📚 Mejorar Documentación
- Corregir errores tipográficos
- Mejorar explicaciones
- Agregar ejemplos
- Actualizar información obsoleta

#### 💻 Contribuir Código
- Solucionar bugs existentes
- Implementar nuevas funcionalidades
- Refactorizar código existente
- Agregar tests

## 🔄 Proceso de Desarrollo

### 1. 🍴 Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/isoflow3.git
cd isoflow3
```

### 2. 🌿 Crear Rama
```bash
# Crear rama para tu contribución
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
# o
git checkout -b docs/mejora-documentacion
```

### 3. 🔧 Configurar Entorno
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno

# Frontend
cd ../frontend
npm install
```

### 4. 💻 Desarrollar
- Sigue los [estándares de código](#-estándares-de-código)
- Escribe tests para tu código
- Actualiza documentación si es necesario
- Respeta el protocolo multi-tenant

### 5. 🧪 Probar
```bash
# Backend
cd backend
npm test
npm run dev

# Frontend
cd ../frontend
npm test
npm run dev
```

### 6. 📝 Commit
```bash
# Seguir guía de commits
git add .
git commit -m "feat: agregar nueva funcionalidad de reportes"
```

### 7. 🚀 Push y PR
```bash
git push origin feature/nueva-funcionalidad
# Crear Pull Request en GitHub
```

## 📋 Estándares de Código

### 🛡️ Protocolo Multi-Tenant (OBLIGATORIO)

Toda contribución **DEBE** respetar el protocolo multi-tenant:

```javascript
// ✅ Backend - Patrón obligatorio
import { ensureTenant, secureQuery, logTenantOperation } from '../middleware/tenantMiddleware.js';

router.use(authMiddleware);
router.use(ensureTenant);

router.get('/', async (req, res) => {
  const query = secureQuery(req);
  const result = await tursoClient.execute({
    sql: `SELECT * FROM tabla WHERE ${query.where()}`,
    args: query.args()
  });
  logTenantOperation(req, 'GET_TABLA', { count: result.rows.length });
  res.json(result.rows);
});
```

```javascript
// ✅ Frontend - Verificación obligatoria
import { authStore } from '../store/authStore.js';

export const service = {
  getAll: async () => {
    const organizationId = authStore.getOrganizationId();
    if (!organizationId) {
      throw new Error('Se requiere organization_id');
    }
    return apiService.get('/api/endpoint');
  }
};
```

### 🎨 Estándares de UI/UX

#### Nomenclatura de Componentes
```
✅ Correcto:
PersonalListing.jsx
PersonalSingle.jsx
PersonalCard.jsx
PersonalModal.jsx

❌ Incorrecto:
personal-listing.jsx
Personal_Single.jsx
personalcard.jsx
```

#### Estructura de Componentes
```jsx
// ✅ Estructura estándar
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Efectos
  useEffect(() => {
    loadData();
  }, []);

  // 3. Funciones
  const loadData = async () => {
    // Lógica de carga
  };

  // 4. Renderizado
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return <Card>...</Card>;
};

export default ComponentName;
```

#### Uso de Componentes UI
```jsx
// ✅ Usar shadcn/ui components
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ✅ Clases responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 📁 Organización de Archivos

```
frontend/src/components/
├── [modulo]/
│   ├── [Modulo]Listing.jsx    # Lista principal
│   ├── [Modulo]Single.jsx     # Vista detallada
│   ├── [Modulo]Card.jsx       # Tarjeta
│   ├── [Modulo]Modal.jsx      # Modal CRUD
│   └── forms/                 # Formularios específicos
```

## 📝 Guía de Commits

### Formato de Commits
```
<tipo>(<scope>): <descripción>

<cuerpo del commit>

<footer>
```

### Tipos de Commits
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos:
```bash
feat(personal): agregar vista detallada de empleado
fix(hallazgos): corregir filtro por organización
docs(readme): actualizar instrucciones de instalación
style(ui): mejorar responsive design en tarjetas
refactor(api): optimizar queries de base de datos
test(auth): agregar tests para autenticación
chore(deps): actualizar dependencias de seguridad
```

## 🔍 Proceso de Pull Request

### 1. 📋 Antes de Crear el PR

- [ ] ✅ He leído [NORMAS_Y_ESTANDARES.md](NORMAS_Y_ESTANDARES.md)
- [ ] ✅ He seguido los estándares de código
- [ ] ✅ He probado mis cambios localmente
- [ ] ✅ He verificado el protocolo multi-tenant
- [ ] ✅ He incluido tests apropiados
- [ ] ✅ He actualizado la documentación

### 2. 📝 Crear el PR

- Usa el [template de pull request](.github/PULL_REQUEST_TEMPLATE.md)
- Título claro y descriptivo
- Descripción detallada de los cambios
- Referencia a issues relacionados
- Screenshots para cambios visuales

### 3. 🔍 Revisión del Código

Tu PR será revisado por:
- ✅ **Adherencia a estándares**: Código sigue las convenciones
- ✅ **Protocolo multi-tenant**: Respeta aislamiento entre organizaciones
- ✅ **Funcionalidad**: Los cambios funcionan como se espera
- ✅ **Tests**: Incluye tests apropiados
- ✅ **Documentación**: Documentación actualizada
- ✅ **Seguridad**: No introduce vulnerabilidades

### 4. 🔄 Proceso de Revisión

1. **Revisión automática**: GitHub Actions ejecuta tests
2. **Revisión manual**: Mantener revisa el código
3. **Feedback**: Se proporcionan comentarios si es necesario
4. **Correcciones**: Realizar cambios solicitados
5. **Aprobación**: PR aprobado y listo para merge
6. **Merge**: Cambios integrados al proyecto

## 🐛 Reportar Problemas

### 🚨 Problemas de Seguridad
**NO** reportes problemas de seguridad públicamente. Envía un email privado a: security@isoflow3.com

### 🐛 Bugs Regulares
1. Busca en issues existentes
2. Usa el [template de bug report](.github/ISSUE_TEMPLATE.md)
3. Incluye información completa
4. Especifica el módulo afectado
5. Proporciona pasos para reproducir

### ✨ Solicitudes de Funcionalidad
1. Busca en issues existentes
2. Usa el [template de feature request](.github/FEATURE_REQUEST_TEMPLATE.md)
3. Explica el problema que resuelve
4. Considera el impacto en multi-tenancy
5. Incluye mockups si es posible

## 🛠️ Configuración del Entorno

### Requisitos
- Node.js 18+
- npm o yarn
- Git
- Editor de código (VS Code recomendado)

### Configuración Inicial
```bash
# 1. Clonar repositorio
git clone https://github.com/TU_USUARIO/isoflow3.git
cd isoflow3

# 2. Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# 3. Configurar variables de entorno
cd backend
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Iniciar en modo desarrollo
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Extensiones Recomendadas (VS Code)
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Tailwind CSS IntelliSense
- Thunder Client (para probar APIs)
- GitLens
- Prettier

### Configuración de Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 📊 Métricas de Contribución

### ✅ Criterios de Éxito
- **Funcionalidad**: Los cambios funcionan como se espera
- **Protocolo**: Respeta el protocolo multi-tenant
- **Tests**: Incluye tests apropiados (>80% cobertura)
- **Documentación**: Documentación actualizada
- **Estándares**: Sigue las convenciones del proyecto

### 📈 Proceso de Mejora
- Feedback constructivo en todas las revisiones
- Aprendizaje continuo y mejora de procesos
- Documentación de mejores prácticas
- Automatización de validaciones

## 🆘 Soporte y Ayuda

### 💬 Canales de Comunicación
- **Issues**: Para bugs y solicitudes de funcionalidad
- **Discussions**: Para preguntas generales
- **Email**: team@isoflow3.com

### 📚 Recursos Adicionales
- [Documentación completa](README.md)
- [Normas y estándares](NORMAS_Y_ESTANDARES.md)
- [Flujos de trabajo](FLUJOS_DE_TRABAJO.md)
- [Guía de inicio rápido](README.md#-inicio-rápido)

### 🤝 Mentorship
¿Nuevo en el proyecto? ¡Bienvenido! Puedes:
- Empezar con issues marcados como "good first issue"
- Pedir ayuda en las discusiones
- Unirte a nuestras sesiones de onboarding

---

## 🎉 ¡Gracias por Contribuir!

Cada contribución, grande o pequeña, es valiosa para el proyecto. ¡Esperamos trabajar contigo para hacer de ISOFlow3 un mejor sistema de gestión de calidad!

**¡Happy coding! 🚀** 