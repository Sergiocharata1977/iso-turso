import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tursoClient as db } from '../lib/tursoClient.js';

// @desc    Registrar una nueva organización y su usuario admin
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { 
      organizationName, 
      adminName, 
      adminEmail, 
      adminPassword,
      organizationEmail = '',
      organizationPhone = '',
      plan = 'basic'
    } = req.body;

    // Validaciones básicas
    if (!organizationName || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Verificar si la organización ya existe
    const existingOrg = await db.execute({
      sql: 'SELECT id FROM organizations WHERE name = ?',
      args: [organizationName]
    });

    if (existingOrg.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe una organización con ese nombre' 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await db.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ?',
      args: [adminEmail]
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un usuario con ese email' 
      });
    }

    // Crear la organización
    const orgResult = await db.execute({
      sql: 'INSERT INTO organizations (name, email, phone, plan, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
      args: [organizationName, organizationEmail, organizationPhone, plan]
    });

    const organizationId = Number(orgResult.lastInsertRowid);

    // Crear features básicas para la organización
    const basicFeatures = [
      'users_management',
      'documents_management', 
      'processes_management',
      'audits_management',
      'reports_basic'
    ];
    
    for (const feature of basicFeatures) {
      await db.execute({
        sql: 'INSERT INTO organization_features (organization_id, feature_name, is_enabled, created_at) VALUES (?, ?, 1, datetime("now"))',
        args: [organizationId, feature]
      });
    }
    console.log(`✅ Created ${basicFeatures.length} basic features for organization`);

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Crear el usuario admin
    const userResult = await db.execute({
      sql: 'INSERT INTO usuarios (name, email, password_hash, role, organization_id, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
      args: [adminName, adminEmail, hashedPassword, 'admin', organizationId]
    });

    const userId = Number(userResult.lastInsertRowid);

    // Generar tokens
    const accessToken = jwt.sign(
      { userId, organizationId, role: 'admin' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId, organizationId },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: '7d' }
    );

    // Guardar refresh token
    await db.execute({
      sql: 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
      args: [userId, refreshToken]
    });

    res.status(201).json({
      success: true,
      message: 'Organización y usuario admin creados exitosamente',
      data: {
        user: {
          id: userId,
          name: adminName,
          email: adminEmail,
          role: 'admin'
        },
        organization: {
          id: organizationId,
          name: organizationName,
          email: organizationEmail,
          phone: organizationPhone,
          plan
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  console.log('\n--- 🚀 INICIANDO PROCESO DE LOGIN 🚀 ---');
  try {
    const { email, password } = req.body;
    console.log(`[1/6] 📥 Datos recibidos: Email=${email}`);

    if (!email || !password) {
      console.log('  [❌ ERROR] Email o contraseña no recibidos.');
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    console.log(`[2/6] 🤫 Verificando JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Encontrado' : '❌ NO ENCONTRADO'}`);
    
    console.log('[3/6] 🔍 Buscando usuario en la base de datos...');
    const userResult = await db.execute({
      sql: `SELECT * FROM usuarios WHERE email = ?`,
      args: [email]
    });

    if (userResult.rows.length === 0) {
      console.log('  [❌ ERROR] Usuario no encontrado en la base de datos.');
      return res.status(401).json({ 
        success: false, 
        message: 'El email ingresado no está registrado en el sistema' 
      });
    }

    const user = userResult.rows[0];
    console.log('  [✅ OK] Usuario encontrado:', { id: user.id, email: user.email, role: user.role, org_id: user.organization_id });
    console.log('  [INFO] Hash almacenado:', user.password_hash);

    console.log('[4/6] 🔐 Comparando contraseñas...');
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log(`  [INFO] Resultado de la comparación: ${isPasswordValid ? '✅ Válida' : '❌ Inválida'}`);

    if (!isPasswordValid) {
      console.log('  [❌ ERROR] La contraseña no coincide.');
      return res.status(401).json({ 
        success: false, 
        message: 'La contraseña ingresada es incorrecta' 
      });
    }

    console.log('[5/6] ✍️  Generando tokens JWT...');
    const accessToken = jwt.sign(
      { 
        userId: Number(user.id), 
        organizationId: Number(user.organization_id), 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: Number(user.id), organizationId: Number(user.organization_id) },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: '7d' }
    );
    console.log('  [✅ OK] Tokens generados.');

    console.log('[6/6] 💾 Guardando refresh token...');
    await db.execute({
      sql: 'DELETE FROM refresh_tokens WHERE user_id = ?',
      args: [user.id]
    });
    await db.execute({
      sql: 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
      args: [user.id, refreshToken]
    });
    console.log('  [✅ OK] Refresh token guardado.');

    console.log('📤 Enviando respuesta al cliente...');
    console.log('--- ✅ FIN PROCESO DE LOGIN ✅ ---\n');
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: Number(user.id),
          name: user.name,
          email: user.email,
          role: user.role
        },
        organization: {
          id: Number(user.organization_id)
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('❌ Error catastrófico en login:', error);
    console.log('--- ❌ FIN PROCESO DE LOGIN CON ERROR ❌ ---\n');
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

// @desc    Renovar access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refresh token es requerido' 
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
    );

    // Verificar que el token existe en la base de datos
    const tokenResult = await db.execute({
      sql: 'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime("now")',
      args: [refreshToken]
    });

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token inválido o expirado' 
      });
    }

    // Obtener información del usuario
    const userResult = await db.execute({
      sql: 'SELECT * FROM usuarios WHERE id = ?',
      args: [decoded.userId]
    });

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    const user = userResult.rows[0];

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { 
        userId: user.id, 
        organizationId: user.organization_id, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    console.error('Error en refresh token:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Refresh token inválido' 
    });
  }
};

// @desc    Cerrar sesión
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Eliminar refresh token de la base de datos
      await db.execute({
        sql: 'DELETE FROM refresh_tokens WHERE token = ?',
        args: [refreshToken]
      });
    }

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userResult = await db.execute({
      sql: `
        SELECT u.*, o.name as organization_name, o.plan as organization_plan 
        FROM usuarios u 
        JOIN organizations o ON u.organization_id = o.id 
        WHERE u.id = ?
      `,
      args: [userId]
    });

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    const user = userResult.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        organization: {
          id: user.organization_id,
          name: user.organization_name,
          type: user.organization_type
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}; 