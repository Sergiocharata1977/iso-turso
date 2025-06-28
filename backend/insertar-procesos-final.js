import { tursoClient } from './lib/tursoClient.js';

async function insertarProcesosFinal() {
  try {
    console.log('🚀 Iniciando inserción de procesos...');
    
    // Insertar proceso 1
    try {
      await tursoClient.execute({
        sql: 'INSERT INTO procesos (id, nombre, codigo, version, responsable, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        args: [
          'proc-001',
          'Gestión de Calidad',
          'GC-001',
          '1.0',
          'Director de Calidad',
          'Proceso para asegurar la calidad de los productos y servicios'
        ]
      });
      console.log('✅ Proceso 1 insertado correctamente');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('⚠️ El proceso 1 ya existe, continuando...');
      } else {
        console.error('❌ Error al insertar proceso 1:', error.message);
      }
    }
    
    // Insertar proceso 2
    try {
      await tursoClient.execute({
        sql: 'INSERT INTO procesos (id, nombre, codigo, version, responsable, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        args: [
          'proc-002',
          'Desarrollo de Software',
          'DS-001',
          '1.0',
          'Líder de Desarrollo',
          'Proceso para el ciclo de vida del desarrollo de software'
        ]
      });
      console.log('✅ Proceso 2 insertado correctamente');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('⚠️ El proceso 2 ya existe, continuando...');
      } else {
        console.error('❌ Error al insertar proceso 2:', error.message);
      }
    }
    
    // Insertar proceso 3
    try {
      await tursoClient.execute({
        sql: 'INSERT INTO procesos (id, nombre, codigo, version, responsable, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        args: [
          'proc-003',
          'Atención al Cliente',
          'AC-001',
          '1.0',
          'Gerente de Servicio',
          'Proceso para gestionar la relación con los clientes y sus solicitudes'
        ]
      });
      console.log('✅ Proceso 3 insertado correctamente');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('⚠️ El proceso 3 ya existe, continuando...');
      } else {
        console.error('❌ Error al insertar proceso 3:', error.message);
      }
    }
    
    // Verificar resultados
    const count = await tursoClient.execute('SELECT COUNT(*) as count FROM procesos');
    console.log(`🔢 Total de procesos en la base de datos: ${count.rows[0].count}`);
    
    const allProcesos = await tursoClient.execute('SELECT id, nombre, codigo FROM procesos');
    console.log('📋 Procesos disponibles:');
    for (const proceso of allProcesos.rows) {
      console.log(`   - ${proceso.nombre} (${proceso.codigo})`);
    }
    
    console.log('🎉 ¡Operación completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

insertarProcesosFinal();
