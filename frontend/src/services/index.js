// Índice de servicios para exportación centralizada
import auth from './auth.js';
import departamentos from './departamentos.js';
import puestos from './puestos.js';
import { personalService } from './personalService.js';
import auditoriasService from './auditoriasService.js';
import indicadoresService from './indicadoresService.js';
import medicionesService from './medicionesService.js';
import mejorasService from './mejorasService.js';
import { capacitacionesService } from './capacitacionesService.js';
import evaluacionesService from './evaluacionesService.js';
import productosService from './productosService.js';
import encuestasService from './encuestasService.js';
import usuariosService from './usuariosService.js';

import { documentosService } from './documentosService.js';
import normasService from './normasService.js';
import procesosService from './procesosService.js';
import objetivosCalidadService from './objetivosCalidadService.js';

// Exportaciones nombradas para acceso directo
export { 
  auth,
  departamentos,
  puestos,
  personalService,
  auditoriasService,
  indicadoresService,
  medicionesService,
  mejorasService,
  capacitacionesService,
  evaluacionesService,
  productosService,
  encuestasService,
  usuariosService,

  documentosService,
  normasService,
  procesosService,
  objetivosCalidadService
};

// Exportación por defecto
export default {
  auth,
  departamentos,
  puestos,
  personal: personalService,
  auditorias: auditoriasService,
  indicadores: indicadoresService,
  mediciones: medicionesService,
  mejoras: mejorasService,
  capacitaciones: capacitacionesService,
  evaluaciones: evaluacionesService,
  productos: productosService,
  encuestas: encuestasService,
  usuarios: usuariosService,

  documentos: documentosService,
  normas: normasService,
  procesos: procesosService,
  objetivosCalidad: objetivosCalidadService
};
