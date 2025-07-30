-- SQL ULTRA-MINIMAL para tabla minutas
-- Ejecutar directamente en Turso

CREATE TABLE minutas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  fecha TEXT NOT NULL,
  responsable TEXT NOT NULL,
  descripcion TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba ultra-minimales
INSERT INTO minutas (titulo, fecha, responsable, descripcion) VALUES 
('Minuta 1', '2025-08-15', 'Juan Pérez', 'Descripción breve'),
('Minuta 2', '2025-08-20', 'Ana López', 'Otra descripción');

-- Verificar que funciona
SELECT * FROM minutas;
