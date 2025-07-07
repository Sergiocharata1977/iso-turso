import { z } from 'zod';

// Esquema para el formulario de login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Esquema para el formulario de registro
export const registerSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'El nombre de la organización es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  userName: z
    .string()
    .min(1, 'El nombre del usuario es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  userEmail: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  userPassword: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede exceder 50 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña')
}).refine((data) => data.userPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// Esquemas exportados para uso en componentes React
