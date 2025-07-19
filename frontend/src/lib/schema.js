import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ===============================================
// ESQUEMA DE BASE DE DATOS ISOFLOW3
// Basado en la estructura actual del sistema
// ===============================================

// 🏢 ORGANIZACIONES (Multi-tenant)
export const organizations = sqliteTable('organizations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  type: text('type').default('empresa'),
  industry: text('industry').default('general'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// 👥 USUARIOS
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('employee'),
  organization_id: integer('organization_id').notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// 🏢 DEPARTAMENTOS
export const departamentos = sqliteTable('departamentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  responsable: text('responsable'),
  estado: text('estado').default('activo'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  created_by: integer('created_by'),
  updated_by: integer('updated_by'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

// 💼 PUESTOS
export const puestos = sqliteTable('puestos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  departamento_id: integer('departamento_id'),
  nivel: text('nivel'),
  competencias_requeridas: text('competencias_requeridas'),
  estado: text('estado').default('activo'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  created_by: integer('created_by'),
  updated_by: integer('updated_by'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

// 👤 PERSONAL
export const personal = sqliteTable('personal', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  numero: text('numero'),
  nombre: text('nombre').notNull(),
  puesto: text('puesto'),
  departamento: text('departamento'),
  email: text('email'),
  telefono: text('telefono'),
  fecha_ingreso: text('fecha_ingreso'),
  documento_identidad: text('documento_identidad'),
  direccion: text('direccion'),
  formacion_academica: text('formacion_academica'),
  experiencia_laboral: text('experiencia_laboral'),
  competencias: text('competencias'),
  evaluacion_desempeno: text('evaluacion_desempeno'),
  capacitaciones_recibidas: text('capacitaciones_recibidas'),
  observaciones: text('observaciones'),
  imagen: text('imagen'),
  created_at: text('created_at'),
  updated_at: text('updated_at')
});

// 🔄 PROCESOS
export const procesos = sqliteTable('procesos', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  codigo: text('codigo').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo').default('proceso'),
  responsable: text('responsable'),
  entradas: text('entradas'),
  salidas: text('salidas'),
  indicadores: text('indicadores'),
  documentos_relacionados: text('documentos_relacionados'),
  estado: text('estado').default('activo'),
  version: text('version').default('1.0'),
  objetivo: text('objetivo'),
  alcance: text('alcance'),
  descripcion_detallada: text('descripcion_detallada'),
  fecha_creacion: text('fecha_creacion').notNull(),
  fecha_actualizacion: text('fecha_actualizacion')
});

// 📋 HALLAZGOS
export const hallazgos = sqliteTable('hallazgos', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  numeroHallazgo: text('numeroHallazgo').notNull().unique(),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  origen: text('origen'),
  categoria: text('categoria'),
  requisitoIncumplido: text('requisitoIncumplido'),
  fechaRegistro: text('fechaRegistro').default('CURRENT_TIMESTAMP'),
  estado: text('estado').notNull(),
  orden: integer('orden')
});

// ✅ ACCIONES DE MEJORA
export const acciones = sqliteTable('acciones', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  hallazgo_id: text('hallazgo_id').notNull(),
  numeroAccion: text('numeroAccion').notNull().unique(),
  estado: text('estado').notNull(),
  descripcion_accion: text('descripcion_accion'),
  responsable_accion: text('responsable_accion'),
  fecha_plan_accion: text('fecha_plan_accion'),
  comentarios_ejecucion: text('comentarios_ejecucion'),
  fecha_ejecucion: text('fecha_ejecucion'),
  descripcion_verificacion: text('descripcion_verificacion'),
  responsable_verificacion: text('responsable_verificacion'),
  fecha_plan_verificacion: text('fecha_plan_verificacion'),
  comentarios_verificacion: text('comentarios_verificacion'),
  fecha_verificacion_finalizada: text('fecha_verificacion_finalizada'),
  eficacia: text('eficacia')
});

// 📊 AUDITORÍAS
export const auditorias = sqliteTable('auditorias', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  codigo: text('codigo').notNull().unique(),
  titulo: text('titulo').notNull(),
  area: text('area').notNull(),
  responsable_id: text('responsable_id'),
  fecha_programada: text('fecha_programada').notNull(),
  fecha_ejecucion: text('fecha_ejecucion'),
  estado: text('estado').default('planificada'),
  objetivos: text('objetivos'),
  alcance: text('alcance'),
  criterios: text('criterios'),
  resultados: text('resultados'),
  observaciones: text('observaciones'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// 📄 DOCUMENTOS
export const documentos = sqliteTable('documentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  titulo: text('titulo').notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  version: text('version').default('1.0'),
  archivo_nombre: text('archivo_nombre').notNull(),
  archivo_path: text('archivo_path').notNull(),
  tipo_archivo: text('tipo_archivo'),
  tamaño: integer('tamaño'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// 📈 INDICADORES
export const indicadores = sqliteTable('indicadores', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  proceso_id: text('proceso_id'),
  tipo: text('tipo'),
  unidad_medida: text('unidad_medida'),
  meta: real('meta'),
  frecuencia: text('frecuencia'),
  responsable: text('responsable'),
  estado: text('estado').default('activo'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
});

// 📊 MEDICIONES
export const mediciones = sqliteTable('mediciones', {
  id: text('id').primaryKey(),
  organization_id: integer('organization_id').notNull(),
  indicador_id: text('indicador_id').notNull(),
  valor: real('valor').notNull(),
  fecha_medicion: text('fecha_medicion').notNull(),
  observaciones: text('observaciones'),
  responsable: text('responsable'),
  fecha_creacion: text('fecha_creacion').default('CURRENT_TIMESTAMP')
});

// 🎓 CAPACITACIONES
export const capacitaciones = sqliteTable('capacitaciones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo'),
  duracion: text('duracion'),
  modalidad: text('modalidad'),
  instructor: text('instructor'),
  fecha_inicio: text('fecha_inicio'),
  fecha_fin: text('fecha_fin'),
  estado: text('estado').default('planificada'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  created_by: integer('created_by'),
  updated_by: integer('updated_by'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

// 📝 EVALUACIONES
export const evaluaciones = sqliteTable('evaluaciones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  personal_id: text('personal_id'),
  tipo: text('tipo'),
  fecha: text('fecha'),
  resultado: text('resultado'),
  observaciones: text('observaciones'),
  evaluador: text('evaluador'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  created_by: integer('created_by'),
  updated_by: integer('updated_by'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

// 🎯 OBJETIVOS
export const objetivos = sqliteTable('objetivos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo'),
  fecha_inicio: text('fecha_inicio'),
  fecha_fin: text('fecha_fin'),
  estado: text('estado').default('activo'),
  responsable: text('responsable'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  created_by: integer('created_by'),
  updated_by: integer('updated_by'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true)
});

// 📦 PRODUCTOS
export const productos = sqliteTable('productos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organization_id: integer('organization_id').notNull(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  codigo: text('codigo').unique(),
  tipo: text('tipo').notNull(),
  categoria: text('categoria'),
  estado: text('estado').default('Borrador'),
  version: text('version').default('1.0'),
  fecha_creacion: text('fecha_creacion'),
  fecha_revision: text('fecha_revision'),
  responsable: text('responsable'),
  especificaciones: text('especificaciones'),
  requisitos_calidad: text('requisitos_calidad'),
  proceso_aprobacion: text('proceso_aprobacion'),
  documentos_asociados: text('documentos_asociados'),
  observaciones: text('observaciones'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  created_by: integer('created_by'),
  updated_by: integer('updated_by')
});

// ===============================================
// RELACIONES ENTRE TABLAS
// ===============================================

// Relaciones de Organizations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  departamentos: many(departamentos),
  puestos: many(puestos),
  personal: many(personal),
  procesos: many(procesos),
  hallazgos: many(hallazgos),
  acciones: many(acciones),
  auditorias: many(auditorias),
  documentos: many(documentos),
  indicadores: many(indicadores),
  mediciones: many(mediciones),
  capacitaciones: many(capacitaciones),
  evaluaciones: many(evaluaciones),
  objetivos: many(objetivos),
  productos: many(productos)
}));

// Relaciones de Users
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organization_id],
    references: [organizations.id]
  })
}));

// Relaciones de Departamentos
export const departamentosRelations = relations(departamentos, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [departamentos.organization_id],
    references: [organizations.id]
  }),
  puestos: many(puestos)
}));

