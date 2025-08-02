import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tursoClient } from './lib/tursoClient.js';

// 🔒 IMPORTAR MIDDLEWARES DE SEGURIDAD
import {
  createRateLimiter,
  corsOptions,
  securityHeaders,
  sanitizeInput,
  requestLogger,
  errorHandler,
  requestSizeLimiter
} from './middleware/security.js';

// 🛡️ IMPORTAR RUTAS
import authRouter from './routes/authRoutes.js';
import personalRouter from './routes/personal.routes.js';
import departamentosRouter from './routes/departamentos.routes.js';
import puestosRouter from './routes/puestos.routes.js';
import capacitacionesRouter from './routes/capacitaciones.js';
import competenciasRouter from './routes/competencias.routes.js';
import evaluacionesRouter from './routes/evaluaciones.js';
import normasRouter from './routes/normas.routes.js';
import documentosRouter from './routes/documentos.js';
import procesosRouter from './routes/procesos.routes.js';
import identificacionProcesosRouter from './routes/identificacion-procesos.routes.js';
import objetivosCalidadRouter from './routes/objetivos-calidad.routes.js';
import indicadoresRouter from './routes/indicadores.routes.js';
import medicionesRouter from './routes/mediciones.routes.js';
import auditoriasRouter from './routes/auditorias.routes.js';
import hallazgosRouter from './routes/hallazgos.js';
import accionesRouter from './routes/acciones.routes.js';
import planesRouter from './routes/planes.js';
import suscripcionesRouter from './routes/suscripciones.js';
import sgcHierarchyRouter from './routes/sgc-hierarchy.routes.js';

// 📊 CONFIGURACIÓN DE ENTORNO
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🚨 SECURITY MIDDLEWARES (CRÍTICO)
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(requestSizeLimiter);
app.use(requestLogger);

// 🛡️ RATE LIMITING POR RUTA
const generalLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 login attempts per 15 minutes
const apiLimiter = createRateLimiter(15 * 60 * 1000, 1000); // 1000 API calls per 15 minutes

app.use(generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// 🔍 INPUT SANITIZATION
app.use(sanitizeInput);

// 📝 PARSING MIDDLEWARE
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🛡️ RUTAS CON SEGURIDAD
app.use('/api/auth', authRouter);
app.use('/api/personal', personalRouter);
app.use('/api/departamentos', departamentosRouter);
app.use('/api/puestos', puestosRouter);
app.use('/api/capacitaciones', capacitacionesRouter);
app.use('/api/competencias', competenciasRouter);
app.use('/api/evaluaciones', evaluacionesRouter);
app.use('/api/normas', normasRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/procesos', procesosRouter);
app.use('/api/identificacion-procesos', identificacionProcesosRouter);
app.use('/api/objetivos-calidad', objetivosCalidadRouter);
app.use('/api/indicadores', indicadoresRouter);
app.use('/api/mediciones', medicionesRouter);
app.use('/api/auditorias', auditoriasRouter);
app.use('/api/hallazgos', hallazgosRouter);
app.use('/api/acciones', accionesRouter);
app.use('/api/planes', planesRouter);
app.use('/api/suscripciones', suscripcionesRouter);
app.use('/api/sgc', sgcHierarchyRouter);

// 🔍 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 🚨 ERROR HANDLER (DEBE SER EL ÚLTIMO)
app.use(errorHandler);

// 🚀 INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛡️ Seguridad habilitada`);
});

export default app;
