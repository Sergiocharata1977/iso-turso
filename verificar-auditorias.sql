-- ===============================================
-- VERIFICACIÓN DE TABLA AUDITORIAS EXISTENTE
-- ===============================================

-- 1. Verificar estructura actual de la tabla auditorias
PRAGMA table_info(auditorias);

-- 2. Verificar si hay datos
SELECT COUNT(*) as total_auditorias FROM auditorias;

-- 3. Verificar si existe la tabla auditoria_aspectos
SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%auditoria%';

-- 4. Verificar índices existentes
SELECT name FROM sqlite_master WHERE type='index' AND name LIKE '%auditoria%'; 