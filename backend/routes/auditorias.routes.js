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
  deleteAspecto
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

// Rutas de aspectos
router.get('/:auditoriaId/aspectos', getAspectos);
router.post('/:auditoriaId/aspectos', addAspecto);

// Rutas de aspectos individuales
router.put('/auditoria-aspectos/:id', updateAspecto);
router.delete('/auditoria-aspectos/:id', deleteAspecto);

export default router; 