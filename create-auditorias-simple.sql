-- ===============================================
-- SISTEMA DE AUDITORÍAS ISO 9001 - VERSIÓN SIMPLIFICADA
-- Usa las tablas existentes: personal, procesos, hallazgos
-- ===============================================

-- 1. Tabla Principal de Auditorías (ÚNICA tabla nueva)
CREATE TABLE auditorias (
  id TEXT PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE, -- AUD-2024-001
  titulo TEXT NOT NULL,
  area TEXT NOT NULL, -- Producción, Calidad, etc.
  responsable_id TEXT, -- FK a personal.id
  fecha_programada TEXT NOT NULL,
  fecha_ejecucion TEXT,
  estado TEXT DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_proceso', 'completada', 'cancelada')),
  objetivos TEXT,
  alcance TEXT,
  criterios TEXT,
  resultados TEXT,
  observaciones TEXT,
  organization_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Tabla de Aspectos/Procesos Auditados (ÚNICA tabla nueva adicional)
CREATE TABLE auditoria_aspectos (
  id TEXT PRIMARY KEY,
  auditoria_id TEXT NOT NULL,
  proceso_id TEXT, -- FK a procesos.id (opcional)
  proceso_nombre TEXT NOT NULL, -- Nombre del proceso auditado
  documentacion_referenciada TEXT, -- PO-001, Manual de Calidad, etc.
  auditor_nombre TEXT, -- Nombre del auditor asignado
  observaciones TEXT,
  conformidad TEXT CHECK (conformidad IN ('conforme', 'no_conforme', 'observacion')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE
);

-- ===============================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ===============================================

-- Índices para auditorias
CREATE INDEX idx_auditorias_organization ON auditorias(organization_id);
CREATE INDEX idx_auditorias_estado ON auditorias(estado);
CREATE INDEX idx_auditorias_fecha_programada ON auditorias(fecha_programada);
CREATE INDEX idx_auditorias_codigo ON auditorias(codigo);
CREATE INDEX idx_auditorias_responsable ON auditorias(responsable_id);

-- Índices para auditoria_aspectos
CREATE INDEX idx_auditoria_aspectos_auditoria ON auditoria_aspectos(auditoria_id);
CREATE INDEX idx_auditoria_aspectos_proceso ON auditoria_aspectos(proceso_id);

-- ===============================================
-- DATOS DE EJEMPLO
-- ===============================================

-- Insertar auditoría de ejemplo
INSERT INTO auditorias (
  id, codigo, titulo, area, responsable_id, fecha_programada, 
  estado, objetivos, organization_id
) VALUES (
  'aud-001', 'AUD-2024-001', 'Auditoría de Procesos de Producción', 
  'Producción', '1', '2024-01-19', 
  'completada', 'Verificar cumplimiento de procesos de calidad en línea de producción', 1
);

-- Insertar aspectos de la auditoría
INSERT INTO auditoria_aspectos (
  id, auditoria_id, proceso_nombre, documentacion_referenciada, 
  auditor_nombre, conformidad
) VALUES 
  ('asp-001', 'aud-001', 'Control de Calidad', 'PO-001 Procedimiento de Control', 'María García', 'conforme'),
  ('asp-002', 'aud-001', 'Gestión de Inventarios', 'PO-002 Procedimiento de Inventarios', 'Juan Pérez', 'observacion');

-- ===============================================
-- VERIFICACIÓN
-- ===============================================

-- Verificar tablas creadas
SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'auditoria%';

-- Verificar datos insertados con JOIN a personal existente
SELECT 
  a.codigo, 
  a.titulo, 
  a.area, 
  a.estado,
  p.nombres || ' ' || p.apellidos as responsable_nombre,
  COUNT(DISTINCT asp.id) as aspectos
FROM auditorias a
LEFT JOIN personal p ON a.responsable_id = p.id
LEFT JOIN auditoria_aspectos asp ON a.id = asp.auditoria_id
GROUP BY a.id; 