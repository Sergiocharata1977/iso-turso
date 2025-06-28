import { Router } from 'express';
import {
  getEncuestas,
  createEncuesta,
  getEncuesta,
  updateEncuesta,
  deleteEncuesta,
  addRespuesta
} from '../controllers/encuestas.controller.js';

const router = Router();

// Rutas para Encuestas
router.get('/', getEncuestas);
router.post('/', createEncuesta);
router.get('/:id', getEncuesta);
router.put('/:id', updateEncuesta);
router.delete('/:id', deleteEncuesta);

// Ruta para Respuestas de una Encuesta
router.post('/:id/respuestas', addRespuesta);

export default router;
