import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { hallazgosService } from '@/services/hallazgosService';

const EjecucionForm = ({ hallazgoId, onUpdate }) => {
  const [formData, setFormData] = useState({
    ejecucion_fecha: '',
    ejecucion_responsable_id: '',
    ejecucion_comentarios: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const updatedData = {
        ...formData,
        estado: 'd3_accion_inmediata_finalizada',
      };
      await hallazgosService.updateHallazgo(hallazgoId, updatedData);
      toast.success('Acción inmediata ejecutada. Estado actualizado a D3.');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error(error.message || 'Error al guardar la ejecución.');
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="ejecucion_comentarios">Comentarios de la Ejecución</Label>
        <Textarea
          id="ejecucion_comentarios"
          name="ejecucion_comentarios"
          value={formData.ejecucion_comentarios}
          onChange={handleChange}
          placeholder="Describa qué se hizo, los resultados obtenidos, etc."
          required
          rows={4}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ejecucion_fecha">Fecha de Ejecución</Label>
          <Input
            id="ejecucion_fecha"
            name="ejecucion_fecha"
            type="date"
            value={formData.ejecucion_fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="ejecucion_responsable_id">Ejecutado por</Label>
          {/* TODO: Reemplazar con un Select que traiga usuarios */}
          <Input
            id="ejecucion_responsable_id"
            name="ejecucion_responsable_id"
            value={formData.ejecucion_responsable_id}
            onChange={handleChange}
            placeholder="ID del ejecutor"
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando...' : 'Guardar Ejecución (Pasa a D3)'}
      </Button>
    </form>
  );
};

export default EjecucionForm;
