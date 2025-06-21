import express from 'express';
// Importamos el cliente de Turso
import { tursoClient } from '../lib/tursoClient.js';

const router = express.Router();
const TABLE_NAME = 'tickets';

// @route   GET api/tickets
// @desc    Obtener todos los tickets desde la base de datos
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    // Usamos directamente el cliente tursoClient para obtener todos los registros
    const result = await tursoClient.execute(`SELECT * FROM ${TABLE_NAME}`);
    const allTickets = result.rows || [];
    console.log(`Se encontraron ${allTickets.length} tickets en la base de datos.`);
    res.json(allTickets); 
  } catch (error) {
    console.error('Error al obtener tickets desde la base de datos:', error);
    next(error);
  }
});

// @route   POST api/tickets
// @desc    Crear un nuevo ticket en la base de datos
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const newTicketData = req.body;
    
    // TODO: Realizar una validación más robusta de los datos de entrada.
    if (!newTicketData.problem) {
      return res.status(400).json({ message: 'El campo "problem" es obligatorio.' });
    }

    // Preparar los datos para la inserción
    const keys = Object.keys(newTicketData);
    const values = Object.values(newTicketData);
    
    const placeholders = keys.map(() => '?').join(', ');
    const fieldsString = keys.join(', ');
    
    // Insertamos directamente usando tursoClient
    const result = await tursoClient.execute(
      `INSERT INTO ${TABLE_NAME} (${fieldsString}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    
    const createdTicket = result.rows[0];
    
    console.log('Ticket creado y guardado en la base de datos:', createdTicket);
    res.status(201).json(createdTicket);
  } catch (error) {
    console.error('Error al crear ticket en la base de datos:', error);
    next(error);
  }
});

// TODO: Implementar las rutas para PUT, DELETE y GET por ID.

export default router;
