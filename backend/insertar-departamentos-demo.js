import { tursoClient } from './lib/tursoClient.js';
import { randomUUID } from 'crypto';

async function insertarDepartamentosDemo() {
  const organizationId = 21; // Cambia este valor si tu organización es otra
  const departamentos = [
    {
      nombre: 'Comercial Insumos',
      descripcion: 'Venta de semillas, fertilizantes y agroquímicos a productores rurales.'
    },
    {
      nombre: 'Logística y Distribución',
      descripcion: 'Gestión de almacenes y entrega de insumos a campo.'
    },
    {
      nombre: 'Compras de Cereales',
      descripcion: 'Compra de granos y cereales a productores durante la cosecha.'
    },
    {
      nombre: 'Administración y Finanzas',
      descripcion: 'Facturación, pagos, cobranzas y gestión financiera de la empresa.'
    },
    {
      nombre: 'Servicio Técnico y Postventa',
      descripcion: 'Asesoramiento técnico y soporte postventa a clientes agropecuarios.'
    }
  ];

  for (const depto of departamentos) {
    const id = randomUUID();
    await tursoClient.execute({
      sql: `INSERT INTO departamentos (id, nombre, descripcion, responsable_id, organization_id)
             VALUES (?, ?, ?, ?, ?)` ,
      args: [id, depto.nombre, depto.descripcion, null, organizationId]
    });
    console.log(`✅ Departamento insertado: ${depto.nombre}`);
  }

  console.log('\n🎉 Departamentos de ejemplo insertados correctamente.');
}

insertarDepartamentosDemo(); 