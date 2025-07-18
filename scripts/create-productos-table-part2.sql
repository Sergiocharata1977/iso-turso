-- PARTE 2: Tabla de Historial de Cambios
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