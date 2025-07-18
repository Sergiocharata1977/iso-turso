-- PARTE 5: Trigger simplificado para registrar cambios en el historial
CREATE TRIGGER IF NOT EXISTS log_productos_changes
  AFTER UPDATE ON productos
  FOR EACH ROW
BEGIN
  -- Registrar cambios en nombre
  IF OLD.nombre != NEW.nombre THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'nombre', OLD.nombre, NEW.nombre, 'Sistema');
  END IF;
  
  -- Registrar cambios en estado
  IF OLD.estado != NEW.estado THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'estado', OLD.estado, NEW.estado, 'Sistema');
  END IF;
  
  -- Registrar cambios en descripción
  IF OLD.descripcion != NEW.descripcion THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'descripcion', OLD.descripcion, NEW.descripcion, 'Sistema');
  END IF;
  
  -- Registrar cambios en código
  IF OLD.codigo != NEW.codigo THEN
    INSERT INTO productos_historial (producto_id, organization_id, campo_modificado, valor_anterior, valor_nuevo, usuario_responsable)
    VALUES (NEW.id, NEW.organization_id, 'codigo', OLD.codigo, NEW.codigo, 'Sistema');
  END IF;
END; 