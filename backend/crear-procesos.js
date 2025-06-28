import { tursoClient } from './lib/tursoClient.js';

async function crearProcesos() {
  try {
    console.log('🚀 Creando datos de procesos...');
    
    // Crear algunos procesos
    console.log('🔄 Creando procesos...');
    
    await tursoClient.execute({
      sql: 'INSERT INTO procesos (id, nombre, codigo, descripcion, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      args: [
        'proc-001',
        'Gestión de Calidad',
        'GC-01',
        'Proceso para asegurar la calidad de los productos y servicios.',
        new Date().toISOString()
      ]
    });
    console.log('✅ Proceso Gestión de Calidad creado');

    await tursoClient.execute({
      sql: 'INSERT INTO procesos (id, nombre, codigo, descripcion, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      args: [
        'proc-002',
        'Desarrollo de Software',
        'DS-01',
        'Proceso para el ciclo de vida del desarrollo de software.',
        new Date().toISOString()
      ]
    });
    console.log('✅ Proceso Desarrollo de Software creado');

    await tursoClient.execute({
      sql: 'INSERT INTO procesos (id, nombre, codigo, descripcion, fecha_creacion) VALUES (?, ?, ?, ?, ?)',
      args: [
        'proc-003',
        'Atención al Cliente',
        'AC-01',
        'Proceso para gestionar la relación con los clientes y sus solicitudes.',
        new Date().toISOString()
      ]
    });
    console.log('✅ Proceso Atención al Cliente creado');

    // Verificar resultados
    const procesos = await tursoClient.execute('SELECT COUNT(*) as count FROM procesos');
    console.log(`🔄 Procesos creados: ${procesos.rows[0].count}`);
    
    console.log('🎉 ¡Datos de procesos creados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error creando procesos:', error.message);
  }
}

crearProcesos();
