import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import indicadoresService from "@/services/indicadoresService";

/**
 * Modal para crear/editar mediciones
 * Permite seleccionar un indicador y registrar su valor medido
 */
function MedicionModal({ isOpen, onClose, onSave, medicion }) {
  const [indicadores, setIndicadores] = useState([]);
  const [selectedIndicador, setSelectedIndicador] = useState(null);
  const [isLoadingIndicadores, setIsLoadingIndicadores] = useState(false);

  // Datos iniciales del formulario
  const getInitialFormData = () => ({
    indicador_id: '',
    valor: '',
    fecha_medicion: new Date(),
    observaciones: '',
    responsable: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  /**
   * Carga los indicadores disponibles para seleccionar
   */
  const loadIndicadores = async () => {
    try {
      setIsLoadingIndicadores(true);
      const data = await indicadoresService.getAll();
      setIndicadores(data || []);
    } catch (error) {
      console.error('Error cargando indicadores:', error);
    } finally {
      setIsLoadingIndicadores(false);
    }
  };

  /**
   * Efecto para cargar datos cuando se abre el modal
   */
  useEffect(() => {
    if (isOpen) {
      loadIndicadores();
      
      if (medicion) {
        // Modo edición
        setFormData({
          indicador_id: medicion.indicador_id || '',
          valor: medicion.valor || '',
          fecha_medicion: medicion.fecha_medicion ? new Date(medicion.fecha_medicion) : new Date(),
          observaciones: medicion.observaciones || '',
          responsable: medicion.responsable || '',
        });
      } else {
        // Modo creación
        setFormData(getInitialFormData());
      }
    }
  }, [medicion, isOpen]);

  /**
   * Efecto para buscar el indicador seleccionado
   */
  useEffect(() => {
    if (formData.indicador_id && indicadores.length > 0) {
      const indicador = indicadores.find(ind => ind.id.toString() === formData.indicador_id.toString());
      setSelectedIndicador(indicador);
    } else {
      setSelectedIndicador(null);
    }
  }, [formData.indicador_id, indicadores]);

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  /**
   * Maneja el cambio de indicador seleccionado
   */
  const handleIndicadorChange = (value) => {
    setFormData(prev => ({ ...prev, indicador_id: value }));
  };

  /**
   * Maneja el cambio de fecha
   */
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fecha_medicion: date }));
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.indicador_id) {
      return;
    }
    
    if (!formData.valor || isNaN(formData.valor)) {
      return;
    }

    // Preparar datos para envío
    const dataToSend = {
      ...formData,
      indicador_id: formData.indicador_id.toString(),
      valor: parseFloat(formData.valor),
      fecha_medicion: formData.fecha_medicion.toISOString().split('T')[0],
    };

    onSave(dataToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {medicion ? 'Editar Medición' : 'Registrar Nueva Medición'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Selección de Indicador */}
          <div className="space-y-2">
            <Label htmlFor="indicador_id">Indicador a Medir *</Label>
            <Select value={formData.indicador_id.toString()} onValueChange={handleIndicadorChange}>
              <SelectTrigger id="indicador_id">
                <SelectValue placeholder="Selecciona un indicador" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingIndicadores ? (
                  <SelectItem value="loading" disabled>Cargando indicadores...</SelectItem>
                ) : indicadores.length === 0 ? (
                  <SelectItem value="empty" disabled>No hay indicadores disponibles</SelectItem>
                ) : (
                  indicadores.map(indicador => (
                    <SelectItem key={indicador.id} value={indicador.id.toString()}>
                      {indicador.nombre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedIndicador && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Descripción:</strong> {selectedIndicador.descripcion}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <strong>Meta:</strong> {selectedIndicador.meta} | 
                  <strong> Frecuencia:</strong> {selectedIndicador.frecuencia_medicion}
                </p>
              </div>
            )}
          </div>

          {/* Valor y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Medido *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={handleInputChange}
                placeholder="Ej: 95.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Medición *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.fecha_medicion && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fecha_medicion ? (
                      format(formData.fecha_medicion, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fecha_medicion}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Responsable */}
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable de la Medición</Label>
            <Input
              id="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez - Gerente de Calidad"
            />
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              placeholder="Notas adicionales sobre la medición, contexto o anomalías observadas..."
              className="min-h-[100px]"
            />
          </div>

          {/* Información de cumplimiento */}
          {selectedIndicador && formData.valor && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  parseFloat(formData.valor) >= (selectedIndicador.meta || 0) 
                    ? "bg-emerald-500" 
                    : "bg-red-500"
                )}></div>
                <span className="text-sm font-medium">
                  {parseFloat(formData.valor) >= (selectedIndicador.meta || 0) 
                    ? "✓ Cumple con la meta" 
                    : "✗ No cumple con la meta"}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Valor: {formData.valor} | Meta: {selectedIndicador.meta}
              </p>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!formData.indicador_id || !formData.valor}
            >
              {medicion ? 'Guardar Cambios' : 'Registrar Medición'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MedicionModal; 