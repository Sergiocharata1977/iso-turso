import { tursoClient } from '../lib/tursoClient.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// ===== SUPER ADMIN FUNCTIONS =====

export const getAllOrganizations = async (req, res) => {
  try {
    console.log('🔍 Super Admin: Obteniendo todas las organizaciones...');
    
    const result = await tursoClient.execute({
      sql: `
        SELECT 
          o.*,
          COUNT(u.id) as total_users,
          COUNT(CASE WHEN u.is_active = 1 THEN 1 END) as active_users
        FROM organizations o
        LEFT JOIN usuarios u ON o.id = u.organization_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `
    });

    console.log(`✅ ${result.rows.length} organizaciones encontradas`);
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error obteniendo organizaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener organizaciones',
      error: error.message
    });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Super Admin: Obteniendo organización ${id}...`);
    
    const result = await tursoClient.execute({
      sql: `
        SELECT 
          o.*,
          COUNT(u.id) as total_users,
          COUNT(CASE WHEN u.is_active = 1 THEN 1 END) as active_users
        FROM organizations o
        LEFT JOIN usuarios u ON o.id = u.organization_id
        WHERE o.id = ?
        GROUP BY o.id
      `,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }

    console.log(`✅ Organización ${id} encontrada`);
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error obteniendo organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener organización',
      error: error.message
    });
  }
};

export const createOrganization = async (req, res) => {
  try {
    const { name, email, phone, plan = 'basic' } = req.body;
    console.log('🔍 Super Admin: Creando nueva organización...');
    
    // Validaciones
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son requeridos'
      });
    }

    // Verificar si ya existe una organización con ese nombre
    const existingOrg = await tursoClient.execute({
      sql: 'SELECT id FROM organizations WHERE name = ?',
      args: [name]
    });

    if (existingOrg.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una organización con ese nombre'
      });
    }

    const result = await tursoClient.execute({
      sql: `
        INSERT INTO organizations (name, email, phone, plan, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        RETURNING *
      `,
      args: [name, email, phone, plan]
    });

    console.log(`✅ Organización creada con ID: ${result.rows[0].id}`);
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Organización creada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear organización',
      error: error.message
    });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, plan, is_active } = req.body;
    console.log(`🔍 Super Admin: Actualizando organización ${id}...`);
    
    const result = await tursoClient.execute({
      sql: `
        UPDATE organizations 
        SET name = ?, email = ?, phone = ?, plan = ?, is_active = ?, updated_at = datetime('now')
        WHERE id = ?
        RETURNING *
      `,
      args: [name, email, phone, plan, is_active, id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }

    console.log(`✅ Organización ${id} actualizada`);
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Organización actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar organización',
      error: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log('🔍 Super Admin: Obteniendo todos los usuarios...');
    
    const result = await tursoClient.execute({
      sql: `
        SELECT 
          u.*,
          o.name as organization_name
        FROM usuarios u
        LEFT JOIN organizations o ON u.organization_id = o.id
        ORDER BY u.created_at DESC
      `
    });

    console.log(`✅ ${result.rows.length} usuarios encontrados`);
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
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, organization_id } = req.body;
    console.log('🔍 Super Admin: Creando nuevo usuario...');
    
    // Validaciones
    if (!name || !email || !password || !role || !organization_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await tursoClient.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ?',
      args: [email]
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese email'
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await tursoClient.execute({
      sql: `
        INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        RETURNING id, name, email, role, organization_id, is_active, created_at
      `,
      args: [name, email, passwordHash, role, organization_id]
    });

    console.log(`✅ Usuario creado con ID: ${result.rows[0].id}`);
    res.status(201).json({
      success: true,
      data: result.rows[0],
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
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, organization_id, is_active } = req.body;
    console.log(`🔍 Super Admin: Actualizando usuario ${id}...`);
    
    // Verificar si el usuario existe
    const existingUser = await tursoClient.execute({
      sql: 'SELECT id FROM usuarios WHERE id = ?',
      args: [id]
    });

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si se proporciona un nuevo email, verificar que no exista
    if (email) {
      const emailCheck = await tursoClient.execute({
        sql: 'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        args: [email, id]
      });

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese email'
        });
      }
    }

    // Construir la consulta SQL dinámicamente
    let sql = 'UPDATE usuarios SET ';
    let args = [];
    let updates = [];

    if (name) {
      updates.push('name = ?');
      args.push(name);
    }
    if (email) {
      updates.push('email = ?');
      args.push(email);
    }
    if (password) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updates.push('password_hash = ?');
      args.push(passwordHash);
    }
    if (role) {
      updates.push('role = ?');
      args.push(role);
    }
    if (organization_id) {
      updates.push('organization_id = ?');
      args.push(organization_id);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      args.push(is_active);
    }

    updates.push('updated_at = datetime(\'now\')');
    sql += updates.join(', ') + ' WHERE id = ? RETURNING *';
    args.push(id);

    const result = await tursoClient.execute({ sql, args });

    console.log(`✅ Usuario ${id} actualizado`);
    res.json({
      success: true,
      data: result.rows[0],
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
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Super Admin: Eliminando usuario ${id}...`);
    
    // Verificar si el usuario existe
    const existingUser = await tursoClient.execute({
      sql: 'SELECT id, role FROM usuarios WHERE id = ?',
      args: [id]
    });

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar super admins
    if (existingUser.rows[0].role === 'super_admin') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un Super Administrador'
      });
    }

    const result = await tursoClient.execute({
      sql: 'DELETE FROM usuarios WHERE id = ? RETURNING id',
      args: [id]
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
};

// ===== ORGANIZATION ADMIN FUNCTIONS =====

export const getOrganizationUsers = async (req, res) => {
  try {
    const { organizationId } = req.params;
    console.log(`🔍 Admin: Obteniendo usuarios de organización ${organizationId}...`);
    
    const result = await tursoClient.execute({
      sql: `
        SELECT 
          u.id, u.name, u.email, u.role, u.is_active, u.created_at,
          o.name as organization_name
        FROM usuarios u
        LEFT JOIN organizations o ON u.organization_id = o.id
        WHERE u.organization_id = ?
        ORDER BY u.created_at DESC
      `,
      args: [organizationId]
    });

    console.log(`✅ ${result.rows.length} usuarios encontrados en organización ${organizationId}`);
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuarios de organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios de la organización',
      error: error.message
    });
  }
};

