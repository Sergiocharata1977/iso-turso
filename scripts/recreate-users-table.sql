-- Script para eliminar y recrear la tabla usuarios en TursoDB

-- 1. Eliminar la tabla usuarios si existe
DROP TABLE IF EXISTS usuarios;

-- 2. Crear la tabla usuarios con la estructura correcta
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

-- 3. Insertar los usuarios que se ven en la captura de pantalla
-- Nota: las contraseñas están hasheadas en la base de datos
-- Los hashes mostrados son solo ejemplos, el script en JavaScript generará hashes adecuados
INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
VALUES
  ('Administrador', 'admin@isoflow.com', 'hash_de_admin123', 'admin', '2025-05-10 15:24:24', '2025-05-10 15:24:24'),
  ('Juan Pérez', 'juan@isoflow.com', 'hash_de_isoflow123', 'user', '2025-05-10 20:03:34', '2025-05-10 20:03:34'),
  ('María Gómez', 'maria@isoflow.com', 'hash_de_isoflow123', 'supervisor', '2025-05-10 20:03:35', '2025-05-10 20:03:35');
