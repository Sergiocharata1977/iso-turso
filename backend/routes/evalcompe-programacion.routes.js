import { Router } from 'express';
import evalcompeProgramacionController from '../controllers/evalcompeProgramacionController.js';

const router = Router();

router.get('/', evalcompeProgramacionController.getProgramaciones);
router.post('/', evalcompeProgramacionController.createProgramacion);
router.get('/:id', evalcompeProgramacionController.getProgramacion);
router.put('/:id', evalcompeProgramacionController.updateProgramacion);
router.delete('/:id', evalcompeProgramacionController.deleteProgramacion);

export default router; 