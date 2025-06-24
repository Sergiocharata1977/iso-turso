// Script para recrear la tabla de normas con estructura simplificada
import { tursoClient } from './lib/tursoClient.js';
import crypto from 'crypto';

async function recreateNormasTable() {
  try {
    console.log(' Iniciando recreación de la tabla normas...');
    
    // Paso 1: Desactivar claves foráneas
    console.log(' Paso 1: Desactivando claves foráneas...');
    await tursoClient.execute('PRAGMA foreign_keys = OFF;');
    console.log(' Claves foráneas desactivadas.');
    
    // Paso 2: Eliminar tabla existente
    console.log(' Paso 2: Eliminando tabla normas existente...');
    await tursoClient.execute('DROP TABLE IF EXISTS normas');
    console.log(' Tabla normas eliminada.');
    
    // Paso 3: Crear nueva tabla simplificada
    console.log(' Paso 3: Creando nueva tabla normas simplificada...');
    await tursoClient.execute({
      sql: `
        CREATE TABLE normas (
          id TEXT PRIMARY KEY,
          codigo TEXT NOT NULL UNIQUE,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          observaciones TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        )
      `
    });
    console.log(' Nueva tabla normas creada con estructura simplificada.');
    
    // Paso 4: Reactivar claves foráneas
    console.log(' Paso 4: Reactivando claves foráneas...');
    await tursoClient.execute('PRAGMA foreign_keys = ON;');
    console.log(' Claves foráneas reactivadas.');
    
    // Paso 5: Insertar algunos datos de prueba
    console.log(' Paso 5: Insertando datos de prueba...');
    const testData = [
      {
        id: crypto.randomUUID(),
        codigo: '9.1',
        titulo: 'Seguimiento, medición, análisis y evaluación',
        descripcion: 'La organización debe determinar qué necesita seguimiento y medición.',
        observaciones: 'Establecer indicadores de desempeño y métodos de seguimiento'
      },
      {
        id: crypto.randomUUID(),
        codigo: '9.2',
        titulo: 'Auditoría interna',
        descripcion: 'La organización debe llevar a cabo auditorías internas a intervalos planificados.',
        observaciones: 'Programar auditorías internas anuales con auditores competentes'
      },
      {
        id: crypto.randomUUID(),
        codigo: '9.3',
        titulo: 'Revisión por la dirección',
        descripcion: 'La alta dirección debe revisar el sistema de gestión de la calidad a intervalos planificados.',
        observaciones: 'Realizar revisiones gerenciales trimestrales con documentación de resultados'
      }
    ];
    
    for (const norma of testData) {
      await tursoClient.execute({
        sql: `INSERT INTO normas (id, codigo, titulo, descripcion, observaciones) 
              VALUES (?, ?, ?, ?, ?)`,
        args: [norma.id, norma.codigo, norma.titulo, norma.descripcion, norma.observaciones]
      });
    }
    console.log(' Datos de prueba insertados correctamente.');
    
    // Verificar la nueva estructura
    console.log(' Verificando nueva estructura...');
    const result = await tursoClient.execute('SELECT * FROM normas');
    console.log(` Total de registros en la nueva tabla: ${result.rows.length}`);
    
    console.log(' ¡Tabla normas recreada exitosamente!');
    console.log(' Nueva estructura:');
    console.log('   - id (TEXT PRIMARY KEY)');
    console.log('   - codigo (TEXT NOT NULL UNIQUE)');
    console.log('   - titulo (TEXT NOT NULL)');
    console.log('   - descripcion (TEXT)');
    console.log('   - observaciones (TEXT)');
    console.log('   - created_at (TEXT DEFAULT now)');
    console.log('   - updated_at (TEXT DEFAULT now)');
    
  } catch (error) {
    console.error(' Error al recrear la tabla normas:', error);
    
    // Intentar reactivar FK en caso de error
    try {
      await tursoClient.execute('PRAGMA foreign_keys = ON;');
      console.log(' Claves foráneas reactivadas tras error.');
    } catch (fkError) {
      console.error(' No se pudieron reactivar las claves foráneas:', fkError);
    }
    
    throw error;
  } finally {
    console.log(' Cerrando conexión...');
    tursoClient.close();
  }
}

// Ejecutar el script
recreateNormasTable();
