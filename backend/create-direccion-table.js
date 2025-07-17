import { tursoClient } from './lib/tursoClient.js';

async function createDireccionTable() {
  try {
    console.log('🏗️  Creando tabla direccion_configuracion...');
    
    // Crear tabla direccion_configuracion
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS direccion_configuracion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        politica_calidad TEXT,
        alcance TEXT,
        estrategia TEXT,
        organigrama_url TEXT,
        mapa_procesos_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await tursoClient.execute(createTableSQL);
    console.log('✅ Tabla direccion_configuracion creada exitosamente');
    
    // Verificar si ya existe un registro
    const existingResult = await tursoClient.execute('SELECT COUNT(*) as count FROM direccion_configuracion');
    const count = existingResult.rows[0].count;
    
    if (count === 0) {
      console.log('📝 Insertando registro inicial...');
      
      // Insertar registro inicial
      const insertSQL = `
        INSERT INTO direccion_configuracion (
          id, 
          politica_calidad, 
          alcance, 
          estrategia,
          organigrama_url,
          mapa_procesos_url
        ) VALUES (
          1,
          'Nuestra política de calidad se compromete a entregar productos y servicios que excedan las expectativas de nuestros clientes, cumpliendo con los requisitos establecidos y mejorando continuamente nuestro Sistema de Gestión de Calidad basado en la norma ISO 9001.',
          'El alcance del Sistema de Gestión de Calidad abarca todos los procesos relacionados con la planificación, desarrollo, implementación y mejora continua de nuestros productos y servicios.',
          'Nuestra estrategia organizacional se enfoca en la excelencia operativa, la innovación constante y la satisfacción del cliente como pilares fundamentales para el crecimiento sostenible.',
          NULL,
          NULL
        );
      `;
      
      await tursoClient.execute(insertSQL);
      console.log('✅ Registro inicial insertado exitosamente');
    } else {
      console.log('ℹ️  La tabla ya contiene datos, no se inserta registro inicial');
    }
    
    // Verificar que todo esté correcto
    const verifyResult = await tursoClient.execute('SELECT * FROM direccion_configuracion WHERE id = 1');
    console.log('🔍 Verificación final:', verifyResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Error al crear la tabla:', error);
    throw error;
  }
}

// Ejecutar el script
createDireccionTable()
  .then(() => {
    console.log('🎉 Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en el proceso:', error);
    process.exit(1);
  }); 