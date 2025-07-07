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

async function createAuthSAAS() {
  try {
    console.log('🚀 CREANDO SISTEMA DE AUTENTICACIÓN SAAS...\n');
    
    // 1. Crear tabla organizations
    console.log('📊 Creando tabla organizations...');
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        email TEXT,
        phone TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    console.log('✅ Tabla organizations creada');
    
    // 2. Crear tabla usuarios
    console.log('👥 Creando tabla usuarios...');
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('super_admin', 'admin', 'manager', 'employee')) NOT NULL DEFAULT 'employee',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla usuarios creada');
    
    // 3. Verificar tablas creadas
    const result = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('organizations', 'usuarios')
      ORDER BY name
    `);
    
    console.log('\n📋 TABLAS DE AUTENTICACIÓN VERIFICADAS:');
    result.rows.forEach(row => {
      console.log(`   ✅ ${row.name}`);
    });
    
    // 4. Mostrar estructura de la tabla usuarios
    const userStructure = await tursoClient.execute(`PRAGMA table_info(usuarios)`);
    console.log('\n🔍 ESTRUCTURA TABLA USUARIOS:');
    userStructure.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ' DEFAULT ' + col.dflt_value : ''}`);
    });
    
    console.log('\n🎯 SISTEMA DE AUTENTICACIÓN SAAS CREADO EXITOSAMENTE');
    console.log('🏛️ Multi-tenant: organizations + usuarios con roles');
    console.log('👑 Roles: super_admin, admin, manager, employee');
    
  } catch (error) {
    console.error('❌ Error creando sistema de autenticación:', error);
  }
}

createAuthSAAS();
