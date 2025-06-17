// Pruebas de integración para objetivosCalidadService.js
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
import objetivosCalidadService from '../../services/objetivosCalidadService.js';

const mockObjetivo = {
  id: 1,
  descripcion: 'Reducir reclamos de clientes',
  meta: 'Menos de 5 reclamos por mes',
  indicador: 'Cantidad de reclamos',
  unidad_medida: 'reclamos',
  valor_esperado: 5,
  responsable_puesto_id: 2,
  proceso_id: 1
};

const mockObjetivoActualizado = {
  ...mockObjetivo,
  descripcion: 'Reducir reclamos de clientes (Actualizado)',
  meta: 'Menos de 3 reclamos por mes'
};

describe('Integration Tests for objetivosCalidadService', () => {
  beforeEach(() => {
    apiService.get.mockClear();
    apiService.post.mockClear();
    apiService.put.mockClear();
    apiService.delete.mockClear();
  });

  describe('getAll', () => {
    it('should fetch all objetivos de calidad successfully', async () => {
      apiService.get.mockResolvedValue([mockObjetivo]);
      const objetivos = await objetivosCalidadService.getAll();
      expect(apiService.get).toHaveBeenCalledWith('/objetivos_calidad');
      expect(objetivos).toEqual([mockObjetivo]);
    });

    it('should handle errors when fetching all objetivos de calidad', async () => {
      apiService.get.mockRejectedValue(new Error('Network Error'));
      await expect(objetivosCalidadService.getAll()).rejects.toThrow('Network Error');
    });
  });

  describe('getById', () => {
    it('should fetch an objetivo de calidad by ID successfully', async () => {
      apiService.get.mockResolvedValue(mockObjetivo);
      const objetivo = await objetivosCalidadService.getById(1);
      expect(apiService.get).toHaveBeenCalledWith('/objetivos_calidad/1');
      expect(objetivo).toEqual(mockObjetivo);
    });

    it('should handle errors when fetching an objetivo de calidad by ID', async () => {
      apiService.get.mockRejectedValue(new Error('Not Found'));
      await expect(objetivosCalidadService.getById(999)).rejects.toThrow('Not Found');
    });
  });

  describe('create', () => {
    it('should create a new objetivo de calidad successfully', async () => {
      const nuevoObjetivo = { descripcion: 'Aumentar satisfacción', meta: '90%', indicador: 'Encuesta', unidad_medida: '%', valor_esperado: 90, responsable_puesto_id: 2, proceso_id: 1 };
      const objetivoCreado = { ...nuevoObjetivo, id: 2 };
      apiService.post.mockResolvedValue(objetivoCreado);
      const result = await objetivosCalidadService.create(nuevoObjetivo);
      expect(apiService.post).toHaveBeenCalledWith('/objetivos_calidad', nuevoObjetivo);
      expect(result).toEqual(objetivoCreado);
    });

    it('should handle errors when creating an objetivo de calidad', async () => {
      apiService.post.mockRejectedValue(new Error('Validation Failed'));
      await expect(objetivosCalidadService.create({})).rejects.toThrow('Validation Failed');
    });
  });

  describe('update', () => {
    it('should update an objetivo de calidad successfully', async () => {
      apiService.put.mockResolvedValue(mockObjetivoActualizado);
      const result = await objetivosCalidadService.update(1, mockObjetivoActualizado);
      expect(apiService.put).toHaveBeenCalledWith('/objetivos_calidad/1', mockObjetivoActualizado);
      expect(result).toEqual(mockObjetivoActualizado);
    });

    it('should handle errors when updating an objetivo de calidad', async () => {
      apiService.put.mockRejectedValue(new Error('Update Failed'));
      await expect(objetivosCalidadService.update(1, mockObjetivoActualizado)).rejects.toThrow('Update Failed');
    });
  });

  describe('delete', () => {
    it('should delete an objetivo de calidad successfully', async () => {
      apiService.delete.mockResolvedValue({ message: 'Objetivo de calidad eliminado' });
      const result = await objetivosCalidadService.delete(1);
      expect(apiService.delete).toHaveBeenCalledWith('/objetivos_calidad/1');
      expect(result).toEqual({ message: 'Objetivo de calidad eliminado' });
    });

    it('should handle errors when deleting an objetivo de calidad', async () => {
      apiService.delete.mockRejectedValue(new Error('Delete Failed'));
      await expect(objetivosCalidadService.delete(1)).rejects.toThrow('Delete Failed');
    });
  });
});
