import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

class DocumentAnalyzerService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Analiza un documento para verificar su cumplimiento con normas ISO
   * @param {string} documentContent - El contenido del documento
   * @param {string} documentName - Nombre del documento
   * @returns {Object} - Resultado del análisis
   */
  async analyzeDocument(documentContent, documentName) {
    try {
      const prompt = `
      Eres un experto auditor en sistemas de gestión de calidad ISO 9001. Analiza el siguiente documento:
      
      Nombre del documento: ${documentName}
      
      Contenido del documento:
      """
      ${documentContent}
      """
      
      Proporciona un análisis detallado con los siguientes elementos:
      
      1. ASPECTOS DESTACADOS: Identifica los puntos principales que aborda el documento.
      
      2. CUMPLIMIENTO ISO 9001: Evalúa si el documento cumple con los requisitos de ISO 9001:2015. 
         Identifica los puntos específicos de la norma que se abordan en el documento.
         
      3. RECOMENDACIONES: Sugiere mejoras específicas para que el documento cumpla mejor con la norma ISO 9001.
      
      Proporciona un análisis estructurado y detallado para cada sección.
      `;

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o", // Actualizado al modelo actual
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });

      const analysisText = completion.choices[0].message.content;
      
      // Procesar el texto para extraer las secciones relevantes
      const highlightsMatch = analysisText.match(/ASPECTOS DESTACADOS:(.*?)(?=CUMPLIMIENTO ISO 9001:|$)/s);
      const complianceMatch = analysisText.match(/CUMPLIMIENTO ISO 9001:(.*?)(?=RECOMENDACIONES:|$)/s);
      const recommendationsMatch = analysisText.match(/RECOMENDACIONES:(.*?)$/s);

      return {
        documentName,
        highlights: highlightsMatch ? highlightsMatch[1].trim() : null,
        compliance: complianceMatch ? complianceMatch[1].trim() : null,
        recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : null,
        fullAnalysis: analysisText,
      };
    } catch (error) {
      console.error('Error al analizar documento:', error);
      throw new Error(`Error al analizar el documento: ${error.message}`);
    }
  }

  /**
   * Guarda un documento temporal para análisis
   * @param {Buffer} fileBuffer - Contenido del archivo
   * @param {string} filename - Nombre del archivo
   * @returns {string} - Ruta del archivo guardado
   */
  async saveTempDocument(fileBuffer, filename) {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filePath = path.join(tempDir, filename);
    await fs.promises.writeFile(filePath, fileBuffer);
    return filePath;
  }

  /**
   * Lee el contenido de un archivo de texto
   * @param {string} filePath - Ruta del archivo
   * @returns {Promise<string>} - Contenido del archivo
   */
  async readTextFile(filePath) {
    try {
      return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      throw error;
    }
  }
}

export default new DocumentAnalyzerService();
