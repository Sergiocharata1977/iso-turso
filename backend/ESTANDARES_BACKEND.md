# Estándares Backend - ISOFlow3

## 📋 Resumen Ejecutivo

Este documento establece los estándares y convenciones para el desarrollo del backend de ISOFlow3, basado en el análisis de la estructura actual del proyecto.

## 🏗️ Configuración del Proyecto

### Tipo de Módulos
- **ES Modules (ESM)**: El proyecto está configurado como ES Modules
- **package.json**: `"type": "module"`
- **Extensión de archivos**: `.js` (no `.mjs`)

## 📁 Estructura de Archivos

```
backend/
├── index.js                 # Punto de entrada principal
├── routes/                  # Rutas de la API
├── controllers/             # Controladores de lógica de negocio
├── middleware/              # Middlewares personalizados
├── lib/                     # Librerías y utilidades
├── services/                # Servicios de negocio
└── scripts/                 # Scripts de utilidad
```

## 🔧 Estándares de Código

### 1. Importaciones/Exportaciones

#### ✅ CORRECTO - ES Modules
```javascript
// Importaciones
import express from 'express';
import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

// Exportaciones
export default router;
export { functionName };
```

#### ❌ INCORRECTO - CommonJS
```javascript
// NO USAR
const express = require('express');
module.exports = router;
```

### 2. Estructura de Rutas

#### Template Estándar para Rutas
```javascript
import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = Router();

// GET - Listar
router.get('/', async (req, res, next) => {
  try {
    const result = await tursoClient.execute('SELECT * FROM tabla');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST - Crear
router.post('/', async (req, res, next) => {
  try {
    // Lógica de creación
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar
router.put('/:id', async (req, res, next) => {
  try {
    // Lógica de actualización
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    // Lógica de eliminación
    res.json({ message: 'Eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### 3. Estructura de Controladores

#### Template Estándar para Controladores
```javascript
import { tursoClient } from '../lib/tursoClient.js';

// Listar
export const getAll = async (req, res) => {
  try {
    const result = await tursoClient.execute('SELECT * FROM tabla');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear
export const create = async (req, res) => {
  try {
    // Lógica de creación
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar
export const update = async (req, res) => {
  try {
    // Lógica de actualización
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar
export const remove = async (req, res) => {
  try {
    // Lógica de eliminación
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 🔗 Registro de Rutas en index.js

### Template Estándar
```javascript
// Importar rutas
import competenciasRouter from './routes/competencias.routes.js';
import departamentosRouter from './routes/departamentos.routes.js';

// Registrar rutas (después del middleware de autenticación)
app.use('/api/competencias', competenciasRouter);
app.use('/api/departamentos', departamentosRouter);
```

## 🚨 Errores Comunes y Soluciones

### Error: "does not provide an export named 'default'"
**Causa**: Mezcla de sintaxis ES Modules y CommonJS
**Solución**: Usar consistentemente ES Modules

```javascript
// ❌ INCORRECTO
const router = require('express').Router();
module.exports = router;

// ✅ CORRECTO
import { Router } from 'express';
const router = Router();
export default router;
```

### Error: "Cannot use import statement outside a module"
**Causa**: Archivo no reconocido como ES Module
**Solución**: Verificar que `"type": "module"` esté en package.json

## 📝 Checklist para Nuevos Archivos

- [ ] Usar sintaxis ES Modules (`import`/`export`)
- [ ] Incluir extensión `.js` en importaciones relativas
- [ ] Usar `export default` para el router principal
- [ ] Registrar la ruta en `index.js`
- [ ] Seguir el template de estructura estándar
- [ ] Incluir manejo de errores con `try/catch`
- [ ] Usar `next(error)` para propagar errores

## 🔄 Migración de Archivos Existentes

Si encuentras archivos usando CommonJS, migrarlos a ES Modules:

1. Cambiar `require()` por `import`
2. Cambiar `module.exports` por `export default`
3. Agregar extensiones `.js` en importaciones relativas
4. Verificar que funcione correctamente

## 📚 Referencias

- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [Express.js Documentation](https://expressjs.com/)
- [Turso Client Documentation](https://docs.turso.tech/)

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Responsable**: Equipo de Desarrollo ISOFlow3 