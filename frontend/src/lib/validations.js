import { z } from 'zod';

// Esquema para login
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

// Esquema para registro de organización
export const registerSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'El nombre de la organización es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  userName: z
    .string()
    .min(1, 'Tu nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  userEmail: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  userPassword: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
});

// Esquema para crear/editar usuario
export const userSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal('')),
  role: z.enum(['employee', 'manager', 'admin'], {
    errorMap: () => ({ message: 'Selecciona un rol válido' })
  }),
  is_active: z.boolean().optional()
});

// Esquema para editar usuario (password opcional)
export const editUserSchema = userSchema.extend({
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal(''))
});

// Esquema para proceso
export const processSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre del proceso es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  responsable: z
    .string()
    .min(1, 'El responsable es requerido'),
  descripcion: z
    .string()
    .optional()
});

// Los tipos se pueden usar con JSDoc si es necesario
// export type LoginFormData = z.infer<typeof loginSchema>;
// export type RegisterFormData = z.infer<typeof registerSchema>;
// export type UserFormData = z.infer<typeof userSchema>;
// export type EditUserFormData = z.infer<typeof editUserSchema>;
// export type ProcessFormData = z.infer<typeof processSchema>;