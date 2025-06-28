
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
import { Target, User, Goal, AlertCircle, Calendar } from "lucide-react";

function ObjetivoModal({ isOpen, onClose, onSave, objetivo }) {
  const [formData, setFormData] = useState({
    codigo: "",
    descripcion: "",
    meta: "",
    responsable: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "activo"
  });
  
  const [error, setError] = useState("");

  useEffect(() => {
    if (objetivo) {
      setFormData({
        codigo: objetivo.codigo || "",
        descripcion: objetivo.descripcion || "",
        meta: objetivo.meta || "",
        responsable: objetivo.responsable || "",
        fecha_inicio: objetivo.fecha_inicio || "",
        fecha_fin: objetivo.fecha_fin || "",
        estado: objetivo.estado || "activo"
      });
    } else {
      setFormData({
        codigo: "",
        descripcion: "",
        meta: "",
        responsable: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "activo"
      });
    }
    setError("");
  }, [objetivo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.codigo || !formData.descripcion) {
      setError("Los campos Código y Descripción son obligatorios");
      return;
    }
    
    // Formatear fechas para la API
    const dataToSave = {
      ...formData,
      fecha_inicio: formData.fecha_inicio ? formatDateForAPI(formData.fecha_inicio) : null,
      fecha_fin: formData.fecha_fin ? formatDateForAPI(formData.fecha_fin) : null
    };
    
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-slate-200 flex items-center gap-2">
                  <Target className="h-4 w-4 text-teal-500" />
                  Código <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="OBJ-001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-slate-200 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-teal-500" />
                  Estado
                </Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => setFormData({...formData, estado: value})}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="activo" className="focus:bg-slate-700">Activo</SelectItem>
                    <SelectItem value="En progreso" className="focus:bg-slate-700">En progreso</SelectItem>
                    <SelectItem value="Completado" className="focus:bg-slate-700">Completado</SelectItem>
                    <SelectItem value="inactivo" className="focus:bg-slate-700">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
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
                placeholder="Describa el objetivo de calidad"
              />
            </div>
            
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
                placeholder="Describa la meta específica a alcanzar"
              />
            </div>
            
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
                placeholder="Departamento o persona responsable"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio" className="text-slate-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-500" />
                  Fecha de inicio
                </Label>
                <Input
                  id="fecha_inicio"
                  name="fecha_inicio"
                  type="date"
                  value={formatDateForInput(formData.fecha_inicio)}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha_fin" className="text-slate-200 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-500" />
                  Fecha de finalización
                </Label>
                <Input
                  id="fecha_fin"
                  name="fecha_fin"
                  type="date"
                  value={formatDateForInput(formData.fecha_fin)}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {objetivo ? "Guardar Cambios" : "Crear Objetivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ObjetivoModal;
