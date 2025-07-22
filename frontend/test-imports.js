// Script para verificar imports
console.log('✅ Verificando imports...');

try {
  // Verificar que los archivos existen
  const fs = require('fs');
  const path = require('path');
  
  const files = [
    'src/components/competencias/CompetenciasListing.jsx',
    'src/components/competencias/CompetenciaModal.jsx',
    'src/components/competencias/EvalcompeProgramacionListing.jsx',
    'src/components/competencias/EvalcompeProgramacionModal.jsx',
    'src/services/competenciasService.js',
    'src/services/evalcompeProgramacionService.js'
  ];
  
  files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file} existe`);
    } else {
      console.log(`❌ ${file} NO existe`);
    }
  });
  
  console.log('\n🎉 Verificación completada');
} catch (error) {
  console.error('❌ Error:', error.message);
} 