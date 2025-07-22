import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { evalcompeProgramacionService } from '@/services/evalcompeProgramacionService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileEdit, PlusCircle } from 'lucide-react';
import ProgramacionCompetenciasModal from './ProgramacionCompetenciasModal';

const ProgramacionCompetenciasSingle = () => {
  const { id } = useParams();
  const [programacion, setProgramacion] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar datos de la campaña y sus evaluaciones
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener la campaña y sus evaluaciones asociadas
        const response = await evalcompeProgramacionService.getSingle(id);
        setProgramacion(response.programacion || response);
        setEvaluaciones(response.evaluaciones || []);
      } catch (err) {
        setProgramacion(null);
        setEvaluaciones([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Guardar cambios en la campaña
  const handleSave = async (data) => {
    // Aquí deberías llamar a tu servicio de update
    // await evalcompeProgramacionService.update(id, data);
    setModalOpen(false);
    // Recargar datos
    // fetchData();
  };

  if (loading) return <div className="p-8">Cargando...</div>;
  if (!programacion) return <div className="p-8 text-red-500">No se encontró la campaña.</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{programacion.nombre}</CardTitle>
            <div className="text-gray-500 text-sm">Estado: {programacion.estado}</div>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <FileEdit className="mr-2 h-4 w-4" />
            Editar campaña
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>Fecha de inicio: {programacion.fecha_inicio}</div>
            <div>Fecha de fin: {programacion.fecha_fin}</div>
          </div>
        </CardContent>
      </Card>

      {/* Listado de evaluaciones individuales asociadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Evaluaciones individuales</CardTitle>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        </CardHeader>
        <CardContent>
          {evaluaciones.length === 0 ? (
            <div className="text-gray-500">No hay evaluaciones registradas para esta campaña.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persona</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluaciones.map((ev) => (
                  <tr key={ev.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{ev.persona_nombre || ev.persona_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ev.fecha ? new Date(ev.fecha).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal para editar campaña */}
      {modalOpen && (
        <ProgramacionCompetenciasModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          programacion={programacion}
        />
      )}
    </div>
  );
};

export default ProgramacionCompetenciasSingle; 