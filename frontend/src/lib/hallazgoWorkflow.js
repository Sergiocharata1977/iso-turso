export const STAGES = {
  DETECCION: 'Deteccion',
  TRATAMIENTO: 'Tratamiento',
  VERIFICACION: 'Verificacion',
};

export const ESTADOS = {
  // Detección
  D1_INICIADO: { id: 'd1_iniciado', nombre: 'Iniciado', etapa: STAGES.DETECCION },
  D2_CON_ACCION_INMEDIATA: { id: 'd2_con_accion_inmediata', nombre: 'Con Acción Inmediata', etapa: STAGES.DETECCION },
  D4_CORREGIDO_COMPLETO: { id: 'd4_corregido_completo', nombre: 'Corrección Finalizada', etapa: STAGES.DETECCION },

  // Tratamiento
  T1_EN_ANALISIS: { id: 't1_en_analisis', nombre: 'En Análisis de Causa', etapa: STAGES.TRATAMIENTO },
  T2_NO_REQUIERE_ACCION: { id: 't2_no_requiere_accion', nombre: 'No Requiere Acción', etapa: STAGES.TRATAMIENTO },
  T3_PROGRAMADA: { id: 't3_programada', nombre: 'Acción Planificada', etapa: STAGES.TRATAMIENTO },
  T5_IMPLEMENTACION_FINALIZADA: { id: 't5_implementacion_finalizada', nombre: 'Acción Ejecutada', etapa: STAGES.TRATAMIENTO },
  
  // Verificación
  C3_VERIFICACION_PLANIFICADA: { id: 'c3_verificacion_planificada', nombre: 'Verificación Planificada', etapa: STAGES.VERIFICACION },
  C4_EJECUTADA_LA_VERIFICACION: { id: 'c4_ejecutada_la_verificacion', nombre: 'Verificación Ejecutada', etapa: STAGES.VERIFICACION },
  C5_CERRADO: { id: 'c5_cerrado', nombre: 'Cerrado', etapa: STAGES.VERIFICACION },
};

export const getStageFromEstado = (estadoId) => {
  const estado = Object.values(ESTADOS).find(e => e.id === estadoId);
  return estado ? estado.etapa : null;
};

// This defines the first state when moving to a new stage
export const getInitialStateForStage = (stage) => {
  switch (stage) {
    case STAGES.DETECCION:
      return ESTADOS.D1_INICIADO.id;
    case STAGES.TRATAMIENTO:
      return ESTADOS.T1_EN_ANALISIS.id;
    case STAGES.VERIFICACION:
      return ESTADOS.C3_VERIFICACION_PLANIFICADA.id;
    default:
      return null;
  }
};

// This can be expanded later to enforce strict transition rules
export const canMove = (fromEstadoId, toStage) => {
  const fromStage = getStageFromEstado(fromEstadoId);
  if (!fromStage || !toStage) return false;

  const stageOrder = [STAGES.DETECCION, STAGES.TRATAMIENTO, STAGES.VERIFICACION];
  const fromIndex = stageOrder.indexOf(fromStage);
  const toIndex = stageOrder.indexOf(toStage);


  
  // Allow moving back from Verificacion to Tratamiento (e.g., if action was ineffective)
  if (fromStage === STAGES.VERIFICACION && toStage === STAGES.TRATAMIENTO) {
    return true;
  }

  // Only allow moving forward to the very next stage.
  return toIndex === fromIndex + 1;
};
