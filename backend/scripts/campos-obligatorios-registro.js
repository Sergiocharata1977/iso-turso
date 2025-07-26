const { tursoClient } = require('../config/database');

/**
 * 📋 CAMPOS OBLIGATORIOS POR REGISTRO
 * Script para listar todos los campos obligatorios de cada entidad del sistema
 */

// Colores para consola
const COLORES = {
  TITULO: '\x1b[36m%s\x1b[0m',     // Cyan
  ENTIDAD: '\x1b[33m%s\x1b[0m',    // Amarillo
  CAMPO: '\x1b[32m%s\x1b[0m',      // Verde
  VALOR: '\x1b[37m%s\x1b[0m',      // Blanco
  ERROR: '\x1b[31m%s\x1b[0m',      // Rojo
  EXITO: '\x1b[92m%s\x1b[0m'       // Verde claro
};

async function analizarCamposObligatorios() {
  console.log(COLORES.TITULO, '\n📋 ANÁLISIS DE CAMPOS OBLIGATORIOS POR REGISTRO\n');

  const entidades = [
    'puestos',
    'personal', 
    'departamentos',
    'procesos',
    'auditorias',
    'capacitaciones',
    'indicadores',
    'objetivos_calidad',
    'documentos',
    'normas',
    'usuarios'
  ];

  for (const tabla of entidades) {
    console.log(COLORES.ENTIDAD, `\n🏷️  ENTIDAD: ${tabla.toUpperCase()}`);
    console.log('─'.repeat(50));

    try {
      // 1. Obtener estructura de la tabla
      const schema = await tursoClient.execute({
        sql: `PRAGMA table_info(${tabla})`
      });

      if (schema.rows.length === 0) {
        console.log(COLORES.ERROR, `   ❌ Tabla '${tabla}' no encontrada`);
        continue;
      }

      // 2. Filtrar campos NOT NULL
      const camposObligatorios = schema.rows.filter(col => 
        col.notnull === 1 && col.name !== 'id'
      );

      console.log(COLORES.EXITO, `   📊 CAMPOS OBLIGATORIOS (NOT NULL):`);
      
      if (camposObligatorios.length === 0) {
        console.log('      ✨ No hay campos obligatorios (excepto ID)');
      } else {
        camposObligatorios.forEach(campo => {
          const defaultValue = campo.dflt_value ? ` [DEFAULT: ${campo.dflt_value}]` : '';
          console.log(COLORES.CAMPO, `      ✅ ${campo.name}`, COLORES.VALOR, `(${campo.type})${defaultValue}`);
        });
      }

      // 3. Verificar validaciones en código
      console.log('   🔍 VALIDACIONES EN CÓDIGO:');
      const validacionesCodigo = await obtenerValidacionesCodigo(tabla);
      
      if (validacionesCodigo.length === 0) {
        console.log('      ⚪ No se encontraron validaciones adicionales');
      } else {
        validacionesCodigo.forEach(validacion => {
          console.log(COLORES.CAMPO, `      🔒 ${validacion}`);
        });
      }

      // 4. Mostrar campos únicos
      const camposUnicos = schema.rows.filter(col => 
        col.name.includes('UNIQUE') || col.pk === 1
      );

      if (camposUnicos.length > 1) { // Más que solo ID
        console.log('   🔑 CAMPOS ÚNICOS:');
        camposUnicos.forEach(campo => {
          if (campo.name !== 'id') {
            console.log(COLORES.CAMPO, `      🔐 ${campo.name}`, COLORES.VALOR, `(${campo.type})`);
          }
        });
      }

    } catch (error) {
      console.log(COLORES.ERROR, `   ❌ Error analizando ${tabla}: ${error.message}`);
    }
  }

  // 5. Resumen final
  console.log(COLORES.TITULO, '\n📈 RESUMEN DE VALIDACIONES ENCONTRADAS EN CÓDIGO:');
  console.log('─'.repeat(60));
  
  const validacionesEncontradas = {
    'puestos': ['nombre (obligatorio)', 'organization_id (automático)'],
    'procesos': ['nombre (obligatorio)', 'codigo (requerido en algunas rutas)'],
    'indicadores': ['nombre (obligatorio)'],
    'capacitaciones': ['titulo (obligatorio en algunos casos)'],
    'mejoras': ['estado (obligatorio)']
  };

  Object.entries(validacionesEncontradas).forEach(([entidad, validaciones]) => {
    console.log(COLORES.ENTIDAD, `\n${entidad.toUpperCase()}:`);
    validaciones.forEach(validacion => {
      console.log(COLORES.CAMPO, `  ✅ ${validacion}`);
    });
  });

  console.log(COLORES.TITULO, '\n✅ Análisis completado');
}

/**
 * Función auxiliar para obtener validaciones en código
 */
async function obtenerValidacionesCodigo(tabla) {
  const validaciones = [];
  
  // Mapear validaciones conocidas por tabla
  const validacionesConocidas = {
    'puestos': ['nombre es obligatorio'],
    'procesos': ['nombre es obligatorio'],
    'indicadores': ['nombre es obligatorio'],
    'capacitaciones': ['titulo es obligatorio (en algunos casos)'],
    'mejoras': ['estado es obligatorio'],
    'usuarios': ['email único', 'username único', 'password obligatorio'],
    'personal': ['sin validaciones explícitas encontradas'],
    'departamentos': ['sin validaciones explícitas encontradas']
  };

  return validacionesConocidas[tabla] || [];
}

// Ejecutar si se llama directamente
if (require.main === module) {
  analizarCamposObligatorios()
    .then(() => {
      console.log('\n🎯 Para agregar más validaciones, editar las rutas en backend/routes/[entidad].routes.js');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { analizarCamposObligatorios };
