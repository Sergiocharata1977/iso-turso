-- PARTE 5: Trigger SIMPLIFICADO para Turso
-- Solo registra cambios en estado (el más importante)

CREATE TRIGGER IF NOT EXISTS log_productos_estado_changes
  AFTER UPDATE ON productos
  FOR EACH ROW
  WHEN OLD.estado != NEW.estado
BEGIN
  INSERT INTO productos_historial (
    producto_id, 
    organization_id, 
    campo_modificado, 
    valor_anterior, 
    valor_nuevo, 
    usuario_responsable
  ) VALUES (
    NEW.id, 
    NEW.organization_id, 
    'estado', 
    OLD.estado, 
    NEW.estado, 
    'Sistema'
  );
END; 