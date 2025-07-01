import FormPlanificacionAI from '@/components/hallazgos/forms/FormPlanificacionAI';
import FormEjecucionAI from '@/components/hallazgos/forms/FormEjecucionAI';
import FormAnalisisAccion from '@/components/hallazgos/forms/FormAnalisisAccion';
import FormVerificacionCierre from '@/components/hallazgos/forms/FormVerificacionCierre';

export const hallazgoWorkflow = {
  'deteccion': {
    label: 'Planificar Acción Inmediata',
    Component: FormPlanificacionAI,
    nextState: 'planificacion_ai'
  },
  'd1_iniciado': {
    label: 'Planificar Acción Inmediata',
    Component: FormPlanificacionAI,
    nextState: 'planificacion_ai'
  },
  'planificacion_ai': {
    label: 'Ejecutar Acción Inmediata',
    Component: FormEjecucionAI,
    nextState: 'ejecucion_ai'
  },
  'd2_accion_inmediata_programada': {
    label: 'Ejecutar Acción Inmediata',
    Component: FormEjecucionAI,
    nextState: 'ejecucion_ai'
  },
  'ejecucion_ai': {
    label: 'Realizar Análisis y Plan de Acción',
    Component: FormAnalisisAccion,
    nextState: 'analisis_plan_accion'
  },
  'd2_analisis_causa_raiz_programado': {
    label: 'Realizar Análisis y Plan de Acción',
    Component: FormAnalisisAccion,
    nextState: 'analisis_plan_accion'
  },
  'analisis_plan_accion': {
    label: 'Analizar Acción',
    Component: FormAnalisisAccion,
    nextState: {
      requiere_accion: 'd3_plan_accion_definido',
      no_requiere_accion: 'd5_verificacion_eficacia_realizada',
    },
  },
  'd3_plan_accion_definido': {
    label: 'Verificar y Cerrar',
    Component: FormVerificacionCierre,
    nextState: 'verificacion_cierre', // Este es para el plan de acción, el de la corrección es otro.
  },
  'd4_verificacion_programada': {
    label: 'Verificar y Cerrar',
    Component: FormVerificacionCierre,
    nextState: 'verificacion_cierre',
  },
  'd5_verificacion_eficacia_realizada': {
    label: 'Verificar Eficacia y Cerrar',
    Component: FormVerificacionCierre,
    nextState: { // Bifurcación basada en la eficacia
      eficaz: 'cerrado',
      no_eficaz: 'd1_iniciado', // Vuelve al inicio si la acción no fue eficaz
    },
  },
  'verificacion_cierre': {
    label: 'Verificar y Cerrar',
    Component: FormVerificacionCierre,
    nextState: { // Bifurcación basada en la eficacia
      eficaz: 'cerrado',
      no_eficaz: 'd1_iniciado', // Vuelve al inicio si la acción no fue eficaz
    },
  },
  'cerrado': {
    label: 'Proceso Finalizado',
    Component: null,
    nextState: null
  }
};
