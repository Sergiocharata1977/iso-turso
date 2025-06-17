import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { testConnection } from './lib/tursoClient.js';

const app = express();
const PORT = process.env.PORT || 3002; 

// Middleware
app.use(cors()); 
app.use(express.json()); 



// Rutas de la API
app.get('/', (req, res) => {
  res.send('API de ISOFlow3 funcionando.');
});


import departamentosRouter from './routes/departamentos.routes.js';
import puestosRouter from './routes/puestos.routes.js';
import procesosRouter from './routes/procesos.routes.js';
import documentosRouter from './routes/documentos.routes.js';
import personalRouter from './routes/personal.routes.js';
import objetivosCalidadRouter from './routes/objetivos_calidad.routes.js';
import normasRouter from './routes/normas.routes.js';



// Rutas de la API

app.use('/api/departamentos', departamentosRouter);
app.use('/api/puestos', puestosRouter);
app.use('/api/procesos', procesosRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/personal', personalRouter);
app.use('/api/objetivos-calidad', objetivosCalidadRouter);
app.use('/api/normas', normasRouter);



// Función para iniciar el servidor de forma segura
async function startServer() {
  try {
    // 1. Conectar a la base de datos
    await testConnection();

    // 2. Si la conexión es exitosa, iniciar el servidor
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor backend listo y escuchando en http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor. Error al conectar con la base de datos:', error);
    process.exit(1); // Terminar el proceso si la base de datos no está disponible
  }
}

// Arrancar el servidor
startServer();

// Exportar la aplicación para las pruebas
export default app;
