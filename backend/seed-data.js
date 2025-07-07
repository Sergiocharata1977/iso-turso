import { tursoClient } from './lib/tursoClient.js';

async function seedData() {
  try {
    console.log('🌱 Agregando datos de prueba...');
    
    // Agregar procesos de prueba
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO procesos (nombre, descripcion, responsable, organization_id) VALUES (?, ?, ?, ?)',
      args: ['Gestión de Ventas', 'Proceso de ventas y atención al cliente', 'Juan Pérez', 20]
    });
    
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO procesos (nombre, descripcion, responsable, organization_id) VALUES (?, ?, ?, ?)',
      args: ['Control de Calidad', 'Proceso de control y aseguramiento de calidad', 'María García', 20]
    });
    
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO procesos (nombre, descripcion, responsable, organization_id) VALUES (?, ?, ?, ?)',
      args: ['Gestión de Compras', 'Proceso de adquisiciones y proveedores', 'Carlos López', 20]
    });
    
    // Agregar personal de prueba (usando las columnas que realmente existen)
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO personal (nombres, apellidos, email, telefono, organization_id) VALUES (?, ?, ?, ?, ?)',
      args: ['Juan', 'Pérez', 'juan.perez@empresa.com', '+54 11 1234-5678', 20]
    });
    
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO personal (nombres, apellidos, email, telefono, organization_id) VALUES (?, ?, ?, ?, ?)',
      args: ['María', 'García', 'maria.garcia@empresa.com', '+54 11 2345-6789', 20]
    });
    
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO personal (nombres, apellidos, email, telefono, organization_id) VALUES (?, ?, ?, ?, ?)',
      args: ['Carlos', 'López', 'carlos.lopez@empresa.com', '+54 11 3456-7890', 20]
    });
    
    await tursoClient.execute({
      sql: 'INSERT OR IGNORE INTO personal (nombres, apellidos, email, telefono, organization_id) VALUES (?, ?, ?, ?, ?)',
      args: ['Ana', 'Rodríguez', 'ana.rodriguez@empresa.com', '+54 11 4567-8901', 20]
    });
    
    // Agregar hallazgos de prueba (si la tabla existe)
    try {
      await tursoClient.execute({
        sql: 'INSERT OR IGNORE INTO hallazgos (numeroHallazgo, titulo, descripcion, estado, fecha_deteccion, organization_id) VALUES (?, ?, ?, ?, ?, ?)',
        args: ['H-001', 'Falta de documentación en proceso', 'Se detectó que el proceso de ventas no tiene documentación actualizada', 'deteccion', new Date().toISOString(), 20]
      });
      
      await tursoClient.execute({
        sql: 'INSERT OR IGNORE INTO hallazgos (numeroHallazgo, titulo, descripcion, estado, fecha_deteccion, organization_id) VALUES (?, ?, ?, ?, ?, ?)',
        args: ['H-002', 'Control de calidad insuficiente', 'Los controles de calidad en producción son insuficientes', 'tratamiento', new Date().toISOString(), 20]
      });
      
      console.log('✅ Hallazgos agregados');
    } catch (error) {
      console.log('⚠️ No se pudieron agregar hallazgos:', error.message);
    }
    
    // Agregar acciones de prueba (si la tabla existe)
    try {
      await tursoClient.execute({
        sql: 'INSERT OR IGNORE INTO acciones (numeroAccion, titulo, descripcion, estado, organization_id) VALUES (?, ?, ?, ?, ?)',
        args: ['A-001', 'Actualizar documentación de ventas', 'Revisar y actualizar toda la documentación del proceso de ventas', 'planificacion', 20]
      });
      
      await tursoClient.execute({
        sql: 'INSERT OR IGNORE INTO acciones (numeroAccion, titulo, descripcion, estado, organization_id) VALUES (?, ?, ?, ?, ?)',
        args: ['A-002', 'Implementar controles adicionales', 'Implementar controles de calidad adicionales en la línea de producción', 'ejecucion', 20]
      });
      
      console.log('✅ Acciones agregadas');
    } catch (error) {
      console.log('⚠️ No se pudieron agregar acciones:', error.message);
    }
    
    console.log('✅ Datos de prueba agregados correctamente');
    console.log('📊 Se agregaron:');
    console.log('   - 3 procesos');
    console.log('   - 4 miembros del personal');
    console.log('   - Hallazgos y acciones (si las tablas existen)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedData(); 