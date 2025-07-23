-- Crear tabla de evaluaciones individuales
CREATE TABLE IF NOT EXISTS evaluaciones_individuales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    empleado_id TEXT NOT NULL,
    evaluador_id TEXT NOT NULL,
    fecha_evaluacion TEXT NOT NULL,
    observaciones TEXT,
    puntaje_total REAL DEFAULT 0,
    estado TEXT DEFAULT 'pendiente',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (empleado_id) REFERENCES personal(id),
    FOREIGN KEY (evaluador_id) REFERENCES usuarios(id)
);

-- Crear tabla de detalle de competencias evaluadas
CREATE TABLE IF NOT EXISTS evaluaciones_competencias_detalle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    evaluacion_id INTEGER NOT NULL,
    competencia_id INTEGER NOT NULL,
    puntaje INTEGER NOT NULL CHECK (puntaje >= 0 AND puntaje <= 10),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones_individuales(id),
    FOREIGN KEY (competencia_id) REFERENCES competencias(id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_evaluaciones_org_empleado ON evaluaciones_individuales(organization_id, empleado_id);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_fecha ON evaluaciones_individuales(fecha_evaluacion);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_estado ON evaluaciones_individuales(estado);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_detalle_eval ON evaluaciones_competencias_detalle(evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_detalle_comp ON evaluaciones_competencias_detalle(competencia_id); 