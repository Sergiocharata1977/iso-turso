import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap, 
  ClipboardList, 
  Shield, 
  Award, 
  Clock,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialFormData = {
  titulo_puesto: "",
  nivel: "",
  proposito_general: "",
  requisitos: "",
  competencias_necesarias: "",
  principales_responsabilidades: "",
  experiencia_requerida: "",
  formacion_requerida: "",
  estado_puesto: "activo",
};

function PuestoModal({ isOpen, onClose, onSave, puesto, isSaving }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (puesto) {
        setFormData({
          ...initialFormData,
          ...puesto,
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, puesto]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {puesto ? "Editar Puesto" : "Nuevo Puesto"}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-slate-600 text-white">General</TabsTrigger>
            <TabsTrigger value="funciones" className="data-[state=active]:bg-slate-600 text-white">Funciones</TabsTrigger>
            <TabsTrigger value="requisitos" className="data-[state=active]:bg-slate-600 text-white">Requisitos</TabsTrigger>
            <TabsTrigger value="competencias" className="data-[state=active]:bg-slate-600 text-white">Competencias</TabsTrigger>
          </TabsList>
          
          <form id="puesto-form" onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo_puesto" className="text-white flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Nombre del Puesto <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="titulo_puesto"
                    value={formData.titulo_puesto}
                    onChange={(e) => handleInputChange('titulo_puesto', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: Gerente de Calidad"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivel" className="text-white flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Nivel <span className="text-red-400">*</span>
                  </Label>
                  <Select value={formData.nivel} onValueChange={(value) => handleInputChange('nivel', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="ejecutivo" className="text-white hover:bg-slate-600">Ejecutivo</SelectItem>
                      <SelectItem value="gerencial" className="text-white hover:bg-slate-600">Gerencial</SelectItem>
                      <SelectItem value="supervisor" className="text-white hover:bg-slate-600">Supervisor</SelectItem>
                      <SelectItem value="coordinador" className="text-white hover:bg-slate-600">Coordinador</SelectItem>
                      <SelectItem value="operativo" className="text-white hover:bg-slate-600">Operativo</SelectItem>
                      <SelectItem value="especialista" className="text-white hover:bg-slate-600">Especialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposito_general" className="text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Propósito General <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="proposito_general"
                  value={formData.proposito_general}
                  onChange={(e) => handleInputChange('proposito_general', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                  placeholder="Describa el propósito general del puesto..."
                  rows={4}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="funciones" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="principales_responsabilidades" className="text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Funciones y Responsabilidades <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="principales_responsabilidades"
                  value={formData.principales_responsabilidades}
                  onChange={(e) => handleInputChange('principales_responsabilidades', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                  placeholder="Lista las funciones y responsabilidades principales (una por línea)..."
                  rows={8}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="requisitos" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experiencia_requerida" className="text-white flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Experiencia Requerida <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="experiencia_requerida"
                    value={formData.experiencia_requerida}
                    onChange={(e) => handleInputChange('experiencia_requerida', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: 3 años en puestos similares"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formacion_requerida" className="text-white flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Formación Requerida <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="formacion_requerida"
                    value={formData.formacion_requerida}
                    onChange={(e) => handleInputChange('formacion_requerida', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: Licenciatura en Administración"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requisitos" className="text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Otros Requisitos
                </Label>
                <Textarea
                  id="requisitos"
                  value={formData.requisitos}
                  onChange={(e) => handleInputChange('requisitos', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                  placeholder="Lista otros requisitos (ej: idiomas, certificaciones)..."
                  rows={5}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="competencias" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="competencias_necesarias" className="text-white flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Competencias <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="competencias_necesarias"
                  value={formData.competencias_necesarias}
                  onChange={(e) => handleInputChange('competencias_necesarias', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 resize-none"
                  placeholder="Lista las competencias requeridas (una por línea)..."
                  rows={8}
                  required
                />
              </div>
            </TabsContent>
          </form>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-700 mt-6">
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
              form="puesto-form"
              disabled={isSaving}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isSaving ? "Guardando..." : (puesto ? "Guardar Cambios" : "Crear Puesto")}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default PuestoModal;
