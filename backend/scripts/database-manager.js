/**
 * GESTOR CENTRALIZADO DE BASE DE DATOS - IsoFlow3
 * 
 * ⚠️  IMPORTANTE: Este es el ÚNICO script autorizado para gestionar la estructura de BD
 * ⚠️  NO crear otros scripts que hagan DROP TABLE o ALTER TABLE
 * ⚠️  Todas las operaciones de BD deben pasar por este gestor
 * 
 * Fecha: 2025-07-03
 * Autor: Sistema IsoFlow3
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// ✅ TABLAS CRÍTICAS DEL FRONTEND - NO TOCAR JAMÁS
const CRITICAL_TABLES = [
  'acciones',
  'auditorias', 
  'capacitaciones',
  'comunicaciones',
  'departamentos',
  'documentos',
  'encuestas',
  'evaluaciones_capacitaciones',
  'eventos_calendario',
  'hallazgos',
  'indicadores',
  'messages',
  'message_recipients', 
  'message_tags',
  'normas',
  'noticias',
  'objetivos',
  'personal',
  'procesos',
  'puestos',
  'usuarios'
];

class DatabaseManager {
  constructor() {
    this.client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_DB_TOKEN,
    });
  }

  /**
   * 🔍 Verificar estado de todas las tablas
   */
  async checkAllTables() {
    try {
      console.log('🔍 Verificando estado de la base de datos...\n');
      
      const result = await this.client.execute({
        sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
        args: []
      });

      const existingTables = result.rows.map(row => row.name);
      
      console.log('📋 TABLAS EXISTENTES:');
      existingTables.forEach((table, index) => {
        const isCritical = CRITICAL_TABLES.includes(table);
        const status = isCritical ? '🔒 CRÍTICA' : '📄 Normal';
        console.log(`${index + 1}. ${table} ${status}`);
      });

      console.log('\n🔍 ANÁLISIS:');
      const missingCritical = CRITICAL_TABLES.filter(table => !existingTables.includes(table));
      const extraTables = existingTables.filter(table => 
        !CRITICAL_TABLES.includes(table) && table !== 'sqlite_sequence'
      );

      if (missingCritical.length > 0) {
        console.log('❌ TABLAS CRÍTICAS FALTANTES:');
        missingCritical.forEach(table => console.log(`   - ${table}`));
      } else {
        console.log('✅ Todas las tablas críticas están presentes');
      }

      if (extraTables.length > 0) {
        console.log('\n📝 TABLAS ADICIONALES:');
        extraTables.forEach(table => console.log(`   - ${table}`));
      }

      return {
        existing: existingTables,
        missing: missingCritical,
        extra: extraTables
      };

    } catch (error) {
      console.error('❌ Error al verificar tablas:', error.message);
      throw error;
    }
  }

  /**
   * 🛡️ Verificar si una tabla es crítica (protegida)
   */
  isCriticalTable(tableName) {
    return CRITICAL_TABLES.includes(tableName);
  }

  /**
   * ⚠️ OPERACIÓN PELIGROSA: Solo para emergencias
   * Requiere confirmación explícita
   */
  async dangerousDropTable(tableName, confirmationCode) {
    if (confirmationCode !== 'CONFIRM_DROP_' + tableName.toUpperCase()) {
      throw new Error('❌ Código de confirmación incorrecto. Operación cancelada por seguridad.');
    }

    if (this.isCriticalTable(tableName)) {
      throw new Error(`❌ PROHIBIDO: ${tableName} es una tabla crítica del frontend. No se puede eliminar.`);
    }

    console.log(`⚠️ ELIMINANDO TABLA: ${tableName}`);
    await this.client.execute(`DROP TABLE IF EXISTS ${tableName}`);
    console.log(`✅ Tabla ${tableName} eliminada`);
  }

  /**
   * 📊 Obtener información detallada de una tabla
   */
  async getTableInfo(tableName) {
    try {
      const result = await this.client.execute({
        sql: `PRAGMA table_info(${tableName})`,
        args: []
      });

      console.log(`\n📋 ESTRUCTURA DE TABLA: ${tableName}`);
      console.log('Columna | Tipo | Nulo | Defecto | PK');
      console.log('--------|------|------|---------|---');
      
      result.rows.forEach(row => {
        console.log(`${row.name} | ${row.type} | ${row.notnull ? 'NO' : 'SÍ'} | ${row.dflt_value || 'NULL'} | ${row.pk ? 'SÍ' : 'NO'}`);
      });

      return result.rows;
    } catch (error) {
      console.error(`❌ Error al obtener info de tabla ${tableName}:`, error.message);
      throw error;
    }
  }

  /**
   * 🔧 Crear tabla de forma segura (solo si no existe)
   */
  async safeCreateTable(tableName, createSQL) {
    try {
      const tables = await this.checkAllTables();
      
      if (tables.existing.includes(tableName)) {
        console.log(`⚠️ La tabla ${tableName} ya existe. No se creará.`);
        return false;
      }

      console.log(`🔨 Creando tabla: ${tableName}`);
      await this.client.execute(createSQL);
      console.log(`✅ Tabla ${tableName} creada exitosamente`);
      return true;
    } catch (error) {
      console.error(`❌ Error al crear tabla ${tableName}:`, error.message);
      throw error;
    }
  }

  /**
   * 🧹 Cerrar conexión
   */
  close() {
    this.client.close();
  }
}

// 🚀 COMANDOS DISPONIBLES
async function main() {
  const manager = new DatabaseManager();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'check':
        await manager.checkAllTables();
        break;
      
      case 'info':
        const tableName = process.argv[3];
        if (!tableName) {
          console.log('❌ Uso: node database-manager.js info <nombre_tabla>');
          return;
        }
        await manager.getTableInfo(tableName);
        break;
      
      case 'help':
      default:
        console.log(`
🛠️  GESTOR DE BASE DE DATOS - IsoFlow3

COMANDOS DISPONIBLES:
  check     - Verificar estado de todas las tablas
  info <tabla> - Ver estructura de una tabla específica
  help      - Mostrar esta ayuda

EJEMPLOS:
  node database-manager.js check
  node database-manager.js info usuarios
  node database-manager.js help

⚠️  IMPORTANTE: Este script NO permite eliminar tablas críticas del frontend.
⚠️  Para operaciones peligrosas, contactar al administrador del sistema.
        `);
        break;
    }
  } catch (error) {
    console.error('💥 Error:', error.message);

}

// Ejecutar si es llamado directamente
if (import.meta.url.startsWith('file:') && process.argv[1].includes('database-manager.js')) {
  main();
}

export default DatabaseManager;
