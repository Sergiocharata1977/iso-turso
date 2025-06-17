// Módulo para centralizar la conexión a la base de datos SQLite local
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la base de datos
const dbPath = path.join(__dirname, '..', 'data.db');
const dbUrl = process.env.DATABASE_URL || `file:${dbPath}`;

// Verificar si el archivo de base de datos existe
if (!process.env.DATABASE_URL && !fs.existsSync(dbPath) && process.env.NODE_ENV !== 'test') {
  console.error(`El archivo de base de datos no existe: ${dbPath}`);
  console.error('Cree el archivo usando el script init-auth-database.js');
}

// Cliente de TursoDB
export const tursoClient = createClient({ url: dbUrl });

/**
 * Ejecuta una consulta SQL en la base de datos TursoDB
 * @param {string} query - Consulta SQL a ejecutar
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise} - Resultado de la consulta
 */
export async function executeQuery(query, params = []) {
  try {
    const result = await tursoClient.execute({ sql: query, args: params });
    return result;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

/**
 * Ejecuta una transacción con múltiples consultas
 * @param {Function} callback - Función que recibe un objeto de transacción y ejecuta consultas
 * @returns {Promise} - Resultado de la transacción
 */
export async function executeTransaction(callback) {
  try {
    return await tursoClient.transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    console.error('Error en la transacción:', error);
    throw error;
  }
}

/**
 * Verifica la conexión a la base de datos
 * @returns {Promise<boolean>} - true si la conexión es exitosa
 */
export async function testConnection() {
  try {
    const result = await executeQuery('SELECT 1 as test');
    console.log('Conexión a la base de datos exitosa');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    // Si estamos en modo de prueba, no queremos que el proceso termine
    // Se elimina process.exit(1) para evitar que el servidor se detenga abruptamente.
    // El error será lanzado y manejado por la función que llama.
    return false;
  }
}

/**
 * Obtiene todos los registros de una tabla
 * @param {string} table - Nombre de la tabla
 * @returns {Promise<Array>} - Registros encontrados
 */
export async function findAll(table) {
  try {
    const result = await executeQuery(`SELECT * FROM ${table}`);
    return result.rows;
  } catch (error) {
    console.error(`Error al obtener registros de ${table}:`, error);
    throw error;
  }
}

/**
 * Busca un registro por su ID
 * @param {string} table - Nombre de la tabla
 * @param {number} id - ID del registro
 * @returns {Promise<Object|null>} - Registro encontrado o null
 */
export async function findById(table, id) {
  try {
    const result = await executeQuery(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error al buscar registro en ${table} con id ${id}:`, error);
    throw error;
  }
}

/**
 * Busca registros por condiciones
 * @param {string} table - Nombre de la tabla
 * @param {Object} conditions - Objeto con condiciones {campo: valor}
 * @returns {Promise<Array>} - Registros encontrados
 */
export async function findBy(table, conditions) {
  try {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    
    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
    const result = await executeQuery(`SELECT * FROM ${table} WHERE ${whereClause}`, values);
    
    return result.rows;
  } catch (error) {
    console.error(`Error al buscar registros en ${table} con condiciones:`, error);
    throw error;
  }
}

/**
 * Inserta un registro en la tabla
 * @param {string} table - Nombre de la tabla
 * @param {Object} data - Datos a insertar
 * @returns {Promise<Object>} - Resultado de la inserción
 */
export async function insert(table, data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.join(', ');
    
    const result = await executeQuery(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      values
    );
    
    return { id: result.lastInsertRowid, ...data };
  } catch (error) {
    console.error(`Error al insertar en ${table}:`, error);
    throw error;
  }
}

/**
 * Actualiza un registro en la tabla
 * @param {string} table - Nombre de la tabla
 * @param {number} id - ID del registro a actualizar
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} - Resultado de la actualización
 */
export async function update(table, id, data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    await executeQuery(
      `UPDATE ${table} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error(`Error al actualizar en ${table} con id ${id}:`, error);
    throw error;
  }
}

/**
 * Elimina un registro de la tabla
 * @param {string} table - Nombre de la tabla
 * @param {number} id - ID del registro a eliminar
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
export async function remove(table, id) {
  try {
    await executeQuery(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return true;
  } catch (error) {
    console.error(`Error al eliminar de ${table} con id ${id}:`, error);
    throw error;
  }
}
