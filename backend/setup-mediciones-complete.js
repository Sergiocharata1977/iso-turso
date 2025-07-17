import { tursoClient } from './lib/tursoClient.js';

async function setupCompleteSystem() {
  try {
    console.log('🚀 Configurando sistema completo de mediciones...');
    
    // 1. Verificar y crear indicadores si no existen
    console.log('\n📊 Verificando indicadores...');
    const indicadores = await tursoClient.execute('SELECT COUNT(*) as total FROM indicadores');
    console.log(`Total de indicadores: ${indicadores.rows[0].total}`);
    
    if (indicadores.rows[0].total === 0) {
      console.log('🌱 Creando indicadores de ejemplo...');
      
      const sampleIndicadores = [
        {
          id: 1,
          nombre: 'Satisfacción del Cliente',
          descripcion: 'Porcentaje de satisfacción del cliente medido mensualmente',
          proceso_id: 1,
          frecuencia_medicion: 'Mensual',
          meta: 90.0,
          formula: '(Clientes satisfechos / Total clientes) * 100'
        },
        {
          id: 2,
          nombre: 'Tiempo de Respuesta',
          descripcion: 'Tiempo promedio de respuesta a solicitudes en horas',
          proceso_id: 1,
          frecuencia_medicion: 'Diaria',
          meta: 48.0,
          formula: 'Suma total horas respuesta / Número solicitudes'
        },
        {
          id: 3,
          nombre: 'Defectos por Producto',
          descripcion: 'Número de defectos por cada 100 productos fabricados',
          proceso_id: 1,
          frecuencia_medicion: 'Semanal',
          meta: 2.0,
          formula: '(Productos defectuosos / Total productos) * 100'
        }
      ];
      
      for (const ind of sampleIndicadores) {
        await tursoClient.execute({
          sql: `INSERT INTO indicadores (
            id, nombre, descripcion, proceso_id, frecuencia_medicion, 
            meta, formula, organization_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            ind.id,
            ind.nombre,
            ind.descripcion,
            ind.proceso_id,
            ind.frecuencia_medicion,
            ind.meta,
            ind.formula,
            1,
            new Date().toISOString(),
            new Date().toISOString()
          ]
        });
      }
      
      console.log(`✅ Creados ${sampleIndicadores.length} indicadores de ejemplo`);
    }
    
    // 2. Crear mediciones de ejemplo
    console.log('\n📈 Creando mediciones de ejemplo...');
    const medicionesCount = await tursoClient.execute('SELECT COUNT(*) as total FROM mediciones');
    
    if (medicionesCount.rows[0].total === 0) {
      const sampleMediciones = [
        {
          id: 'med-' + Date.now() + '-1',
          indicador_id: '1',
          valor: 85.5,
          fecha_medicion: '2024-01-15',
          observaciones: 'Satisfacción del cliente por encima del promedio mensual',
          responsable: 'Juan Pérez - Gerente de Calidad'
        },
        {
          id: 'med-' + Date.now() + '-2',
          indicador_id: '2',
          valor: 24.0,
          fecha_medicion: '2024-01-13',
          observaciones: 'Tiempo de respuesta excelente, muy por debajo del objetivo',
          responsable: 'María García - Supervisor de Operaciones'
        },
        {
          id: 'med-' + Date.now() + '-3',
          indicador_id: '3',
          valor: 1.2,
          fecha_medicion: '2024-01-12',
          observaciones: 'Calidad excepcional en producción esta semana',
          responsable: 'Carlos López - Jefe de Producción'
        },
        {
          id: 'med-' + Date.now() + '-4',
          indicador_id: '1',
          valor: 94.4,
          fecha_medicion: '2024-01-14',
          observaciones: 'Objetivo superado - campañas de mejora funcionando',
          responsable: 'Ana Martínez - Analista de Calidad'
        },
        {
          id: 'med-' + Date.now() + '-5',
          indicador_id: '2',
          valor: 36.0,
          fecha_medicion: '2024-01-11',
          observaciones: 'Tiempo de respuesta dentro del objetivo establecido',
          responsable: 'Pedro Rodríguez - Coordinador de Servicio'
        }
      ];
      
      for (const med of sampleMediciones) {
        await tursoClient.execute({
          sql: `INSERT INTO mediciones (
            id, indicador_id, valor, fecha_medicion, 
            observaciones, responsable, fecha_creacion, organization_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            med.id,
            med.indicador_id,
            med.valor,
            med.fecha_medicion,
            med.observaciones,
            med.responsable,
            new Date().toISOString(),
            1
          ]
        });
      }
      
      console.log(`✅ Creadas ${sampleMediciones.length} mediciones de ejemplo`);
    }
    
    // 3. Mostrar resumen
    console.log('\n📋 Resumen del sistema:');
    
    const finalIndicadores = await tursoClient.execute('SELECT COUNT(*) as total FROM indicadores');
    const finalMediciones = await tursoClient.execute('SELECT COUNT(*) as total FROM mediciones');
    
    console.log(`📊 Total de indicadores: ${finalIndicadores.rows[0].total}`);
    console.log(`📈 Total de mediciones: ${finalMediciones.rows[0].total}`);
    
    // 4. Mostrar algunas mediciones con sus indicadores
    console.log('\n🔍 Mediciones recientes con indicadores:');
    const medicionesConIndicadores = await tursoClient.execute(`
      SELECT 
        m.id, 
        m.valor, 
        m.fecha_medicion, 
        i.nombre as indicador_nombre,
        i.meta,
        i.frecuencia_medicion,
        m.responsable,
        m.observaciones
      FROM mediciones m
      JOIN indicadores i ON m.indicador_id = i.id
      ORDER BY m.fecha_medicion DESC
      LIMIT 5
    `);
    
    medicionesConIndicadores.rows.forEach(row => {
      const cumple = row.valor >= row.meta ? '✅' : '❌';
      const porcentaje = ((row.valor / row.meta) * 100).toFixed(1);
      console.log(`\n  ${cumple} ${row.indicador_nombre}`);
      console.log(`     Valor: ${row.valor} | Meta: ${row.meta} (${porcentaje}% del objetivo)`);
      console.log(`     Fecha: ${row.fecha_medicion} | Frecuencia: ${row.frecuencia_medicion}`);
      console.log(`     Responsable: ${row.responsable}`);
      console.log(`     Observaciones: ${row.observaciones}`);
    });
    
    console.log('\n🎉 ¡Sistema de mediciones configurado exitosamente!');
    console.log('🔗 Las mediciones están relacionadas con los indicadores');
    console.log('📊 Puedes ver los datos en la interfaz web en /mediciones');
    
  } catch (error) {
    console.error('❌ Error configurando sistema:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Ejecutar configuración
console.log('🔧 Iniciando configuración completa...');
setupCompleteSystem(); 