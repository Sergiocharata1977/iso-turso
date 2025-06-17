/**
 * Servicio mock para componentes que aún no tienen API implementada en el backend
 * Este servicio proporciona datos de ejemplo y simula operaciones CRUD
 * hasta que se implementen las rutas de API correspondientes
 */

import { toast } from 'react-toastify';

class MockService {
  constructor(entityName) {
    this.entityName = entityName;
    this.localStorageKey = `mock_${entityName.toLowerCase()}`;
    
    // Intentar cargar datos del localStorage
    try {
      const storedData = localStorage.getItem(this.localStorageKey);
      this.data = storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error(`Error al cargar datos mock de ${entityName}:`, error);
      this.data = [];
    }
  }

  /**
   * Guarda los datos en localStorage
   */
  _saveData() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error(`Error al guardar datos mock de ${this.entityName}:`, error);
      toast.error(`Error al guardar datos de ${this.entityName}`);
    }
  }

  /**
   * Obtiene todos los registros
   * @returns {Promise<Array>} Lista de registros
   */
  async getAll() {
    return new Promise(resolve => {
      // Simular delay de red
      setTimeout(() => {
        resolve([...this.data]);
      }, 300);
    });
  }

  /**
   * Obtiene un registro por su ID
   * @param {string|number} id ID del registro
   * @returns {Promise<Object|null>} Registro encontrado o null
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = this.data.find(item => item.id === id);
        if (item) {
          resolve({...item});
        } else {
          reject(new Error(`${this.entityName} no encontrado`));
        }
      }, 300);
    });
  }

  /**
   * Crea un nuevo registro
   * @param {Object} data Datos del nuevo registro
   * @returns {Promise<Object>} Registro creado
   */
  async create(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newItem = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.data.push(newItem);
        this._saveData();
        
        toast.success(`${this.entityName} creado correctamente`);
        resolve({...newItem});
      }, 500);
    });
  }

  /**
   * Actualiza un registro existente
   * @param {string|number} id ID del registro a actualizar
   * @param {Object} data Nuevos datos
   * @returns {Promise<Object>} Registro actualizado
   */
  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.data.findIndex(item => item.id === id);
        
        if (index !== -1) {
          const updatedItem = {
            ...this.data[index],
            ...data,
            updatedAt: new Date().toISOString()
          };
          
          this.data[index] = updatedItem;
          this._saveData();
          
          toast.success(`${this.entityName} actualizado correctamente`);
          resolve({...updatedItem});
        } else {
          reject(new Error(`${this.entityName} no encontrado`));
        }
      }, 500);
    });
  }

  /**
   * Elimina un registro
   * @param {string|number} id ID del registro a eliminar
   * @returns {Promise<void>}
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = this.data.length;
        this.data = this.data.filter(item => item.id !== id);
        
        if (this.data.length < initialLength) {
          this._saveData();
          toast.success(`${this.entityName} eliminado correctamente`);
          resolve();
        } else {
          reject(new Error(`${this.entityName} no encontrado`));
        }
      }, 500);
    });
  }
}

export default MockService;
