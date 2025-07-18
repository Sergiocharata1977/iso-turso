import * as reunionesService from '../services/reunionesService.js';

// Obtener todas las reuniones
export const getAllReuniones = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const reuniones = await reunionesService.getReunionesByOrgId(organizationId);
    res.status(200).json(reuniones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reuniones', error: error.message });
  }
};

// Obtener una reunión específica
export const getReunion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const reunion = await reunionesService.getReunionById(id, organizationId);
    if (!reunion) {
      return res.status(404).json({ message: 'Reunión no encontrada' });
    }
    res.status(200).json(reunion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la reunión', error: error.message });
  }
};

// Obtener una reunión completa con participantes y documentos
export const getReunionCompleta = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const reunion = await reunionesService.getReunionCompleta(id, organizationId);
    if (!reunion) {
      return res.status(404).json({ message: 'Reunión no encontrada' });
    }
    res.status(200).json(reunion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la reunión completa', error: error.message });
  }
};

// Crear una nueva reunión
export const createNewReunion = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const nuevaReunion = await reunionesService.createReunion(req.body, organizationId);
    res.status(201).json(nuevaReunion);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reunión', error: error.message });
  }
};

// Actualizar una reunión
export const updateExistingReunion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const reunionActualizada = await reunionesService.updateReunion(id, req.body, organizationId);
    if (!reunionActualizada) {
      return res.status(404).json({ message: 'Reunión no encontrada para actualizar' });
    }
    res.status(200).json(reunionActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la reunión', error: error.message });
  }
};

// Eliminar una reunión
export const deleteExistingReunion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const fueEliminada = await reunionesService.deleteReunion(id, organizationId);
    if (!fueEliminada) {
      return res.status(404).json({ message: 'Reunión no encontrada para eliminar' });
    }
    res.status(204).send(); // No hay contenido que enviar
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la reunión', error: error.message });
  }
};

// Obtener los participantes de una reunión
export const getParticipantesByReunion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const participantes = await reunionesService.getParticipantesByReunionId(id, organizationId);
    res.status(200).json(participantes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los participantes de la reunión', error: error.message });
  }
};

// Obtener los documentos de una reunión
export const getDocumentosByReunion = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const documentos = await reunionesService.getDocumentosByReunionId(id, organizationId);
    res.status(200).json(documentos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los documentos de la reunión', error: error.message });
  }
};
