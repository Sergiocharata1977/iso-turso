import { tursoClient } from '../backend/lib/tursoClient.js';
import bcrypt from 'bcrypt';

const createSuperAdmin = async () => {
  try {
    console.log('🚀 Creando Super Administrador inicial...');

    // 1. Crear organización inicial
    console.log('📋 Creando organización inicial...');
    const orgResult = await tursoClient.execute({
      sql: `
        INSERT INTO organizations (name, email, phone, plan, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        RETURNING *
      `,
      args: ['ISOFlow3 Platform', 'admin@isoflow3.com', '+1234567890', 'enterprise']
    });

    const organizationId = orgResult.rows[0].id;
    console.log(`✅ Organización creada con ID: ${organizationId}`);

    // 2. Crear super administrador
    console.log('👑 Creando super administrador...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);

    const userResult = await tursoClient.execute({
      sql: `
        INSERT INTO usuarios (name, email, password_hash, role, organization_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
        RETURNING id, name, email, role, organization_id
      `,
      args: ['Super Administrador', 'admin@isoflow3.com', passwordHash, 'super_admin', organizationId]
    });

    console.log(`✅ Super Administrador creado con ID: ${userResult.rows[0].id}`);

    // 3. Crear features básicas para la organización
    console.log('⚙️ Configurando features básicas...');
    const features = [
      'personal',
      'capacitaciones',
      'procesos',
      'documentos',
      'auditorias',
      'hallazgos',
      'acciones',
      'indicadores',
      'mediciones'
    ];

    for (const feature of features) {
      await tursoClient.execute({
        sql: `
          INSERT OR REPLACE INTO organization_features (organization_id, feature_name, is_enabled, created_at)
          VALUES (?, ?, 1, datetime('now'))
        `,
        args: [organizationId, feature]
      });
    }

    console.log(`✅ ${features.length} features habilitadas`);

    // 4. Mostrar información de acceso
    console.log('\n🎉 ¡Super Administrador creado exitosamente!');
    console.log('==========================================');
    console.log('📧 Email: admin@isoflow3.com');
    console.log('🔑 Contraseña: admin123');
    console.log('👑 Rol: Super Administrador');
    console.log('🏢 Organización: ISOFlow3 Platform');
    console.log('==========================================');
    console.log('\n⚠️ IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error creando super administrador:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createSuperAdmin();
}

export default createSuperAdmin; 