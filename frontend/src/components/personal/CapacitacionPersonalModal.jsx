import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, GraduationCap, Calendar, Clock, Award, FileText } from "lucide-react";

function CapacitacionPersonalModal({ isOpen, onClose, onSave, capacitacion }) {
  const isEditMode = Boolean(capacitacion);
  
  const initialFormData = {
    titulo: "",
    institucion: "",
    fecha_inicio: "",
    fecha_fin: "",
    duracion: "",
    tipo: "",
    certificado: "",
    descripcion: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (capacitacion) {
      setFormData({
        ...capacitacion,
        fecha_inicio: capacitacion.fecha_inicio ? capacitacion.fecha_inicio.split('T')[0] : "",
        fecha_fin: capacitacion.fecha_fin ? capacitacion.fecha_fin.split('T')[0] : "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [capacitacion, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputStyles = "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-white">
              {isEditMode ? "Editar Capacitación Personal" : "Agregar Nueva Capacitación Personal"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              {isEditMode ? "Modifica los datos de la capacitación del legajo personal" : "Registra una capacitación previa del empleado (antes de ingresar a la empresa)"}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="capacitacion-personal-form" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Título de la Capacitación
              </Label>
              <Input 
                id="titulo" 
                name="titulo" 
                value={formData.titulo} 
                onChange={handleChange} 
                required 
                className={inputStyles} 
                placeholder="Ej: Curso de Excel Avanzado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institucion" className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Institución
              </Label>
              <Input 
                id="institucion" 
                name="institucion" 
                value={formData.institucion} 
                onChange={handleChange} 
                required 
                className={inputStyles} 
                placeholder="Ej: Instituto Tecnológico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Tipo de Capacitación
              </Label>
              <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="curso">Curso</SelectItem>
                  <SelectItem value="taller">Taller</SelectItem>
                  <SelectItem value="seminario">Seminario</SelectItem>
                  <SelectItem value="diplomado">Diplomado</SelectItem>
                  <SelectItem value="certificacion">Certificación</SelectItem>
                  <SelectItem value="capacitacion-tecnica">Capacitación Técnica</SelectItem>
                  <SelectItem value="capacitacion-blanda">Capacitación en Habilidades Blandas</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracion" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Duración
              </Label>
              <Input 
                id="duracion" 
                name="duracion" 
                value={formData.duracion} 
                onChange={handleChange} 
                className={inputStyles} 
                placeholder="Ej: 40 horas, 2 semanas, 3 meses"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_inicio" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Fecha de Inicio
              </Label>
              <Input 
                id="fecha_inicio" 
                name="fecha_inicio" 
                type="date" 
                value={formData.fecha_inicio} 
                onChange={handleChange} 
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Fecha de Finalización
              </Label>
              <Input 
                id="fecha_fin" 
                name="fecha_fin" 
                type="date" 
                value={formData.fecha_fin} 
                onChange={handleChange} 
                className={inputStyles}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="certificado" className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Certificado/Diploma
              </Label>
              <Select value={formData.certificado} onValueChange={(value) => handleSelectChange("certificado", value)}>
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder="¿Obtuvo certificado?" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="si">Sí, con certificado</SelectItem>
                  <SelectItem value="no">No certificado</SelectItem>
                  <SelectItem value="en-proceso">En proceso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Estado</Label>
              <div className="flex items-center h-10 px-3 rounded-md bg-slate-700 border border-slate-600">
                <span className="text-sm text-slate-300">Capacitación Personal (Legajo)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Descripción y Contenidos
            </Label>
            <Textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              className={inputStyles} 
              placeholder="Describe brevemente el contenido de la capacitación, habilidades adquiridas, etc..." 
              rows={4}
            />
          </div>
        </form>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline" className="border-slate-600 text-white hover:bg-slate-700 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="capacitacion-personal-form" className="bg-teal-600 text-white hover:bg-teal-700">
            {isEditMode ? "Guardar Cambios" : "Agregar Capacitación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CapacitacionPersonalModal; 