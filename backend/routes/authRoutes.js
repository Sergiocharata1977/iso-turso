import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Registrar una nueva organización y su usuario admin
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Iniciar sesión y obtener token
// @access  Public
router.post('/login', login);

export default router;
