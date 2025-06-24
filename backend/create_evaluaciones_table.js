import { tursoClient } from './lib/tursoClient.js';

async function createEvaluacionesTable() {
  try {
    console.log('🔧 Creando tabla evaluaciones_personal...');
    
    // Crear tabla simple para evaluaciones de personal
    const createTable = `
      CREATE TABLE IF NOT EXISTS evaluaciones_personal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personal_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha_evaluacion DATE NOT NULL,
        puntaje INTEGER,
        estado TEXT DEFAULT 'pendiente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await tursoClient.execute(createTable);
    console.log('✅ Tabla evaluaciones_personal creada');
    
    // Verificar si existe tabla personal, si no crearla simple
    try {
      await tursoClient.execute("SELECT 1 FROM personal LIMIT 1");
      console.log('✅ Tabla personal ya existe');
    } catch {
      console.log('🔧 Creando tabla personal simple...');
      const createPersonal = `
        CREATE TABLE IF NOT EXISTS personal (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          puesto TEXT,
          departamento TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await tursoClient.execute(createPersonal);
      
      // Insertar datos de ejemplo
      const insertSample = `
        INSERT INTO personal (nombre, apellido, puesto, departamento) VALUES
        ('Juan', 'Pérez', 'Analista', 'IT'),
        ('María', 'González', 'Supervisor', 'RRHH'),
        ('Carlos', 'López', 'Técnico', 'Operaciones'),
        ('Ana', 'Martínez', 'Gerente', 'Ventas'),
        ('Luis', 'Rodríguez', 'Especialista', 'Calidad')
      `;
      await tursoClient.execute(insertSample);
      console.log('✅ Tabla personal creada con datos de ejemplo');
    }
    
    // Insertar evaluaciones de ejemplo
    console.log('🔧 Insertando evaluaciones de ejemplo...');
    const insertEvals = `
      INSERT INTO evaluaciones_personal (personal_id, titulo, descripcion, fecha_evaluacion, puntaje, estado) VALUES
      (1, 'Evaluación Anual 2024', 'Evaluación de desempeño anual para Juan Pérez', '2024-12-01', 85, 'completada'),
      (2, 'Evaluación de Competencias', 'Evaluación de competencias técnicas y soft skills', '2024-11-15', 92, 'completada'),
      (3, 'Evaluación 360°', 'Evaluación integral con feedback de pares y supervisores', '2024-10-30', null, 'en_proceso'),
      (1, 'Evaluación Probatoria', 'Evaluación de período de prueba', '2024-09-15', 78, 'completada'),
      (4, 'Evaluación de Liderazgo', 'Evaluación específica para roles de liderazgo', '2024-12-15', null, 'pendiente')
    `;
    
    await tursoClient.execute(insertEvals);
    console.log('✅ Evaluaciones de ejemplo insertadas');
    
    // Verificar datos
    const result = await tursoClient.execute(`
      SELECT e.*, p.nombre, p.apellido, p.puesto 
      FROM evaluaciones_personal e 
      JOIN personal p ON e.personal_id = p.id 
      ORDER BY e.created_at DESC
    `);
    
    console.log(`\n📊 Evaluaciones creadas (${result.rows.length} registros):`);
    result.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.titulo} - ${row.nombre} ${row.apellido} (${row.estado})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

createEvaluacionesTable();
