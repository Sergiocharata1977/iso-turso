// Servicio para el módulo de Personal - Migrado a Backend API
import apiService from './apiService.js';

const ENDPOINT = '/personal';

// Obtener todos los registros de personal
export async function getAllPersonal() {
  try {
    return await apiService.get(ENDPOINT);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    throw error;
  }
}

// Obtener un registro de personal por ID
export async function getPersonalById(id) {
  try {
    return await apiService.get(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error al obtener personal con ID ${id}:`, error);
    throw error;
  }
}

// Obtener personal con información de puesto (ya incluido en el backend)
export async function getPersonalConPuesto() {
  try {
    // El backend ya incluye la información de departamento y puesto
    return await getAllPersonal();
  } catch (error) {
    console.error('Error al obtener personal con información de puesto:', error);
    throw error;
  }
}

// Crear un nuevo registro de personal
export async function createPersonal(data) {
  try {
    return await apiService.post(ENDPOINT, data);
  } catch (error) {
    console.error('Error al crear personal:', error);
    throw error;
  }
}

// Actualizar un registro de personal
export async function updatePersonal(id, data) {
  try {
    return await apiService.put(`${ENDPOINT}/${id}`, data);
  } catch (error) {
    console.error(`Error al actualizar personal con ID ${id}:`, error);
    throw error;
  }
}

// Eliminar un registro de personal
export async function deletePersonal(id) {
  try {
    return await apiService.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar personal con ID ${id}:`, error);
    throw error;
  }
}

// Buscar personal por filtros
export async function searchPersonal(filters) {
  try {
    const personal = await getAllPersonal();
    return personal.filter(p => {
      for (const key in filters) {
        if (p[key] !== filters[key]) return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Error al buscar personal:', error);
    throw error;
  }
}

// Obtener todos los puestos
export async function getAllPuestos() {
  try {
    const personal = await getAllPersonal();
    const puestos = {};
    personal.forEach(p => {
      if (!puestos[p.puesto_id]) {
        puestos[p.puesto_id] = {
          id: p.puesto_id,
          nombre: p.puesto_nombre,
          departamento: p.departamento
        };
      }
    });
    return Object.values(puestos);
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    throw error;
  }
}

// Obtener un puesto por ID
export async function getPuestoById(id) {
  try {
    const puestos = await getAllPuestos();
    return puestos.find(p => p.id === id);
  } catch (error) {
    console.error(`Error al obtener puesto con ID ${id}:`, error);
    throw error;
  }
}

// Crear un nuevo puesto
export async function createPuesto(data) {
  try {
    // No se puede crear un puesto directamente, se debe crear un nuevo personal con el puesto
    const personalData = {
      puesto_id: data.id,
      puesto_nombre: data.nombre,
      departamento: data.departamento
    };
    return await createPersonal(personalData);
  } catch (error) {
    console.error('Error al crear puesto:', error);
    throw error;
  }
}

// Actualizar un puesto
export async function updatePuesto(id, data) {
  try {
    // No se puede actualizar un puesto directamente, se debe actualizar el personal con el puesto
    const personal = await getPersonalByPuesto(id);
    if (personal.length > 0) {
      const personalData = {
        ...personal[0],
        puesto_nombre: data.nombre,
        departamento: data.departamento
      };
      return await updatePersonal(personal[0].id, personalData);
    } else {
      throw new Error(`No se encontró personal con puesto ID ${id}`);
    }
  } catch (error) {
    console.error(`Error al actualizar puesto con ID ${id}:`, error);
    throw error;
  }
}

// Eliminar un puesto
export async function deletePuesto(id) {
  try {
    // No se puede eliminar un puesto directamente, se debe eliminar el personal con el puesto
    const personal = await getPersonalByPuesto(id);
    if (personal.length > 0) {
      return await deletePersonal(personal[0].id);
    } else {
      throw new Error(`No se encontró personal con puesto ID ${id}`);
    }
  } catch (error) {
    console.error(`Error al eliminar puesto con ID ${id}:`, error);
    throw error;
  }
}

// Funciones adicionales para compatibilidad con el código existente
export async function getPersonalByDepartamento(departamentoId) {
  try {
    const personal = await getAllPersonal();
    return personal.filter(p => p.departamento_id === departamentoId);
  } catch (error) {
    console.error('Error al obtener personal por departamento:', error);
    throw error;
  }
}

export async function getPersonalByPuesto(puestoId) {
  try {
    const personal = await getAllPersonal();
    return personal.filter(p => p.puesto_id === puestoId);
  } catch (error) {
    console.error('Error al obtener personal por puesto:', error);
    throw error;
  }
}

// Exportar todas las funciones
export default {
  getAllPersonal,
  getPersonalById,
  getPersonalConPuesto,
  createPersonal,
  updatePersonal,
  deletePersonal,
  searchPersonal,
  getAllPuestos,
  getPuestoById,
  createPuesto,
  updatePuesto,
  deletePuesto,
  getPersonalByDepartamento,
  getPersonalByPuesto
};
