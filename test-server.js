import express from 'express';

const app = express();
const PORT = 9999; // Usamos un puerto diferente para evitar conflictos

app.get('/', (req, res) => {
  res.send('Servidor de prueba funcionando!');
});

app.listen(PORT, () => {
  console.log(`[TEST-SERVER] Servidor de prueba escuchando en http://localhost:${PORT}`);
  console.log('[TEST-SERVER] Este servidor debería quedarse corriendo. Si este proceso termina, hay un problema en el entorno.');
});
