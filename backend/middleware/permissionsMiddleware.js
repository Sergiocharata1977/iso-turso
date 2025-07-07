import jwt from 'jsonwebtoken';
import { tursoClient } from '../lib/tursoClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_secreto';

// Middleware de autenticación básica
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Obtener información completa del usuario y organización
    const userResult = await tursoClient.execute({
      sql: `SELECT u.id, u.name, u.email, u.role, u.organization_id, 
             o.name as organization_name, o.plan, o.max_users
             FROM usuarios u 
             LEFT JOIN organizations o ON u.organization_id = o.id 
             WHERE u.id = ?`,
      args: [decoded.id]
    });

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];
    req.user = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      organization_id: Number(user.organization_id),
      organization_plan: user.plan || 'basic',
      organization_name: user.organization_name || 'Sin organización',
      max_users: Number(user.max_users) || 10
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

/**
 * Middleware simplificado para verificar que el usuario está autenticado
 * Por ahora no hay restricciones de plan o rol
 */
export const checkPermissions = (requiredFeature = null, requiredAction = 'read') => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      console.log('🔐 Usuario autenticado:', { 
        user: user.email, 
        role: user.role, 
        organization_id: user.organization_id
      });

      // Super admin tiene acceso total
      if (user.role === 'super_admin') {
        console.log('👑 Super admin - acceso total permitido');
        return next();
      }

      // Por ahora, todos los usuarios autenticados pueden acceder a todos los módulos
      // Solo verificamos que tengan una organización válida
      if (!user.organization_id) {
        return res.status(403).json({ message: 'Usuario no asignado a una organización' });
      }

      console.log('✅ Acceso permitido para usuario de organización:', user.organization_id);
      
      // Agregar información básica al request
      req.permissions = {
        organizationId: user.organization_id,
        userRole: user.role
      };

      next();
    } catch (error) {
      console.error('💥 Error en middleware de permisos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};

/**
 * Middleware simplificado para verificar límites de usuarios
 * Por ahora no hay límites activos
 */
export const checkUserLimits = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Super admin no tiene límites
    if (user.role === 'super_admin') {
      return next();
    }

    // Por ahora no aplicamos límites, solo log
    console.log('ℹ️ Verificación de límites (sin restricciones activas):', {
      organization_id: user.organization_id,
      user_role: user.role
    });

    next();
  } catch (error) {
    console.error('💥 Error en verificación de límites:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Middleware simplificado para auto-detectar permisos
 * Por ahora solo verifica autenticación
 */
export const autoCheckPermissions = (req, res, next) => {
  // Por ahora solo verificamos que el usuario esté autenticado
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }
  
  console.log('🔐 Auto-verificación de permisos:', {
    path: req.path,
    method: req.method,
    user: req.user.email,
    organization_id: req.user.organization_id
  });
  
  next();
};

export default {
  authenticate,
  checkPermissions,
  checkUserLimits,
  autoCheckPermissions
};
