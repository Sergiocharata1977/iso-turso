import { Router } from 'express';
import evaluacionesCompetenciasController from '../controllers/evaluacionesCompetenciasController.js';

const router = Router();

// Listar todas las evaluaciones de competencias
router.get('/', evaluacionesCompetenciasController.getEvaluacionesCompetencias);
// Programar una nueva evaluación
router.post('/', evaluacionesCompetenciasController.createEvaluacionCompetencia);
// Obtener detalle de una evaluación
router.get('/:id', evaluacionesCompetenciasController.getEvaluacionCompetencia);
// Ejecutar (actualizar) una evaluación
router.put('/:id', evaluacionesCompetenciasController.updateEvaluacionCompetencia);
// Eliminar una evaluación
router.delete('/:id', evaluacionesCompetenciasController.deleteEvaluacionCompetencia);

export default router; 