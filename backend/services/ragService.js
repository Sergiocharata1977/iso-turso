import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Directorio donde se almacenan los documentos
const DOCUMENTS_DIR = path.join(process.cwd(), 'documents');

class RagService {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.vectorStore = null;
    this.initialized = false;
  }

  // Inicializar el servicio: cargar y procesar documentos
  async initialize() {
    try {
      if (this.initialized) return;
      
      console.log("Inicializando el servicio RAG...");
      console.log(`Cargando documentos desde: ${DOCUMENTS_DIR}`);
      
      if (!fs.existsSync(DOCUMENTS_DIR)) {
        console.log("El directorio de documentos no existe. Creándolo...");
        fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
      }

      // Cargar documentos desde el directorio
      const loader = new DirectoryLoader(DOCUMENTS_DIR, {
        ".pdf": (path) => new PDFLoader(path),
        ".txt": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
      });

      const docs = await loader.load();
      console.log(`Documentos cargados: ${docs.length}`);
      
      if (docs.length === 0) {
        console.log("No se encontraron documentos para procesar.");
        return;
      }

      // Dividir los documentos en chunks más pequeños
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await textSplitter.splitDocuments(docs);
      console.log(`Documentos divididos en ${splitDocs.length} chunks`);

      // Crear el almacén de vectores con los documentos usando HNSWLib
      this.vectorStore = await HNSWLib.fromDocuments(
        splitDocs,
        this.embeddings
      );
      
      this.initialized = true;
      console.log("Servicio RAG inicializado correctamente con HNSWLib");
    } catch (error) {
      console.error("Error al inicializar el servicio RAG:", error);
      throw error;
    }
  }

  // Consultar documentos relevantes basados en la consulta del usuario
  async queryDocuments(query, maxResults = 5) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      if (!this.vectorStore || !this.initialized) {
        console.log("No hay documentos disponibles para consultar.");
        return [];
      }

      const results = await this.vectorStore.similaritySearch(query, maxResults);
      return results;
    } catch (error) {
      console.error("Error al consultar documentos:", error);
      return [];
    }
  }

  // Obtener un contexto formateado para enviar a la API de OpenAI
  async getDocumentContext(query) {
    const documents = await this.queryDocuments(query);
    
    if (documents.length === 0) {
      return null;
    }

    // Formatear los documentos como un contexto legible
    const formattedDocs = documents.map((doc, i) => {
      return `Documento ${i + 1} (${doc.metadata.source || 'desconocido'}):\n"${doc.pageContent}"`;
    });

    return formattedDocs.join('\n\n');
  }
}

// Exportar una instancia única del servicio
const ragService = new RagService();
export default ragService;
