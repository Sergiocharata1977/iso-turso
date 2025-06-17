// Script para eliminar y recrear la tabla usuarios en TursoDB
import { db } from '../backend/lib/tursoClient.js';
import bcrypt from 'bcryptjs';

async function recreateUsersTable() {
  try {
    console.log('=== RECREANDO TABLA USUARIOS SEGÚN ESTRUCTURA TURSO ===');
    
    // 1. Eliminar la tabla si existe
    console.log('1. Eliminando tabla usuarios...');
    await db.execute({ sql: "DROP TABLE IF EXISTS usuarios" });
    console.log('   ✓ Tabla eliminada correctamente');
    
    // 2. Crear la tabla con la estructura que se ve en TursoDB
    console.log('2. Creando tabla usuarios con estructura correcta...');
    await db.execute({
      sql: `CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'user',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT
      )`
    });
    console.log('   ✓ Tabla creada con la estructura correcta');
    
    // 3. Generar hashes de contraseñas
    console.log('3. Generando hashes de contraseñas...');
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    const userHash = await bcrypt.hash('isoflow123', salt);
    console.log('   ✓ Hashes generados correctamente');
    
    // 4. Insertar los usuarios que se ven en la captura
    console.log('4. Insertando usuarios...');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    await db.execute({
      sql: `INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['Administrador', 'admin@isoflow.com', adminHash, 'admin', timestamp, timestamp]
    });
    
    await db.execute({
      sql: `INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['Juan Pérez', 'juan@isoflow.com', userHash, 'user', timestamp, timestamp]
    });
    
    await db.execute({
      sql: `INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['María Gómez', 'maria@isoflow.com', userHash, 'supervisor', timestamp, timestamp]
    });
    console.log('   ✓ Usuarios insertados correctamente');
    
    // 5. Verificar que los usuarios se han creado
    console.log('5. Verificando usuarios creados...');
    const users = await db.execute({ sql: 'SELECT * FROM usuarios' });
    console.log(`   ✓ Se han creado ${users.rows.length} usuarios:`);
    
    users.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.nombre}, ${user.role})`);
    });
    
    console.log('\n=== CREDENCIALES PARA PRUEBAS ===');
    console.log('Administrador:');
    console.log('Email: admin@isoflow.com');
    console.log('Contraseña: admin123');
    console.log('\nUsuario regular:');
    console.log('Email: juan@isoflow.com');
    console.log('Contraseña: isoflow123');
    console.log('\nSupervisor:');
    console.log('Email: maria@isoflow.com');
    console.log('Contraseña: isoflow123');
    
    console.log('\n¡Tabla recreada exitosamente! Ahora puedes probar el inicio de sesión.');
    
  } catch (error) {
    console.error('Error al recrear la tabla usuarios:', error);
  }
}

// Ejecutar la función
recreateUsersTable().then(() => {
  console.log('Proceso completado.');
  process.exit(0);
}).catch(error => {
  console.error('Error en el proceso:', error);
  process.exit(1);
});
