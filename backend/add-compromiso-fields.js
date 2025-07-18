import { tursoClient } from './lib/tursoClient.js';

async function addCompromisoFields() {
  try {
    console.log('🔧 Agregando campos de compromiso a la tabla direccion_configuracion...');
    
    // Agregar los nuevos campos de compromiso
    const alterTableSQL = `
      ALTER TABLE direccion_configuracion ADD COLUMN compromiso_titulo TEXT DEFAULT 'Compromiso con la Excelencia en la Agricultura';
    `;
    
    await tursoClient.execute(alterTableSQL);
    console.log('✅ Campo compromiso_titulo agregado');
    
    const alterTableSQL2 = `
      ALTER TABLE direccion_configuracion ADD COLUMN compromiso_descripcion TEXT DEFAULT '"Los Señores del Agro" se compromete a ser el proveedor líder de fertilizantes, semillas y servicios logísticos de alta calidad para el sector agrícola.';
    `;
    
    await tursoClient.execute(alterTableSQL2);
    console.log('✅ Campo compromiso_descripcion agregado');
    
    const alterTableSQL3 = `
      ALTER TABLE direccion_configuracion ADD COLUMN compromiso_satisfaccion TEXT DEFAULT 'Entender y exceder las expectativas de nuestros clientes, proporcionando productos y servicios que cumplan con los requisitos establecidos y mejoren su productividad y rentabilidad.';
    `;
    
    await tursoClient.execute(alterTableSQL3);
    console.log('✅ Campo compromiso_satisfaccion agregado');
    
    const alterTableSQL4 = `
      ALTER TABLE direccion_configuracion ADD COLUMN compromiso_calidad TEXT DEFAULT 'Asegurar la calidad de nuestros agroquímicos, semillas y servicios logísticos, cumpliendo con las normativas vigentes y los estándares más altos de la industria.';
    `;
    
    await tursoClient.execute(alterTableSQL4);
    console.log('✅ Campo compromiso_calidad agregado');
    
    const alterTableSQL5 = `
      ALTER TABLE direccion_configuracion ADD COLUMN compromiso_mejora TEXT DEFAULT 'Promover una cultura de mejora continua en todos los niveles de la organización, identificando y aplicando oportunidades para optimizar nuestros procesos y aumentar la eficiencia.';
    `;
    
    await tursoClient.execute(alterTableSQL5);
    console.log('✅ Campo compromiso_mejora agregado');
    
    const alterTableSQL6 = `
      ALTER TABLE direccion_configuracion ADD COLUMN compromiso_personal TEXT DEFAULT 'Desarrollar y mantener un equipo de colaboradores altamente capacitado y motivado, que cuente con los conocimientos y habilidades necesarias para cumplir con los objetivos de calidad.';
    `;
    
    await tursoClient.execute(alterTableSQL6);
    console.log('✅ Campo compromiso_personal agregado');
    
    // Verificar que los campos se agregaron correctamente
    const verifyResult = await tursoClient.execute('SELECT * FROM direccion_configuracion WHERE id = 1');
    console.log('🔍 Verificación final:', verifyResult.rows[0]);
    
    console.log('🎉 Todos los campos de compromiso agregados exitosamente');
    
  } catch (error) {
    console.error('❌ Error al agregar campos:', error);
    // Si el error es que la columna ya existe, no es un problema
    if (error.message.includes('duplicate column name')) {
      console.log('ℹ️  Los campos ya existen, no hay problema');
    } else {
      throw error;
    }
  }
}

// Ejecutar el script
addCompromisoFields()
  .then(() => {
    console.log('🎉 Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en el proceso:', error);
    process.exit(1);
  }); 