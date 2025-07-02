import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Loader2, Paperclip, FileText, Tag } from 'lucide-react';
import documentosService from '../../services/documentosService';

const DocumentoModal = ({ isOpen, onClose, onSave, documento }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titulo: '',
    version: '',
    descripcion: '',
  });
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = Boolean(documento);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          titulo: documento.titulo || '',
          version: documento.version || '',
          descripcion: documento.descripcion || '',
        });
      } else {
        setFormData({ titulo: '', version: '', descripcion: '' });
      }
      setFile(null);
    }
  }, [documento, isOpen, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.version) {
      toast({ variant: "destructive", title: "Error", description: 'Los campos Título y Versión son obligatorios.' });
      return;
    }

    if (!isEditMode && !file) {
      toast({ variant: "destructive", title: "Error", description: 'Debe seleccionar un archivo para crear un nuevo documento.' });
      return;
    }

    setIsSaving(true);
    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('version', formData.version);
    data.append('descripcion', formData.descripcion);
    if (file) {
      data.append('archivo', file);
    }

    try {
      if (isEditMode) {
        await documentosService.updateDocumento(documento.id, data);
      } else {
        await documentosService.createDocumento(data);
      }
      toast({ title: "Éxito", description: `Documento ${isEditMode ? 'actualizado' : 'creado'} con éxito.` });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error guardando documento:", error);
      toast({ variant: "destructive", title: "Error", description: `Error al ${isEditMode ? 'actualizar' : 'crear'} el documento.` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-700">
          <DialogTitle className="text-xl font-semibold text-white">
            {isEditMode ? 'Editar Documento' : 'Nuevo Documento'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form id="documento-form" onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" />Título *</Label>
            <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500" placeholder="Ej: Manual de Calidad" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version" className="text-white flex items-center gap-2"><Tag className="h-4 w-4" />Versión *</Label>
            <Input id="version" name="version" value={formData.version} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500" placeholder="Ej: 1.0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white flex items-center gap-2">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500" placeholder="Añade una breve descripción del documento" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="archivo" className="text-white flex items-center gap-2"><Paperclip className="h-4 w-4" />Archivo {isEditMode ? '(Opcional: reemplazar existente)' : '*'}</Label>
            <Input id="archivo" type="file" onChange={handleFileChange} className="bg-slate-700 border-slate-600 text-white file:text-slate-300 file:bg-slate-600 file:border-none file:px-3 file:py-1.5 file:rounded-md file:mr-3 hover:file:bg-slate-500" />
            {file && <p className="text-sm text-slate-400 mt-2">Archivo seleccionado: {file.name}</p>}
            {isEditMode && !file && <p className="text-sm text-slate-400 mt-2">Archivo actual: {documento.archivo}</p>}
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
          <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-slate-600 text-white hover:bg-slate-700">
            Cancelar
          </Button>
          <Button type="submit" form="documento-form" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 text-white">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Guardar Cambios' : 'Crear Documento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentoModal;
