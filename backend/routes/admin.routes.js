import express from 'express';
import { 
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getOrganizationUsers,
  createOrganizationUser,
  updateOrganizationUser,
  deleteOrganizationUser,
  getOrganizationFeatures,
  updateOrganizationFeatures
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware para verificar si es super admin
const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de Super Administrador'
    });
  }
  next();
};

// Middleware para verificar si es admin o super admin
const requireAdmin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de Administrador o Super Administrador'
    });
  }
  next();
};

// NOTA: No necesitamos authMiddleware aquí porque ya se aplica en index.js
// router.use(authMiddleware);

// ===== RUTAS SUPER ADMIN (Nivel 4) =====

// Gestión de Organizaciones (Solo Super Admin)
router.get('/organizations', requireSuperAdmin, getAllOrganizations);
router.get('/organizations/:id', requireSuperAdmin, getOrganizationById);
router.post('/organizations', requireSuperAdmin, createOrganization);
router.put('/organizations/:id', requireSuperAdmin, updateOrganization);

// Gestión Global de Usuarios (Solo Super Admin)
router.get('/users', requireSuperAdmin, getAllUsers);
router.post('/users', requireSuperAdmin, createUser);
router.put('/users/:id', requireSuperAdmin, updateUser);
router.delete('/users/:id', requireSuperAdmin, deleteUser);

// ===== RUTAS ADMIN DE ORGANIZACIÓN (Nivel 3) =====

// Gestión de Usuarios de la Organización (Admin de la organización)
router.get('/organization/:organizationId/users', requireAdmin, getOrganizationUsers);
router.post('/organization/:organizationId/users', requireAdmin, createOrganizationUser);
router.put('/organization/:organizationId/users/:userId', requireAdmin, updateOrganizationUser);
router.delete('/organization/:organizationId/users/:userId', requireAdmin, deleteOrganizationUser);

// Gestión de Features de la Organización
router.get('/organization/:organizationId/features', requireAdmin, getOrganizationFeatures);
router.put('/organization/:organizationId/features', requireAdmin, updateOrganizationFeatures);

export default router; 