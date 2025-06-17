// Script para ejecutar la verificación de integración API
import verificarIntegracion from './verificar-integracion-api.js';

console.log('Iniciando verificación de integración API...');
console.log('Este script verificará la comunicación entre todos los servicios frontend y las APIs backend.');
console.log('Por favor, asegúrate de que el servidor backend esté en ejecución antes de continuar.\n');

// Ejecutar la verificación
verificarIntegracion()
  .then(resultados => {
    console.log('\nResultados de la verificación:');
    console.log(`- Servicios verificados: ${resultados.exitosos + resultados.fallidos}`);
    console.log(`- Servicios funcionando correctamente: ${resultados.exitosos}`);
    console.log(`- Servicios con problemas: ${resultados.fallidos}`);
    
    if (resultados.fallidos === 0) {
      console.log('\n✅ ¡Todos los servicios están correctamente integrados!');
    } else {
      console.log('\n⚠️ Algunos servicios presentan problemas de integración.');
      console.log('Revisa los detalles anteriores para identificar y solucionar los problemas.');
    }
    
    process.exit(resultados.fallidos === 0 ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Error durante la verificación:', error);
    process.exit(1);
  });
