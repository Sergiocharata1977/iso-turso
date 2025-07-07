import { getAuditLogs } from '../middleware/auditMiddleware.js';
import { tursoClient } from '../lib/tursoClient.js';

// Obtener logs de auditoría de la organización
export const getOrganizationAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, resourceType, userId, dateFrom, dateTo } = req.query;
    const offset = (page - 1) * limit;
    
    const filters = {};
    if (action) filters.action = action;
    if (resourceType) filters.resourceType = resourceType;
    if (userId) filters.userId = userId;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    
    const logs = await getAuditLogs(req.user.organization_id, parseInt(limit), offset, filters);
    
    // Obtener el total de registros para paginación
    let countSql = `SELECT COUNT(*) as total FROM audit_logs WHERE organization_id = ?`;
    const countArgs = [req.user.organization_id];
    
    if (filters.action) {
      countSql += ` AND action = ?`;
      countArgs.push(filters.action);
    }
    
    if (filters.resourceType) {
      countSql += ` AND resource_type = ?`;
      countArgs.push(filters.resourceType);
    }
    
    if (filters.userId) {
      countSql += ` AND user_id = ?`;
      countArgs.push(filters.userId);
    }
    
    if (filters.dateFrom) {
      countSql += ` AND timestamp >= ?`;
      countArgs.push(filters.dateFrom);
    }
    
    if (filters.dateTo) {
      countSql += ` AND timestamp <= ?`;
      countArgs.push(filters.dateTo);
    }
    
    const countResult = await tursoClient.execute({ sql: countSql, args: countArgs });
    const total = countResult.rows[0].total;
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener logs de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de auditoría
export const getAuditStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const organizationId = req.user.organization_id;
    
    let dateFilter = '';
    const args = [organizationId];
    
    if (dateFrom && dateTo) {
      dateFilter = ' AND timestamp BETWEEN ? AND ?';
      args.push(dateFrom, dateTo);
    } else if (dateFrom) {
      dateFilter = ' AND timestamp >= ?';
      args.push(dateFrom);
    } else if (dateTo) {
      dateFilter = ' AND timestamp <= ?';
      args.push(dateTo);
    }
    
    // Estadísticas por acción
    const actionStats = await tursoClient.execute({
      sql: `SELECT action, COUNT(*) as count FROM audit_logs WHERE organization_id = ?${dateFilter} GROUP BY action ORDER BY count DESC`,
      args
    });
    
    // Estadísticas por tipo de recurso
    const resourceStats = await tursoClient.execute({
      sql: `SELECT resource_type, COUNT(*) as count FROM audit_logs WHERE organization_id = ?${dateFilter} GROUP BY resource_type ORDER BY count DESC`,
      args
    });
    
    // Estadísticas por usuario
    const userStats = await tursoClient.execute({
      sql: `SELECT al.user_id, u.name, u.email, COUNT(*) as count 
            FROM audit_logs al 
            LEFT JOIN usuarios u ON al.user_id = u.id 
            WHERE al.organization_id = ?${dateFilter} 
            GROUP BY al.user_id, u.name, u.email 
            ORDER BY count DESC 
            LIMIT 10`,
      args
    });
    
    // Actividad por día (últimos 30 días)
    const dailyActivity = await tursoClient.execute({
      sql: `SELECT DATE(timestamp) as date, COUNT(*) as count 
            FROM audit_logs 
            WHERE organization_id = ? AND timestamp >= date('now', '-30 days')
            GROUP BY DATE(timestamp) 
            ORDER BY date DESC`,
      args: [organizationId]
    });
    
    res.json({
      actionStats: actionStats.rows,
      resourceStats: resourceStats.rows,
      userStats: userStats.rows,
      dailyActivity: dailyActivity.rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Exportar logs de auditoría (Solo para admins)
export const exportAuditLogs = async (req, res) => {
  try {
    const { format = 'csv', dateFrom, dateTo } = req.query;
    const organizationId = req.user.organization_id;
    
    let dateFilter = '';
    const args = [organizationId];
    
    if (dateFrom && dateTo) {
      dateFilter = ' AND timestamp BETWEEN ? AND ?';
      args.push(dateFrom, dateTo);
    }
    
    const logs = await tursoClient.execute({
      sql: `SELECT al.*, u.name as user_name, u.email as user_email 
            FROM audit_logs al
            LEFT JOIN usuarios u ON al.user_id = u.id
            WHERE al.organization_id = ?${dateFilter}
            ORDER BY al.timestamp DESC`,
      args
    });
    
    if (format === 'csv') {
      // Generar CSV
      const csvHeaders = 'Timestamp,User,Email,Action,Resource Type,Resource ID,IP Address,Details\n';
      const csvData = logs.rows.map(log => {
        const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
        return `"${log.timestamp}","${log.user_name || ''}","${log.user_email || ''}","${log.action}","${log.resource_type}","${log.resource_id || ''}","${log.ip_address || ''}","${details}"`;
      }).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvHeaders + csvData);
    } else {
      // Formato JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.json"`);
      res.json(logs.rows);
    }
  } catch (error) {
    console.error('Error al exportar logs de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 