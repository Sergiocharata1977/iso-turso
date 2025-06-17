// backend/__tests__/puestos.test.js

import request from 'supertest';
import app from '../index.js';
import { tursoClient } from '../lib/tursoClient.js';

// Variables globales para almacenar IDs de prueba
let testDepartamentoId;
let testPuestoId;

beforeAll(async () => {
  try {
    // Limpiar datos de pruebas anteriores
    await tursoClient.execute({
      sql: "DELETE FROM departamentos WHERE nombre = ?",
      args: ["Departamento de Prueba para Puestos Test"]
    });
    await tursoClient.execute({
        sql: "DELETE FROM puestos WHERE nombre LIKE ?",
        args: ["Puesto de Prueba%"]
      });

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await tursoClient.execute({
      sql: `INSERT INTO departamentos (nombre, descripcion, created_at, updated_at)
            VALUES (?, ?, ?, ?) RETURNING id;`,
      args: ["Departamento de Prueba para Puestos Test", "Descripción de prueba", createdAt, createdAt]
    });
    if (result.rows.length > 0) {
      testDepartamentoId = result.rows[0].id;
      console.log(`Departamento de prueba creado con ID: ${testDepartamentoId}`);
    } else {
      throw new Error("No se pudo crear el departamento de prueba");
    }
  } catch (error) {
    console.error("Error en beforeAll:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (testDepartamentoId) {
      await tursoClient.execute({
        sql: "DELETE FROM puestos WHERE departamento_id = ?",
        args: [testDepartamentoId]
      });
      await tursoClient.execute({
        sql: "DELETE FROM departamentos WHERE id = ?",
        args: [testDepartamentoId]
      });
      console.log(`Datos de prueba eliminados`);
    }
    if (testPuestoId) {
        await tursoClient.execute({
            sql: "DELETE FROM puestos WHERE id = ?",
            args: [testPuestoId]
        });
    }
  } catch (error) {
    console.error("Error en afterAll:", error);
  }
});

describe('API de Puestos - /api/puestos', () => {
  // Pruebas para POST /api/puestos
  describe('POST /api/puestos', () => {
    test('debería crear un nuevo puesto y devolver 201', async () => {
      const nuevoPuesto = {
        nombre: 'Puesto de Prueba Jest 1',
        departamento_id: testDepartamentoId,
        descripcion: 'Descripción del puesto de prueba Jest 1',
        nivel: 'Junior',
        requisitos: 'Saber Jest',
        responsabilidades: 'Probar todo'
      };
      
      const response = await request(app)
        .post('/api/puestos')
        .send(nuevoPuesto);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nombre).toBe(nuevoPuesto.nombre);
      expect(response.body.departamento_id).toBe(testDepartamentoId);
      testPuestoId = response.body.id;
    });

    test('no debería crear un puesto sin nombre y devolver 400', async () => {
      const puestoSinNombre = {
        departamento_id: testDepartamentoId,
        descripcion: 'Puesto inválido'
      };
      
      const response = await request(app)
        .post('/api/puestos')
        .send(puestoSinNombre);
        
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('El nombre del puesto es obligatorio.');
    });

    test('no debería crear un puesto con un departamento_id inexistente y devolver 404', async () => {
      const puestoDeptoInexistente = {
        nombre: 'Puesto con Depto Fantasma',
        departamento_id: 99999,
        descripcion: 'Puesto inválido'
      };
      
      const response = await request(app)
        .post('/api/puestos')
        .send(puestoDeptoInexistente);
        
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toContain('no existe');
    });

    test('no debería crear un puesto con un nombre duplicado y devolver 409', async () => {
        const puestoOriginal = {
            nombre: 'Puesto Duplicado Test',
            departamento_id: testDepartamentoId,
        };
        await request(app).post('/api/puestos').send(puestoOriginal);

        const response = await request(app)
            .post('/api/puestos')
            .send(puestoOriginal);
        
        expect(response.statusCode).toBe(409);
        expect(response.body.error).toContain('ya existe');
    });
  });
});
