import { tursoClient } from '../../lib/tursoClient.js';

// Obtener todas las reuniones de una organización
export const getReunionesByOrgId = async (organizationId) => {
  const result = await tursoClient.execute('SELECT * FROM reuniones WHERE organization_id = ? ORDER BY fecha DESC', [organizationId]);
  return result.rows;
};

// Obtener una reunión por su ID
export const getReunionById = async (id, organizationId) => {
  const result = await tursoClient.execute('SELECT * FROM reuniones WHERE id = ? AND organization_id = ?', [id, organizationId]);
  return result.rows[0];
};

// Crear una nueva reunión
export const createReunion = async (reunionData, organizationId) => {
  const { titulo, fecha, hora, area, temas, objetivos } = reunionData;
  const result = await tursoClient.execute({
    sql: 'INSERT INTO reuniones (titulo, fecha, hora, area, temas, objetivos, organization_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [titulo, fecha, hora, area, temas, objetivos, organizationId]
  });
  
  // Obtener el ID de la nueva reunión
  const reunionId = result.lastInsertRowid;
  
  // Si hay participantes, crear las relaciones correspondientes
  if (reunionData.participantes && reunionData.participantes.length > 0) {
    await addParticipantesToReunion(reunionId, reunionData.participantes, organizationId);
  }
  
  // Si hay documentos, crear las relaciones correspondientes
  if (reunionData.documentos && reunionData.documentos.length > 0) {
    await addDocumentsToReunion(reunionId, reunionData.documentos, organizationId);
  }
  
  const newReunionResult = await tursoClient.execute('SELECT * FROM reuniones WHERE id = ?', [reunionId]);
  return newReunionResult.rows[0];
};

// Actualizar una reunión existente
export const updateReunion = async (id, reunionData, organizationId) => {
  const { titulo, fecha, hora, area, estado, temas, objetivos, minuta } = reunionData;
  await tursoClient.execute({
    sql: 'UPDATE reuniones SET titulo = ?, fecha = ?, hora = ?, area = ?, estado = ?, temas = ?, objetivos = ?, minuta = ?, updated_at = datetime(\'now\',\'localtime\') WHERE id = ? AND organization_id = ?',
    args: [titulo, fecha, hora, area, estado, temas, objetivos, minuta, id, organizationId]
  });
  
  // Si hay participantes, actualizar las relaciones
  if (reunionData.participantes) {
    // Primero eliminamos las relaciones existentes
    await tursoClient.execute({
      sql: 'DELETE FROM relaciones WHERE organization_id = ? AND origin_tipo = ? AND origin_id = ? AND destino_tipo = ?',
      args: [organizationId, 'reunion', id, 'personal']
    });
    
    // Luego añadimos las nuevas relaciones
    if (reunionData.participantes.length > 0) {
      await addParticipantesToReunion(id, reunionData.participantes, organizationId);
    }
  }
  
  // Si hay documentos, actualizar las relaciones
  if (reunionData.documentos) {
    // Primero eliminamos las relaciones existentes
    await tursoClient.execute({
      sql: 'DELETE FROM relaciones WHERE organization_id = ? AND origin_tipo = ? AND origin_id = ? AND destino_tipo = ?',
      args: [organizationId, 'reunion', id, 'documento']
    });
    
    // Luego añadimos las nuevas relaciones
    if (reunionData.documentos.length > 0) {
      await addDocumentsToReunion(id, reunionData.documentos, organizationId);
    }
  }
  
  return getReunionById(id, organizationId);
};

// Eliminar una reunión
export const deleteReunion = async (id, organizationId) => {
  // Primero eliminamos todas las relaciones asociadas a esta reunión
  await tursoClient.execute({
    sql: 'DELETE FROM relaciones WHERE organization_id = ? AND origin_tipo = ? AND origin_id = ?',
    args: [organizationId, 'reunion', id]
  });
  
  // Luego eliminamos la reunión
  const result = await tursoClient.execute({
    sql: 'DELETE FROM reuniones WHERE id = ? AND organization_id = ?',
    args: [id, organizationId]
  });
  return result.rowsAffected > 0;
};

// Añadir participantes a una reunión usando la tabla relaciones
export const addParticipantesToReunion = async (reunionId, participantes, organizationId) => {
  for (const participante of participantes) {
    const { personalId, rol = 'Asistente', confirmado = false, asistio = false } = participante;
    
    // Creamos un objeto JSON con la información adicional
    const descripcion = JSON.stringify({ rol, confirmado, asistio });
    
    await tursoClient.execute({
      sql: 'INSERT INTO relaciones (organization_id, origin_tipo, origin_id, destino_tipo, destino_id, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      args: [organizationId, 'reunion', reunionId, 'personal', personalId, descripcion]
    });
  }
};

// Añadir documentos a una reunión usando la tabla relaciones
export const addDocumentsToReunion = async (reunionId, documentos, organizationId) => {
  for (const documento of documentos) {
    const { documentoId, tipo = 'Adjunto', comentario = '' } = documento;
    
    // Creamos un objeto JSON con la información adicional
    const descripcion = JSON.stringify({ tipo, comentario });
    
    await tursoClient.execute({
      sql: 'INSERT INTO relaciones (organization_id, origin_tipo, origin_id, destino_tipo, destino_id, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      args: [organizationId, 'reunion', reunionId, 'documento', documentoId, descripcion]
    });
  }
};

// Obtener los participantes de una reunión
export const getParticipantesByReunionId = async (reunionId, organizationId) => {
  const result = await tursoClient.execute({
    sql: `SELECT r.*, p.* 
     FROM relaciones r 
     JOIN personal p ON r.destino_id = p.id 
     WHERE r.organization_id = ? 
     AND r.origin_tipo = 'reunion' 
     AND r.origin_id = ? 
     AND r.destino_tipo = 'personal'`,
    args: [organizationId, reunionId]
  });
  
  // Procesamos los resultados para extraer la información de descripcion (JSON)
  return result.rows.map(row => {
    const infoAdicional = row.descripcion ? JSON.parse(row.descripcion) : {};
    return {
      personalId: row.destino_id,
      nombre: row.nombre,
      apellido: row.apellido,
      email: row.email,
      rol: infoAdicional.rol || 'Asistente',
      confirmado: infoAdicional.confirmado || false,
      asistio: infoAdicional.asistio || false
    };
  });
};

// Obtener los documentos de una reunión
export const getDocumentosByReunionId = async (reunionId, organizationId) => {
  const result = await tursoClient.execute({
    sql: `SELECT r.*, d.* 
     FROM relaciones r 
     JOIN documentos d ON r.destino_id = d.id 
     WHERE r.organization_id = ? 
     AND r.origin_tipo = 'reunion' 
     AND r.origin_id = ? 
     AND r.destino_tipo = 'documento'`,
    args: [organizationId, reunionId]
  });
  
  // Procesamos los resultados para extraer la información de descripcion (JSON)
  return result.rows.map(row => {
    const infoAdicional = row.descripcion ? JSON.parse(row.descripcion) : {};
    return {
      documentoId: row.destino_id,
      nombre: row.nombre,
      tipo: infoAdicional.tipo || 'Adjunto',
      comentario: infoAdicional.comentario || ''
    };
  });
};

// Obtener una reunión completa con sus participantes y documentos
export const getReunionCompleta = async (id, organizationId) => {
  const reunion = await getReunionById(id, organizationId);
  if (!reunion) return null;
  
  const participantes = await getParticipantesByReunionId(id, organizationId);
  const documentos = await getDocumentosByReunionId(id, organizationId);
  
  return {
    ...reunion,
    participantes,
    documentos
  };
};
