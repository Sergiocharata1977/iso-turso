import { tursoClient } from '../lib/tursoClient.js';

async function testPersonalNavigation() {
  try {
    console.log('🧪 Iniciando pruebas de navegación de personal...\n');

    // 1. Verificar datos de personal
    console.log('1️⃣ Verificando datos de personal...');
    const personalResult = await tursoClient.execute({
      sql: `SELECT id, nombres, apellidos, email, organization_id FROM personal WHERE organization_id = ? LIMIT 5`,
      args: ['2']
    });
    
    console.log(`   ✅ Personal encontrado: ${personalResult.rows.length} registros`);
    personalResult.rows.forEach((person, index) => {
      console.log(`   📋 ${index + 1}. ${person.nombres} ${person.apellidos} (ID: ${person.id})`);
    });

    // 2. Verificar datos de puestos
    console.log('\n2️⃣ Verificando datos de puestos...');
    const puestosResult = await tursoClient.execute({
      sql: `SELECT id, nombre, organization_id FROM puestos WHERE organization_id = ? LIMIT 5`,
      args: ['2']
    });
    
    console.log(`   ✅ Puestos encontrados: ${puestosResult.rows.length} registros`);
    puestosResult.rows.forEach((puesto, index) => {
      console.log(`   💼 ${index + 1}. ${puesto.nombre} (ID: ${puesto.id})`);
    });

    // 3. Verificar datos de departamentos
    console.log('\n3️⃣ Verificando datos de departamentos...');
    const departamentosResult = await tursoClient.execute({
      sql: `SELECT id, nombre, organization_id FROM departamentos WHERE organization_id = ? LIMIT 5`,
      args: ['2']
    });
    
    console.log(`   ✅ Departamentos encontrados: ${departamentosResult.rows.length} registros`);
    departamentosResult.rows.forEach((depto, index) => {
      console.log(`   🏢 ${index + 1}. ${depto.nombre} (ID: ${depto.id})`);
    });

    // 4. Verificar relaciones existentes
    console.log('\n4️⃣ Verificando relaciones existentes...');
    const relacionesResult = await tursoClient.execute({
      sql: `SELECT * FROM relaciones_sgc WHERE organization_id = ? LIMIT 10`,
      args: ['2']
    });
    
    console.log(`   ✅ Relaciones encontradas: ${relacionesResult.rows.length} registros`);
    relacionesResult.rows.forEach((relacion, index) => {
      console.log(`   🔗 ${index + 1}. ${relacion.origen_tipo}:${relacion.origen_id} -> ${relacion.destino_tipo}:${relacion.destino_id}`);
    });

    // 5. Verificar estructura de tablas
    console.log('\n5️⃣ Verificando estructura de tablas...');
    
    // Personal
    const personalSchema = await tursoClient.execute({
      sql: `PRAGMA table_info(personal)`
    });
    console.log('   📋 Tabla personal:');
    personalSchema.rows.forEach(col => {
      console.log(`      - ${col.name} (${col.type})`);
    });

    // Puestos
    const puestosSchema = await tursoClient.execute({
      sql: `PRAGMA table_info(puestos)`
    });
    console.log('   💼 Tabla puestos:');
    puestosSchema.rows.forEach(col => {
      console.log(`      - ${col.name} (${col.type})`);
    });

    // Relaciones
    const relacionesSchema = await tursoClient.execute({
      sql: `PRAGMA table_info(relaciones_sgc)`
    });
    console.log('   🔗 Tabla relaciones_sgc:');
    relacionesSchema.rows.forEach(col => {
      console.log(`      - ${col.name} (${col.type})`);
    });

    console.log('\n🎉 Pruebas completadas exitosamente!');
    console.log('\n📝 Resumen:');
    console.log(`   - Personal: ${personalResult.rows.length} registros`);
    console.log(`   - Puestos: ${puestosResult.rows.length} registros`);
    console.log(`   - Departamentos: ${departamentosResult.rows.length} registros`);
    console.log(`   - Relaciones: ${relacionesResult.rows.length} registros`);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

testPersonalNavigation(); 