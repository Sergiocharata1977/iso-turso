import { tursoClient } from '../lib/tursoClient.js';

const productosDePrueba = [
  {
    nombre: 'Software de Gestión ISO 9001',
    descripcion: 'Plataforma integral para la gestión de sistemas de calidad basados en la norma ISO 9001.',
    codigo: 'ISO-SFT-001',
    estado: 'En Desarrollo'
  },
  {
    nombre: 'Servicio de Consultoría para Certificación',
    descripcion: 'Asesoramiento y acompañamiento para empresas que buscan la certificación ISO 9001.',
    codigo: 'ISO-CSV-001',
    estado: 'Aprobado'
  },
  {
    nombre: 'Curso de Auditor Interno',
    descripcion: 'Capacitación completa para la formación de auditores internos del SGC.',
    codigo: 'ISO-CAP-001',
    estado: 'Rechazado'
  }
];

async function seedProductos() {
  console.log('Iniciando la inserción de datos de prueba para productos...');

  if (!tursoClient) {
    console.error('Error: El cliente de Turso no está inicializado.');
    return;
  }

  try {
    // Limpiar la tabla antes de insertar para evitar duplicados en ejecuciones repetidas
    await tursoClient.execute('DELETE FROM productos;');
    console.log('Tabla `productos` limpiada.');

    // Preparar las sentencias de inserción
    const statements = productosDePrueba.map(p => ({
      sql: 'INSERT INTO productos (nombre, descripcion, codigo, estado) VALUES (?, ?, ?, ?)',
      args: [p.nombre, p.descripcion, p.codigo, p.estado]
    }));

    // Ejecutar todas las inserciones en un solo batch
    await tursoClient.batch(statements, 'write');

    console.log(`✅ ${productosDePrueba.length} productos de prueba han sido insertados con éxito.`);

  } catch (error) {
    console.error('❌ Error al insertar datos de prueba en la tabla de productos:', error.message);
    if (error.cause) {
      console.error('Causa del error:', error.cause);
    }
  }
}

seedProductos();
