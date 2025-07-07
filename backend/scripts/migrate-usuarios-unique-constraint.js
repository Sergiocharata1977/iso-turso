import db from '../db.js';

async function migrateUsuariosTable() {
  console.log('🔄 Iniciando migración de tabla usuarios...\n');
  
  try {
    // 1. Verificar estructura actual
    console.log('1️⃣ Verificando estructura actual de la tabla usuarios...');
    const tableInfo = await db.execute('PRAGMA table_info(usuarios)');
    console.log('Columnas actuales:', tableInfo.rows.map(col => col.name).join(', '));
    
    // 2. Hacer backup de los datos actuales
    console.log('\n2️⃣ Haciendo backup de los datos actuales...');
    const usuarios = await db.execute('SELECT * FROM usuarios');
    console.log(`Total de usuarios a migrar: ${usuarios.rows.length}`);
    
    // 3. Renombrar tabla actual
    console.log('\n3️⃣ Renombrando tabla actual a usuarios_backup...');
    await db.execute('ALTER TABLE usuarios RENAME TO usuarios_backup');
    
    // 4. Crear nueva tabla con constraint compuesto
    console.log('\n4️⃣ Creando nueva tabla usuarios con constraint compuesto...');
    await db.execute(`
      CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'employee',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        UNIQUE(email, organization_id)
      )
    `);
    console.log('✅ Nueva tabla creada con UNIQUE(email, organization_id)');
    
    // 5. Migrar datos
    console.log('\n5️⃣ Migrando datos a la nueva tabla...');
    if (usuarios.rows.length > 0) {
      for (const usuario of usuarios.rows) {
        await db.execute({
          sql: `INSERT INTO usuarios (id, organization_id, name, email, password_hash, role, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            usuario.id,
            usuario.organization_id,
            usuario.name,
            usuario.email,
            usuario.password_hash,
            usuario.role,
            usuario.is_active,
            usuario.created_at,
            usuario.updated_at
          ]
        });
      }
      console.log(`✅ ${usuarios.rows.length} usuarios migrados exitosamente`);
    }
    
    // 6. Verificar la migración
    console.log('\n6️⃣ Verificando la migración...');
    const newCount = await db.execute('SELECT COUNT(*) as total FROM usuarios');
    const backupCount = await db.execute('SELECT COUNT(*) as total FROM usuarios_backup');
    
    if (newCount.rows[0].total === backupCount.rows[0].total) {
      console.log('✅ Migración verificada: todos los usuarios fueron migrados correctamente');
      
      // 7. Opcional: Eliminar tabla de backup (comentado por seguridad)
      console.log('\n7️⃣ Tabla de backup usuarios_backup se mantiene por seguridad.');
      console.log('   Para eliminarla manualmente: DROP TABLE usuarios_backup;');
      
      // 8. Probar el nuevo constraint
      console.log('\n8️⃣ Probando el nuevo constraint...');
      try {
        // Intentar insertar dos usuarios con el mismo email en diferentes organizaciones
        await db.execute({
          sql: `INSERT INTO usuarios (organization_id, name, email, password_hash, role) 
                VALUES (1, 'Test User 1', 'test@example.com', 'hash1', 'employee')`,
          args: []
        });
        
        await db.execute({
          sql: `INSERT INTO usuarios (organization_id, name, email, password_hash, role) 
                VALUES (2, 'Test User 2', 'test@example.com', 'hash2', 'employee')`,
          args: []
        });
        
        console.log('✅ Éxito: Ahora se pueden crear usuarios con el mismo email en diferentes organizaciones!');
        
        // Limpiar usuarios de prueba
        await db.execute("DELETE FROM usuarios WHERE email = 'test@example.com'");
        
      } catch (error) {
        console.error('❌ Error al probar el constraint:', error.message);
      }
      
    } else {
      console.error('❌ Error: El número de usuarios no coincide después de la migración');
      console.error(`   Nueva tabla: ${newCount.rows[0].total} usuarios`);
      console.error(`   Backup: ${backupCount.rows[0].total} usuarios`);
    }
    
    console.log('\n✨ Migración completada!');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    console.error('Detalles:', error.message);
    
    // Intentar restaurar si algo salió mal
    try {
      console.log('\n🔄 Intentando restaurar tabla original...');
      await db.execute('DROP TABLE IF EXISTS usuarios');
      await db.execute('ALTER TABLE usuarios_backup RENAME TO usuarios');
      console.log('✅ Tabla original restaurada');
    } catch (restoreError) {
      console.error('❌ Error al restaurar:', restoreError.message);
    }
  }
  
  process.exit(0);
}

// Ejecutar migración
migrateUsuariosTable();