import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3002/api';

async function verificarCapacitaciones() {
  console.log('=== VERIFICACIÓN DE API DE CAPACITACIONES ===');
  
  try {
    console.log('Probando GET /api/capacitaciones...');
    const response = await fetch(`${API_BASE_URL}/capacitaciones`);
    
    if (!response.ok) {
      console.log(`❌ Error HTTP: ${response.status}`);
      const errorText = await response.text();
      console.log('Detalles del error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Llamada exitosa');
    console.log(`📊 Recibidos ${data.length} registros`);
    console.log('Primer registro:', JSON.stringify(data[0], null, 2));
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

verificarCapacitaciones();
