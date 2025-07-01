import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { hallazgosService } from '@/services/hallazgosService';

const PlanificacionForm = ({ hallazgoId, onUpdate }) => {
  const [formData, setFormData] = useState({
    planificacion_descripcion: '',
    planificacion_fecha_compromiso: '',
    planificacion_responsable_id: '',
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
        estado: 'd2_accion_inmediata_programada',
      };
      await hallazgosService.updateHallazgo(hallazgoId, updatedData);
      toast.success('Acción inmediata programada. Estado actualizado a D2.');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error(error.message || 'Error al guardar la planificación.');
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="planificacion_descripcion">Acción inmediata (Corrección)</Label>
        <Textarea
          id="planificacion_descripcion"
          name="planificacion_descripcion"
          value={formData.planificacion_descripcion}
          onChange={handleChange}
          placeholder="Describe la corrección que se aplicará..."
          required
        />
      </div>
      <div>
        <Label htmlFor="planificacion_fecha_compromiso">Fecha de compromiso de la Corrección</Label>
        <Input
          id="planificacion_fecha_compromiso"
          name="planificacion_fecha_compromiso"
          type="date"
          value={formData.planificacion_fecha_compromiso}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="planificacion_responsable_id">Responsable del tratamiento del hallazgo</Label>
        <Input
          id="planificacion_responsable_id"
          name="planificacion_responsable_id"
          value={formData.planificacion_responsable_id}
          onChange={handleChange}
          placeholder="Asigna un responsable"
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Registrando...' : 'Registrar Planificación (Pasa a D2)'}
      </Button>
    </form>
  );
};

export default PlanificacionForm;
