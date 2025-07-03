import express from 'express';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de eventos están protegidas y requieren autenticación.
// El middleware 'protect' se encarga de verificar el token y adjuntar el usuario al request.

router.route('/')
  .get(protect, getAllEvents)   // Obtener todos los eventos de la organización del usuario
  .post(protect, createEvent);  // Crear un nuevo evento

router.route('/:id')
  .put(protect, updateEvent)    // Actualizar un evento por su ID
  .delete(protect, deleteEvent);// Eliminar un evento por su ID

export default router;
