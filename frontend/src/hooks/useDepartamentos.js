import { useState, useEffect } from 'react';
import { departamentosService } from '@/services/departamentos';

/**
 * Hook personalizado para gestionar departamentos
 * @returns {Object} Métodos y estado para trabajar con departamentos
 */
export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);

  // Cargar todos los departamentos
  const loadDepartamentos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departamentosService.getAll();
      setDepartamentos(data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar departamentos');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener un departamento por ID
  const getDepartamentoById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const departamento = await departamentosService.getById(id);
      setSelectedDepartamento(departamento);
      return departamento;
    } catch (err) {
      setError(err.message || `Error al obtener departamento con ID ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Crear un nuevo departamento
  const createDepartamento = async (departamentoData) => {
    setIsLoading(true);
    setError(null);
    try {
      const nuevoDepartamento = await departamentosService.create(departamentoData);
      setDepartamentos([...departamentos, nuevoDepartamento]);
      return nuevoDepartamento;
    } catch (err) {
      setError(err.message || 'Error al crear departamento');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar un departamento existente
  const updateDepartamento = async (id, departamentoData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedDepartamento = await departamentosService.update(id, departamentoData);
      setDepartamentos(departamentos.map(d => d.id === id ? updatedDepartamento : d));
      if (selectedDepartamento?.id === id) {
        setSelectedDepartamento(updatedDepartamento);
      }
      return updatedDepartamento;
    } catch (err) {
      setError(err.message || `Error al actualizar departamento con ID ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar un departamento
  const deleteDepartamento = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await departamentosService.delete(id);
      setDepartamentos(departamentos.filter(d => d.id !== id));
      if (selectedDepartamento?.id === id) {
        setSelectedDepartamento(null);
      }
      return true;
    } catch (err) {
      setError(err.message || `Error al eliminar departamento con ID ${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Restablecer el error
  const clearError = () => setError(null);

  return {
    departamentos,
    isLoading,
    error,
    selectedDepartamento,
    setSelectedDepartamento,
    loadDepartamentos,
    getDepartamentoById,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
    clearError
  };
}

export default useDepartamentos;
