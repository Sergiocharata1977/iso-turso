import { Router } from 'express';
import competenciasController from '../controllers/competenciasController.js';

const router = Router();

// Listar todas las competencias
router.get('/', competenciasController.getCompetencias);
// Crear una competencia
router.post('/', competenciasController.createCompetencia);
// Actualizar una competencia
router.put('/:id', competenciasController.updateCompetencia);
// Eliminar una competencia
router.delete('/:id', competenciasController.deleteCompetencia);

export default router; 