// Relaciones de Puestos
export const puestosRelations = relations(puestos, ({ one }) => ({
  organization: one(organizations, {
    fields: [puestos.organization_id],
    references: [organizations.id]
  }),
  departamento: one(departamentos, {
    fields: [puestos.departamento_id],
    references: [departamentos.id]
  })
}));

// Relaciones de Personal
export const personalRelations = relations(personal, ({ one }) => ({
  organization: one(organizations, {
    fields: [personal.organization_id],
    references: [organizations.id]
  })
}));

// Relaciones de Procesos
export const procesosRelations = relations(procesos, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [procesos.organization_id],
    references: [organizations.id]
  }),
  indicadores: many(indicadores)
}));

// Relaciones de Hallazgos
export const hallazgosRelations = relations(hallazgos, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [hallazgos.organization_id],
    references: [organizations.id]
  }),
  acciones: many(acciones)
}));

// Relaciones de Acciones
export const accionesRelations = relations(acciones, ({ one }) => ({
  organization: one(organizations, {
    fields: [acciones.organization_id],
    references: [organizations.id]
  }),
  hallazgo: one(hallazgos, {
    fields: [acciones.hallazgo_id],
    references: [hallazgos.id]
  })
}));

// Relaciones de Auditorías
export const auditoriasRelations = relations(auditorias, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditorias.organization_id],
    references: [organizations.id]
  })
}));

