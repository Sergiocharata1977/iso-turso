// Script para actualizar la tabla usuarios y ajustar autenticación
import { tursoClient, executeQuery } from '../backend/lib/tursoClient.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateUsersAndAuth() {
  try {
    console.log('=== ACTUALIZANDO SISTEMA DE AUTENTICACIÓN ===');
    
    // 1. Eliminar la tabla si existe
    console.log('1. Eliminando tabla usuarios...');
    await tursoClient.execute({ sql: "DROP TABLE IF EXISTS usuarios" });
    console.log('   ✓ Tabla eliminada correctamente');
    
    // 2. Crear la tabla con la estructura que se ve en TursoDB
    console.log('2. Creando tabla usuarios con estructura de TursoDB...');
    await tursoClient.execute({
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
    
    await tursoClient.execute({
      sql: `INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['Administrador', 'admin@isoflow.com', adminHash, 'admin', timestamp, timestamp]
    });
    
    await tursoClient.execute({
      sql: `INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['Juan Pérez', 'juan@isoflow.com', userHash, 'user', timestamp, timestamp]
    });
    
    await tursoClient.execute({
      sql: `INSERT INTO usuarios (nombre, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ['María Gómez', 'maria@isoflow.com', userHash, 'supervisor', timestamp, timestamp]
    });
    console.log('   ✓ Usuarios insertados correctamente');
    
    // 5. Verificar que los usuarios se han creado
    console.log('5. Verificando usuarios creados...');
    const users = await tursoClient.execute({ sql: 'SELECT * FROM usuarios' });
    console.log(`   ✓ Se han creado ${users.rows.length} usuarios:`);
    
    users.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.nombre}, ${user.role})`);
    });
    
    // 6. Crear archivo de actualización para el controlador de autenticación
    console.log('6. Creando archivo con modificaciones necesarias para el controlador de autenticación...');
    
    const authControllerPath = path.join(__dirname, '..', 'backend', 'controllers', 'auth.controller.js');
    const updatePath = path.join(__dirname, '..', 'backend', 'controllers', 'auth.controller.fix.js');
    
    // Leer el controlador actual
    if (fs.existsSync(authControllerPath)) {
      const authControllerContent = fs.readFileSync(authControllerPath, 'utf8');
      
      // Modificar el contenido para adaptarlo a la nueva estructura
      const updatedContent = authControllerContent
        // Cambiar la función de login para usar email en lugar de username
        .replace(/const { username, password } = req.body;/g, 'const { username, email, password } = req.body;')
        .replace(/const usuarios = await findBy\('usuarios', { username }\);/g, 
          `// Buscar por email o username (compatibilidad)
    const searchKey = email || username;
    const usuarios = await findBy('usuarios', { email: searchKey });`)
        .replace(/const isMatch = await bcrypt.compare\(password, usuario.password\);/g, 
          'const isMatch = await bcrypt.compare(password, usuario.password_hash);')
        .replace(/delete usuario.password;/g, '// La password ya no está en el objeto')
        .replace(/rol TEXT DEFAULT 'user'/g, "role TEXT DEFAULT 'user'");
      
      fs.writeFileSync(updatePath, updatedContent);
      console.log('   ✓ Archivo de actualización creado en controllers/auth.controller.fix.js');
    } else {
      console.log('   ⚠️ No se pudo encontrar el archivo del controlador de autenticación');
    }
    
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
    
    console.log('\n=== PRÓXIMOS PASOS ===');
    console.log('1. Revisar el archivo auth.controller.fix.js para las modificaciones sugeridas');
    console.log('2. Aplicar las modificaciones al controlador de autenticación');
    console.log('3. Probar el login con las credenciales proporcionadas');
    console.log('4. Si sigue habiendo problemas, verificar el servicio de autenticación del frontend');
    
    console.log('\n¡Proceso completado!');
    
  } catch (error) {
    console.error('Error al actualizar el sistema de autenticación:', error);
  }
}

// Ejecutar la función
updateUsersAndAuth().then(() => {
  console.log('Script finalizado.');
  process.exit(0);
}).catch(error => {
  console.error('Error en el script:', error);
  process.exit(1);
});
