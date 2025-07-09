import { tursoClient } from '../lib/tursoClient.js';

async function fixPuestosTable() {
  try {
    console.log('🔧 Corrigiendo tabla puestos...');

    // 1. Crear tabla temporal con la estructura correcta
    await tursoClient.execute({
      sql: `CREATE TABLE puestos_temp (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion_responsabilidades TEXT,
        requisitos_experiencia TEXT,
        requisitos_formacion TEXT,
        departamento_id TEXT,
        reporta_a_id TEXT,
        organization_id TEXT NOT NULL,
        created_at TEXT,
        updated_at TEXT
      )`
    });

    console.log('✅ Tabla temporal creada');

    // 2. Copiar datos existentes
    await tursoClient.execute({
      sql: `INSERT INTO puestos_temp (
        id, nombre, descripcion_responsabilidades,
        requisitos_experiencia, requisitos_formacion,
        departamento_id, reporta_a_id, organization_id,
        created_at, updated_at
      )
      SELECT 
        id, nombre, descripcion_responsabilidades,
        requisitos_experiencia, requisitos_formacion,
        departamento_id, reporta_a_id, CAST(organization_id AS TEXT),
        created_at, updated_at
      FROM puestos`
    });

    console.log('✅ Datos copiados a tabla temporal');

    // 3. Eliminar tabla original
    await tursoClient.execute({
      sql: 'DROP TABLE puestos'
    });

    console.log('✅ Tabla original eliminada');

    // 4. Renombrar tabla temporal
    await tursoClient.execute({
      sql: 'ALTER TABLE puestos_temp RENAME TO puestos'
    });

    console.log('✅ Tabla temporal renombrada');

    console.log('✅ Estructura de tabla puestos corregida exitosamente');

  } catch (error) {
    console.error('❌ Error al corregir tabla puestos:', error);
    throw error;
  }
}

fixPuestosTable(); 