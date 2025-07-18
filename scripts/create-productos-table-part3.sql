-- PARTE 3: Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_productos_organization ON productos(organization_id);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_historial_producto ON productos_historial(producto_id);
CREATE INDEX IF NOT EXISTS idx_productos_historial_organization ON productos_historial(organization_id); 