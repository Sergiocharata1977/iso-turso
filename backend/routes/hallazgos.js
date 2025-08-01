import express from 'express';
const router = express.Router();

// GET - Obtener todos los hallazgos
router.get('/', (req, res) => {
  res.json({ message: 'Hallazgos endpoint working' });
});

// GET - Obtener un hallazgo específico
router.get('/:id', (req, res) => {
  res.json({ message: 'Hallazgo específico endpoint working', id: req.params.id });
});

// POST - Crear nuevo hallazgo
router.post('/', (req, res) => {
  res.json({ message: 'Crear hallazgo endpoint working' });
});

// PUT - Actualizar hallazgo
router.put('/:id', (req, res) => {
  res.json({ message: 'Actualizar hallazgo endpoint working', id: req.params.id });
});

// DELETE - Eliminar hallazgo
router.delete('/:id', (req, res) => {
  res.json({ message: 'Eliminar hallazgo endpoint working', id: req.params.id });
});

// GET - Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hallazgos service running' });
});

export default router; 