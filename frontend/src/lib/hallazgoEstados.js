/**
 * @description Módulo central para la gestión de estados de los Hallazgos de Mejora.
 * Contiene la definición de los estados, sus etiquetas, y la lógica de transición.
 */

/**
 * @typedef {'d1_iniciado' | 'd2_con_accion_inmediata' | 'd3_corregido_parcial' | 'd4_corregido_completo' | 't1_en_analisis' | 't2_no_requiere_accion' | 't3_pendiente_implementacion' | 't4_en_implementacion' | 't5_implementacion_finalizada' | 'c1_pendiente_verificacion' | 'c2_en_verificacion' | 'c3_verificado_satisfactorio' | 'c4_verificado_insatisfactorio' | 'c5_cerrado'} EstadoGlobal
 */

// Definición de todos los estados posibles para evitar errores de tipeo.
export const ESTADOS = {
  // 1. Detección
  D1_INICIADO: 'd1_iniciado',
  D2_CON_ACCION_INMEDIATA: 'd2_con_accion_inmediata',
  D3_CORREGIDO_PARCIAL: 'd3_corregido_parcial',
  D4_CORREGIDO_COMPLETO: 'd4_corregido_completo',
  
  // 2. Tratamiento
  T1_EN_ANALISIS: 't1_en_analisis',
  T2_NO_REQUIERE_ACCION: 't2_no_requiere_accion',
  T3_PENDIENTE_IMPLEMENTACION: 't3_pendiente_implementacion',
  T4_EN_IMPLEMENTACION: 't4_en_implementacion',
  T5_IMPLEMENTACION_FINALIZADA: 't5_implementacion_finalizada',

  // 3. Control y Verificación
  C1_PENDIENTE_VERIFICACION: 'c1_pendiente_verificacion',
  C2_EN_VERIFICACION: 'c2_en_verificacion',
  C3_VERIFICADO_SATISFACTORIO: 'c3_verificado_satisfactorio',
  C4_VERIFICADO_INSATISFACTORIO: 'c4_verificado_insatisfactorio',
  C5_CERRADO: 'c5_cerrado',
};

// Mapeo de los códigos de estado a etiquetas legibles para el usuario.
export const LABELS = {
  [ESTADOS.D1_INICIADO]: 'Iniciado',
  [ESTADOS.D2_CON_ACCION_INMEDIATA]: 'Con Acción Inmediata',
  [ESTADOS.D3_CORREGIDO_PARCIAL]: 'Corregido Parcialmente',
  [ESTADOS.D4_CORREGIDO_COMPLETO]: 'Corrección Finalizada',
  [ESTADOS.T1_EN_ANALISIS]: 'Análisis en Curso',
  [ESTADOS.T2_NO_REQUIERE_ACCION]: 'No Requiere Acción',
  [ESTADOS.T3_PENDIENTE_IMPLEMENTACION]: 'Pendiente de Implementación',
  [ESTADOS.T4_EN_IMPLEMENTACION]: 'En Implementación',
  [ESTADOS.T5_IMPLEMENTACION_FINALIZADA]: 'Acción Implementada',
  [ESTADOS.C1_PENDIENTE_VERIFICACION]: 'Pendiente de Verificación',
  [ESTADOS.C2_EN_VERIFICACION]: 'En Verificación',
  [ESTADOS.C3_VERIFICADO_SATISFACTORIO]: 'Eficaz',
  [ESTADOS.C4_VERIFICADO_INSATISFACTORIO]: 'Ineficaz',
  [ESTADOS.C5_CERRADO]: 'Cerrado',
};

// Descripciones para cada estado, visibles en la UI.
export const DESCRIPTIONS = {
  [ESTADOS.D1_INICIADO]: 'El hallazgo ha sido registrado y está pendiente de acción.',
  [ESTADOS.D2_CON_ACCION_INMEDIATA]: 'Se ha aplicado una solución temporal para contener el problema.',
  [ESTADOS.D3_CORREGIDO_PARCIAL]: 'La corrección se ha aplicado, pero aún no está finalizada.',
  [ESTADOS.D4_CORREGIDO_COMPLETO]: 'La corrección inmediata ha sido completada.',
  [ESTADOS.T1_EN_ANALISIS]: 'Se está investigando la causa raíz del hallazgo.',
  [ESTADOS.T2_NO_REQUIERE_ACCION]: 'Tras el análisis, se determinó que no se necesitan más acciones.',
  [ESTADOS.T3_PENDIENTE_IMPLEMENTACION]: 'Las acciones correctivas han sido definidas y están listas para ser aplicadas.',
  [ESTADOS.T4_EN_IMPLEMENTACION]: 'Las acciones correctivas se están llevando a cabo.',
  [ESTADOS.T5_IMPLEMENTACION_FINALIZADA]: 'Las acciones correctivas han sido implementadas en su totalidad.',
  [ESTADOS.C1_PENDIENTE_VERIFICACION]: 'A la espera de confirmar si las acciones fueron efectivas.',
  [ESTADOS.C2_EN_VERIFICACION]: 'Se está evaluando la eficacia de las acciones implementadas.',
  [ESTADOS.C3_VERIFICADO_SATISFACTORIO]: 'Las acciones han solucionado el problema de forma eficaz.',
  [ESTADOS.C4_VERIFICADO_INSATISFACTORIO]: 'Las acciones no fueron efectivas y se requiere un nuevo análisis.',
  [ESTADOS.C5_CERRADO]: 'El ciclo del hallazgo ha sido completado y cerrado.',
};

