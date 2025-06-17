// Pruebas de integración para procesosService.js
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

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

import apiService from '../../services/apiService.js';
import procesosService from '../../services/procesosService.js';

const mockProceso = {
  id: 1,
  nombre: 'Gestión de Calidad',
  codigo: 'GC-01',
  version: '1.0',
  responsable: 'Juan Pérez',
  descripcion: 'Proceso encargado de mantener y mejorar el sistema de gestión de calidad.'
};

const mockProcesoActualizado = {
  ...mockProceso,
  nombre: 'Gestión de Calidad (Actualizado)',
  descripcion: 'Descripción actualizada.'
};

describe('Integration Tests for procesosService', () => {
  beforeEach(() => {
    apiService.get.mockClear();
    apiService.post.mockClear();
    apiService.put.mockClear();
    apiService.delete.mockClear();
  });

  describe('getAll', () => {
    it('should fetch all procesos successfully', async () => {
      apiService.get.mockResolvedValue([mockProceso]);
      const procesos = await procesosService.getAll();
      expect(apiService.get).toHaveBeenCalledWith('/procesos');
      expect(procesos).toEqual([mockProceso]);
    });

    it('should handle errors when fetching all procesos', async () => {
      apiService.get.mockRejectedValue(new Error('Network Error'));
      await expect(procesosService.getAll()).rejects.toThrow('Network Error');
    });
  });

  describe('getById', () => {
    it('should fetch a proceso by ID successfully', async () => {
      apiService.get.mockResolvedValue(mockProceso);
      const proceso = await procesosService.getById(1);
      expect(apiService.get).toHaveBeenCalledWith('/procesos/1');
      expect(proceso).toEqual(mockProceso);
    });

    it('should handle errors when fetching a proceso by ID', async () => {
      apiService.get.mockRejectedValue(new Error('Not Found'));
      await expect(procesosService.getById(999)).rejects.toThrow('Not Found');
    });
  });

  describe('create', () => {
    it('should create a new proceso successfully', async () => {
      const nuevoProceso = { nombre: 'Nuevo Proceso', codigo: 'NP-01', version: '1.0', responsable: 'Ana López', descripcion: 'Nuevo proceso de prueba.' };
      const procesoCreado = { ...nuevoProceso, id: 2 };
      apiService.post.mockResolvedValue(procesoCreado);
      const result = await procesosService.create(nuevoProceso);
      expect(apiService.post).toHaveBeenCalledWith('/procesos', nuevoProceso);
      expect(result).toEqual(procesoCreado);
    });

    it('should handle errors when creating a proceso', async () => {
      apiService.post.mockRejectedValue(new Error('Validation Failed'));
      await expect(procesosService.create({})).rejects.toThrow('Validation Failed');
    });
  });

  describe('update', () => {
    it('should update a proceso successfully', async () => {
      apiService.put.mockResolvedValue(mockProcesoActualizado);
      const result = await procesosService.update(1, mockProcesoActualizado);
      expect(apiService.put).toHaveBeenCalledWith('/procesos/1', mockProcesoActualizado);
      expect(result).toEqual(mockProcesoActualizado);
    });

    it('should handle errors when updating a proceso', async () => {
      apiService.put.mockRejectedValue(new Error('Update Failed'));
      await expect(procesosService.update(1, mockProcesoActualizado)).rejects.toThrow('Update Failed');
    });
  });

  describe('delete', () => {
    it('should delete a proceso successfully', async () => {
      apiService.delete.mockResolvedValue({ message: 'Proceso eliminado' });
      const result = await procesosService.delete(1);
      expect(apiService.delete).toHaveBeenCalledWith('/procesos/1');
      expect(result).toEqual({ message: 'Proceso eliminado' });
    });

    it('should handle errors when deleting a proceso', async () => {
      apiService.delete.mockRejectedValue(new Error('Delete Failed'));
      await expect(procesosService.delete(1)).rejects.toThrow('Delete Failed');
    });
  });
});
