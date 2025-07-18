-- PARTE 1: Tabla Principal de Productos y Servicios ISO 9001
CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  
  -- Información Básica
  nombre TEXT NOT NULL,
  descripcion TEXT,
  codigo TEXT UNIQUE,
  
  -- Clasificación ISO 9001
  tipo TEXT NOT NULL CHECK (tipo IN ('Producto', 'Servicio', 'Software', 'Documento', 'Proceso', 'Equipamiento')),
  categoria TEXT,
  
  -- Estado y Control
  estado TEXT NOT NULL DEFAULT 'Borrador' CHECK (estado IN ('Borrador', 'En Revisión', 'Pendiente Aprobación', 'Aprobado', 'Activo', 'En Modificación', 'Descontinuado')),
  version TEXT DEFAULT '1.0',
  
  -- Fechas
  fecha_creacion DATE,
  fecha_revision DATE,
  
  -- Responsabilidad
  responsable TEXT,
  
  -- Especificaciones ISO 9001
  especificaciones TEXT,
  requisitos_calidad TEXT,
  proceso_aprobacion TEXT,
  
  -- Documentación
  documentos_asociados TEXT,
  observaciones TEXT,
  
  -- Metadatos
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  
  -- Constraints
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES usuarios(id),
  FOREIGN KEY (updated_by) REFERENCES usuarios(id)
); 