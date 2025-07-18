import express from 'express';
import {
  getAllAuditorias,
  getAuditoriaById,
  createAuditoria,
  updateAuditoria,
  deleteAuditoria,
  getAspectos,
  addAspecto,
  updateAspecto,
  deleteAspecto,
  addRelacion,
  getRelaciones,
  deleteRelacion,
  getRegistrosRelacionables
} from '../controllers/auditoriasController.js';

const router = express.Router();

// ===============================================
// RUTAS DE AUDITORÍAS - SGC PRO
// ===============================================

// Rutas principales de auditorías
router.get('/', getAllAuditorias);
router.get('/:id', getAuditoriaById);
router.post('/', createAuditoria);
router.put('/:id', updateAuditoria);
router.delete('/:id', deleteAuditoria);

// Rutas de aspectos de auditoría
router.get('/:auditoriaId/aspectos', getAspectos);
router.post('/:auditoriaId/aspectos', addAspecto);
router.put('/:auditoriaId/aspectos/:aspectoId', updateAspecto);
router.delete('/:auditoriaId/aspectos/:aspectoId', deleteAspecto);

// Rutas de relaciones de auditoría
router.get('/:auditoriaId/relaciones', getRelaciones);
router.post('/:auditoriaId/relaciones', addRelacion);
router.delete('/relaciones/:relacionId', deleteRelacion);

// Ruta para obtener registros relacionables
router.get('/registros-relacionables/:tipo', getRegistrosRelacionables);

export default router; 