export const createOrganizationUser = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { name, email, password, role = 'employee' } = req.body;
    console.log(`🔍 Admin: Creando usuario en organización ${organizationId}...`);
    
    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Verificar que el rol sea válido para admin de organización
    const validRoles = ['admin', 'manager', 'employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido'
      });
    }

    // Verificar si ya existe un usuario con ese email en la organización
    const existingUser = await tursoClient.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ? AND organization_id = ?',
      args: [email, organizationId]
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese email en esta organización'
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await tursoClient.execute({
      sql: `
        INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        RETURNING id, name, email, role, organization_id, is_active, created_at
      `,
      args: [name, email, passwordHash, role, organizationId]
    });

    console.log(`✅ Usuario creado en organización ${organizationId} con ID: ${result.rows[0].id}`);
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando usuario en organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario en la organización',
      error: error.message
    });
  }
};

export const updateOrganizationUser = async (req, res) => {
  try {
    const { organizationId, userId } = req.params;
    const { name, email, role, is_active } = req.body;
    console.log(`🔍 Admin: Actualizando usuario ${userId} en organización ${organizationId}...`);
    
    const result = await tursoClient.execute({
      sql: `
        UPDATE usuarios 
        SET name = ?, email = ?, role = ?, is_active = ?, updated_at = datetime('now')
        WHERE id = ? AND organization_id = ?
        RETURNING id, name, email, role, organization_id, is_active, created_at, updated_at
      `,
      args: [name, email, role, is_active, userId, organizationId]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en esta organización'
      });
    }

    console.log(`✅ Usuario ${userId} actualizado en organización ${organizationId}`);
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando usuario en organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario en la organización',
      error: error.message
    });
  }
};

export const deleteOrganizationUser = async (req, res) => {
  try {
    const { organizationId, userId } = req.params;
    console.log(`🔍 Admin: Eliminando usuario ${userId} de organización ${organizationId}...`);
    
    const result = await tursoClient.execute({
      sql: 'DELETE FROM usuarios WHERE id = ? AND organization_id = ?',
      args: [userId, organizationId]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en esta organización'
      });
    }

    console.log(`✅ Usuario ${userId} eliminado de organización ${organizationId}`);
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando usuario de organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario de la organización',
      error: error.message
    });
  }
};

// ===== FEATURES MANAGEMENT =====

export const getOrganizationFeatures = async (req, res) => {
  try {
    const { organizationId } = req.params;
    console.log(`🔍 Obteniendo features de organización ${organizationId}...`);
    
    const result = await tursoClient.execute({
      sql: `
        SELECT feature_name, is_enabled
        FROM organization_features
        WHERE organization_id = ?
        ORDER BY feature_name
      `,
      args: [organizationId]
    });

    console.log(`✅ ${result.rows.length} features encontradas para organización ${organizationId}`);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo features de organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener features de la organización',
      error: error.message
    });
  }
};

export const updateOrganizationFeatures = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { features } = req.body; // Array de { feature_name, is_enabled }
    console.log(`🔍 Actualizando features de organización ${organizationId}...`);
    
    // Actualizar cada feature
    for (const feature of features) {
      await tursoClient.execute({
        sql: `
          INSERT OR REPLACE INTO organization_features (organization_id, feature_name, is_enabled, created_at)
          VALUES (?, ?, ?, datetime('now'))
        `,
        args: [organizationId, feature.feature_name, feature.is_enabled]
      });
    }

    console.log(`✅ Features actualizadas para organización ${organizationId}`);
    res.json({
      success: true,
      message: 'Features actualizadas exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando features de organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar features de la organización',
      error: error.message
    });
  }
}; 