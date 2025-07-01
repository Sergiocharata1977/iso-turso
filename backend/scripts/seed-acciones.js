import { tursoClient } from '../lib/tursoClient.js';
import { randomUUID } from 'crypto';

async function getFirstHallazgoId() {
  try {
    const rs = await tursoClient.execute('SELECT id FROM hallazgos LIMIT 1');
    if (rs.rows.length > 0) {
      return rs.rows[0].id;
    }
    console.error('No se encontraron hallazgos. Por favor, crea al menos un hallazgo antes de ejecutar este script.');
    return null;
  } catch (e) {
    console.error('Error al obtener el hallazgo:', e);
    return null;
  }
}

async function seedAcciones() {
  const hallazgoId = await getFirstHallazgoId();
  if (!hallazgoId) {
    return;
  }

  try {
    console.log('Limpiando acciones existentes...');
    await tursoClient.execute('DELETE FROM acciones');
    console.log('Acciones existentes eliminadas.');
  } catch (e) {
    console.error('Error al limpiar la tabla de acciones:', e);
    return; // Detener si no se puede limpiar
  }

  const acciones = [
    {
      id: randomUUID(),
      titulo: 'Investigar causa raíz del problema de stock',
      descripcion: 'Realizar un análisis detallado para identificar por qué el inventario no coincide con el sistema.',
      responsable_ejecucion: 'Juan Pérez',
      fecha_limite: '2025-07-15',
      estado: 'p1_planificacion_accion',
    },
    {
      id: randomUUID(),
      titulo: 'Capacitar al personal en nuevo procedimiento',
      descripcion: 'Organizar una sesión de capacitación para todo el personal del almacén sobre el nuevo proceso de recepción de mercancías.',
      responsable_ejecucion: 'Maria García',
      fecha_limite: '2025-08-01',
      estado: 'e2_ejecucion_accion', // Corregido el estado
    },
  ];

  try {
    for (const accion of acciones) {
      const numeroAccionResult = await tursoClient.execute("SELECT numeroAccion FROM acciones ORDER BY numeroAccion DESC LIMIT 1");
      let nextNumeroAccion = 'AM-001';
      if (numeroAccionResult.rows.length > 0) {
          const lastNumero = numeroAccionResult.rows[0].numeroAccion;
          const lastId = parseInt(lastNumero.split('-')[1]);
          nextNumeroAccion = `AM-${String(lastId + 1).padStart(3, '0')}`;
      }

      await tursoClient.execute({
        sql: `INSERT INTO acciones (id, hallazgo_id, numeroAccion, titulo, descripcion, estado, responsable_ejecucion, fecha_limite, eficacia)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,        args: [accion.id, hallazgoId, nextNumeroAccion, accion.titulo, accion.descripcion, accion.estado, accion.responsable_ejecucion, accion.fecha_limite, 'Pendiente'],
      });
      console.log(`Acción '${accion.titulo}' creada con éxito.`);
    }
    console.log('¡Datos de prueba para acciones insertados correctamente!');
  } catch (e) {
    console.error('Error al insertar datos de prueba para acciones:', e);
  }
}

seedAcciones();
