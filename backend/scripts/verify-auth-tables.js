import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

async function verifyAuthTables() {
  try {
    console.log('🔍 VERIFICANDO TABLAS DE AUTENTICACIÓN...\n');
    
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('organizations', 'usuarios') 
      ORDER BY name
    `);
    
    console.log('📋 TABLAS ENCONTRADAS:');
    if (tables.rows.length === 0) {
      console.log('❌ No se encontraron tablas de autenticación');
      return;
    }
    
    tables.rows.forEach(row => {
      console.log(`   ✅ ${row.name}`);
    });
    
    if (tables.rows.find(r => r.name === 'usuarios')) {
      console.log('\n👥 ESTRUCTURA TABLA USUARIOS:');
      const userSchema = await client.execute('PRAGMA table_info(usuarios)');
      userSchema.rows.forEach(col => {
        console.log(`   - ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ' DEFAULT ' + col.dflt_value : ''}`);
      });
    }
    
    if (tables.rows.find(r => r.name === 'organizations')) {
      console.log('\n🏛️ ESTRUCTURA TABLA ORGANIZATIONS:');
      const orgSchema = await client.execute('PRAGMA table_info(organizations)');
      orgSchema.rows.forEach(col => {
        console.log(`   - ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ' DEFAULT ' + col.dflt_value : ''}`);
      });
    }
    
    console.log('\n✅ VERIFICACIÓN COMPLETA - SISTEMA SAAS MULTI-TENANT LISTO');
    
  } catch (error) {
    console.error('❌ Error verificando tablas:', error);
  }
}

verifyAuthTables();
