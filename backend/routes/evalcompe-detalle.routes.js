import { Router } from 'express';
import evalcompeDetalleController from '../controllers/evalcompeDetalleController.js';

const router = Router();

router.get('/', evalcompeDetalleController.getDetallesByProgramacion); // ?programacion_id=xx
router.get('/:id', evalcompeDetalleController.getDetalle);
router.put('/:id', evalcompeDetalleController.updateDetalle);
router.delete('/:id', evalcompeDetalleController.deleteDetalle);

export default router; 