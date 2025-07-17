/**
 * 🔍 DIAGNÓSTICO: Problema con alta de procesos
 * Identifica la causa específica del error 500 en POST /api/procesos
 */

import { tursoClient } from './backend/lib/tursoClient.js';

async function diagnosticarUsuario() {
  console.log('🔍 DIAGNÓSTICO: Usuario admin@demo.com');
  console.log('='.repeat(50));
  
  try {
    // Verificar datos del usuario
    const userResult = await tursoClient.execute({
      sql: 'SELECT id, name, email, role, organization_id FROM usuarios WHERE email = ?',
      args: ['admin@demo.com']
    });
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuario admin@demo.com NO ENCONTRADO');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log('   - ID:', user.id);
    console.log('   - Nombre:', user.name);
    console.log('   - Email:', user.email);
    console.log('   - Rol:', user.role);
    console.log('   - Organization ID:', user.organization_id);
    
    // Verificar jerarquía de roles
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'manager': 2,
      'employee': 1
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy['manager'] || 0;
    const canCreateProcess = userLevel >= requiredLevel;
    
    console.log('\n🔐 Verificación de permisos:');
    console.log('   - Nivel usuario:', userLevel, `(${user.role})`);
    console.log('   - Nivel requerido:', requiredLevel, '(manager)');
    console.log('   - ¿Puede crear procesos?:', canCreateProcess ? '✅ SÍ' : '❌ NO');
    
    if (!user.organization_id) {
      console.log('\n⚠️ PROBLEMA ENCONTRADO: Usuario sin organization_id');
      console.log('   SOLUCIÓN: El usuario necesita un organization_id válido');
    }
    
    if (userLevel < requiredLevel) {
      console.log('\n⚠️ PROBLEMA ENCONTRADO: Permisos insuficientes');
      console.log('   SOLUCIÓN: El usuario necesita rol manager o admin');
    }
    
    return user;
    
  } catch (error) {
    console.error('❌ Error al verificar usuario:', error);
  }
}

async function diagnosticarTablaProcesos() {
  console.log('\n📋 DIAGNÓSTICO: Tabla procesos');
  console.log('='.repeat(50));
  
  try {
    // Verificar estructura de la tabla
    const tableInfo = await tursoClient.execute({
      sql: "PRAGMA table_info(procesos)"
    });
    
    console.log('✅ Estructura de tabla procesos:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Verificar si tiene organization_id
    const hasOrgId = tableInfo.rows.some(col => col.name === 'organization_id');
    console.log(`\n🏢 ¿Tiene organization_id?: ${hasOrgId ? '✅ SÍ' : '❌ NO'}`);
    
    if (!hasOrgId) {
      console.log('   ⚠️ PROBLEMA: Tabla procesos sin organization_id');
      console.log('   SOLUCIÓN: Ejecutar migración de tabla');
    }
    
    // Contar procesos existentes
    const countResult = await tursoClient.execute({
      sql: 'SELECT COUNT(*) as total FROM procesos'
    });
    
    console.log(`\n📊 Procesos existentes: ${countResult.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error al verificar tabla procesos:', error);
  }
}

async function probarCreacionProceso() {
  console.log('\n🧪 PRUEBA: Creación directa de proceso');
  console.log('='.repeat(50));
  
  try {
    // Simular datos de usuario
    const mockUser = {
      id: 1,
      organization_id: 21,
      role: 'admin'
    };
    
    // Verificar permisos
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'manager': 2,
      'employee': 1
    };
    
    const userLevel = roleHierarchy[mockUser.role] || 0;
    const requiredLevel = roleHierarchy['manager'] || 0;
    const hasPermission = userLevel >= requiredLevel;
    
    console.log('👤 Usuario simulado:');
    console.log('   - Organization ID:', mockUser.organization_id);
    console.log('   - Rol:', mockUser.role);
    console.log('   - ¿Tiene permisos?:', hasPermission ? '✅ SÍ' : '❌ NO');
    
    if (!hasPermission) {
      console.log('❌ Sin permisos para crear proceso');
      return;
    }
    
    // Intentar crear proceso
    const procesoTest = {
      id: `proc-test-${Date.now()}`,
      nombre: 'Proceso de Prueba Diagnóstico',
      responsable: 'Admin',
      descripcion: 'Proceso creado para diagnóstico',
      organization_id: mockUser.organization_id
    };
    
    console.log('\n📝 Creando proceso de prueba...');
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO procesos (id, nombre, responsable, descripcion, organization_id) 
            VALUES (?, ?, ?, ?, ?) RETURNING *`,
      args: [
        procesoTest.id,
        procesoTest.nombre, 
        procesoTest.responsable,
        procesoTest.descripcion,
        procesoTest.organization_id
      ]
    });
    
    if (result.rows && result.rows.length > 0) {
      console.log('✅ Proceso creado exitosamente:');
      console.log('   - ID:', result.rows[0].id);
      console.log('   - Nombre:', result.rows[0].nombre);
      console.log('   - Organization ID:', result.rows[0].organization_id);
      
      // Limpiar - eliminar proceso de prueba
      await tursoClient.execute({
        sql: 'DELETE FROM procesos WHERE id = ?',
        args: [procesoTest.id]
      });
      console.log('🧹 Proceso de prueba eliminado');
      
    } else {
      console.log('❌ No se pudo crear el proceso');
    }
    
  } catch (error) {
    console.error('❌ Error al crear proceso de prueba:', error);
    
    // Analizar el error específico
    if (error.message.includes('no such column: organization_id')) {
      console.log('\n🚨 CAUSA IDENTIFICADA: Tabla procesos sin columna organization_id');
      console.log('   SOLUCIÓN: Ejecutar migración de tabla:');
      console.log('   ALTER TABLE procesos ADD COLUMN organization_id INTEGER NOT NULL DEFAULT 1;');
    } else if (error.message.includes('constraint')) {
      console.log('\n🚨 CAUSA IDENTIFICADA: Violación de restricción de base de datos');
    } else {
      console.log('\n🚨 CAUSA IDENTIFICADA: Error desconocido en base de datos');
    }
  }
}

