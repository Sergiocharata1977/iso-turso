import express from 'express';
import { tursoClient } from '../lib/tursoClient.js';

const router = express.Router();

// Obtener todos los usuarios de la organización
router.get('/', async (req, res) => {
  try {
    const organization_id = req.user?.organization_id;

    if (!organization_id) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo determinar la organización del usuario.'
      });
    }

    console.log(`🔍 Obteniendo usuarios para organización: ${organization_id}`);

    const result = await tursoClient.execute({
      sql: `SELECT 
        id, name, email, role, organization_id, created_at, updated_at
        FROM usuarios 
        WHERE organization_id = ?
        ORDER BY name ASC`,
      args: [organization_id]
    });

    console.log(`✅ Encontrados ${result.rows.length} usuarios para organización ${organization_id}`);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

// Obtener usuario específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const organization_id = req.user?.organization_id;

    if (!organization_id) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo determinar la organización del usuario.'
      });
    }

    const result = await tursoClient.execute({
      sql: `SELECT 
        id, name, email, role, organization_id, created_at, updated_at
        FROM usuarios 
        WHERE id = ? AND organization_id = ?`,
      args: [id, organization_id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      role = 'user'
    } = req.body;

    const organization_id = req.user?.organization_id;

    if (!organization_id) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo determinar la organización del usuario.'
      });
    }

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'nombre, email y password son campos requeridos'
      });
    }

    // Verificar si el email ya existe
    const existingResult = await tursoClient.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ? AND organization_id = ?',
      args: [email, organization_id]
    });

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash de la contraseña (simplificado por ahora)
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await tursoClient.execute({
      sql: `INSERT INTO usuarios (
        nombre, email, password, role, organization_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *`,
      args: [nombre, email, hashedPassword, role, organization_id]
    });

    console.log(`✅ Usuario creado con ID: ${result.rows[0].id}`);

    // No devolver la contraseña
    const { password: _, ...userData } = result.rows[0];

    res.status(201).json({
      success: true,
      data: userData,
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      email,
      role
    } = req.body;

    const organization_id = req.user?.organization_id;

    if (!organization_id) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo determinar la organización del usuario.'
      });
    }

    // Verificar que el usuario existe y pertenece a la organización
    const existingResult = await tursoClient.execute({
      sql: 'SELECT id FROM usuarios WHERE id = ? AND organization_id = ?',
      args: [id, organization_id]
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const result = await tursoClient.execute({
      sql: `UPDATE usuarios SET 
        nombre = ?, email = ?, role = ?, updated_at = datetime('now')
        WHERE id = ? AND organization_id = ?
        RETURNING *`,
      args: [nombre, email, role, id, organization_id]
    });

    console.log(`✅ Usuario ${id} actualizado`);

    // No devolver la contraseña
    const { password: _, ...userData } = result.rows[0];

    res.json({
      success: true,
      data: userData,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const organization_id = req.user?.organization_id;

    if (!organization_id) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo determinar la organización del usuario.'
      });
    }

    // Verificar que el usuario existe y pertenece a la organización
    const existingResult = await tursoClient.execute({
      sql: 'SELECT id FROM usuarios WHERE id = ? AND organization_id = ?',
      args: [id, organization_id]
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await tursoClient.execute({
      sql: 'DELETE FROM usuarios WHERE id = ? AND organization_id = ?',
      args: [id, organization_id]
    });

    console.log(`✅ Usuario ${id} eliminado`);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

export default router; 