// Relaciones de Documentos
export const documentosRelations = relations(documentos, ({ one }) => ({
  organization: one(organizations, {
    fields: [documentos.organization_id],
    references: [organizations.id]
  })
}));

// Relaciones de Indicadores
export const indicadoresRelations = relations(indicadores, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [indicadores.organization_id],
    references: [organizations.id]
  }),
  proceso: one(procesos, {
    fields: [indicadores.proceso_id],
    references: [procesos.id]
  }),
  mediciones: many(mediciones)
}));

// Relaciones de Mediciones
export const medicionesRelations = relations(mediciones, ({ one }) => ({
  organization: one(organizations, {
    fields: [mediciones.organization_id],
    references: [organizations.id]
  }),
  indicador: one(indicadores, {
    fields: [mediciones.indicador_id],
    references: [indicadores.id]
  })
}));

// Relaciones de Capacitaciones
export const capacitacionesRelations = relations(capacitaciones, ({ one }) => ({
  organization: one(organizations, {
    fields: [capacitaciones.organization_id],
    references: [organizations.id]
  })
}));

// Relaciones de Evaluaciones
export const evaluacionesRelations = relations(evaluaciones, ({ one }) => ({
  organization: one(organizations, {
    fields: [evaluaciones.organization_id],
    references: [organizations.id]
  }),
  personal: one(personal, {
    fields: [evaluaciones.personal_id],
    references: [personal.id]
  })
}));

// Relaciones de Objetivos
export const objetivosRelations = relations(objetivos, ({ one }) => ({
  organization: one(organizations, {
    fields: [objetivos.organization_id],
    references: [organizations.id]
  })
}));

// Relaciones de Productos
export const productosRelations = relations(productos, ({ one }) => ({
  organization: one(organizations, {
    fields: [productos.organization_id],
    references: [organizations.id]
  })
}));

// ===============================================
// TIPOS DE DATOS PARA TYPESCRIPT
// ===============================================

export const schema = {
  organizations,
  users,
  departamentos,
  puestos,
  personal,
  procesos,
  hallazgos,
  acciones,
  auditorias,
  documentos,
  indicadores,
  mediciones,
  capacitaciones,
  evaluaciones,
  objetivos,
  productos
};

export const schemaRelations = {
  organizationsRelations,
  usersRelations,
  departamentosRelations,
  puestosRelations,
  personalRelations,
  procesosRelations,
  hallazgosRelations,
  accionesRelations,
  auditoriasRelations,
  documentosRelations,
  indicadoresRelations,
  medicionesRelations,
  capacitacionesRelations,
  evaluacionesRelations,
  objetivosRelations,
  productosRelations
}; 