import jwt from 'jsonwebtoken';
import { tursoClient } from '../lib/tursoClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_secreto';

// Middleware de autenticación para sistema SAAS multi-tenant
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Log para depuración
    console.log('Decoded JWT:', decoded);
    // Aceptar tanto 'id' como 'userId' en el token
    const userId = decoded.id || decoded.userId;
    if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
      return res.status(401).json({ message: 'Token sin ID de usuario válido.' });
    }
    
    // Obtener usuario actual de la base de datos
    const userResult = await tursoClient.execute({
      sql: `SELECT id, organization_id, name, email, role, is_active 
            FROM usuarios 
            WHERE id = ? AND is_active = 1`,
      args: [userId]
    });

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no válido o inactivo.' });
    }

    // Agregar usuario al request para uso en controladores
    req.user = userResult.rows[0];
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export default authMiddleware;
export { authMiddleware };
