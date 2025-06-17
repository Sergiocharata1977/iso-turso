// Pruebas de integración para documentosService.js
import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';

// NO importamos apiService directamente aquí, ya que será completamente mockeado.

// Mock apiService and define mockApiService inside the factory
jest.mock('../../services/apiService', () => {
  const internalMockApiService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    // Asegúrate de que todos los métodos de la clase ApiService estén aquí si son llamados por DocumentosService
  };
  return {
    __esModule: true,
    default: internalMockApiService,
  };
});

// Import the mocked apiService to access its mocked methods
import apiService from '../../services/apiService.js'; // This will be the mocked version
import documentosService from '../../services/documentosService';

const mockDocumento = {
  _id: 'doc1',
  nombre: 'Manual de Calidad',
  codigo: 'MC-001',
  tipo: 'Manual',
  version: '1.0',
  estado: 'Aprobado',
  archivoUrl: 'http://example.com/mc001.pdf',
  fechaCreacion: new Date().toISOString(),
  fechaActualizacion: new Date().toISOString(),
};

const mockDocumentoActualizado = {
  ...mockDocumento,
  nombre: 'Manual de Calidad Actualizado',
  version: '1.1',
};

describe('Integration Tests for documentosService', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    apiService.get.mockClear();
    apiService.post.mockClear();
    apiService.put.mockClear();
    apiService.delete.mockClear();
  });

  describe('getAllDocumentos', () => {
    it('should fetch all documentos successfully', async () => {
      apiService.get.mockResolvedValue([mockDocumento]);
      const documentos = await documentosService.getAllDocumentos();
      expect(apiService.get).toHaveBeenCalledWith('/documentos');
      expect(documentos).toEqual([mockDocumento]);
      expect(documentos.length).toBe(1);
    });

    it('should handle errors when fetching all documentos', async () => {
      apiService.get.mockRejectedValue(new Error('Network Error'));
      await expect(documentosService.getAllDocumentos()).rejects.toThrow('Error al obtener los documentos: Network Error');
      expect(apiService.get).toHaveBeenCalledWith('/documentos');
    });
  });

  describe('getDocumentoById', () => {
    it('should fetch a documento by ID successfully', async () => {
      apiService.get.mockResolvedValue(mockDocumento);
      const documento = await documentosService.getDocumentoById('doc1');
      expect(apiService.get).toHaveBeenCalledWith('/documentos/doc1');
      expect(documento).toEqual(mockDocumento);
    });

    it('should handle errors when fetching a documento by ID', async () => {
      apiService.get.mockRejectedValue(new Error('Not Found'));
      await expect(documentosService.getDocumentoById('doc1')).rejects.toThrow('Error al obtener el documento doc1: Not Found');
      expect(apiService.get).toHaveBeenCalledWith('/documentos/doc1');
    });
  });

  describe('createDocumento', () => {
    it('should create a new documento successfully', async () => {
      const newDocumentoData = { nombre: 'Nuevo Procedimiento', codigo: 'PROC-002' };
      const createdDocumento = { ...newDocumentoData, _id: 'doc2' };
      apiService.post.mockResolvedValue(createdDocumento);
      const result = await documentosService.createDocumento(newDocumentoData);
      expect(apiService.post).toHaveBeenCalledWith('/documentos', newDocumentoData);
      expect(result).toEqual(createdDocumento);
    });

    it('should handle errors when creating a documento', async () => {
      const newDocumentoData = { nombre: 'Nuevo Procedimiento', codigo: 'PROC-002' };
      apiService.post.mockRejectedValue(new Error('Validation Error'));
      await expect(documentosService.createDocumento(newDocumentoData)).rejects.toThrow('Error al crear el documento: Validation Error');
      expect(apiService.post).toHaveBeenCalledWith('/documentos', newDocumentoData);
    });
  });

  describe('updateDocumento', () => {
    it('should update a documento successfully', async () => {
      apiService.put.mockResolvedValue(mockDocumentoActualizado);
      const result = await documentosService.updateDocumento('doc1', mockDocumentoActualizado);
      expect(apiService.put).toHaveBeenCalledWith('/documentos/doc1', mockDocumentoActualizado);
      expect(result).toEqual(mockDocumentoActualizado);
    });

    it('should handle errors when updating a documento', async () => {
      apiService.put.mockRejectedValue(new Error('Update Failed'));
      await expect(documentosService.updateDocumento('doc1', mockDocumentoActualizado)).rejects.toThrow('Error al actualizar el documento doc1: Update Failed');
      expect(apiService.put).toHaveBeenCalledWith('/documentos/doc1', mockDocumentoActualizado);
    });
  });

  describe('deleteDocumento', () => {
    it('should delete a documento successfully', async () => {
      apiService.delete.mockResolvedValue({ message: 'Documento eliminado' });
      const result = await documentosService.deleteDocumento('doc1');
      expect(apiService.delete).toHaveBeenCalledWith('/documentos/doc1');
      expect(result).toEqual({ message: 'Documento eliminado' });
    });

    it('should handle errors when deleting a documento', async () => {
      apiService.delete.mockRejectedValue(new Error('Delete Failed'));
      await expect(documentosService.deleteDocumento('doc1')).rejects.toThrow('Error al eliminar el documento doc1: Delete Failed');
      expect(apiService.delete).toHaveBeenCalledWith('/documentos/doc1');
    });
  });
});
