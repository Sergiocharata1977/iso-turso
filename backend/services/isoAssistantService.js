import OpenAI from 'openai';
import 'dotenv/config';

class IsoAssistantService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // Usar gpt-4o (modelo actual) en lugar de gpt-4-turbo (obsoleto)
    this.model = process.env.OPENAI_MODEL || 'gpt-4o';
    
    // Sistema de conversaciones para mantener contexto
    this.conversations = new Map();
  }

  /**
   * Generar un ID único para una nueva conversación
   */
  createConversation() {
    const conversationId = Date.now().toString();
    this.conversations.set(conversationId, {
      messages: [
        {
          role: 'system',
          content: `Eres un asistente especializado en sistemas de gestión de calidad ISO 9001:2015. 
          Tu objetivo es ayudar a interpretar y aplicar la norma, respondiendo preguntas técnicas 
          y ofreciendo orientación práctica para la implementación y mejora de sistemas de gestión.
          
          Tienes conocimiento experto sobre:
          - Requisitos y cláusulas de ISO 9001:2015
          - Interpretación y aplicación de los requisitos
          - Procedimientos de auditoría
          - Mejores prácticas para implementación
          - Documentación requerida
          - Gestión de no conformidades
          - Análisis de riesgos y oportunidades
          
          Responde siempre de manera clara, precisa y orientada a la práctica. Si no conoces algún detalle específico,
          indícalo claramente y ofrece recursos para ampliar la información.
          
          Cuando sea apropiado, estructura tus respuestas usando listas, viñetas o secciones para 
          facilitar la comprensión. Si te preguntan sobre otras normas ISO relacionadas con calidad
          (como ISO 19011, ISO 14001, etc.), puedes proporcionar información general y conexiones con ISO 9001.`
        }
      ],
      lastActivity: Date.now()
    });
    return conversationId;
  }

  /**
   * Obtener una conversación existente por su ID
   */
  getConversation(conversationId) {
    return this.conversations.get(conversationId);
  }

  /**
   * Limpiar conversaciones inactivas (más de 24 horas sin actividad)
   */
  cleanupConversations() {
    const now = Date.now();
    const expiryTime = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    
    for (const [id, conversation] of this.conversations.entries()) {
      if (now - conversation.lastActivity > expiryTime) {
        this.conversations.delete(id);
      }
    }
  }

  /**
   * Procesar una consulta del usuario y obtener respuesta
   */
  async processQuery(conversationId, userMessage) {
    let conversation = this.getConversation(conversationId);
    
    // Si no existe la conversación, crear una nueva
    if (!conversation) {
      conversationId = this.createConversation();
      conversation = this.getConversation(conversationId);
    }
    
    // Añadir mensaje del usuario a la conversación
    conversation.messages.push({
      role: 'user',
      content: userMessage
    });
    
    try {
      // Llamar a la API de OpenAI
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: conversation.messages,
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      // Extraer la respuesta
      const assistantMessage = response.choices[0].message;
      
      // Añadir respuesta a la conversación
      conversation.messages.push(assistantMessage);
      
      // Actualizar timestamp de actividad
      conversation.lastActivity = Date.now();
      
      return {
        conversationId,
        message: assistantMessage.content
      };
    } catch (error) {
      console.error('Error al procesar consulta con OpenAI:', error);
      throw new Error(`Error al procesar tu consulta: ${error.message}`);
    }
  }
}

// Exportar una instancia única del servicio
const isoAssistantService = new IsoAssistantService();
export default isoAssistantService;
