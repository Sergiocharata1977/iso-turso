import { Router } from 'express';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/auth.controller.fix.js';
import authenticateToken from '../middleware/authenticateToken.js'; // Asumimos que este middleware se creará en el siguiente paso

const router = Router();

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Iniciar sesión de usuario
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/profile
// @desc    Obtener perfil del usuario autenticado
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @route   PUT /api/auth/profile
// @desc    Actualizar perfil del usuario autenticado
// @access  Private
router.put('/profile', authenticateToken, updateProfile);

// @route   POST /api/auth/change-password
// @desc    Cambiar contraseña del usuario autenticado
// @access  Private
router.post('/change-password', authenticateToken, changePassword);

export default router;
