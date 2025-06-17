import request from 'supertest';
import { app } from '../index.js';
import { tursoClient } from '../lib/tursoClient.js';

describe('Normas API', () => {
  let testNormaId;

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testNormaId) {
      await tursoClient.execute({
        sql: 'DELETE FROM normas WHERE id = ?',
        args: [testNormaId]
      });
    }
  });

  describe('POST /api/normas', () => {
    it('debería crear una nueva norma exitosamente', async () => {
      const normaData = {
        codigo: 'ISO-9001-4.1',
        titulo: 'Comprensión de la organización y de su contexto',
        descripcion: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito',
        version: '2015',
        fecha_vigencia: '2015-09-15',
        estado: 'vigente',
        responsable: 'Representante de la Dirección',
        observaciones: 'Requisito fundamental para el SGC'
      };

      const response = await request(app)
        .post('/api/normas')
        .send(normaData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.codigo).toBe(normaData.codigo);
      expect(response.body.titulo).toBe(normaData.titulo);
      expect(response.body.descripcion).toBe(normaData.descripcion);
      expect(response.body.version).toBe(normaData.version);
      expect(response.body.fecha_vigencia).toBe(normaData.fecha_vigencia);
      expect(response.body.estado).toBe('vigente');
      expect(response.body.responsable).toBe(normaData.responsable);
      expect(response.body.observaciones).toBe(normaData.observaciones);

      testNormaId = response.body.id;
    });

    it('debería crear norma con valores por defecto', async () => {
      const normaData = {
        codigo: 'ISO-9001-4.2',
        titulo: 'Comprensión de las necesidades y expectativas de las partes interesadas'
      };

      const response = await request(app)
        .post('/api/normas')
        .send(normaData)
        .expect(201);

      expect(response.body.codigo).toBe(normaData.codigo);
      expect(response.body.titulo).toBe(normaData.titulo);
      expect(response.body.version).toBe('1.0'); // Valor por defecto
      expect(response.body.estado).toBe('vigente'); // Valor por defecto

      // Limpiar esta norma de prueba
      await tursoClient.execute({
        sql: 'DELETE FROM normas WHERE id = ?',
        args: [response.body.id]
      });
    });

    it('debería fallar al crear norma sin código', async () => {
      const normaData = {
        titulo: 'Norma sin código'
      };

      const response = await request(app)
        .post('/api/normas')
        .send(normaData)
        .expect(400);

      expect(response.body.error).toBe('El código es obligatorio.');
    });

    it('debería fallar al crear norma sin título', async () => {
      const normaData = {
        codigo: 'ISO-9001-SIN-TITULO'
      };

      const response = await request(app)
        .post('/api/normas')
        .send(normaData)
        .expect(400);

      expect(response.body.error).toBe('El título es obligatorio.');
    });

    it('debería fallar al crear norma con código duplicado', async () => {
      const normaData = {
        codigo: 'ISO-9001-4.1', // Código ya usado
        titulo: 'Otra norma con el mismo código'
      };

      const response = await request(app)
        .post('/api/normas')
        .send(normaData)
        .expect(409);

      expect(response.body.error).toBe('Ya existe una norma con este código.');
    });
  });

  describe('GET /api/normas', () => {
    it('debería obtener la lista de normas', async () => {
      const response = await request(app)
        .get('/api/normas')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const norma = response.body.find(n => n.id === testNormaId);
      expect(norma).toBeDefined();
      expect(norma.codigo).toBe('ISO-9001-4.1');
    });
  });

  describe('GET /api/normas/:id', () => {
    it('debería obtener una norma por ID', async () => {
      const response = await request(app)
        .get(`/api/normas/${testNormaId}`)
        .expect(200);

      expect(response.body.id).toBe(testNormaId);
      expect(response.body.codigo).toBe('ISO-9001-4.1');
      expect(response.body.titulo).toBe('Comprensión de la organización y de su contexto');
      expect(response.body.version).toBe('2015');
    });

    it('debería retornar 404 para norma inexistente', async () => {
      const response = await request(app)
        .get('/api/normas/99999')
        .expect(404);

      expect(response.body.error).toBe('Norma no encontrada');
    });
  });

  describe('PUT /api/normas/:id', () => {
    it('debería actualizar una norma exitosamente', async () => {
      const updateData = {
        codigo: 'ISO-9001-4.1-UPD',
        titulo: 'Comprensión de la organización y de su contexto - Actualizado',
        descripcion: 'Descripción actualizada del requisito',
        version: '2015-Rev1',
        estado: 'revisado',
        responsable: 'Nuevo Responsable'
      };

      const response = await request(app)
        .put(`/api/normas/${testNormaId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.codigo).toBe(updateData.codigo);
      expect(response.body.titulo).toBe(updateData.titulo);
      expect(response.body.descripcion).toBe(updateData.descripcion);
      expect(response.body.version).toBe(updateData.version);
      expect(response.body.estado).toBe('revisado');
      expect(response.body.responsable).toBe(updateData.responsable);
    });

    it('debería fallar al actualizar norma inexistente', async () => {
      const updateData = {
        codigo: 'ISO-INEXISTENTE',
        titulo: 'Norma Inexistente'
      };

      const response = await request(app)
        .put('/api/normas/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Norma no encontrada.');
    });

    it('debería fallar al actualizar con código vacío', async () => {
      const updateData = {
        codigo: '',
        titulo: 'Título válido'
      };

      const response = await request(app)
        .put(`/api/normas/${testNormaId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('El código es obligatorio.');
    });

    it('debería fallar al actualizar con título vacío', async () => {
      const updateData = {
        codigo: 'ISO-VALIDO',
        titulo: ''
      };

      const response = await request(app)
        .put(`/api/normas/${testNormaId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('El título es obligatorio.');
    });
  });

  describe('DELETE /api/normas/:id', () => {
    it('debería eliminar una norma exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/normas/${testNormaId}`)
        .expect(200);

      expect(response.body.message).toBe('Norma eliminada exitosamente');

      // Verificar que fue eliminada
      await request(app)
        .get(`/api/normas/${testNormaId}`)
        .expect(404);

      testNormaId = null; // Para evitar intentar eliminarla en afterAll
    });

    it('debería retornar 404 al eliminar norma inexistente', async () => {
      const response = await request(app)
        .delete('/api/normas/99999')
        .expect(404);

      expect(response.body.error).toBe('Norma no encontrada.');
    });
  });
});
