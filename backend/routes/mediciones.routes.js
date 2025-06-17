import { Router } from 'express';
import { tursoClient } from '../lib/tursoClient.js';
import crypto from 'crypto';

const router = Router();

// GET /api/mediciones - Listar todas las mediciones
router.get('/', async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT m.*, i.nombre as indicador_nombre 
        FROM mediciones m
        LEFT JOIN indicadores i ON m.indicador_id = i.id
        ORDER BY m.fecha_medicion DESC
      `
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mediciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/mediciones - Crear una nueva medición
router.post('/', async (req, res) => {
  const { indicador_id, valor, fecha_medicion, observaciones, responsable } = req.body;

  if (!indicador_id || valor === undefined || valor === null) {
    return res.status(400).json({ error: 'Los campos "indicador_id" y "valor" son obligatorios.' });
  }

  try {
    // Verificar que el indicador existe
    const indicador = await tursoClient.execute({
      sql: 'SELECT id FROM indicadores WHERE id = ?',
      args: [indicador_id],
    });

    if (indicador.rows.length === 0) {
      return res.status(404).json({ error: 'El indicador especificado no existe.' });
    }

    const fechaCreacion = new Date().toISOString();
    const fechaMedicionFinal = fecha_medicion || fechaCreacion;
    const id = crypto.randomUUID();
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO mediciones (
              id, indicador_id, valor, fecha_medicion, 
              observaciones, responsable, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, 
        indicador_id, 
        valor, 
        fechaMedicionFinal, 
        observaciones || null, 
        responsable || null,
        fechaCreacion
      ],
    });

    // Devolver la medición recién creada
    const newMedicion = await tursoClient.execute({
      sql: `
        SELECT m.*, i.nombre as indicador_nombre 
        FROM mediciones m
        LEFT JOIN indicadores i ON m.indicador_id = i.id
        WHERE m.id = ?
      `,
      args: [id]
    });
    
    if (newMedicion.rows.length > 0) {
      res.status(201).json(newMedicion.rows[0]);
    } else {
      res.status(201).json({ 
        id, 
        indicador_id, 
        valor, 
        fecha_medicion: fechaMedicionFinal, 
        observaciones, 
        responsable,
        fecha_creacion: fechaCreacion
      });
    }
  } catch (error) {
    console.error('Error al crear la medición:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mediciones/:id - Obtener una medición por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `
        SELECT m.*, i.nombre as indicador_nombre 
        FROM mediciones m
        LEFT JOIN indicadores i ON m.indicador_id = i.id
        WHERE m.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medición no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener la medición ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/mediciones/:id - Actualizar una medición
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { indicador_id, valor, fecha_medicion, observaciones, responsable } = req.body;

  if (!indicador_id || valor === undefined || valor === null) {
    return res.status(400).json({ error: 'Los campos "indicador_id" y "valor" son obligatorios.' });
  }

  try {
    // Verificar que el indicador existe
    const indicador = await tursoClient.execute({
      sql: 'SELECT id FROM indicadores WHERE id = ?',
      args: [indicador_id],
    });

    if (indicador.rows.length === 0) {
      return res.status(404).json({ error: 'El indicador especificado no existe.' });
    }

    // Verificar que la medición existe
    const existsCheck = await tursoClient.execute({
      sql: 'SELECT id FROM mediciones WHERE id = ?',
      args: [id]
    });
    
    if (existsCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Medición no encontrada.' });
    }

    const result = await tursoClient.execute({
      sql: `UPDATE mediciones SET 
              indicador_id = ?, valor = ?, fecha_medicion = ?, 
              observaciones = ?, responsable = ?
            WHERE id = ?`,
      args: [
        indicador_id, 
        valor, 
        fecha_medicion || null, 
        observaciones || null, 
        responsable || null,
        id
      ],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Medición no encontrada.' });
    }

    // Devolver la medición actualizada
    const updatedMedicion = await tursoClient.execute({
      sql: `
        SELECT m.*, i.nombre as indicador_nombre 
        FROM mediciones m
        LEFT JOIN indicadores i ON m.indicador_id = i.id
        WHERE m.id = ?
      `,
      args: [id]
    });

    res.json(updatedMedicion.rows[0]);
  } catch (error) {
    console.error(`Error al actualizar la medición ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/mediciones/:id - Eliminar una medición
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: 'DELETE FROM mediciones WHERE id = ?',
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Medición no encontrada.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error al eliminar la medición ${id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mediciones/indicador/:indicadorId - Obtener mediciones por indicador
router.get('/indicador/:indicadorId', async (req, res) => {
  const { indicadorId } = req.params;
  try {
    // Verificar que el indicador existe
    const indicador = await tursoClient.execute({
      sql: 'SELECT id, nombre, descripcion FROM indicadores WHERE id = ?',
      args: [indicadorId],
    });

    if (indicador.rows.length === 0) {
      return res.status(404).json({ error: 'Indicador no encontrado.' });
    }

    const result = await tursoClient.execute({
      sql: `
        SELECT * FROM mediciones 
        WHERE indicador_id = ?
        ORDER BY fecha_medicion DESC
      `,
      args: [indicadorId],
    });

    res.json({
      indicador: indicador.rows[0],
      mediciones: result.rows
    });
  } catch (error) {
    console.error(`Error al obtener mediciones para el indicador ${indicadorId}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
