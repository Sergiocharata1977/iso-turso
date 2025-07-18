import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { reunionesService } from "@/services/reunionesService";
import { personalService } from "@/services/personalService";
import { documentosService } from "@/services/documentosService";

const NuevaReunionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    area: '',
    temas: '',
    objetivos: '',
    estado: 'planificada'
  });
  
  const [personal, setPersonal] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [selectedParticipantes, setSelectedParticipantes] = useState([]);
  const [selectedDocumentos, setSelectedDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);

  // Cargar personal y documentos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      fetchPersonal();
      fetchDocumentos();
    }
  }, [isOpen]);

  const fetchPersonal = async () => {
    try {
      setLoadingPersonal(true);
      const data = await personalService.getAllPersonal();
      setPersonal(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    } finally {
      setLoadingPersonal(false);
    }
  };

  const fetchDocumentos = async () => {
    try {
      setLoadingDocumentos(true);
      const data = await documentosService.getAllDocumentos();
      setDocumentos(data);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setLoadingDocumentos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Preparar datos para enviar al backend
      const reunionData = {
        ...formData,
        fecha_hora: `${formData.fecha}T${formData.hora}:00`,
        participantes: selectedParticipantes,
        documentos: selectedDocumentos
      };
      
      // Llamar al servicio para crear la reunión
      const nuevaReunion = await reunionesService.createReunion(reunionData);
      
      // Notificar al componente padre
      onSave(nuevaReunion);
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        fecha: '',
        hora: '',
        area: '',
        temas: '',
        objetivos: '',
        estado: 'planificada'
      });
      setSelectedParticipantes([]);
      setSelectedDocumentos([]);
    } catch (error) {
      console.error('Error al crear reunión:', error);
      throw error; // Para que el componente padre pueda manejar el error
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const toggleParticipante = (id) => {
    setSelectedParticipantes(prev => 
      prev.includes(id) 
        ? prev.filter(participanteId => participanteId !== id)
        : [...prev, id]
    );
  };

  const toggleDocumento = (id) => {
    setSelectedDocumentos(prev => 
      prev.includes(id) 
        ? prev.filter(documentoId => documentoId !== id)
        : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nueva Reunión de Revisión</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Revisión Trimestral del SGC"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select 
                value={formData.area} 
                onValueChange={(value) => setFormData({ ...formData, area: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calidad">Calidad</SelectItem>
                  <SelectItem value="produccion">Producción</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="direccion">Dirección</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Participantes</Label>
              <div className="border rounded-md p-2">
                {loadingPersonal ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ScrollArea className="h-[150px] w-full pr-4">
                    <div className="space-y-2">
                      {personal.map((persona) => (
                        <div key={persona.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`participante-${persona.id}`} 
                            checked={selectedParticipantes.includes(persona.id)}
                            onCheckedChange={() => toggleParticipante(persona.id)}
                          />
                          <Label htmlFor={`participante-${persona.id}`} className="cursor-pointer">
                            {persona.nombre} {persona.apellido} - {persona.puesto || 'Sin puesto asignado'}
                          </Label>
                        </div>
                      ))}
                      {personal.length === 0 && (
                        <p className="text-gray-500 text-center py-2">No hay personal disponible</p>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Documentos Relacionados</Label>
              <div className="border rounded-md p-2">
                {loadingDocumentos ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ScrollArea className="h-[150px] w-full pr-4">
                    <div className="space-y-2">
                      {documentos.map((documento) => (
                        <div key={documento.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`documento-${documento.id}`} 
                            checked={selectedDocumentos.includes(documento.id)}
                            onCheckedChange={() => toggleDocumento(documento.id)}
                          />
                          <Label htmlFor={`documento-${documento.id}`} className="cursor-pointer">
                            {documento.nombre || documento.titulo} - {documento.codigo || 'Sin código'}
                          </Label>
                        </div>
                      ))}
                      {documentos.length === 0 && (
                        <p className="text-gray-500 text-center py-2">No hay documentos disponibles</p>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temas">Temas a Tratar</Label>
              <Textarea
                id="temas"
                value={formData.temas}
                onChange={(e) => setFormData({ ...formData, temas: e.target.value })}
                placeholder="Puntos principales a discutir"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos de la Reunión</Label>
              <Textarea
                id="objetivos"
                value={formData.objetivos}
                onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                placeholder="Objetivos específicos a alcanzar"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select 
                value={formData.estado} 
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificada">Planificada</SelectItem>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Guardando...' : 'Guardar Reunión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevaReunionModal;
