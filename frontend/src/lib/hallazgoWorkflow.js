// Única fuente de verdad para las etapas y estados del flujo de trabajo de mejoras.

export const stages = [
  { 
    id: 'deteccion', 
    title: 'Detección',
    estados: ['d1_iniciado', 'd2_accion_inmedita-programada', 'd3_accion_inmedita-finalizada'] 
  },
  { 
    id: 'analisis', 
    title: 'Análisis',
    estados: ['t1_en_analisis', 't2_no_requiere_accion', 't3_requiere_accion'] 
  },
  { 
    id: 'planificacion_accion', 
    title: 'Planificación Acción',
    estados: ['p1_planificacion_accion'] 
  },
  { 
    id: 'ejecucion_accion', 
    title: 'Ejecución Acción',
    estados: ['e2_ejecucion_accion'] 
  },
  { 
    id: 'verificacion', 
    title: 'Verificación',
    estados: ['v3_planificacion_verificacion', 'v4_ejecucion_verificacion'] 
  },
  { 
    id: 'cierre', 
    title: 'Cierre',
    estados: ['c5_cerrado', 'c5_cerrada'] 
  },
];

// Mapeo inverso de estado a ID de etapa para búsqueda rápida.
const estadoToStageMap = stages.reduce((acc, stage) => {
  stage.estados.forEach(estado => {
    acc[estado] = stage.id;
  });
  return acc;
}, {});

/**
 * Devuelve el ID de la etapa correspondiente a un estado dado.
 * @param {string} estado - El estado a buscar (ej: 'd1_iniciado').
 * @returns {string|null} El ID de la etapa (ej: 'deteccion') o null si no se encuentra.
 */
export const getStageFromEstado = (estado) => {
  return estadoToStageMap[estado] || null;
};

/**
 * Devuelve el primer estado válido para una etapa de destino.
 * @param {string} stageId - El ID de la etapa de destino.
 * @returns {string|null} El primer estado de esa etapa o null.
 */
export const getInitialStateForStage = (stageId) => {
  const stage = stages.find(s => s.id === stageId);
  return stage ? stage.estados[0] : null;
};

/**
 * Determina si un item puede moverse de su estado actual a una nueva etapa.
 * @param {string} fromEstado - El estado actual del item.
 * @param {string} toStageId - El ID de la etapa de destino.
 * @returns {boolean} True si el movimiento es válido.
 */
export const canMove = (fromEstado, toStageId) => {
  const fromStageId = getStageFromEstado(fromEstado);
  
  const fromIndex = stages.findIndex(s => s.id === fromStageId);
  const toIndex = stages.findIndex(s => s.id === toStageId);

  if (fromIndex === -1 || toIndex === -1) {
    return false; // Etapa de origen o destino no válida.
  }

  // Lógica simple por ahora: permitir mover hacia adelante o en la misma columna.
  // Se puede refinar con reglas más estrictas en el futuro.
  return toIndex >= fromIndex;
};
