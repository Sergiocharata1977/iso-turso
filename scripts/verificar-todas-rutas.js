import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3002/api';

const rutas = [
  { nombre: 'Documentos', path: '/documentos' },
  { nombre: 'Normas', path: '/normas' },
  { nombre: 'Procesos', path: '/procesos' },
  { nombre: 'Capacitaciones', path: '/capacitaciones' },
  { nombre: 'Evaluaciones', path: '/evaluaciones' },
  { nombre: 'Mediciones', path: '/mediciones' },
  { nombre: 'Auditorías', path: '/auditorias' },
  { nombre: 'Objetivos de Calidad', path: '/objetivos-calidad' },
  { nombre: 'Mejoras', path: '/mejoras' },
  { nombre: 'Personal', path: '/personal' },
  { nombre: 'Puestos', path: '/puestos' },
  { nombre: 'Departamentos', path: '/departamentos' },
  { nombre: 'Indicadores', path: '/indicadores' }
];

async function verificarRuta(ruta) {
  console.log(`Probando GET ${ruta.path}...`);
  try {
    const response = await fetch(`${API_BASE_URL}${ruta.path}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${ruta.nombre}: OK (${response.status})`);
      console.log(`   Elementos devueltos: ${Array.isArray(data) ? data.length : 'Objeto único'}`);
      return { ok: true, status: response.status };
    } else {
      console.log(`❌ ${ruta.nombre}: Error HTTP: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Detalles del error: ${errorText}`);
      return { ok: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.log(`❌ ${ruta.nombre}: Error de conexión: ${error.message}`);
    return { ok: false, error: error.message };
  }
}

async function verificarTodasLasRutas() {
  console.log('=== VERIFICACIÓN DE TODAS LAS RUTAS API ===\n');
  
  const resultados = [];
  
  for (const ruta of rutas) {
    const resultado = await verificarRuta(ruta);
    resultados.push({ ...ruta, resultado });
    console.log(''); // Línea en blanco para separar resultados
  }
  
  // Resumen final
  console.log('\n=== RESUMEN DE VERIFICACIÓN ===');
  
  const exitosas = resultados.filter(r => r.resultado.ok).length;
  const fallidas = resultados.length - exitosas;
  
  console.log(`✅ Rutas funcionando correctamente: ${exitosas}/${resultados.length}`);
  
  if (fallidas > 0) {
    console.log(`❌ Rutas con errores: ${fallidas}`);
    resultados.filter(r => !r.resultado.ok).forEach(r => {
      console.log(`   - ${r.nombre} (${r.path}): ${r.resultado.status || r.resultado.error}`);
    });
  } else {
    console.log('🎉 ¡Todas las rutas están funcionando correctamente!');
  }
}

verificarTodasLasRutas();
