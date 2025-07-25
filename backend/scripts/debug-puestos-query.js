import { tursoClient } from '../lib/tursoClient.js';

async function debugPuestosQuery() {
  try {
    console.log('🔍 DEBUG: Verificando consulta de puestos...\n');

    // 1. Verificar puestos con organization_id = 3
    console.log('📊 1. Puestos con organization_id = 3:');
    const puestosOrg3 = await tursoClient.execute({
      sql: 'SELECT id, nombre, organization_id, typeof(organization_id) as tipo FROM puestos WHERE organization_id = 3'
    });
    console.table(puestosOrg3.rows);

    // 2. Verificar puestos con organization_id = "3" (string)
    console.log('\n📊 2. Puestos con organization_id = "3" (string):');
    const puestosOrg3String = await tursoClient.execute({
      sql: 'SELECT id, nombre, organization_id, typeof(organization_id) as tipo FROM puestos WHERE organization_id = "3"'
    });
    console.table(puestosOrg3String.rows);

    // 3. Verificar todos los puestos
    console.log('\n📊 3. Todos los puestos:');
    const todosPuestos = await tursoClient.execute({
      sql: 'SELECT id, nombre, organization_id, typeof(organization_id) as tipo FROM puestos'
    });
    console.table(todosPuestos.rows);

    // 4. Verificar el tipo de dato que viene del usuario
    console.log('\n📊 4. Simulando req.user.organization_id:');
    const userOrgId = 3;
    console.log(`req.user.organization_id = ${userOrgId} (tipo: ${typeof userOrgId})`);

    // 5. Probar la consulta exacta del backend
    console.log('\n📊 5. Consulta exacta del backend:');
    const queryBackend = await tursoClient.execute({
      sql: `SELECT * FROM puestos WHERE organization_id = ? ORDER BY created_at DESC`,
      args: [userOrgId]
    });
    console.log(`Resultado: ${queryBackend.rows.length} registros`);
    console.table(queryBackend.rows);

  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
}

debugPuestosQuery().then(() => {
  console.log('\n🎉 Debug completado');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Error en debug:', error);
  process.exit(1);
}); 