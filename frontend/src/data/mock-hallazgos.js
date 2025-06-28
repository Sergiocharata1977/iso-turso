import { ESTADOS } from '@/lib/hallazgoEstados';

export const mockHallazgos = [
  {
    id: 1,
    numeroHallazgo: 'H001',
    titulo: 'Falta de calibración en equipos de medición',
    descripcion: 'Se detectó que 3 equipos no tienen calibración vigente en el laboratorio central.',
    responsable: 'Juan Pérez',
    fechaRegistro: '2024-01-15',
    prioridad: 'Alta',
    origen: 'Auditoría Interna',
    estado: ESTADOS.D2_CON_ACCION_INMEDIATA,
    etapa: 'Detección',
    accionInmediata: 'Suspender uso de equipos hasta calibración',
    acciones: [
      {
        id: 1,
        tipo: 'inmediata',
        descripcion: 'Suspender uso de equipos hasta calibración',
        fecha: '2024-01-15',
        estado: 'Completada'
      },
      {
        id: 2,
        tipo: 'correctiva',
        descripcion: 'Programar calibración con proveedor certificado',
        fecha: '2024-01-18',
        estado: 'En progreso'
      }
    ],
    historial: [
      {
        id: 1,
        tipo: 'estado',
        descripcion: 'Cambio de estado: Iniciado → Con acción inmediata',
        fecha: '2024-01-16 10:30',
        usuario: 'Juan Pérez'
      },
      {
        id: 2,
        tipo: 'creacion',
        descripcion: 'Hallazgo registrado inicialmente',
        fecha: '2024-01-15 14:20',
        usuario: 'Juan Pérez'
      }
    ]
  },
  {
    id: 2,
    numeroHallazgo: 'H002',
    titulo: 'Documentos obsoletos en área de producción',
    descripcion: 'Procedimientos desactualizados encontrados en la línea 2 de ensamblaje.',
    responsable: 'María García',
    fechaRegistro: '2024-01-14',
    prioridad: 'Media',
    origen: 'Revisión de Procesos',
    estado: ESTADOS.T4_EN_IMPLEMENTACION,
    etapa: 'Tratamiento',
    accionInmediata: ''
  },
  {
    id: 3,
    numeroHallazgo: 'H003',
    titulo: 'Capacitación insuficiente en nuevos procesos',
    descripcion: 'Personal de formación en producción no conoce el nuevo protocolo de seguridad.',
    responsable: 'Carlos López',
    fechaRegistro: '2024-01-12',
    prioridad: 'Alta',
    origen: 'Observación Directa',
    estado: ESTADOS.C2_EN_VERIFICACION,
    etapa: 'Verificación',
    accionInmediata: 'Se ha realizado una charla de refuerzo inmediata.'
  },
  {
    id: 4,
    numeroHallazgo: 'H004',
    titulo: 'Tiempos de respuesta lentos en soporte técnico',
    descripcion: 'Los tickets de soporte de baja prioridad tardan más de 72 horas en ser respondidos.',
    responsable: 'Ana Martínez',
    fechaRegistro: '2024-01-10',
    prioridad: 'Baja',
    origen: 'Queja de Cliente',
    estado: ESTADOS.T1_EN_ANALISIS,
    etapa: 'Tratamiento',
    accionInmediata: ''
  }
];
