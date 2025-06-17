// Pruebas de integración para personalService
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Mock apiService and define mockApiService inside the factory
jest.mock('../../services/apiService.js', () => {
  // This internalMockApiService is local to the factory's scope but its methods are persistent jest.fn()
  const internalMockApiService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    // Asegúrate de que todos los métodos de la clase ApiService estén aquí si son llamados por PersonalService
  };
  return {
    __esModule: true,
    default: internalMockApiService,
  };
});

// Import the mocked apiService to access its mocked methods
import apiService from '../../services/apiService.js'; // This will be the mocked version
import * as personalService from '../../services/personalService.js';

describe('PersonalService Integration Tests', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    apiService.get.mockClear();
    apiService.post.mockClear();
    apiService.put.mockClear();
    apiService.delete.mockClear();
  });

  describe('getAllPersonal', () => {
    it('should fetch all personal records', async () => {
      const mockPersonal = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          departamento_id: 1,
          puesto_id: 1,
          departamento_nombre: 'IT',
          puesto_nombre: 'Desarrollador'
        },
        {
          id: 2,
          nombre: 'María López',
          email: 'maria@example.com',
          departamento_id: 2,
          puesto_id: 2,
          departamento_nombre: 'RRHH',
          puesto_nombre: 'Analista'
        }
      ];

      apiService.get.mockResolvedValue(mockPersonal);

      const result = await personalService.getAllPersonal();

      expect(apiService.get).toHaveBeenCalledWith('/personal');
      expect(result).toEqual(mockPersonal);
    });

    it('should handle errors when fetching personal', async () => {
      const error = new Error('Network error');
      apiService.get.mockRejectedValue(error);

      await expect(personalService.getAllPersonal()).rejects.toThrow('Network error');
      expect(apiService.get).toHaveBeenCalledWith('/personal');
    });
  });

  describe('getPersonalById', () => {
    it('should fetch personal by ID', async () => {
      const mockPersonal = {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        departamento_id: 1,
        puesto_id: 1
      };

      apiService.get.mockResolvedValue(mockPersonal);

      const result = await personalService.getPersonalById(1);

      expect(apiService.get).toHaveBeenCalledWith('/personal/1');
      expect(result).toEqual(mockPersonal);
    });

    it('should handle not found errors', async () => {
      const error = new Error('Personal not found');
      apiService.get.mockRejectedValue(error);

      await expect(personalService.getPersonalById(999)).rejects.toThrow('Personal not found');
    });
  });

  describe('createPersonal', () => {
    it('should create new personal record', async () => {
      const newPersonal = {
        nombre: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        departamento_id: 1,
        puesto_id: 1,
        telefono: '123456789',
        estado: 'activo'
      };

      const createdPersonal = { id: 3, ...newPersonal };
      apiService.post.mockResolvedValue(createdPersonal);

      const result = await personalService.createPersonal(newPersonal);

      expect(apiService.post).toHaveBeenCalledWith('/personal', newPersonal);
      expect(result).toEqual(createdPersonal);
    });

    it('should handle validation errors', async () => {
      const invalidPersonal = { nombre: '' }; // Datos inválidos
      const error = new Error('Validation failed');
      apiService.post.mockRejectedValue(error);

      await expect(personalService.createPersonal(invalidPersonal)).rejects.toThrow('Validation failed');
    });
  });

  describe('updatePersonal', () => {
    it('should update personal record', async () => {
      const updateData = {
        nombre: 'Juan Pérez Actualizado',
        email: 'juan.updated@example.com'
      };

      const updatedPersonal = { id: 1, ...updateData };
      apiService.put.mockResolvedValue(updatedPersonal);

      const result = await personalService.updatePersonal(1, updateData);

      expect(apiService.put).toHaveBeenCalledWith('/personal/1', updateData);
      expect(result).toEqual(updatedPersonal);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      apiService.put.mockRejectedValue(error);

      await expect(personalService.updatePersonal(1, {})).rejects.toThrow('Update failed');
    });
  });

  describe('deletePersonal', () => {
    it('should delete personal record', async () => {
      const deleteResponse = { message: 'Personal eliminado correctamente' };
      apiService.delete.mockResolvedValue(deleteResponse);

      const result = await personalService.deletePersonal(1);

      expect(apiService.delete).toHaveBeenCalledWith('/personal/1');
      expect(result).toEqual(deleteResponse);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      apiService.delete.mockRejectedValue(error);

      await expect(personalService.deletePersonal(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('getPersonalConPuesto', () => {
    it('should fetch personal with position info', async () => {
      const mockPersonal = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          departamento_nombre: 'IT',
          puesto_nombre: 'Desarrollador'
        }
      ];

      apiService.get.mockResolvedValue(mockPersonal);

      const result = await personalService.getPersonalConPuesto();

      expect(apiService.get).toHaveBeenCalledWith('/personal');
      expect(result).toEqual(mockPersonal);
    });
  });

  describe('getPersonalByDepartamento', () => {
    it('should filter personal by department', async () => {
      const mockPersonal = [
        { id: 1, nombre: 'Juan', departamento_id: 1 },
        { id: 2, nombre: 'María', departamento_id: 2 },
        { id: 3, nombre: 'Carlos', departamento_id: 1 }
      ];

      apiService.get.mockResolvedValue(mockPersonal);

      const result = await personalService.getPersonalByDepartamento(1);

      expect(result).toHaveLength(2);
      expect(result.every(p => p.departamento_id === 1)).toBe(true);
    });
  });

  describe('getPersonalByPuesto', () => {
    it('should filter personal by position', async () => {
      const mockPersonal = [
        { id: 1, nombre: 'Juan', puesto_id: 1 },
        { id: 2, nombre: 'María', puesto_id: 2 },
        { id: 3, nombre: 'Carlos', puesto_id: 1 }
      ];

      apiService.get.mockResolvedValue(mockPersonal);

      const result = await personalService.getPersonalByPuesto(1);

      expect(result).toHaveLength(2);
      expect(result.every(p => p.puesto_id === 1)).toBe(true);
    });
  });
});
