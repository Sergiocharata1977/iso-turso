import { createApiClient } from './apiService';

const authApiClient = createApiClient('/auth');

export const authService = {
  /**
   * Registra una nueva organización y su usuario administrador.
   * @param {object} data - Datos de registro.
   * @param {string} data.organizationName - Nombre de la nueva organización.
   * @param {string} data.userName - Nombre del usuario administrador.
   * @param {string} data.userEmail - Email del usuario administrador.
   * @param {string} data.userPassword - Contraseña del usuario administrador.
   * @returns {Promise<object>} Respuesta de la API.
   */
  register(data) {
    return authApiClient.post('/register', data);
  },

  /**
   * Inicia sesión de un usuario.
   * @param {object} credentials - Credenciales de inicio de sesión.
   * @param {string} credentials.email - Email del usuario.
   * @param {string} credentials.password - Contraseña del usuario.
   * @returns {Promise<object>} Respuesta de la API, incluyendo el token y los datos del usuario.
   */
  login(credentials) {
    return authApiClient.post('/login', credentials);
  },

  // Aquí se podrían añadir más funciones en el futuro, como logout, forgotPassword, etc.
};
