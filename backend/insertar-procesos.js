import { tursoClient } from './lib/tursoClient.js';

async function insertarProcesos() {
  try {
    console.log('🚀 Iniciando inserción de procesos...');
    
    // Primero, verificamos la estructura actual de la tabla
    console.log('🔍 Verificando estructura de la tabla procesos...');
    const estructura = await tursoClient.execute('PRAGMA table_info(procesos)');
    
    if (estructura.rows.length === 0) {
      console.error('❌ La tabla procesos no existe!');
      return;
    }
    
    const columnas = estructura.rows.map(col => col.name);
    console.log('📋 Columnas disponibles:', columnas.join(', '));
    
    // Datos base para insertar
    const procesos = [
      {
        id: 'proc-001',
        nombre: 'Gestión de Calidad',
        codigo: 'GC-001',
        descripcion: 'Proceso para asegurar la calidad de los productos y servicios'
      },
      {
        id: 'proc-002',
        nombre: 'Desarrollo de Software',
        codigo: 'DS-001',
        descripcion: 'Proceso para el ciclo de vida del desarrollo de software'
      },
      {
        id: 'proc-003',
        nombre: 'Atención al Cliente',
        codigo: 'AC-001',
        descripcion: 'Proceso para gestionar la relación con los clientes y sus solicitudes'
      }
    ];
    
    // Insertamos cada proceso, usando solo las columnas disponibles
    for (const proceso of procesos) {
      // Construir dinámicamente la consulta SQL basada en las columnas disponibles
      const columnasDisponibles = [];
      const valores = [];
      const placeholders = [];
      
      // Para cada propiedad del proceso, verificamos si existe la columna
      for (const [key, value] of Object.entries(proceso)) {
        if (columnas.includes(key)) {
          columnasDisponibles.push(key);
          valores.push(value);
          placeholders.push('?');
        }
      }
      
      // Si la tabla tiene columnas adicionales que podríamos necesitar
      if (columnas.includes('estado')) {
        columnasDisponibles.push('estado');
        valores.push('activo');
        placeholders.push('?');
      }
      
      // Construir la consulta SQL
      const sql = `INSERT INTO procesos (${columnasDisponibles.join(', ')}) VALUES (${placeholders.join(', ')})`;
      
      try {
        await tursoClient.execute({ sql, args: valores });
        console.log(`✅ Proceso ${proceso.nombre} insertado correctamente`);
      } catch (error) {
        console.error(`❌ Error insertando proceso ${proceso.nombre}:`, error.message);
      }
    }
    
    // Verificar resultados
    const count = await tursoClient.execute('SELECT COUNT(*) as count FROM procesos');
    console.log(`🔢 Total de procesos en la base de datos: ${count.rows[0].count}`);
    
    const allProcesos = await tursoClient.execute('SELECT id, nombre, codigo FROM procesos');
    console.log('📋 Procesos disponibles:');
    allProcesos.rows.forEach(p => console.log(`   - ${p.nombre} (${p.codigo})`));
    
    console.log('🎉 ¡Operación completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

insertarProcesos();
