import 'dotenv/config'; // Asegura que las variables de entorno se carguen primero
import jwt from 'jsonwebtoken';
import db from '../db.js';

// SOLUCIÓN TEMPORAL: Bypass completo de autenticación para pruebas
const protect = async (req, res, next) => {
  console.log('⚠️ MODO DE PRUEBA: Autenticación desactivada temporalmente');
  
  try {
    // Asignar un usuario de prueba fijo
    const userResult = await db.execute({
      sql: 'SELECT id, organization_id, name, email, role FROM users LIMIT 1',
      args: [],
    });

    if (userResult.rows.length === 0) {
      return res.status(500).json({ message: 'No se encontraron usuarios en la base de datos' });
    }

    // Asignar el primer usuario como usuario autenticado
    req.user = userResult.rows[0];
    console.log('Usuario autenticado automáticamente:', req.user.email);
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export { protect };
