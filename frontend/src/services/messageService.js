import { apiService } from './apiService.js';

const ENDPOINT = '/messages';

export const getMessages = async () => {
  try {
    const response = await apiService.get(ENDPOINT);
    return response || [];
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    throw new Error(`Error al obtener mensajes: ${error.message}`);
  }
};

export const createMessage = async (messageData) => {
  try {
    const response = await apiService.post(ENDPOINT, messageData);
    return response;
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    throw new Error(`Error al crear mensaje: ${error.message}`);
  }
};

// Agrega aquí las otras funciones (getMessageById, markAsRead, deleteMessage) cuando las necesites.