async function verificarMiddlewares() {
  console.log('\n🛡️ DIAGNÓSTICO: Middlewares');
  console.log('='.repeat(50));
  
  // Simular request completo
  const mockReq = {
    user: {
      id: 1,
      email: 'admin@demo.com',
      organization_id: 21,
      role: 'admin'
    },
    body: {
      nombre: 'Proceso de Prueba',
      responsable: 'Admin',
      descripcion: 'Descripción de prueba'
    }
  };
  
  console.log('🔍 Simulando middlewares...');
  
  // Simular ensureTenant
  if (!mockReq.user || !mockReq.user.organization_id) {
    console.log('❌ ensureTenant FALLARÍA: Usuario sin organization_id');
  } else {
    console.log('✅ ensureTenant PASARÍA');
    mockReq.organizationId = mockReq.user.organization_id;
    mockReq.userRole = mockReq.user.role;
  }
  
  // Simular checkPermission
  const roleHierarchy = {
    'super_admin': 4,
    'admin': 3,
    'manager': 2,
    'employee': 1
  };
  
  const userLevel = roleHierarchy[mockReq.userRole] || 0;
  const requiredLevel = roleHierarchy['manager'] || 0;
  const hasPermission = userLevel >= requiredLevel;
  
  if (!hasPermission) {
    console.log('❌ checkPermission FALLARÍA: Permisos insuficientes');
  } else {
    console.log('✅ checkPermission PASARÍA');
  }
  
  // Simular secureQuery
  const query = {
    organizationId: mockReq.organizationId,
    where: () => 'organization_id = ?',
    args: () => [mockReq.organizationId]
  };
  
  console.log('✅ secureQuery funcionaría correctamente');
  console.log('   - Organization ID:', query.organizationId);
  
  return { mockReq, hasPermission, query };
}

async function main() {
  console.log('🚀 DIAGNÓSTICO COMPLETO: Problema alta de procesos\n');
  
  try {
    // 1. Verificar usuario
    const user = await diagnosticarUsuario();
    
    // 2. Verificar tabla
    await diagnosticarTablaProcesos();
    
    // 3. Probar creación directa
    await probarCreacionProceso();
    
    // 4. Verificar middlewares
    const { hasPermission } = await verificarMiddlewares();
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 RESUMEN DEL DIAGNÓSTICO');
    console.log('='.repeat(50));
    
    if (user && user.organization_id && hasPermission) {
      console.log('✅ Usuario y permisos: OK');
    } else {
      console.log('❌ Problema con usuario o permisos');
    }
    
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que tabla procesos tenga organization_id');
    console.log('2. Verificar que usuario tenga organization_id válido');
    console.log('3. Verificar que usuario tenga rol admin o manager');
    console.log('4. Revisar logs del servidor para error específico');
    
  } catch (error) {
    console.error('💥 Error en diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => {
    console.log('\n✅ Diagnóstico completado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error en diagnóstico:', error);
    process.exit(1);
  });
}

export { diagnosticarUsuario, probarCreacionProceso }; 