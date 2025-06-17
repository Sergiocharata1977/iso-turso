import request from 'supertest';
import { app } from '../index.js';
import { tursoClient } from '../lib/tursoClient.js';

describe('Personal API', () => {
  let testDepartamentoId;
  let testPuestoId;
  let testPersonalId;

  beforeAll(async () => {
    // Crear departamento de prueba
    const deptResult = await tursoClient.execute({
      sql: `INSERT INTO departamentos (nombre, descripcion, created_at, updated_at) 
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: ['Depto Test Personal', 'Departamento para pruebas de personal', 
             new Date().toISOString(), new Date().toISOString()]
    });
    testDepartamentoId = deptResult.rows[0].id;

    // Crear puesto de prueba
    const puestoResult = await tursoClient.execute({
      sql: `INSERT INTO puestos (nombre, departamento_id, descripcion, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?) RETURNING *`,
      args: ['Puesto Test Personal', testDepartamentoId, 'Puesto para pruebas de personal',
             new Date().toISOString(), new Date().toISOString()]
    });
    testPuestoId = puestoResult.rows[0].id;
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testPersonalId) {
      await tursoClient.execute({
        sql: 'DELETE FROM personal WHERE id = ?',
        args: [testPersonalId]
      });
    }

    if (testPuestoId) {
      await tursoClient.execute({
        sql: 'DELETE FROM puestos WHERE id = ?',
        args: [testPuestoId]
      });
    }

    if (testDepartamentoId) {
      await tursoClient.execute({
        sql: 'DELETE FROM departamentos WHERE id = ?',
        args: [testDepartamentoId]
      });
    }
  });

  describe('POST /api/personal', () => {
    it('debería crear un nuevo personal exitosamente', async () => {
      const personalData = {
        nombre: 'Juan Pérez Test',
        email: 'juan.perez.test@empresa.com',
        telefono: '123-456-7890',
        departamento_id: testDepartamentoId,
        puesto_id: testPuestoId,
        fecha_contratacion: '2024-01-15',
        numero: 'EMP001',
        estado: 'activo'
      };

      const response = await request(app)
        .post('/api/personal')
        .send(personalData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nombre).toBe(personalData.nombre);
      expect(response.body.email).toBe(personalData.email);
      expect(response.body.telefono).toBe(personalData.telefono);
      expect(response.body.departamento_id).toBe(testDepartamentoId);
      expect(response.body.puesto_id).toBe(testPuestoId);
      expect(response.body.estado).toBe('activo');
      expect(response.body).toHaveProperty('departamento_nombre');
      expect(response.body).toHaveProperty('puesto_nombre');

      testPersonalId = response.body.id;
    });

    it('debería fallar al crear personal sin nombre', async () => {
      const personalData = {
        email: 'sin.nombre@empresa.com'
      };

      const response = await request(app)
        .post('/api/personal')
        .send(personalData)
        .expect(400);

      expect(response.body.error).toBe('El nombre es obligatorio.');
    });

    it('debería fallar al crear personal sin email', async () => {
      const personalData = {
        nombre: 'Sin Email'
      };

      const response = await request(app)
        .post('/api/personal')
        .send(personalData)
        .expect(400);

      expect(response.body.error).toBe('El email es obligatorio.');
    });

    it('debería fallar al crear personal con email duplicado', async () => {
      const personalData = {
        nombre: 'Otro Personal',
        email: 'juan.perez.test@empresa.com' // Email ya usado
      };

      const response = await request(app)
        .post('/api/personal')
        .send(personalData)
        .expect(409);

      expect(response.body.error).toBe('Ya existe personal con este email.');
    });

    it('debería fallar al crear personal con departamento inexistente', async () => {
      const personalData = {
        nombre: 'Personal Test',
        email: 'test.dept@empresa.com',
        departamento_id: 99999
      };

      const response = await request(app)
        .post('/api/personal')
        .send(personalData)
        .expect(404);

      expect(response.body.error).toBe('El departamento especificado no existe.');
    });
  });

  describe('GET /api/personal', () => {
    it('debería obtener la lista de personal', async () => {
      const response = await request(app)
        .get('/api/personal')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const personal = response.body.find(p => p.id === testPersonalId);
      expect(personal).toBeDefined();
      expect(personal.nombre).toBe('Juan Pérez Test');
    });
  });

  describe('GET /api/personal/:id', () => {
    it('debería obtener un personal por ID', async () => {
      const response = await request(app)
        .get(`/api/personal/${testPersonalId}`)
        .expect(200);

      expect(response.body.id).toBe(testPersonalId);
      expect(response.body.nombre).toBe('Juan Pérez Test');
      expect(response.body.email).toBe('juan.perez.test@empresa.com');
      expect(response.body).toHaveProperty('departamento_nombre');
      expect(response.body).toHaveProperty('puesto_nombre');
    });

    it('debería retornar 404 para personal inexistente', async () => {
      const response = await request(app)
        .get('/api/personal/99999')
        .expect(404);

      expect(response.body.error).toBe('Personal no encontrado');
    });
  });

  describe('PUT /api/personal/:id', () => {
    it('debería actualizar un personal exitosamente', async () => {
      const updateData = {
        nombre: 'Juan Pérez Actualizado',
        email: 'juan.perez.actualizado@empresa.com',
        telefono: '987-654-3210',
        estado: 'inactivo'
      };

      const response = await request(app)
        .put(`/api/personal/${testPersonalId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nombre).toBe(updateData.nombre);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.telefono).toBe(updateData.telefono);
      expect(response.body.estado).toBe('inactivo');
    });

    it('debería fallar al actualizar personal inexistente', async () => {
      const updateData = {
        nombre: 'Personal Inexistente'
      };

      const response = await request(app)
        .put('/api/personal/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('Personal no encontrado.');
    });

    it('debería fallar al actualizar con nombre vacío', async () => {
      const updateData = {
        nombre: ''
      };

      const response = await request(app)
        .put(`/api/personal/${testPersonalId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('El nombre es obligatorio.');
    });
  });

  describe('DELETE /api/personal/:id', () => {
    it('debería eliminar un personal exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/personal/${testPersonalId}`)
        .expect(200);

      expect(response.body.message).toBe('Personal eliminado exitosamente');

      // Verificar que fue eliminado
      await request(app)
        .get(`/api/personal/${testPersonalId}`)
        .expect(404);

      testPersonalId = null; // Para evitar intentar eliminarlo en afterAll
    });

    it('debería retornar 404 al eliminar personal inexistente', async () => {
      const response = await request(app)
        .delete('/api/personal/99999')
        .expect(404);

      expect(response.body.error).toBe('Personal no encontrado.');
    });
  });
});
