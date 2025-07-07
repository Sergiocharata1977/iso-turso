import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { tursoClient } from '../lib/tursoClient.js';
import db from '../db.js';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_secreto';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'tu_refresh_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Registrar una nueva organización y su primer usuario (admin)
export const register = async (req, res) => {
  const { organizationName, userName, userEmail, userPassword } = req.body;

  if (!organizationName || !userName || !userEmail || !userPassword) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    // 1. Verificar si la organización ya existe
    let orgResult = await tursoClient.execute({ 
      sql: 'SELECT id FROM organizations WHERE name = ?', 
      args: [organizationName] 
    });

    if (orgResult.rows.length > 0) {
        return res.status(409).json({ message: 'Una organización con ese nombre ya existe.' });
    }
    
    // 2. Verificar si el email del usuario ya existe
    const userResult = await tursoClient.execute({ 
      sql: 'SELECT id FROM usuarios WHERE email = ?', 
      args: [userEmail] 
    });
    if (userResult.rows.length > 0) {
      return res.status(409).json({ message: 'Un usuario con ese email ya existe.' });
    }

    // 3. Crear la organización
    const orgInsertResult = await tursoClient.execute({
        sql: 'INSERT INTO organizations (name, created_at) VALUES (?, ?)',
        args: [organizationName, new Date().toISOString()]
    });
    const organizationId = orgInsertResult.lastInsertRowid;

    // 4. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // 5. Crear el usuario como 'admin' de la nueva organización
    const userInsertResult = await tursoClient.execute({
      sql: 'INSERT INTO usuarios (name, email, password_hash, role, organization_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: [userName, userEmail, hashedPassword, 'admin', organizationId, new Date().toISOString()]
    });
    const userId = userInsertResult.lastInsertRowid;

    // 6. Generar tokens
    const user = { 
      id: Number(userId), 
      name: userName, 
      email: userEmail, 
      role: 'admin', 
      organization_id: Number(organizationId) 
    };
    const { accessToken, refreshToken } = generateTokens(user);

    // 7. Guardar refresh token
    await saveRefreshToken(userId, refreshToken);

    res.status(201).json({ 
      message: 'Organización y usuario administrador registrados con éxito.',
      accessToken,
      refreshToken,
      user: {
        id: Number(userId),
        name: userName,
        email: userEmail,
        role: 'admin',
        organization_id: Number(organizationId)
      }
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  console.log('🔐 Intento de login recibido:', { email: req.body.email, hasPassword: !!req.body.password });
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Login fallido: campos faltantes');
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    console.log('🔍 Buscando usuario en BD:', email);
    const result = await tursoClient.execute({
      sql: `SELECT u.id, u.name, u.email, u.password_hash, u.role, u.organization_id, 
             o.name as organization_name, o.plan, o.max_users
             FROM usuarios u 
             LEFT JOIN organizations o ON u.organization_id = o.id 
             WHERE u.email = ?`,
      args: [email]
    });

    console.log('📊 Resultado de búsqueda:', { found: result.rows.length > 0 });

    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Usuario no encontrado
    }

    const userFromDb = result.rows[0];
    console.log('👤 Usuario encontrado:', { 
      id: userFromDb.id, 
      name: userFromDb.name, 
      email: userFromDb.email, 
      role: userFromDb.role,
      organization_plan: userFromDb.plan 
    });

    console.log('🔒 Verificando contraseña...');
    const isMatch = await bcrypt.compare(password, userFromDb.password_hash);
    console.log('🔒 Resultado verificación:', { isMatch });

    if (!isMatch) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
    }

    console.log('✅ Contraseña correcta, generando tokens...');
    
    // Convertir BigInts a Number antes de generar tokens
    const user = {
      ...userFromDb,
      id: Number(userFromDb.id),
      organization_id: Number(userFromDb.organization_id),
      organization_plan: userFromDb.plan || 'basic',
      organization_name: userFromDb.organization_name || 'Sin organización',
      max_users: Number(userFromDb.max_users) || 10
    };

    console.log('🎫 Usuario para tokens:', user);

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user);
    console.log('🎫 Tokens generados exitosamente');

    // Guardar refresh token
    console.log('💾 Guardando refresh token...');
    await saveRefreshToken(user.id, refreshToken);
    console.log('💾 Refresh token guardado');

    console.log('🎉 Login exitoso para:', email);
    res.json({
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
        organization_plan: user.organization_plan,
        organization_name: user.organization_name,
        max_users: user.max_users
      }
    });

  } catch (error) {
    console.error('💥 Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      organization_id: user.organization_id 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      tokenId: randomUUID() 
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Helper function to save refresh token to database
const saveRefreshToken = async (userId, refreshToken) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
  
  await tursoClient.execute({
    sql: `INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
    args: [randomUUID(), userId, refreshToken, expiresAt.toISOString()]
  });
};

// Helper function to revoke refresh token
const revokeRefreshToken = async (token) => {
  await tursoClient.execute({
    sql: `DELETE FROM refresh_tokens WHERE token = ?`,
    args: [token]
  });
};

// Helper function to validate refresh token
const validateRefreshToken = async (token) => {
  const result = await tursoClient.execute({
    sql: `SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime('now')`,
    args: [token]
  });
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token requerido' });
    }

    // Validar refresh token en la base de datos
    const tokenRecord = await validateRefreshToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }

    // Verificar JWT
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      // Revocar token inválido
      await revokeRefreshToken(refreshToken);
      return res.status(401).json({ message: 'Refresh token inválido' });
    }

    // Obtener usuario actualizado
    const userResult = await tursoClient.execute({
      sql: 'SELECT * FROM usuarios WHERE id = ?',
      args: [decoded.id]
    });

    if (userResult.rows.length === 0) {
      await revokeRefreshToken(refreshToken);
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Revocar el refresh token anterior
    await revokeRefreshToken(refreshToken);

    // Guardar el nuevo refresh token
    await saveRefreshToken(user.id, newRefreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id
      }
    });
  } catch (error) {
    console.error('Error en refresh token:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revocar refresh token
      await revokeRefreshToken(refreshToken);
    }

    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await tursoClient.execute({
      sql: 'SELECT id, name, email, role, organization_id, created_at FROM usuarios WHERE id = ?',
      args: [userId]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
