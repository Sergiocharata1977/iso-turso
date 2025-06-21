import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

const initialFormData = {
  nombre: "",
  descripcion: "",
  objetivos: "", // Añadido para gestionar los objetivos
  responsableId: "", // Campo para futuro uso, coincide con el schema
};

function DepartamentoModal({ isOpen, onClose, onSave, departamento }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Este efecto se ejecuta cuando el modal se abre/cierra o cuando cambia el departamento a editar
    if (isOpen) {
      if (departamento) {
        // Modo Edición: Cargar datos del departamento existente
        setFormData({
          nombre: departamento.nombre || "",
          descripcion: departamento.descripcion || "",
          objetivos: departamento.objetivos || "",
          responsableId: departamento.responsableId || "",
          id: departamento.id, // Mantener el ID para la actualización
        });
      } else {
        // Modo Creación: Resetear el formulario al estado inicial
        setFormData(initialFormData);
      }
    } 
  }, [departamento, isOpen]); // Depender de `isOpen` es crucial para el reseteo

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark max-w-lg w-full rounded-xl shadow-2xl border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {departamento ? "Editar Departamento" : "Nuevo Departamento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Departamento</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Recursos Humanos"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              rows={4}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe la función principal del departamento..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos</Label>
            <Textarea
              id="objetivos"
              rows={4}
              value={formData.objetivos}
              onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
              placeholder="Define los objetivos clave del departamento..."
            />
          </div>

          {/* Campo para responsableId (opcional, se puede implementar con un Select en el futuro) */}
          {/* 
          <div className="space-y-2">
            <Label htmlFor="responsableId">Responsable (ID)</Label>
            <Input
              id="responsableId"
              value={formData.responsableId}
              onChange={(e) => setFormData({ ...formData, responsableId: e.target.value })}
              placeholder="ID del usuario responsable (opcional)"
            />
          </div>
          */}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {departamento ? "Guardar Cambios" : "Crear Departamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DepartamentoModal;
