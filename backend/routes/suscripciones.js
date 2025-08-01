import express from 'express';
const router = express.Router();

// GET - Obtener todas las suscripciones
router.get('/', (req, res) => {
  res.json({ message: 'Suscripciones endpoint working' });
});

// GET - Obtener una suscripción específica
router.get('/:id', (req, res) => {
  res.json({ message: 'Suscripción específica endpoint working', id: req.params.id });
});

// POST - Crear nueva suscripción
router.post('/', (req, res) => {
  res.json({ message: 'Crear suscripción endpoint working' });
});

// PUT - Actualizar suscripción
router.put('/:id', (req, res) => {
  res.json({ message: 'Actualizar suscripción endpoint working', id: req.params.id });
});

// DELETE - Eliminar suscripción
router.delete('/:id', (req, res) => {
  res.json({ message: 'Eliminar suscripción endpoint working', id: req.params.id });
});

// GET - Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Suscripciones service running' });
});

export default router; 