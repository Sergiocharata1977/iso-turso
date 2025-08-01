import express from 'express';
const router = express.Router();

// GET - Obtener todos los planes
router.get('/', (req, res) => {
  res.json({ message: 'Planes endpoint working' });
});

// GET - Obtener un plan específico
router.get('/:id', (req, res) => {
  res.json({ message: 'Plan específico endpoint working', id: req.params.id });
});

// POST - Crear nuevo plan
router.post('/', (req, res) => {
  res.json({ message: 'Crear plan endpoint working' });
});

// PUT - Actualizar plan
router.put('/:id', (req, res) => {
  res.json({ message: 'Actualizar plan endpoint working', id: req.params.id });
});

// DELETE - Eliminar plan
router.delete('/:id', (req, res) => {
  res.json({ message: 'Eliminar plan endpoint working', id: req.params.id });
});

// GET - Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Planes service running' });
});

export default router; 