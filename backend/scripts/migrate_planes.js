import { tursoClient } from '../lib/tursoClient.js';
import fs from 'fs';
import path from 'path';

/**
 * Script de migración para crear las tablas del sistema de planes
 */
async function migratePlanes() {
  try {
    console.log('🚀 Iniciando migración del sistema de planes...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(process.cwd(), 'backend/scripts/create_planes_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`📋 Ejecutando ${commands.length} comandos SQL...`);
    
    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      try {
        await tursoClient.execute({ sql: command });
        console.log(`✅ Comando ${i + 1}/${commands.length} ejecutado correctamente`);
      } catch (error) {
        // Ignorar errores de "table already exists" y "index already exists"
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Comando ${i + 1}/${commands.length} ya existe, continuando...`);
        } else {
          console.error(`❌ Error en comando ${i + 1}/${commands.length}:`, error.message);
        }
      }
    }
    
    // Verificar que las tablas se crearon correctamente
    console.log('🔍 Verificando tablas creadas...');
    
    const tables = ['planes', 'suscripciones', 'limites_uso', 'historial_suscripciones', 'notificaciones_suscripcion'];
    
    for (const table of tables) {
      try {
        const result = await tursoClient.execute({
          sql: `SELECT COUNT(*) as count FROM ${table}`
        });
        console.log(`✅ Tabla ${table}: ${result.rows[0].count} registros`);
      } catch (error) {
        console.error(`❌ Error verificando tabla ${table}:`, error.message);
      }
    }
    
    // Verificar planes de prueba
    const planesResult = await tursoClient.execute({
      sql: 'SELECT nombre, precio_mensual, max_usuarios FROM planes WHERE estado = "activo" ORDER BY orden_display'
    });
    
    console.log('📊 Planes creados:');
    planesResult.rows.forEach(plan => {
      console.log(`  - ${plan.nombre}: $${plan.precio_mensual}/mes, ${plan.max_usuarios} usuarios`);
    });
    
    console.log('🎉 Migración del sistema de planes completada exitosamente!');
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración si el script se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePlanes();
}

export default migratePlanes; 