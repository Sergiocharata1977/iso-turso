import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { testConnection } from './lib/tursoClient.js';
import errorHandler from './middleware/errorHandler.js';
// import setupDatabase from './scripts/setupDatabase.js'; // Comentado temporalmente
import simpleAuth from './middleware/simpleAuth.js';
import competenciasRouter from './routes/competencias.routes.js';
import evalcompeProgramacionRouter from './routes/evalcompeProgramacion.routes.js';
import evalcompeDetalleRouter from './routes/evalcompe-detalle.routes.js';
import evaluacionesRouter from './routes/evaluaciones.routes.js';
import relacionesRouter from './routes/relaciones.routes.js';

// Load environment variables explicitly
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware básico
app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// Rutas de la API
app.get('/', (req, res) => {
  res.send('API de ISOFlow3 funcionando - MODO ULTRA SIMPLE');
});

// Importar rutas
import departamentosRouter from './routes/departamentos.routes.js';
import puestosRouter from './routes/puestos.routes.js';
import procesosRouter from './routes/procesos.routes.js';
import documentosRouter from './routes/documentos.routes.js';
import personalRouter from './routes/personal.routes.js';
import objetivosCalidadRouter from './routes/objetivos_calidad.routes.js';
import normasRouter from './routes/normas.routes.js';
import capacitacionesRouter from './routes/capacitaciones.routes.js';

import indicadoresRouter from './routes/indicadores.routes.js';
import medicionesRouter from './routes/mediciones.routes.js';
import ticketsRouter from './routes/tickets.routes.js';
import productosRouter from './routes/productos.routes.js';
import encuestasRouter from './routes/encuestas.routes.js';
import direccionRoutes from './routes/direccion.routes.js';
import authRoutes from './routes/authRoutes.js';
import hallazgosRouter from './routes/mejoras.routes.js';
import tratamientosRouter from './routes/tratamientos.routes.js';
import verificacionesRouter from './routes/verificaciones.routes.js';
import accionesRouter from './routes/acciones.routes.js';
import userRoutes from './routes/userRoutes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import auditoriasRoutes from './routes/auditorias.routes.js';
// import auditoriaRoutes from './routes/auditorias.routes.js'; // ELIMINADO - Empezando desde cero
import actividadRoutes from './routes/actividad.routes.js';
import minutasRouter from './routes/minutas.routes.js';
import adminRoutes from './routes/admin.routes.js';
import politicaCalidadRouter from './routes/politica-calidad.routes.js';


console.log('🔥 MODO ULTRA SIMPLE: Sin restricciones');

// ===============================================
// RUTAS PÚBLICAS (para login y registro)
// ===============================================
app.use('/api/auth', authRoutes);

// ===============================================
// MIDDLEWARE DE AUTENTICACIÓN
// A partir de aquí, todas las rutas requerirán un token válido
// ===============================================
app.use('/api', simpleAuth);

// ===============================================
// RUTAS PROTEGIDAS
// ===============================================
app.use('/api/minutas', minutasRouter);

app.use('/api/users', userRoutes);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/departamentos', departamentosRouter);
app.use('/api/puestos', puestosRouter);
app.use('/api/personal', personalRouter);
app.use('/api/procesos', procesosRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/normas', normasRouter);
app.use('/api/objetivos-calidad', objetivosCalidadRouter);
app.use('/api/indicadores', indicadoresRouter);
app.use('/api/mediciones', medicionesRouter);
app.use('/api/hallazgos', hallazgosRouter);
app.use('/api/acciones', accionesRouter);
// app.use('/api/auditorias', auditoriaRoutes); // ELIMINADO - Empezando desde cero
app.use('/api/capacitaciones', capacitacionesRouter);

app.use('/api/tickets', ticketsRouter);
app.use('/api/productos', productosRouter);
app.use('/api/encuestas', encuestasRouter);
app.use('/api/tratamientos', tratamientosRouter);
app.use('/api/verificaciones', verificacionesRouter);
app.use('/api/actividad', actividadRoutes);
app.use('/api/competencias', competenciasRouter);
app.use('/api/evaluaciones', evaluacionesRouter);
app.use('/api/relaciones', relacionesRouter);
app.use('/api/evaluacion-programacion', evalcompeProgramacionRouter);
app.use('/api/evaluacion-detalle', evalcompeDetalleRouter);
app.use('/api', direccionRoutes);
app.use('/api/auditorias', auditoriasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/politica-calidad', politicaCalidadRouter);

console.log('✅ TODAS las rutas después de /api/auth están protegidas');

// Middleware de manejo de errores
app.use(errorHandler);

const startServer = () => {
  testConnection()
    // .then(setupDatabase) // Comentado temporalmente
    .then(() => {
      if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
          console.log(`🚀 Servidor ULTRA SIMPLE listo en http://localhost:${PORT}`);
          console.log(`🔓 ACCESO TOTAL: Solo login requerido`);
          console.log(`👀 TODOS ven TODOS los registros`);
        });
      }
    })
    .catch(error => {
      console.error('❌ Error al iniciar servidor:', error);
      process.exit(1);
    });
};

startServer();

export default app;
