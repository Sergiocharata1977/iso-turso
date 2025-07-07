import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function addOrganizationIdToTables() {
  try {
    console.log('🔄 AGREGANDO ORGANIZATION_ID A TABLAS PRINCIPALES...\n');
    
    // Lista de tablas que necesitan organization_id
    const tablesToUpdate = [
      'procesos',
      'hallazgos', 
      'acciones',
      'auditorias',
      'documentos',
      'objetivos',
      'indicadores',
      'comunicaciones',
      'encuestas',
      'eventos_calendario',
      'capacitaciones',
      'departamentos',
      'puestos',
      'personal',
      'evaluaciones_capacitaciones'
    ];

    // Crear organización por defecto si no existe
    console.log('📋 Creando organización por defecto...');
    const orgResult = await tursoClient.execute({
      sql: `INSERT OR IGNORE INTO organizations (id, name, email) VALUES (1, 'Organización Demo', 'demo@example.com')`
    });
    console.log('✅ Organización por defecto creada/verificada');

    // Procesar cada tabla
    for (const tableName of tablesToUpdate) {
      try {
        console.log(`\n🔧 Procesando tabla: ${tableName}`);
        
        // Verificar si la tabla existe
        const tableExists = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
          args: [tableName]
        });

        if (tableExists.rows.length === 0) {
          console.log(`⚠️  Tabla ${tableName} no existe, saltando...`);
          continue;
        }

        // Verificar si ya tiene organization_id
        const columnExists = await tursoClient.execute({
          sql: `PRAGMA table_info(${tableName})`
        });

        const hasOrgId = columnExists.rows.some(col => col.name === 'organization_id');

        if (hasOrgId) {
          console.log(`✅ Tabla ${tableName} ya tiene organization_id`);
          continue;
        }

        // Agregar columna organization_id
        await tursoClient.execute({
          sql: `ALTER TABLE ${tableName} ADD COLUMN organization_id INTEGER DEFAULT 1`
        });

        // Actualizar registros existentes para que pertenezcan a la organización por defecto
        const updateResult = await tursoClient.execute({
          sql: `UPDATE ${tableName} SET organization_id = 1 WHERE organization_id IS NULL`
        });

        console.log(`✅ Tabla ${tableName} actualizada (${updateResult.rowsAffected} registros actualizados)`);

      } catch (error) {
        console.error(`❌ Error procesando tabla ${tableName}:`, error.message);
      }
    }

    // Verificar resultados
    console.log('\n📊 VERIFICACIÓN DE RESULTADOS:');
    for (const tableName of tablesToUpdate) {
      try {
        const tableExists = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
          args: [tableName]
        });

        if (tableExists.rows.length === 0) {
          console.log(`   ⚠️  ${tableName}: No existe`);
          continue;
        }

        const columnExists = await tursoClient.execute({
          sql: `PRAGMA table_info(${tableName})`
        });

        const hasOrgId = columnExists.rows.some(col => col.name === 'organization_id');
        
        if (hasOrgId) {
          const count = await tursoClient.execute({
            sql: `SELECT COUNT(*) as count FROM ${tableName}`
          });
          console.log(`   ✅ ${tableName}: organization_id agregado (${count.rows[0].count} registros)`);
        } else {
          console.log(`   ❌ ${tableName}: Falta organization_id`);
        }
      } catch (error) {
        console.log(`   ❌ ${tableName}: Error verificando - ${error.message}`);
      }
    }

    console.log('\n🎯 MIGRACIÓN COMPLETADA');
    console.log('📝 Todas las tablas principales ahora tienen organization_id');
    console.log('🏢 Los registros existentes pertenecen a la "Organización Demo"');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    tursoClient.close();
  }
}

addOrganizationIdToTables();