import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Loader2, Paperclip, FileText, Tag } from 'lucide-react';
import documentosService from '../../services/documentosService';

const DocumentoModal = ({ isOpen, onClose, onSave, documento }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    version: '',
    descripcion: '',
  });
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = Boolean(documento);

  useEffect(() => {
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
  }, [documento, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.titulo || !formData.version) {
        toast.error('Los campos Título y Versión son obligatorios.');
        setIsSaving(false);
        return;
    }

    if (!isEditMode && !file) {
        toast.error('Debe seleccionar un archivo para crear un nuevo documento.');
        setIsSaving(false);
        return;
    }

    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('version', formData.version);
    data.append('descripcion', formData.descripcion);
    if (file) {
      data.append('archivo', file);
    }

    const promise = isEditMode
      ? documentosService.updateDocumento(documento.id, data)
      : documentosService.createDocumento(data);

    toast.promise(promise, {
      loading: 'Guardando documento...',
      success: () => {
        onSave();
        return `Documento ${isEditMode ? 'actualizado' : 'creado'} con éxito.`;
      },
      error: `Error al ${isEditMode ? 'actualizar' : 'crear'} el documento.`,
      finally: () => setIsSaving(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Editar Documento' : 'Nuevo Documento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div>
            <Label htmlFor="titulo" className="flex items-center mb-2"><FileText className="mr-2 h-4 w-4"/>Título *</Label>
            <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} className="bg-slate-800 border-slate-600" />
          </div>
          <div>
            <Label htmlFor="version" className="flex items-center mb-2"><Tag className="mr-2 h-4 w-4"/>Versión *</Label>
            <Input id="version" name="version" value={formData.version} onChange={handleChange} className="bg-slate-800 border-slate-600" />
          </div>
          <div>
            <Label htmlFor="descripcion" className="flex items-center mb-2">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className="bg-slate-800 border-slate-600" />
          </div>
          <div>
            <Label htmlFor="archivo" className="flex items-center mb-2"><Paperclip className="mr-2 h-4 w-4"/>Archivo {isEditMode ? '(Opcional: reemplazar existente)' : '*'}</Label>
            <Input id="archivo" type="file" onChange={handleFileChange} className="bg-slate-800 border-slate-600 file:text-white" />
            {file && <p className="text-sm text-slate-400 mt-2">Archivo seleccionado: {file.name}</p>}
            {isEditMode && !file && <p className="text-sm text-slate-400 mt-2">Archivo actual: {documento.archivo_nombre}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-slate-600 hover:bg-slate-700">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentoModal;
