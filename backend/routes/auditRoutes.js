import express from 'express';
import { getOrganizationAuditLogs, getAuditStats, exportAuditLogs } from '../controllers/auditController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { ensureTenant, requireRole } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// Aplicar autenticación y middleware de tenant a todas las rutas
router.use(authenticateToken);
router.use(ensureTenant);

// @route   GET /api/audit/logs
// @desc    Obtener logs de auditoría de la organización
// @access  Private (Admin/Manager)
router.get('/logs', requireRole('manager'), getOrganizationAuditLogs);

// @route   GET /api/audit/stats
// @desc    Obtener estadísticas de auditoría
// @access  Private (Admin/Manager)
router.get('/stats', requireRole('manager'), getAuditStats);

// @route   GET /api/audit/export
// @desc    Exportar logs de auditoría
// @access  Private (Admin only)
router.get('/export', requireRole('admin'), exportAuditLogs);

export default router; 