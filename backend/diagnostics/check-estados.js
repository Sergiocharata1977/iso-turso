import fetch from 'node-fetch';

console.log('🔍 VERIFICANDO ESTADOS DE HALLAZGOS EN LA API...\n');

try {
  const response = await fetch('http://localhost:5000/api/hallazgos');
  const hallazgos = await response.json();
  
  console.log(`📊 Total de hallazgos: ${hallazgos.length}\n`);
  
  // Contar estados
  const estadosCount = {};
  hallazgos.forEach(h => {
    const estado = h.estado || 'sin_estado';
    estadosCount[estado] = (estadosCount[estado] || 0) + 1;
  });
  
  console.log('📋 DISTRIBUCIÓN POR ESTADOS:');
  Object.entries(estadosCount).forEach(([estado, count]) => {
    console.log(`   ${estado}: ${count} hallazgos`);
  });
  
  console.log('\n🔍 PRIMEROS 3 HALLAZGOS DE EJEMPLO:');
  hallazgos.slice(0, 3).forEach((h, i) => {
    console.log(`   ${i+1}. ${h.numeroHallazgo} - Estado: "${h.estado}" - Título: "${h.titulo}"`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
