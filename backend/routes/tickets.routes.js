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

    const tickets = result.rows.map(ticket => ({
      ...ticket,
      comentarios: ticket.comentarios ? JSON.parse(ticket.comentarios) : [],
      archivos: ticket.archivos ? JSON.parse(ticket.archivos) : [],
    }));

    res.json(tickets);
    console.log(`Se encontraron ${tickets.length} tickets en la base de datos.`);
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
    
    // Validación de los datos de entrada
    if (!newTicketData.titulo || !newTicketData.descripcion) {
      return res.status(400).json({ message: 'Los campos "titulo" y "descripcion" son obligatorios.' });
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

// @route   GET api/tickets/:id
// @desc    Obtener un ticket por ID
// @access  Private
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    const ticket = result.rows[0];
    ticket.comentarios = ticket.comentarios ? JSON.parse(ticket.comentarios) : [];
    ticket.archivos = ticket.archivos ? JSON.parse(ticket.archivos) : [];

    res.json(ticket);
  } catch (error) {
    console.error(`Error al obtener el ticket ${id}:`, error);
    next(error);
  }
});

// @route   PUT api/tickets/:id
// @desc    Actualizar un ticket existente
// @access  Private
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const updatedTicketData = req.body;

  try {
    // Convertir arrays a JSON strings si existen
    if (updatedTicketData.comentarios) {
      updatedTicketData.comentarios = JSON.stringify(updatedTicketData.comentarios);
    }
    if (updatedTicketData.archivos) {
      updatedTicketData.archivos = JSON.stringify(updatedTicketData.archivos);
    }

    const fields = Object.keys(updatedTicketData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updatedTicketData);

    const result = await tursoClient.execute({
      sql: `UPDATE ${TABLE_NAME} SET ${fields} WHERE id = ? RETURNING *`,
      args: [...values, id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado para actualizar' });
    }

    const updatedTicket = result.rows[0];
    // Parse back to send to frontend
    updatedTicket.comentarios = updatedTicket.comentarios ? JSON.parse(updatedTicket.comentarios) : [];
    updatedTicket.archivos = updatedTicket.archivos ? JSON.parse(updatedTicket.archivos) : [];

    res.json(updatedTicket);
  } catch (error) {
    console.error(`Error al actualizar el ticket ${id}:`, error);
    next(error);
  }
});

// @route   DELETE api/tickets/:id
// @desc    Eliminar un ticket
// @access  Private
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await tursoClient.execute({
      sql: `DELETE FROM ${TABLE_NAME} WHERE id = ? RETURNING *`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado para eliminar' });
    }

    res.json({ message: 'Ticket eliminado con éxito', deletedTicket: result.rows[0] });
  } catch (error) {
    console.error(`Error al eliminar el ticket ${id}:`, error);
    next(error);
  }
});

export default router;
