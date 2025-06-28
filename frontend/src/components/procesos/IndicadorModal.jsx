
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

function IndicadorModal({ isOpen, onClose, onSave, indicador }) {
  const getInitialFormData = () => ({
    nombre: '',
    descripcion: '',
    tipo: 'manual', // Valor por defecto
    formula: '',
    frecuencia: '',
    meta: '',
    responsable: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      if (indicador) {
        setFormData({
          nombre: indicador.nombre || '',
          descripcion: indicador.descripcion || '',
          tipo: indicador.tipo || 'manual',
          formula: indicador.formula || '',
          frecuencia: indicador.frecuencia || '',
          meta: indicador.meta || '',
          responsable: indicador.responsable || '',
        });
      } else {
        setFormData(getInitialFormData());
      }
    }
  }, [indicador, isOpen]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (value) => {
    setFormData(prev => ({ ...prev, tipo: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {indicador ? 'Editar Indicador' : 'Crear Nuevo Indicador'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre del Indicador</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Tasa de Satisfacción del Cliente"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Indicador</Label>
              <Select value={formData.tipo} onValueChange={handleTypeChange}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="calculado">Calculado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe qué mide este indicador y por qué es importante."
              required
              className="min-h-[100px]"
            />
          </div>

          {formData.tipo === 'manual' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="formula">Fórmula de Cálculo</Label>
                <Textarea
                  id="formula"
                  value={formData.formula}
                  onChange={handleInputChange}
                  placeholder="Ej: (Clientes satisfechos / Total encuestados) * 100"
                  className="min-h-[80px] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frecuencia">Frecuencia de Medición</Label>
                  <Input
                    id="frecuencia"
                    value={formData.frecuencia}
                    onChange={handleInputChange}
                    placeholder="Ej: Mensual, Trimestral"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta">Meta</Label>
                  <Input
                    id="meta"
                    value={formData.meta}
                    onChange={handleInputChange}
                    placeholder="Ej: > 95%"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input
                    id="responsable"
                    value={formData.responsable}
                    onChange={handleInputChange}
                    placeholder="Ej: Gerente de Calidad"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {indicador ? 'Guardar Cambios' : 'Crear Indicador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default IndicadorModal;
