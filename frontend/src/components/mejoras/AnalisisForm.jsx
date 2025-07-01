import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { hallazgosService } from '@/services/hallazgosService';
import { Users, ClipboardList } from 'lucide-react';

const AnalisisForm = ({ hallazgoId, onUpdate }) => {
  const [formData, setFormData] = useState({
    analisis_causa_raiz: '',
    grupo_trabajo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (requiereAC) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const nuevoEstado = requiereAC ? 't1_pendiente_ac' : 't2_cerrado';
      const toastMessage = requiereAC
        ? 'Análisis guardado. Se requiere una Acción Correctiva.'
        : 'Análisis guardado. El hallazgo ha sido cerrado.';

      const updatedData = {
        ...formData,
        requiere_accion_correctiva: requiereAC,
        estado: nuevoEstado,
      };

      await hallazgosService.updateHallazgo(hallazgoId, updatedData);
      toast.success(toastMessage);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error(error.message || 'Error al guardar el análisis.');
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="analisis_causa_raiz" className="flex items-center text-gray-900">
          <ClipboardList className="mr-2 h-4 w-4 text-gray-500" />
          Análisis de Causa Raíz
        </Label>
        <Textarea
          id="analisis_causa_raiz"
          name="analisis_causa_raiz"
          value={formData.analisis_causa_raiz}
          onChange={handleChange}
          placeholder="Describa el análisis realizado para encontrar la causa raíz del problema..."
          required
          rows={5}
          className="focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grupo_trabajo" className="flex items-center text-gray-900">
          <Users className="mr-2 h-4 w-4 text-gray-500" />
          Grupo de trabajo
        </Label>
        <Input
          id="grupo_trabajo"
          name="grupo_trabajo"
          value={formData.grupo_trabajo}
          onChange={handleChange}
          placeholder="Nombres de los participantes en el análisis"
          className="focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
         <Label className="font-semibold text-gray-900">Decisión Final</Label>
         <p className="text-sm text-gray-500">
           Una vez completado el análisis, decida si el problema justifica una Acción Correctiva formal para evitar su recurrencia, o si puede darse por cerrado.
         </p>
         <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              Cerrar Hallazgo
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
              {isSubmitting ? 'Guardando...' : 'Requiere Acción Correctiva'}
            </Button>
         </div>
      </div>
    </div>
  );
};

export default AnalisisForm;
