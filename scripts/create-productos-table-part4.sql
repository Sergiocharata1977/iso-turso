-- PARTE 4: Trigger para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_productos_updated_at
  AFTER UPDATE ON productos
  FOR EACH ROW
BEGIN
  UPDATE productos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END; 