// Define las etapas principales del ciclo de mejora.
export const ETAPAS = {
  DETECCION: 'Detección',
  TRATAMIENTO: 'Tratamiento',
  VERIFICACION: 'Verificación',
};

// Agrupa los estados por su etapa correspondiente para facilitar el renderizado en la UI.
export const ESTADOS_POR_ETAPA = {
  [ETAPAS.DETECCION]: Object.values(ESTADOS).filter(e => e.startsWith('d')),
  [ETAPAS.TRATAMIENTO]: Object.values(ESTADOS).filter(e => e.startsWith('t')),
  [ETAPAS.VERIFICACION]: Object.values(ESTADOS).filter(e => e.startsWith('c')),
};

/**
 * Determina el siguiente estado en el flujo de trabajo.
 * @param {string} estadoActual - El código del estado actual.
 * @returns {string} - El código del siguiente estado.
 */
export const avanzarEstado = (estadoActual) => {
  const transiciones = {
    // Flujo principal
    [ESTADOS.D1_INICIADO]: ESTADOS.T1_EN_ANALISIS,
    [ESTADOS.D2_CON_ACCION_INMEDIATA]: ESTADOS.T1_EN_ANALISIS,
    [ESTADOS.D3_CORREGIDO_PARCIAL]: ESTADOS.T1_EN_ANALISIS,
    [ESTADOS.D4_CORREGIDO_COMPLETO]: ESTADOS.T1_EN_ANALISIS,
    [ESTADOS.T1_EN_ANALISIS]: ESTADOS.T3_PENDIENTE_IMPLEMENTACION,
    [ESTADOS.T3_PENDIENTE_IMPLEMENTACION]: ESTADOS.T4_EN_IMPLEMENTACION,
    [ESTADOS.T4_EN_IMPLEMENTACION]: ESTADOS.T5_IMPLEMENTACION_FINALIZADA,
    [ESTADOS.T5_IMPLEMENTACION_FINALIZADA]: ESTADOS.C1_PENDIENTE_VERIFICACION,
    [ESTADOS.C1_PENDIENTE_VERIFICACION]: ESTADOS.C2_EN_VERIFICACION,
    [ESTADOS.C2_EN_VERIFICACION]: ESTADOS.C3_VERIFICADO_SATISFACTORIO, // Por defecto, la verificación es satisfactoria
    [ESTADOS.C3_VERIFICADO_SATISFACTORIO]: ESTADOS.C5_CERRADO,

    // Flujo alternativo por ineficacia
    [ESTADOS.C4_VERIFICADO_INSATISFACTORIO]: ESTADOS.T1_EN_ANALISIS, // Si es ineficaz, vuelve al análisis
  };

  return transiciones[estadoActual] || estadoActual;
};

/**
 * Obtiene información detallada de un estado (etiqueta, etapa y color para la UI).
 * @param {EstadoGlobal} estadoGlobal - El código del estado.
 * @returns {{label: string, etapa: string, color: string}}
 */
export const getEstadoInfo = (estadoGlobal) => {
  // Si el estado es nulo o indefinido, devuelve un objeto por defecto para evitar errores.
  if (!estadoGlobal) {
    return {
      label: 'Desconocido',
      etapa: 'Desconocida',
      color: 'bg-gray-400 text-white',
    };
  }
  const label = LABELS[estadoGlobal] || 'Desconocido';
  let etapa = 'Desconocida';
  let color = 'bg-gray-400 text-white'; // Color por defecto

  if (estadoGlobal.startsWith('d')) {
    etapa = ETAPAS.DETECCION;
    color = 'bg-blue-500 text-white';
  } else if (estadoGlobal.startsWith('t')) {
    etapa = ETAPAS.TRATAMIENTO;
    color = 'bg-yellow-500 text-black';
  } else if (estadoGlobal.startsWith('c')) {
    etapa = ETAPAS.VERIFICACION;
    color = 'bg-green-500 text-white';
  }
  
  if (estadoGlobal === ESTADOS.C5_CERRADO) {
      color = 'bg-gray-600 text-white';
  }
  if (estadoGlobal === ESTADOS.C4_VERIFICADO_INSATISFACTORIO) {
      color = 'bg-red-600 text-white';
  }
  if (estadoGlobal === ESTADOS.T2_NO_REQUIERE_ACCION) {
      color = 'bg-indigo-500 text-white';
  }

  return { label, etapa, color };
};
