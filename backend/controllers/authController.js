import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_secreto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Registrar una nueva organización y su primer usuario (admin)
export const register = async (req, res) => {
  const { organizationName, userName, userEmail, userPassword } = req.body;

  if (!organizationName || !userName || !userEmail || !userPassword) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    // Iniciar transacción
    await db.execute('BEGIN;');

    // 1. Verificar si la organización ya existe
    let orgResult = await db.execute({ sql: 'SELECT id FROM organizations WHERE name = ?', args: [organizationName] });
    let organizationId;

    if (orgResult.rows.length > 0) {
        return res.status(409).json({ message: 'Una organización con ese nombre ya existe.' });
    }
    
    // 2. Crear la organización si no existe
    const newOrgResult = await db.execute({
        sql: 'INSERT INTO organizations (name) VALUES (?)',
        args: [organizationName]
    });
    organizationId = newOrgResult.lastInsertRowid;

    // 3. Verificar si el email del usuario ya existe
    const userResult = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [userEmail] });
    if (userResult.rows.length > 0) {
      await db.execute('ROLLBACK;');
      return res.status(409).json({ message: 'Un usuario con ese email ya existe.' });
    }

    // 4. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(userPassword, salt);

    // 5. Crear el usuario como 'admin' de la nueva organización
    await db.execute({
      sql: 'INSERT INTO users (name, email, password_hash, role, organization_id) VALUES (?, ?, ?, ?, ?)',
      args: [userName, userEmail, password_hash, 'admin', organizationId]
    });

    await db.execute('COMMIT;');

    res.status(201).json({ message: 'Organización y usuario administrador registrados con éxito.' });

  } catch (error) {
    await db.execute('ROLLBACK;').catch(rbError => console.error('Error en rollback:', rbError));
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT id, name, email, password_hash, role, organization_id FROM users WHERE email = ?',
      args: [email]
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Usuario no encontrado
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
    }

    // Crear el token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ 
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
