
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, User, Goal, AlertCircle, Calendar, FileText, BarChart } from "lucide-react";

function ObjetivoModal({ isOpen, onClose, onSave, objetivo }) {
  const [formData, setFormData] = useState({
    nombre_objetivo: "",
    descripcion: "",
    proceso_id: "",
    indicador_asociado_id: "",
    meta: "",
    responsable: "",
    fecha_inicio: "",
    fecha_fin: ""
  });
  
  const [error, setError] = useState("");

  useEffect(() => {
    if (objetivo) {
      setFormData({
        nombre_objetivo: objetivo.nombre_objetivo || "",
        descripcion: objetivo.descripcion || "",
        proceso_id: objetivo.proceso_id || "",
        indicador_asociado_id: objetivo.indicador_asociado_id || "",
        meta: objetivo.meta || "",
        responsable: objetivo.responsable || "",
        fecha_inicio: objetivo.fecha_inicio ? formatDateForInput(objetivo.fecha_inicio) : "",
        fecha_fin: objetivo.fecha_fin ? formatDateForInput(objetivo.fecha_fin) : ""
      });
    } else {
      setFormData({
        nombre_objetivo: "",
        descripcion: "",
        proceso_id: "",
        indicador_asociado_id: "",
        meta: "",
        responsable: "",
        fecha_inicio: "",
        fecha_fin: ""
      });
    }
    setError("");
  }, [objetivo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre_objetivo || !formData.descripcion) {
      setError("Los campos Nombre del Objetivo y Descripción son obligatorios");
      return;
    }
    
    // Formatear fechas para la API
    const dataToSave = {
      ...formData,
      fecha_inicio: formData.fecha_inicio ? formatDateForAPI(formData.fecha_inicio) : null,
      fecha_fin: formData.fecha_fin ? formatDateForAPI(formData.fecha_fin) : null
    };
    
    console.log('💾 Guardando objetivo:', dataToSave);
    onSave(dataToSave);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      // Convertir la fecha ISO a formato YYYY-MM-DD para input type="date"
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "";
    }
  };
  
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    try {
      // Asegurarse de que la fecha esté en formato ISO
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      console.error("Error formateando fecha para API:", error);
      return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-teal-500" />
            {objetivo ? "Editar Objetivo de Calidad" : "Nuevo Objetivo de Calidad"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Complete los datos del objetivo de calidad. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-100 px-4 py-2 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            
            {/* Nombre del Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="nombre_objetivo" className="text-slate-200 flex items-center gap-2">
                <Target className="h-4 w-4 text-teal-500" />
                Nombre del Objetivo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre_objetivo"
                name="nombre_objetivo"
                value={formData.nombre_objetivo}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                placeholder="Ej: Mejorar satisfacción del cliente"
              />
            </div>
            
            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-slate-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-teal-500" />
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="min-h-[100px] bg-slate-700 border-slate-600 text-white focus:border-teal-500 resize-none"
                placeholder="Describa detalladamente el objetivo de calidad"
              />
            </div>

            {/* Proceso e Indicador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proceso_id" className="text-slate-200 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  ID del Proceso
                </Label>
                <Input
                  id="proceso_id"
                  name="proceso_id"
                  value={formData.proceso_id}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="proc-xxx (opcional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="indicador_asociado_id" className="text-slate-200 flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-green-500" />
                  ID del Indicador
                </Label>
                <Input
                  id="indicador_asociado_id"
                  name="indicador_asociado_id"
                  value={formData.indicador_asociado_id}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="ind-xxx (opcional)"
                />
              </div>
            </div>
            
            {/* Meta */}
            <div className="space-y-2">
              <Label htmlFor="meta" className="text-slate-200 flex items-center gap-2">
                <Goal className="h-4 w-4 text-teal-500" />
                Meta
              </Label>
              <Textarea
                id="meta"
                name="meta"
                value={formData.meta}
                onChange={handleChange}
                className="min-h-[80px] bg-slate-700 border-slate-600 text-white focus:border-teal-500 resize-none"
                placeholder="Describa la meta específica a alcanzar (ej: 95% satisfacción)"
              />
            </div>
            
            {/* Responsable */}
            <div className="space-y-2">
              <Label htmlFor="responsable" className="text-slate-200 flex items-center gap-2">
                <User className="h-4 w-4 text-teal-500" />
                Responsable
              </Label>
              <Input
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                placeholder="Nombre del responsable"
              />
            </div>
            
            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio" className="text-slate-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-500" />
                  Fecha de Inicio
                </Label>
                <Input
                  type="date"
                  id="fecha_inicio"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha_fin" className="text-slate-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  Fecha de Finalización
                </Label>
                <Input
                  type="date"
                  id="fecha_fin"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {objetivo ? "Actualizar Objetivo" : "Crear Objetivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ObjetivoModal;
