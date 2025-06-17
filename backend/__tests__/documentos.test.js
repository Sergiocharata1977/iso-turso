import request from 'supertest';
import { app } from '../index.js';
import { tursoClient } from '../lib/tursoClient.js';

describe('Documentos API', () => {
  let testProcesoId;
  let testDocumentoId;

  beforeAll(async () => {
    // Crear proceso de prueba
    const procesoResult = await tursoClient.execute({
      sql: `INSERT INTO procesos (nombre, descripcion, created_at, updated_at) 
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: ['Proceso Test Docs', 'Proceso para pruebas de documentos', 
             new Date().toISOString(), new Date().toISOString()]
    });
    testProcesoId = procesoResult.rows[0].id;
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testDocumentoId) {
      await tursoClient.execute({
        sql: 'DELETE FROM documentos WHERE id = ?',
        args: [testDocumentoId]
      });
    }

    if (testProcesoId) {
      await tursoClient.execute({
        sql: 'DELETE FROM procesos WHERE id = ?',
        args: [testProcesoId]
      });
    }
  });

  describe('POST /api/documentos', () => {
    it('debería crear un nuevo documento exitosamente', async () => {
      const documentoData = {
        titulo: 'Manual de Procedimientos Test',
        descripcion: 'Manual de procedimientos para pruebas automatizadas',
        version: '1.0',
        proceso_id: testProcesoId,
        autor: 'Sistema de Pruebas',
        estado: 'borrador',
        archivo_url: 'https://ejemplo.com/manual.pdf',
        fecha_revision: '2024-12-31'
      };

      const response = await request(app)
        .post('/api/documentos')
        .send(documentoData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.titulo).toBe(documentoData.titulo);
      expect(response.body.descripcion).toBe(documentoData.descripcion);
      expect(response.body.version).toBe(documentoData.version);
      expect(response.body.proceso_id).toBe(testProcesoId);
      expect(response.body.autor).toBe(documentoData.autor);
      expect(response.body.estado).toBe('borrador');
      expect(response.body.archivo_url).toBe(documentoData.archivo_url);
      expect(response.body).toHaveProperty('proceso_nombre');
      expect(response.body).toHaveProperty('fecha_creacion');

      testDocumentoId = response.body.id;
    });

    it('debería crear documento sin proceso_id', async () => {
      const documentoData = {
        titulo: 'Documento Sin Proceso',
        descripcion: 'Documento independiente',
        autor: 'Sistema de Pruebas'
      };

      const response = await request(app)
        .post('/api/documentos')
        .send(documentoData)
        .expect(201);

      expect(response.body.titulo).toBe(documentoData.titulo);
      expect(response.body.proceso_id).toBeNull();
      expect(response.body.version).toBe('1.0'); // Valor por defecto
      expect(response.body.estado).toBe('borrador'); // Valor por defecto

      // Limpiar este documento de prueba
      await tursoClient.execute({
        sql: 'DELETE FROM documentos WHERE id = ?',
        args: [response.body.id]
      });
    });

    it('debería fallar al crear documento sin título', async () => {
      const documentoData = {
        descripcion: 'Documento sin título'
      };

      const response = await request(app)
        .post('/api/documentos')
        .send(documentoData)
        .expect(400);

      expect(response.body.error).toBe('El título es obligatorio.');
    });

    it('debería fallar al crear documento con título duplicado', async () => {
      const documentoData = {
        titulo: 'Manual de Procedimientos Test', // Título ya usado
        descripcion: 'Otro documento con el mismo título'
      };

      const response = await request(app)
        .post('/api/documentos')
        .send(documentoData)
        .expect(409);

      expect(response.body.error).toBe('Ya existe un documento con este título.');
    });

    it('debería fallar al crear documento con proceso inexistente', async () => {
      const documentoData = {
        titulo: 'Documento con Proceso Inexistente',
        proceso_id: 99999
      };

      const response = await request(app)
        .post('/api/documentos')
        .send(documentoData)
        .expect(404);

      expect(response.body.error).toBe('El proceso especificado no existe.');
    });
  });

  describe('GET /api/documentos', () => {
    it('debería obtener la lista de documentos', async () => {
      const response = await request(app)
        .get('/api/documentos')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const documento = response.body.find(d => d.id === testDocumentoId);
      expect(documento).toBeDefined();
      expect(documento.titulo).toBe('Manual de Procedimientos Test');
    });
  });

  describe('GET /api/documentos/:id', () => {
    it('debería obtener un documento por ID', async () => {
      const response = await request(app)
        .get(`/api/documentos/${testDocumentoId}`)
        .expect(200);

      expect(response.body.id).toBe(testDocumentoId);
      expect(response.body.titulo).toBe('Manual de Procedimientos Test');
      expect(response.body.descripcion).toBe('Manual de procedimientos para pruebas automatizadas');
      expect(response.body).toHaveProperty('proceso_nombre');
    });

    it('debería retornar 404 para documento inexistente', async () => {
      const response = await request(app)
        .get('/api/documentos/99999')
        .expect(404);

      expect(response.body.error).toBe('Documento no encontrado');
    });
  });

  describe('PUT /api/documentos/:id', () => {
    it('debería actualizar un documento exitosamente', async () => {
      const updateData = {
        titulo: 'Manual de Procedimientos Actualizado',
        descripcion: 'Manual actualizado con nueva información',
        version: '2.0',
        estado: 'aprobado',
        autor: 'Sistema Actualizado'
      };

      const response = await request(app)
        .put(`/api/documentos/${testDocumentoId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.titulo).toBe(updateData.titulo);
      expect(response.body.descripcion).toBe(updateData.descripcion);
      expect(response.body.version).toBe(updateData.version);
      expect(response.body.estado).toBe('aprobado');
      expect(response.body.autor).toBe(updateData.autor);
    });

    it('debería fallar al actualizar documento inexistente', async () => {
      const updateData = {
        titulo: 'Documento Inexistente'
      };

      const response = await request(app)
        .put('/api/documentos/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Documento no encontrado.');
    });

    it('debería fallar al actualizar con título vacío', async () => {
      const updateData = {
        titulo: ''
      };

      const response = await request(app)
        .put(`/api/documentos/${testDocumentoId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('El título es obligatorio.');
    });
  });

  describe('DELETE /api/documentos/:id', () => {
    it('debería eliminar un documento exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/documentos/${testDocumentoId}`)
        .expect(200);

      expect(response.body.message).toBe('Documento eliminado exitosamente');

      // Verificar que fue eliminado
      await request(app)
        .get(`/api/documentos/${testDocumentoId}`)
        .expect(404);

      testDocumentoId = null; // Para evitar intentar eliminarlo en afterAll
    });

    it('debería retornar 404 al eliminar documento inexistente', async () => {
      const response = await request(app)
        .delete('/api/documentos/99999')
        .expect(404);

      expect(response.body.error).toBe('Documento no encontrado.');
    });
  });
});
