// Script para inicializar la base de datos con todas las tablas necesarias
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta a la base de datos
const dbPath = path.join(__dirname, '..', 'data.db');
const dbUrl = `file:${dbPath}`;

console.log(`Inicializando base de datos en: ${dbPath}`);


const client = createClient({
  url: dbUrl
});

async function initDatabase() {
  console.log('Inicializando base de datos...');

  try {
    // Crear tabla de departamentos si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS departamentos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla departamentos creada/verificada');

    // Crear tabla de puestos si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS puestos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        departamentoId TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (departamentoId) REFERENCES departamentos(id)
      )
    `);
    console.log('✅ Tabla puestos creada/verificada');

    // Crear tabla de personal si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS personal (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT,
        telefono TEXT,
        direccion TEXT,
        fecha_nacimiento TEXT,
        fecha_contratacion TEXT,
        departamentoId TEXT,
        puestoId TEXT,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (departamentoId) REFERENCES departamentos(id),
        FOREIGN KEY (puestoId) REFERENCES puestos(id)
      )
    `);
    console.log('✅ Tabla personal creada/verificada');

    // Crear tabla de documentos si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS documentos (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        version TEXT,
        fecha_emision TEXT,
        fecha_revision TEXT,
        estado TEXT DEFAULT 'vigente',
        url_documento TEXT,
        categoria TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla documentos creada/verificada');

    // Crear tabla de normas si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS normas (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        version TEXT,
        fecha_publicacion TEXT,
        organismo_emisor TEXT,
        estado TEXT DEFAULT 'vigente',
        url_documento TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla normas creada/verificada');

    // Crear tabla de procesos si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS procesos (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT,
        responsable TEXT,
        entradas TEXT,
        salidas TEXT,
        indicadores TEXT,
        documentos_relacionados TEXT,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla procesos creada/verificada');

    // Crear tabla de objetivos de calidad si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS objetivos_calidad (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        meta TEXT,
        responsable TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla objetivos_calidad creada/verificada');

    // Crear tabla de indicadores si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS indicadores (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        formula TEXT,
        unidad_medida TEXT,
        frecuencia_medicion TEXT,
        responsable TEXT,
        meta TEXT,
        proceso_id TEXT,
        objetivo_id TEXT,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (proceso_id) REFERENCES procesos(id),
        FOREIGN KEY (objetivo_id) REFERENCES objetivos_calidad(id)
      )
    `);
    console.log('✅ Tabla indicadores creada/verificada');

    // Crear tabla de mediciones si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS mediciones (
        id TEXT PRIMARY KEY,
        indicador_id TEXT NOT NULL,
        fecha_medicion TEXT NOT NULL,
        valor REAL,
        observaciones TEXT,
        responsable TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (indicador_id) REFERENCES indicadores(id)
      )
    `);
    console.log('✅ Tabla mediciones creada/verificada');

    // Crear tabla de mejoras si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS mejoras (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT,
        origen TEXT,
        proceso_id TEXT,
        responsable TEXT,
        fecha_identificacion TEXT,
        fecha_implementacion TEXT,
        estado TEXT DEFAULT 'identificada',
        resultado TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (proceso_id) REFERENCES procesos(id)
      )
    `);
    console.log('✅ Tabla mejoras creada/verificada');

    // Crear tabla de auditorias si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS auditorias (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        titulo TEXT NOT NULL,
        tipo TEXT,
        alcance TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        responsable TEXT,
        auditores TEXT,
        resultado TEXT,
        estado TEXT DEFAULT 'planificada',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla auditorias creada/verificada');

    // Crear tabla de capacitaciones si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS capacitaciones (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        instructor TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        duracion TEXT,
        lugar TEXT,
        participantes TEXT,
        estado TEXT DEFAULT 'planificada',
        evaluacion TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla capacitaciones creada/verificada');

    // Crear tabla de evaluaciones si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS evaluaciones (
        id TEXT PRIMARY KEY,
        personal_id TEXT NOT NULL,
        tipo_evaluacion TEXT,
        fecha TEXT,
        puntuacion REAL,
        fortalezas TEXT,
        areas_oportunidad TEXT,
        comentarios TEXT,
        planes_accion TEXT,
        estado TEXT DEFAULT 'pendiente',
        competencias TEXT,
        objetivos TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personal_id) REFERENCES personal(id)
      )
    `);
    console.log('✅ Tabla evaluaciones creada/verificada');

    // Crear tabla de productos si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        id TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        categoria TEXT,
        especificaciones TEXT,
        estado TEXT DEFAULT 'activo',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla productos creada/verificada');

    // Crear tabla de encuestas si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS encuestas (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        estado TEXT DEFAULT 'activa',
        preguntas TEXT,
        respuestas TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla encuestas creada/verificada');

    // Crear tabla de usuarios si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        nombre TEXT,
        apellido TEXT,
        email TEXT,
        rol TEXT DEFAULT 'usuario',
        estado TEXT DEFAULT 'activo',
        ultimo_acceso TEXT,
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla usuarios creada/verificada');

    // Crear tabla de tickets si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        solicitante_id TEXT,
        asignado_id TEXT,
        departamento_id TEXT,
        prioridad TEXT DEFAULT 'media',
        estado TEXT DEFAULT 'abierto',
        fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TEXT,
        fecha_cierre TEXT,
        comentarios TEXT,
        FOREIGN KEY (solicitante_id) REFERENCES usuarios(id),
        FOREIGN KEY (asignado_id) REFERENCES usuarios(id),
        FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
      )
    `);
    console.log('✅ Tabla tickets creada/verificada');

    console.log('✅ Base de datos inicializada correctamente');
    
    // Insertar datos de ejemplo si es necesario
    const departamentosCount = await client.execute('SELECT COUNT(*) as count FROM departamentos');
    if (departamentosCount.rows[0].count === 0) {
      console.log('Insertando datos de ejemplo...');
      
      // Insertar departamento de ejemplo
      await client.execute(`
        INSERT INTO departamentos (id, nombre, descripcion)
        VALUES ('dep1', 'Recursos Humanos', 'Departamento encargado de la gestión del personal')
      `);
      
      // Insertar puesto de ejemplo
      await client.execute(`
        INSERT INTO puestos (id, nombre, descripcion, departamentoId)
        VALUES ('puesto1', 'Gerente de RRHH', 'Responsable del departamento de RRHH', 'dep1')
      `);
      
      console.log('✅ Datos de ejemplo insertados');
    }

    return true;
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    return false;
  } finally {
    await client.close();
  }
}

// Ejecutar la función de inicialización
initDatabase()
  .then(success => {
    if (success) {
      console.log('✅ Proceso de inicialización completado exitosamente');
    } else {
      console.log('❌ Proceso de inicialización completado con errores');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error fatal durante la inicialización:', error);
    process.exit(1);
  });
