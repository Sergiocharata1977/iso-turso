#!/usr/bin/env node

/**
 * 🎯 SCRIPT: Crear Tablas de Planificación Estratégica en Turso
 * Ejecuta el SQL para crear las tablas de planificación estratégica
 * Uso: node backend/scripts/crear-tablas-planificacion-estrategica.js
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Cargar variables de entorno
dotenv.config();

// Configurar rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

console.log('🎯 Iniciando creación de tablas de Planificación Estratégica...\n');

async function crearTablas() {
  try {
    // Leer el archivo SQL
    const sqlFile = join(__dirname, 'crear-tablas-planificacion-estrategica.sql');
    const sqlContent = readFileSync(sqlFile, 'utf8');
    
    console.log('📋 Ejecutando SQL para crear tablas...');
    
    // Ejecutar cada instrucción SQL
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.execute(statement);
          console.log(`✅ Ejecutado: ${statement.substring(0, 50)}...`);
        } catch (error) {
          // Ignorar errores de índices duplicados o datos de ejemplo
          if (!error.message.includes('already exists')) {
            console.warn(`⚠️ Advertencia: ${error.message}`);
          }
        }
      }
    }

    console.log('\n🎉 Tablas de planificación estratégica creadas exitosamente!');
    
    // Verificar tablas creadas
    console.log('\n📊 Verificando tablas creadas...');
    const tables = [
      'planificacion_estrategica',
      'analisis_foda',
      'objetivos_estrategicos',
      'objetivos_procesos',
      'seguimiento_objetivos',
      'planificacion_participantes'
    ];

    for (const table of tables) {
      try {
        const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`📊 ${table}: ${result.rows[0].count} registros`);
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Ejecutar
crearTablas();
