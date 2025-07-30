import { tursoClient } from './backend/lib/tursoClient.js';

async function testDBDirecto() {
  console.log('🧪 Probando inserción directa en BD...\n');

  try {
    // Generar ID único
    const id = `reunion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const args = [
      id,
      1, // organization_id
      'Reunión de Prueba Directa',
      '2024-12-25',
      '10:00',
      'Desarrollo', // area
      'Programada', // estado
      'Revisión de proyecto', // temas
      'Definir próximos pasos', // objetivos
      'Equipo de Desarrollo', // participantes
      'Oficina Principal', // ubicacion
      60, // duracion_minutos
      'General', // tipo_reunion
      'Media' // prioridad
    ];

    console.log('🔍 Argumentos SQL:', args);
    console.log('🔍 Tipos de argumentos:', args.map(arg => typeof arg));

    const result = await tursoClient.execute({
      sql: `INSERT INTO reuniones (
        id, organization_id, titulo, fecha, hora, area, estado, temas, objetivos,
        participantes, ubicacion, duracion_minutos, tipo_reunion, prioridad
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: args
    });

    console.log('✅ Inserción exitosa:', result.rows[0]);

  } catch (error) {
    console.error('❌ Error en inserción directa:', error);
    console.error('❌ Error completo:', JSON.stringify(error, null, 2));
  }
}

testDBDirecto(); 