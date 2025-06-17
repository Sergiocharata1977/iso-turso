// Pruebas de integración para normasService.js
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock apiService and define mockApiService inside the factory
jest.mock('../../services/apiService.js', () => {
  const internalMockApiService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    default: internalMockApiService,
  };
});

// Import the mocked apiService to access its mocked methods
import apiService from '../../services/apiService.js'; // This will be the mocked version
import normasService from '../../services/normasService.js';

const mockNorma = {
  _id: 'norma1',
  codigo: 'N001',
  titulo: 'Norma de Calidad ISO 9001',
  descripcion: 'Estándares para sistemas de gestión de calidad.',
  estado: 'activo',
  responsable: 'Juan Perez',
  fecha_publicacion: '2023-01-15',
  // Otros campos relevantes
};

const mockNormaActualizada = {
  ...mockNorma,
  titulo: 'Norma de Calidad ISO 9001 (Revisión 2024)',
  descripcion: 'Estándares actualizados para sistemas de gestión de calidad.',
};

describe('Integration Tests for normasService', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    apiService.get.mockClear();
    apiService.post.mockClear();
    apiService.put.mockClear();
    apiService.delete.mockClear();
  });

  // Test suite para getAllNormas
  describe('getAllNormas', () => {
    it('should fetch all normas successfully', async () => {
      apiService.get.mockResolvedValue([mockNorma]);
      const normas = await normasService.getAllNormas();
      expect(apiService.get).toHaveBeenCalledWith('/normas');
      expect(normas).toEqual([mockNorma]);
      expect(normas.length).toBe(1);
    });

    it('should handle errors when fetching all normas', async () => {
      apiService.get.mockRejectedValue(new Error('Network Error'));
      // Asumimos que normasService.js formateará el error
      await expect(normasService.getAllNormas()).rejects.toThrow('Error al obtener las normas: Network Error');
      expect(apiService.get).toHaveBeenCalledWith('/normas');
    });
  });

  // Test suite para getNormaById
  describe('getNormaById', () => {
    it('should fetch a norma by ID successfully', async () => {
      apiService.get.mockResolvedValue(mockNorma);
      const norma = await normasService.getNormaById('norma1');
      expect(apiService.get).toHaveBeenCalledWith('/normas/norma1');
      expect(norma).toEqual(mockNorma);
    });

    it('should handle errors when fetching a norma by ID', async () => {
      apiService.get.mockRejectedValue(new Error('Not Found'));
      await expect(normasService.getNormaById('normaInexistente')).rejects.toThrow('Error al obtener la norma normaInexistente: Not Found');
      expect(apiService.get).toHaveBeenCalledWith('/normas/normaInexistente');
    });
  });

  // Test suite para createNorma
  describe('createNorma', () => {
    it('should create a new norma successfully', async () => {
      const nuevaNorma = { codigo: 'N002', titulo: 'Nueva Norma de Seguridad' };
      const normaCreada = { ...nuevaNorma, _id: 'norma2' };
      apiService.post.mockResolvedValue(normaCreada);
      const result = await normasService.createNorma(nuevaNorma);
      expect(apiService.post).toHaveBeenCalledWith('/normas', nuevaNorma);
      expect(result).toEqual(normaCreada);
    });

    it('should handle errors when creating a norma', async () => {
      const nuevaNorma = { codigo: 'N002', titulo: 'Nueva Norma de Seguridad' };
      apiService.post.mockRejectedValue(new Error('Validation Failed'));
      await expect(normasService.createNorma(nuevaNorma)).rejects.toThrow('Error al crear la norma: Validation Failed');
      expect(apiService.post).toHaveBeenCalledWith('/normas', nuevaNorma);
    });
  });

  // Test suite para updateNorma
  describe('updateNorma', () => {
    it('should update a norma successfully', async () => {
      apiService.put.mockResolvedValue(mockNormaActualizada);
      const result = await normasService.updateNorma('norma1', mockNormaActualizada);
      expect(apiService.put).toHaveBeenCalledWith('/normas/norma1', mockNormaActualizada);
      expect(result).toEqual(mockNormaActualizada);
    });

    it('should handle errors when updating a norma', async () => {
      apiService.put.mockRejectedValue(new Error('Update Conflict'));
      await expect(normasService.updateNorma('norma1', mockNormaActualizada)).rejects.toThrow('Error al actualizar la norma norma1: Update Conflict');
      expect(apiService.put).toHaveBeenCalledWith('/normas/norma1', mockNormaActualizada);
    });
  });

  // Test suite para deleteNorma
  describe('deleteNorma', () => {
    it('should delete a norma successfully', async () => {
      apiService.delete.mockResolvedValue({ message: 'Norma eliminada' });
      const result = await normasService.deleteNorma('norma1');
      expect(apiService.delete).toHaveBeenCalledWith('/normas/norma1');
      expect(result).toEqual({ message: 'Norma eliminada' });
    });

    it('should handle errors when deleting a norma', async () => {
      apiService.delete.mockRejectedValue(new Error('Deletion Failed'));
      await expect(normasService.deleteNorma('norma1')).rejects.toThrow('Error al eliminar la norma norma1: Deletion Failed');
      expect(apiService.delete).toHaveBeenCalledWith('/normas/norma1');
    });
  });

});
