// Rutas y controlador para Procesos (CRUD básico)
const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de tener este módulo para conexión Turso/SQLite

// Obtener todos los procesos
router.get('/', (req, res) => {
  try {
    const procesos = db.prepare('SELECT * FROM procesos').all();
    res.json(procesos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los procesos: ' + error.message });
  }
});

// Obtener un proceso por ID
router.get('/:id', (req, res) => {
  try {
    const proceso = db.prepare('SELECT * FROM procesos WHERE id = ?').get(req.params.id);
    if (!proceso) return res.status(404).json({ error: 'Proceso no encontrado' });
    res.json(proceso);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proceso: ' + error.message });
  }
});

// Crear un proceso
router.post('/', (req, res) => {
  try {
    const { nombre, codigo, version, responsable, descripcion } = req.body;
    const stmt = db.prepare('INSERT INTO procesos (nombre, codigo, version, responsable, descripcion) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(nombre, codigo, version, responsable, descripcion);
    const nuevoProceso = db.prepare('SELECT * FROM procesos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(nuevoProceso);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proceso: ' + error.message });
  }
});

// Actualizar un proceso
router.put('/:id', (req, res) => {
  try {
    const { nombre, codigo, version, responsable, descripcion } = req.body;
    const stmt = db.prepare('UPDATE procesos SET nombre = ?, codigo = ?, version = ?, responsable = ?, descripcion = ? WHERE id = ?');
    const info = stmt.run(nombre, codigo, version, responsable, descripcion, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Proceso no encontrado' });
    const procesoActualizado = db.prepare('SELECT * FROM procesos WHERE id = ?').get(req.params.id);
    res.json(procesoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proceso: ' + error.message });
  }
});

// Eliminar un proceso
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM procesos WHERE id = ?');
    const info = stmt.run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Proceso no encontrado' });
    res.json({ message: 'Proceso eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proceso: ' + error.message });
  }
});

module.exports = router;
