import PlanificacionAccionForm from '@/components/acciones/forms/PlanificacionAccionForm';
import EjecucionAccionForm from '@/components/acciones/forms/EjecucionAccionForm';
import PlanificarVerificacionForm from '@/components/acciones/forms/PlanificarVerificacionForm';
import EjecutarVerificacionForm from '@/components/acciones/forms/EjecutarVerificacionForm';

export const ACCION_ESTADOS = {
  PLANIFICACION: 'p1_planificacion_accion',
  EJECUCION: 'e2_ejecucion_accion',
  PLANIFICACION_VERIFICACION: 'v3_planificacion_verificacion',
  EJECUCION_VERIFICACION: 'v4_ejecucion_verificacion',
  CERRADA: 'c5_cerrada',
};

export const accionWorkflow = {
  [ACCION_ESTADOS.PLANIFICACION]: {
    title: 'Planificación de la Acción',
    component: PlanificacionAccionForm,
    nextState: ACCION_ESTADOS.EJECUCION,
    color: 'bg-blue-500',
    colorClasses: 'bg-blue-100 dark:bg-blue-900/40',
  },
  [ACCION_ESTADOS.EJECUCION]: {
    title: 'Ejecución de la Acción',
    component: EjecucionAccionForm,
    nextState: ACCION_ESTADOS.PLANIFICACION_VERIFICACION,
    color: 'bg-orange-500',
    colorClasses: 'bg-orange-100 dark:bg-orange-900/40',
  },
  [ACCION_ESTADOS.PLANIFICACION_VERIFICACION]: {
    title: 'Planificar Verificación',
    component: PlanificarVerificacionForm,
    nextState: ACCION_ESTADOS.EJECUCION_VERIFICACION,
    color: 'bg-purple-500',
    colorClasses: 'bg-purple-100 dark:bg-purple-900/40',
  },
  [ACCION_ESTADOS.EJECUCION_VERIFICACION]: {
    title: 'Ejecutar Verificación',
    component: EjecutarVerificacionForm,
    nextState: ACCION_ESTADOS.CERRADA,
    color: 'bg-green-500',
    colorClasses: 'bg-green-100 dark:bg-green-900/40',
  },
  [ACCION_ESTADOS.CERRADA]: {
    title: 'Acción Cerrada',
    component: null, // No hay formulario para el estado cerrado
    color: 'bg-gray-500',
    colorClasses: 'bg-gray-100 dark:bg-gray-800',
  },
};
