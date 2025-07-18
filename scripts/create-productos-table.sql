-- Tabla de Productos y Servicios ISO 9001
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

-- Tabla de Historial de Cambios
CREATE TABLE IF NOT EXISTS productos_historial (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  
  -- Información del cambio
  campo_modificado TEXT NOT NULL,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  
  -- Responsabilidad
  usuario_responsable TEXT,
  fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_productos_organization ON productos(organization_id);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_historial_producto ON productos_historial(producto_id);
CREATE INDEX IF NOT EXISTS idx_productos_historial_organization ON productos_historial(organization_id);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_productos_updated_at
  AFTER UPDATE ON productos
  FOR EACH ROW
BEGIN
  UPDATE productos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para registrar cambios en el historial
CREATE TRIGGER IF NOT EXISTS log_productos_changes
  AFTER UPDATE ON productos
  FOR EACH ROW
BEGIN
  -- Registrar cambios en nombre
  IF OLD.nombre != NEW.nombre THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'nombre', OLD.nombre, NEW.nombre, (SELECT name FROM usuarios WHERE id = NEW.updated_by));
  END IF;
  
  -- Registrar cambios en estado
  IF OLD.estado != NEW.estado THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'estado', OLD.estado, NEW.estado, (SELECT name FROM usuarios WHERE id = NEW.updated_by));
  END IF;
  
  -- Registrar cambios en descripción
  IF OLD.descripcion != NEW.descripcion THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'descripcion', OLD.descripcion, NEW.descripcion, (SELECT name FROM usuarios WHERE id = NEW.updated_by));
  END IF;
  
  -- Registrar cambios en código
  IF OLD.codigo != NEW.codigo THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'codigo', OLD.codigo, NEW.codigo, (SELECT name FROM usuarios WHERE id = NEW.updated_by));
  END IF;
  
  -- Registrar cambios en tipo
  IF OLD.tipo != NEW.tipo THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'tipo', OLD.tipo, NEW.tipo, (SELECT name FROM usuarios WHERE id = NEW.updated_by));
  END IF;
  
  -- Registrar cambios en versión
  IF OLD.version != NEW.version THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'version', OLD.version, NEW.version, (SELECT name FROM usuarios WHERE id = NEW.updated_by));
  END IF;
END; 