// Controlador de autenticación
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery, findBy, update } from '../lib/tursoClient.js';

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'isoflow3_secret_key';

/**
 * Registra un nuevo usuario en el sistema
 */
export const register = async (req, res) => {
  try {
    const { username, email, nombre, apellido, password, tenant_id } = req.body; // Se espera tenant_id del cliente

    // Validación de campos requeridos
    if (!username || !email || !password || !nombre || !apellido || !tenant_id) { // tenant_id es mandatorio para el registro
      return res.status(400).json({ error: 'Todos los campos, incluyendo tenant_id, son requeridos.' });
    }

    // Verificar si el usuario ya existe (la unicidad de email/username es global por ahora)
    // Se podría refinar para que sea único por tenant si la lógica de negocio lo requiere.
    const usuariosExistentes = await findBy('usuarios', { username });
    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
    }

    // Verificar si el email ya existe
    const emailsExistentes = await findBy('usuarios', { email });
    if (emailsExistentes.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    // Asumiendo que la tabla 'usuarios' ahora tiene una columna 'tenant_id' y 'password_hash'
    const result = await executeQuery(`
      INSERT INTO usuarios (username, email, nombre, apellido, password_hash, rol, activo, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [username, email, nombre, apellido, hashedPassword, 'usuario', true, tenant_id]);

    const userId = result.lastInsertRowid; // O la forma apropiada de obtener el ID del usuario insertado

    // Crear token JWT: Incluye el ID del usuario y el tenant_id en el payload del token.
    // Esto permitirá al middleware de autenticación y a los servicios posteriores identificar al usuario y su tenant.
    const token = jwt.sign({ id: userId, tenant_id: tenant_id }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Obtener usuario creado sin la contraseña
    // La consulta debería devolver todos los campos relevantes del usuario, incluyendo tenant_id si se va a mostrar.
    const nuevoUsuario = await executeQuery(
      'SELECT id, username, email, nombre, apellido, rol, activo, fecha_creacion, tenant_id FROM usuarios WHERE id = ?', // Añadido tenant_id a la consulta
      [userId] // Usar userId en lugar de result.lastInsertRowid directamente para claridad
    );

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente.', 
      usuario: nuevoUsuario.rows[0], 
      token 
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
};

/**
 * Inicia sesión de un usuario
 */
export const login = async (req, res) => {
  try {
    // Extraer datos de la solicitud
    const { username, email, password } = req.body;

    // Validar campos obligatorios
    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
    }

    // Buscar usuario por username
    // Buscar por email o username (compatibilidad)
    const searchKey = email || username;
    const usuarios = await findBy('usuarios', { email: searchKey });
    
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const usuario = usuarios[0];

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({ error: 'La cuenta está desactivada.' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Actualizar fecha de último acceso
    await update('usuarios', usuario.id, { 
      ultimo_acceso: new Date().toISOString() 
    });

    // Crear token JWT: Incluye el ID del usuario y el tenant_id (obtenido del registro del usuario en la BD)
    // en el payload del token. Esto es crucial para la operativa multi-tenant.
    const token = jwt.sign({ id: usuario.id, tenant_id: usuario.tenant_id }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Eliminar la contraseña del objeto antes de enviarlo
    // y asegurarse de que el objeto usuarioSinPassword contenga todos los campos necesarios, incluyendo tenant_id
    const { password_hash, ...usuarioSinPassword } = usuario;

    // Responder con el usuario (sin contraseña) y token
    res.json({
      usuario: usuarioSinPassword, // usuarioSinPassword ya incluye tenant_id si estaba en el objeto 'usuario' original
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de inicio de sesión.' });
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 */
export const getProfile = async (req, res) => {
  try {
    // El middleware de autenticación ya ha verificado y añadido el usuario al request
    const userId = req.user.id;
    
    // Obtener datos del usuario sin la contraseña
    const result = await executeQuery(
      'SELECT id, username, email, nombre, apellido, rol, activo, ultimo_acceso, fecha_creacion FROM usuarios WHERE id = ?',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener información del perfil.' });
  }
};

/**
 * Actualiza el perfil del usuario
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido, email } = req.body;
    
    // Validaciones
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y email son campos requeridos.' });
    }

    // Verificar si el email ya existe para otro usuario
    if (email) {
      const emailsExistentes = await executeQuery(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (emailsExistentes.rows.length > 0) {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso por otro usuario.' });
      }
    }

    // Actualizar datos
    await update('usuarios', userId, {
      nombre,
      apellido,
      email,
      fecha_actualizacion: new Date().toISOString()
    });

    // Obtener usuario actualizado
    const result = await executeQuery(
      'SELECT id, username, email, nombre, apellido, rol, activo, ultimo_acceso, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Perfil actualizado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar información del perfil.' });
  }
};

/**
 * Cambia la contraseña del usuario
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'La contraseña actual y la nueva son requeridas.' });
    }

    // Verificar la contraseña actual
    const result = await executeQuery('SELECT password FROM usuarios WHERE id = ?', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await update('usuarios', userId, {
      password: hashedPassword,
      fecha_actualizacion: new Date().toISOString()
    });

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al actualizar la contraseña.' });
  }
};
