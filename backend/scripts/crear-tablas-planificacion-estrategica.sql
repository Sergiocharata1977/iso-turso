-- 🎯 SQL PARA CREAR TABLAS DE PLANIFICACIÓN ESTRATÉGICA EN TURSO
-- Crea las tablas necesarias para planificación estratégica con análisis FODA
-- Ejecutar: node backend/scripts/crear-tablas-planificacion-estrategica.js

-- 1. TABLA PRINCIPAL: Planificación Estratégica
CREATE TABLE IF NOT EXISTS planificacion_estrategica (
    id TEXT PRIMARY KEY DEFAULT ('plan_' || lower(hex(randomblob(8)))),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    periodo_vigencia TEXT,
    estado TEXT DEFAULT 'Borrador' CHECK (estado IN ('Borrador', 'Aprobado', 'En Ejecución', 'Completado', 'Suspendido')),
    responsable_principal TEXT NOT NULL,
    prioridad TEXT DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica')),
    progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
    observaciones TEXT,
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

-- 2. TABLA: Análisis FODA/DAFO
CREATE TABLE IF NOT EXISTS analisis_foda (
    id TEXT PRIMARY KEY DEFAULT ('foda_' || lower(hex(randomblob(8)))),
    planificacion_id TEXT NOT NULL,
    concepto TEXT NOT NULL,
    detalle TEXT,
    tipo_foda TEXT NOT NULL CHECK (tipo_foda IN ('Fortaleza', 'Oportunidad', 'Debilidad', 'Amenaza')),
    acciones TEXT,
    prioridad TEXT DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica')),
    fecha_identificacion DATE,
    responsable_analisis TEXT,
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (planificacion_id) REFERENCES planificacion_estrategica(id) ON DELETE CASCADE
);

-- 3. TABLA: Objetivos Estratégicos
CREATE TABLE IF NOT EXISTS objetivos_estrategicos (
    id TEXT PRIMARY KEY DEFAULT ('obj_est_' || lower(hex(randomblob(8)))),
    planificacion_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    indicador_medicion TEXT,
    meta_numerica REAL,
    fecha_limite DATE,
    responsable TEXT,
    estado TEXT DEFAULT 'Planificado' CHECK (estado IN ('Planificado', 'En Progreso', 'Logrado', 'No Logrado', 'Reprogramado')),
    prioridad TEXT DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica')),
    progreso_actual INTEGER DEFAULT 0 CHECK (progreso_actual >= 0 AND progreso_actual <= 100),
    observaciones TEXT,
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (planificacion_id) REFERENCES planificacion_estrategica(id) ON DELETE CASCADE
);

-- 4. TABLA: Relación Objetivos - Procesos (N:M)
CREATE TABLE IF NOT EXISTS objetivos_procesos (
    id TEXT PRIMARY KEY DEFAULT ('rel_op_' || lower(hex(randomblob(8)))),
    objetivo_estrategico_id TEXT NOT NULL,
    proceso_id TEXT NOT NULL,
    nivel_impacto TEXT DEFAULT 'Medio' CHECK (nivel_impacto IN ('Bajo', 'Medio', 'Alto', 'Crítico')),
    fecha_asignacion DATE,
    observaciones TEXT,
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (objetivo_estrategico_id) REFERENCES objetivos_estrategicos(id) ON DELETE CASCADE,
    FOREIGN KEY (proceso_id) REFERENCES procesos(id) ON DELETE CASCADE
);

-- 5. TABLA: Seguimiento de Objetivos (KPIs)
CREATE TABLE IF NOT EXISTS seguimiento_objetivos (
    id TEXT PRIMARY KEY DEFAULT ('seg_' || lower(hex(randomblob(8)))),
    objetivo_estrategico_id TEXT NOT NULL,
    fecha_seguimiento DATE NOT NULL,
    valor_actual REAL,
    valor_esperado REAL,
    desviacion REAL,
    observaciones TEXT,
    acciones_correctivas TEXT,
    responsable_seguimiento TEXT,
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (objetivo_estrategico_id) REFERENCES objetivos_estrategicos(id) ON DELETE CASCADE
);

-- 6. TABLA: Participantes en Planificación
CREATE TABLE IF NOT EXISTS planificacion_participantes (
    id TEXT PRIMARY KEY DEFAULT ('part_' || lower(hex(randomblob(8)))),
    planificacion_id TEXT NOT NULL,
    personal_id TEXT,
    nombre_participante TEXT NOT NULL,
    cargo TEXT,
    rol_participacion TEXT DEFAULT 'Colaborador' CHECK (rol_participacion IN ('Responsable', 'Colaborador', 'Consultor', 'Aprobador')),
    fecha_participacion DATE,
    observaciones TEXT,
    organization_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (planificacion_id) REFERENCES planificacion_estrategica(id) ON DELETE CASCADE,
    FOREIGN KEY (personal_id) REFERENCES personal(id)
);

-- ÍNDICES para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_planificacion_org ON planificacion_estrategica(organization_id);
CREATE INDEX IF NOT EXISTS idx_analisis_foda_plan ON analisis_foda(planificacion_id);
CREATE INDEX IF NOT EXISTS idx_analisis_foda_tipo ON analisis_foda(tipo_foda);
CREATE INDEX IF NOT EXISTS idx_objetivos_plan ON objetivos_estrategicos(planificacion_id);
CREATE INDEX IF NOT EXISTS idx_objetivos_estado ON objetivos_estrategicos(estado);
CREATE INDEX IF NOT EXISTS idx_seguimiento_objetivo ON seguimiento_objetivos(objetivo_estrategico_id);
CREATE INDEX IF NOT EXISTS idx_participantes_plan ON planificacion_participantes(planificacion_id);

-- DATOS DE EJEMPLO
INSERT INTO planificacion_estrategica (titulo, descripcion, fecha_inicio, fecha_fin, responsable_principal, organization_id) VALUES
('Plan Estratégico 2024-2025', 'Planificación estratégica anual para mejora continua ISO 9001', '2024-01-01', '2024-12-31', 'Dirección General', 2),
('Plan de Mejora Continua Q2', 'Plan trimestral de mejora de procesos de ventas', '2024-04-01', '2024-06-30', 'Gerente Comercial', 2);

INSERT INTO analisis_foda (planificacion_id, concepto, detalle, tipo_foda, acciones, organization_id) VALUES
('plan_123abc', 'Equipo técnico capacitado', 'Personal con certificaciones ISO 9001', 'Fortaleza', 'Mantener actualización continua', 2),
('plan_123abc', 'Procesos documentados', 'Todos los procesos están documentados y actualizados', 'Fortaleza', 'Auditorías trimestrales', 2),
('plan_123abc', 'Competencia creciente', 'Nuevos competidores en el mercado', 'Amenaza', 'Diferenciación de servicios', 2);

INSERT INTO objetivos_estrategicos (planificacion_id, titulo, descripcion, indicador_medicion, meta_numerica, fecha_limite, responsable, organization_id) VALUES
('plan_123abc', 'Mejorar satisfacción del cliente', 'Incrementar satisfacción a 95%', 'NPS Score', 95.0, '2024-12-31', 'Gerente Calidad', 2),
('plan_123abc', 'Reducir tiempos de respuesta', 'Reducir tiempo de respuesta a 24 horas', 'Tiempo promedio respuesta', 24.0, '2024-06-30', 'Gerente Comercial', 2);

-- VERIFICACIÓN DE CREACIÓN
SELECT '✅ Tablas creadas exitosamente' as mensaje;
