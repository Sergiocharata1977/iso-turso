import { tursoClient } from './lib/tursoClient.js';

async function checkOrganizations() {
  try {
    console.log('🏢 Verificando organizaciones existentes...');
    
    // Verificar si existe la tabla organizations
    const tables = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'",
      args: []
    });
    
    if (tables.rows.length === 0) {
      console.log('❌ La tabla organizations no existe');
      console.log('💡 Creando tabla organizations...');
      
      // Crear tabla organizations
      await tursoClient.execute({
        sql: `CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        args: []
      });
      
      console.log('✅ Tabla organizations creada');
      
      // Insertar una organización por defecto
      await tursoClient.execute({
        sql: `INSERT INTO organizations (name, slug) VALUES (?, ?)`,
        args: ['Organización Demo', 'demo']
      });
      
      console.log('✅ Organización demo creada');
    }
    
    // Listar organizaciones existentes
    const organizations = await tursoClient.execute({
      sql: 'SELECT * FROM organizations',
      args: []
    });
    
    console.log('\n📋 Organizaciones existentes:');
    if (organizations.rows.length === 0) {
      console.log('❌ No hay organizaciones');
    } else {
      organizations.rows.forEach(org => {
        console.log(`  - ID: ${org.id}, Nombre: ${org.name}, Slug: ${org.slug}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkOrganizations(); 