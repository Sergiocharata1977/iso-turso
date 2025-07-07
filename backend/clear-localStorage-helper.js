// Script para limpiar localStorage - Copia y pega en la consola del navegador

console.log('🧹 Limpiando localStorage...');

// Limpiar todos los datos de autenticación
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');

// Limpiar todo el localStorage (opcional - descomenta si quieres limpiar todo)
// localStorage.clear();

console.log('✅ localStorage limpiado. Recarga la página.');

// Recargar la página automáticamente
window.location.reload(); 