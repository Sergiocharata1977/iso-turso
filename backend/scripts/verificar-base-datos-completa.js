import { tursoClient } from '../lib/tursoClient.js';

// Configuración de colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Lista de todas las tablas principales del sistema
const TABLAS_SISTEMA = [
  'usuarios', 'personal', 'departamentos', 'puestos',
  'procesos', 'documentos', 'normas', 'auditorias',
  'objetivos_calidad', 'mediciones', 'acciones', 'hallazgos',
  'capacitaciones', 'evaluaciones', 'relaciones_sgc',
  'messages', 'message_recipients', 'message_tags'
];

async function verificarBaseDatosCompleta(organizationId = '2', continuo = false) {
  try {
    console.log(`${colors.cyan}${colors.bright}🗄️  VERIFICACIÓN COMPLETA DE BASE DE DATOS${colors.reset}`);
    console.log(`${colors.blue}📅 Fecha: ${new Date().toLocaleString('es-ES')}${colors.reset}`);
    console.log(`${colors.blue}🏢 Organización ID: ${organizationId}${colors.reset}`);
    console.log(''.padEnd(60, '='));

    const resumenTablas = {};
    
    // 1. Verificar todas las tablas principales
    for (const tabla of TABLAS_SISTEMA) {
      try {
        console.log(`\n${colors.yellow}📊 Verificando tabla: ${tabla}${colors.reset}`);
        
        // Verificar si la tabla existe
        const existeTabla = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
          args: [tabla]
        });

        if (existeTabla.rows.length === 0) {
          console.log(`   ${colors.red}❌ Tabla '${tabla}' no existe${colors.reset}`);
          resumenTablas[tabla] = { existe: false, registros: 0 };
          continue;
        }

        // Contar registros totales
        const totalResult = await tursoClient.execute({
          sql: `SELECT COUNT(*) as total FROM ${tabla}`
        });
        const totalRegistros = totalResult.rows[0]?.total || 0;

        // Contar registros de la organización (si tiene organization_id)
        let registrosOrg = 0;
        try {
          const orgResult = await tursoClient.execute({
            sql: `SELECT COUNT(*) as total FROM ${tabla} WHERE organization_id = ?`,
            args: [organizationId]
          });
          registrosOrg = orgResult.rows[0]?.total || 0;
        } catch (error) {
          // La tabla no tiene organization_id, usar total
          registrosOrg = totalRegistros;
        }

        console.log(`   ${colors.green}✅ Registros totales: ${totalRegistros}${colors.reset}`);
        console.log(`   ${colors.blue}🏢 Registros org ${organizationId}: ${registrosOrg}${colors.reset}`);

        // Guardar resumen
        resumenTablas[tabla] = {
          existe: true,
          registros: totalRegistros,
          registrosOrg: registrosOrg
        };

        // Obtener estructura de la tabla
        const estructura = await tursoClient.execute({
          sql: `PRAGMA table_info(${tabla})`
        });

        console.log(`   ${colors.cyan}📋 Campos (${estructura.rows.length}):${colors.reset}`);
        estructura.rows.forEach(campo => {
          const tipoColor = campo.type.includes('TEXT') ? colors.yellow : 
                           campo.type.includes('INTEGER') ? colors.blue : 
                           campo.type.includes('DATETIME') ? colors.magenta : colors.reset;
          console.log(`      ${tipoColor}- ${campo.name} (${campo.type})${colors.reset}`);
        });

        // Mostrar algunos registros de ejemplo si existen
        if (registrosOrg > 0) {
          try {
            const ejemplosResult = await tursoClient.execute({
              sql: `SELECT * FROM ${tabla} WHERE organization_id = ? LIMIT 3`,
              args: [organizationId]
            });
            
            if (ejemplosResult.rows.length > 0) {
              console.log(`   ${colors.green}📄 Ejemplos:${colors.reset}`);
              ejemplosResult.rows.forEach((registro, index) => {
                const id = registro.id || registro.codigo || `Reg${index+1}`;
                const nombre = registro.nombre || registro.titulo || registro.descripcion || registro.email || 'Sin nombre';
                console.log(`      ${index + 1}. ${id} - ${nombre.toString().substring(0, 40)}...`);
              });
            }
          } catch (error) {
            // Tabla sin organization_id, mostrar ejemplos generales
            const ejemplosResult = await tursoClient.execute({
              sql: `SELECT * FROM ${tabla} LIMIT 3`
            });
            
            if (ejemplosResult.rows.length > 0) {
              console.log(`   ${colors.green}📄 Ejemplos:${colors.reset}`);
              ejemplosResult.rows.forEach((registro, index) => {
                const id = registro.id || registro.codigo || `Reg${index+1}`;
                const nombre = registro.nombre || registro.titulo || registro.descripcion || registro.email || 'Sin nombre';
                console.log(`      ${index + 1}. ${id} - ${nombre.toString().substring(0, 40)}...`);
              });
            }
          }
        }

      } catch (error) {
        console.log(`   ${colors.red}❌ Error verificando '${tabla}': ${error.message}${colors.reset}`);
        resumenTablas[tabla] = { existe: false, registros: 0, error: error.message };
      }
    }

    // 2. Verificar relaciones críticas
    console.log(`\n${colors.bright}${colors.cyan}🔗 VERIFICACIÓN DE RELACIONES${colors.reset}`);
    
    try {
      const relacionesResult = await tursoClient.execute({
        sql: `SELECT origen_tipo, destino_tipo, COUNT(*) as cantidad 
              FROM relaciones_sgc 
              WHERE organization_id = ? 
              GROUP BY origen_tipo, destino_tipo 
              ORDER BY cantidad DESC`,
        args: [organizationId]
      });

      console.log(`   ${colors.green}✅ Tipos de relaciones encontradas:${colors.reset}`);
      relacionesResult.rows.forEach(relacion => {
        console.log(`      ${relacion.origen_tipo} → ${relacion.destino_tipo}: ${relacion.cantidad} relaciones`);
      });
    } catch (error) {
      console.log(`   ${colors.red}❌ Error verificando relaciones: ${error.message}${colors.reset}`);
    }

    // 3. Resumen ejecutivo
    console.log(`\n${colors.bright}${colors.green}📊 RESUMEN EJECUTIVO${colors.reset}`);
    console.log(''.padEnd(60, '='));
    
    const tablasExistentes = Object.values(resumenTablas).filter(t => t.existe).length;
    const totalRegistros = Object.values(resumenTablas).reduce((sum, t) => sum + (t.registros || 0), 0);
    const totalRegistrosOrg = Object.values(resumenTablas).reduce((sum, t) => sum + (t.registrosOrg || 0), 0);

    console.log(`${colors.blue}📋 Tablas verificadas: ${TABLAS_SISTEMA.length}${colors.reset}`);
    console.log(`${colors.green}✅ Tablas existentes: ${tablasExistentes}${colors.reset}`);
    console.log(`${colors.red}❌ Tablas faltantes: ${TABLAS_SISTEMA.length - tablasExistentes}${colors.reset}`);
    console.log(`${colors.yellow}📊 Total registros: ${totalRegistros}${colors.reset}`);
    console.log(`${colors.cyan}🏢 Registros org ${organizationId}: ${totalRegistrosOrg}${colors.reset}`);

    // Mostrar tablas con más datos
    console.log(`\n${colors.bright}🏆 TOP 5 TABLAS CON MÁS DATOS:${colors.reset}`);
    const tablasOrdenadas = Object.entries(resumenTablas)
      .filter(([_, data]) => data.existe && data.registrosOrg > 0)
      .sort(([_, a], [__, b]) => (b.registrosOrg || 0) - (a.registrosOrg || 0))
      .slice(0, 5);

    tablasOrdenadas.forEach(([tabla, data], index) => {
      console.log(`   ${index + 1}. ${tabla}: ${data.registrosOrg} registros`);
    });

    // Mostrar tablas vacías
    const tablasVacias = Object.entries(resumenTablas)
      .filter(([_, data]) => data.existe && (data.registrosOrg || 0) === 0)
      .map(([tabla, _]) => tabla);

    if (tablasVacias.length > 0) {
      console.log(`\n${colors.yellow}⚠️  TABLAS VACÍAS:${colors.reset}`);
      tablasVacias.forEach(tabla => {
        console.log(`   - ${tabla}`);
      });
    }

    console.log(`\n${colors.green}${colors.bright}🎉 Verificación completada exitosamente!${colors.reset}`);
    
    if (continuo) {
      console.log(`\n${colors.blue}🔄 Esperando 30 segundos para próxima verificación...${colors.reset}`);
      setTimeout(() => verificarBaseDatosCompleta(organizationId, true), 30000);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Error durante la verificación completa:${colors.reset}`, error);
    
    if (continuo) {
      console.log(`\n${colors.yellow}🔄 Reintentando en 60 segundos...${colors.reset}`);
      setTimeout(() => verificarBaseDatosCompleta(organizationId, true), 60000);
    }
  }
}

// Función para ejecutar verificación con parámetros
async function main() {
  const args = process.argv.slice(2);
  const organizationId = args[0] || '2';
  const continuo = args.includes('--continuo') || args.includes('-c');
  
  console.log(`${colors.cyan}🚀 Iniciando verificación de base de datos...${colors.reset}`);
  
  if (continuo) {
    console.log(`${colors.yellow}⚡ Modo continuo activado (cada 30 segundos)${colors.reset}`);
    console.log(`${colors.blue}💡 Presiona Ctrl+C para detener${colors.reset}`);
  }
  
  await verificarBaseDatosCompleta(organizationId, continuo);
}

// Manejo de señales para salida limpia
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}👋 Deteniendo verificación continua...${colors.reset}`);
  process.exit(0);
});

main();
