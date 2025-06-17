// Pruebas de integración para apiService
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import apiService from '../../services/apiService.js';

// Mock del fetch global para las pruebas
global.fetch = jest.fn();

describe('ApiService Integration Tests', () => {
  beforeAll(() => {
    // Configurar el entorno de prueba
    process.env.VITE_API_BASE_URL = 'http://localhost:3002/api';
  });

  afterAll(() => {
    // Limpiar mocks
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // Resetear el mock antes de cada prueba
    fetch.mockClear();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Test' }] };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.get('/test');
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle GET request errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      await expect(apiService.get('/nonexistent')).rejects.toThrow('Not found');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { name: 'New Item' };
      const mockResponse = { id: 1, ...mockData };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.post('/test', mockData);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/test',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request validation errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Validation failed' }),
      });

      await expect(apiService.post('/test', {})).rejects.toThrow('Validation failed');
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockData = { name: 'Updated Item' };
      const mockResponse = { id: 1, ...mockData };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.put('/test/1', mockData);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/test/1',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { message: 'Deleted successfully' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.delete('/test/1');
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/test/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.get('/test')).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiService.get('/test')).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
