import React, { useState, useEffect, useCallback } from 'react';
import accionesService from '@/services/accionesService';
import { toast } from 'react-toastify';
// Aquí deberías tener un AccionKanbanBoard similar al de hallazgos. Si no existe, deja un placeholder.
// import AccionKanbanBoard from '@/components/acciones/AccionKanbanBoard';

const AccionesPage2 = () => {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAcciones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await accionesService.getAllAcciones();
      setAcciones(data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'No se pudieron cargar las acciones.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcciones();
  }, [fetchAcciones]);

  // Placeholder para el tablero Kanban de acciones
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tablero Kanban de Acciones</h1>
      {/* Reemplaza esto por <AccionKanbanBoard acciones={acciones} ... /> cuando lo tengas */}
      <div className="p-8 text-center border-dashed border-2 rounded-lg text-muted-foreground">
        Aquí irá el tablero Kanban de Acciones de Mejora (implementación pendiente).
      </div>
    </div>
  );
};

export default AccionesPage2;
