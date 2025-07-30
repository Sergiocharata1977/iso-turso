-- Insertar reuniones de ejemplo en la tabla reunion2
-- Asegúrate de reemplazar el organization_id con el ID correcto de tu organización

INSERT INTO reunion2 (
    titulo_reunion,
    fecha_programada,
    objetivos_reunion,
    participantes,
    tema_tratar,
    organization_id,
    created_at,
    updated_at
) VALUES 
(
    'Reunión de Planificación Estratégica Q1 2025',
    '2025-01-15 09:00:00',
    'Definir objetivos estratégicos para el primer trimestre del año, revisar indicadores de calidad y establecer metas de mejora continua.',
    'Roberto Falconi (Director), María González (Gerente de Calidad), Pedro Davi (Supervisor de Producción), Ana López (RRHH)',
    'Planificación estratégica, revisión de indicadores, establecimiento de metas',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Revisión de Auditorías Internas',
    '2025-01-20 14:30:00',
    'Revisar resultados de auditorías internas realizadas, identificar no conformidades y definir acciones correctivas.',
    'María González (Auditor Líder), Carlos Ruiz (Auditor), Juan Pérez (Responsable de Procesos)',
    'Resultados de auditorías, no conformidades, acciones correctivas',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Capacitación en Normas ISO 9001:2015',
    '2025-01-25 10:00:00',
    'Capacitar al personal en los requisitos de la norma ISO 9001:2015 y su aplicación en los procesos de la organización.',
    'Todo el personal de la organización',
    'Requisitos de ISO 9001:2015, aplicación práctica, documentación del SGC',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Análisis de Indicadores de Calidad',
    '2025-02-01 16:00:00',
    'Analizar el comportamiento de los indicadores de calidad del mes anterior, identificar tendencias y proponer mejoras.',
    'Roberto Falconi, María González, Pedro Davi, Ana López',
    'Análisis de indicadores, tendencias, propuestas de mejora',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Reunión de Revisión por la Dirección',
    '2025-02-10 08:00:00',
    'Revisión completa del Sistema de Gestión de Calidad, evaluación de la política de calidad y objetivos establecidos.',
    'Roberto Falconi (Director General), María González (Representante de la Dirección), Gerentes de Área',
    'Revisión del SGC, política de calidad, objetivos, recursos necesarios',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 