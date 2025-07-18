import express from 'express';
import {
  getAllReuniones,
  getReunion,
  getReunionCompleta,
  createNewReunion,
  updateExistingReunion,
  deleteExistingReunion,
  getParticipantesByReunion,
  getDocumentosByReunion
} from '../controllers/reunionesController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas aquí están protegidas y requieren autenticación
router.use(authMiddleware);

// GET /api/reuniones - Obtener todas las reuniones de la organización del usuario
router.get('/', getAllReuniones);

// GET /api/reuniones/:id - Obtener una reunión específica (solo datos básicos)
router.get('/:id', getReunion);

// GET /api/reuniones/:id/completa - Obtener una reunión con participantes y documentos
router.get('/:id/completa', getReunionCompleta);

// GET /api/reuniones/:id/participantes - Obtener los participantes de una reunión
router.get('/:id/participantes', getParticipantesByReunion);

// GET /api/reuniones/:id/documentos - Obtener los documentos de una reunión
router.get('/:id/documentos', getDocumentosByReunion);

// POST /api/reuniones - Crear una nueva reunión
router.post('/', createNewReunion);

// PUT /api/reuniones/:id - Actualizar una reunión existente
router.put('/:id', updateExistingReunion);

// DELETE /api/reuniones/:id - Eliminar una reunión
router.delete('/:id', deleteExistingReunion);

export default router;
