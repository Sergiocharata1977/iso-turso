import ragService from './ragService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Inicializa el asistente ISO y sus servicios dependientes
 */
export async function initializeAssistant() {
  console.log('🤖 Iniciando Asistente ISO...');
  
  try {
    // Verificar directorio de documentos
    const documentsDir = path.join(__dirname, '..', 'documents');
    ensureDirectoryExists(documentsDir);
    
    // Verificar si hay documentos para indexar
    const hasDocuments = fs.readdirSync(documentsDir).length > 0;
    
    if (!hasDocuments) {
      console.log('⚠️ No se encontraron documentos para indexar en el directorio documents/');
      console.log('ℹ️ Creando documento de ejemplo...');
      
      // Crear un documento de ejemplo si no hay documentos
      const sampleDocContent = `# ISO 9001:2015 - Resumen de requisitos principales

## 4. Contexto de la organización
4.1 Comprender la organización y su contexto
4.2 Comprender necesidades y expectativas de partes interesadas
4.3 Determinar el alcance del SGC
4.4 Sistema de gestión de calidad y sus procesos

## 5. Liderazgo
5.1 Liderazgo y compromiso
5.2 Política de calidad
5.3 Roles, responsabilidades y autoridades

## 6. Planificación
6.1 Acciones para abordar riesgos y oportunidades
6.2 Objetivos de calidad y planificación
6.3 Planificación de cambios

## 7. Apoyo
7.1 Recursos
7.2 Competencia
7.3 Toma de conciencia
7.4 Comunicación
7.5 Información documentada

## 8. Operación
8.1 Planificación y control operacional
8.2 Requisitos para productos y servicios
8.3 Diseño y desarrollo
8.4 Control de procesos, productos y servicios externos
8.5 Producción y provisión del servicio
8.6 Liberación de productos y servicios
8.7 Control de salidas no conformes

## 9. Evaluación del desempeño
9.1 Seguimiento, medición, análisis y evaluación
9.2 Auditoría interna
9.3 Revisión por la dirección

## 10. Mejora
10.1 Generalidades
10.2 No conformidad y acción correctiva
10.3 Mejora continua`;

      fs.writeFileSync(path.join(documentsDir, 'iso9001-resumen.md'), sampleDocContent);
      console.log('✅ Documento de ejemplo creado: iso9001-resumen.md');
    }
    
    // Inicializar el servicio RAG
    console.log('⏳ Inicializando servicio RAG e indexando documentos...');
    await ragService.initialize();
    console.log('✅ Servicio RAG inicializado correctamente');
    
    return { success: true, message: 'Asistente ISO inicializado correctamente' };
  } catch (error) {
    console.error('❌ Error al inicializar el asistente ISO:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Asegura que un directorio exista, creándolo si no existe
 * @param {string} dirPath - Ruta del directorio
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Se ha creado el directorio: ${dirPath}`);
  }
}

// Exportamos una función que solo inicializa si se solicita
export default {
  initializeAssistant
};
