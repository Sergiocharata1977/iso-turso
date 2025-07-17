import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Loader2, Paperclip, FileText, Tag, AlertCircle } from 'lucide-react';
import documentosService from '../../services/documentosService';

const DocumentoModal = ({ isOpen, onClose, onSave, documento }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    version: '',
    descripcion: '',
  });
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

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
      setErrors({});
    }
  }, [documento, isOpen, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validar tamaño del archivo (máximo 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > maxSize) {
        setErrors(prev => ({ ...prev, archivo: 'El archivo es demasiado grande. Máximo 50MB.' }));
        e.target.value = ''; // Limpiar input
        return;
      }
      
      // Validar tipos de archivo permitidos
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, archivo: 'Tipo de archivo no permitido. Use PDF, Word, Excel, imágenes o texto.' }));
        e.target.value = ''; // Limpiar input
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, archivo: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    
    if (!formData.version.trim()) {
      newErrors.version = 'La versión es obligatoria';
    }
    
    if (!isEditMode && !file) {
      newErrors.archivo = 'Debe seleccionar un archivo para crear un nuevo documento';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ 
        variant: "destructive", 
        title: "Error de validación", 
        description: 'Por favor, corrija los errores en el formulario.' 
      });
      return;
    }

    if (!user?.organization_id) {
      toast({ 
        variant: "destructive", 
        title: "Error de autenticación", 
        description: 'No se pudo identificar la organización. Inicie sesión nuevamente.' 
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const data = new FormData();
      data.append('titulo', formData.titulo.trim());
      data.append('version', formData.version.trim());
      data.append('descripcion', formData.descripcion.trim());
      data.append('organization_id', user.organization_id);
      
      if (file) {
        data.append('archivo', file);
      }

      console.log('📄 Enviando datos del documento:', {
        titulo: formData.titulo,
        version: formData.version,
        descripcion: formData.descripcion,
        organization_id: user.organization_id,
        archivo: file ? file.name : 'Sin archivo',
        isEditMode
      });

      let resultado;
      if (isEditMode) {
        resultado = await documentosService.updateDocumento(documento.id, data);
      } else {
        resultado = await documentosService.createDocumento(data);
      }

      console.log('✅ Documento guardado exitosamente:', resultado);

      toast({ 
        title: "¡Éxito!", 
        description: `Documento ${isEditMode ? 'actualizado' : 'creado'} correctamente.`,
        variant: "success"
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('❌ Error guardando documento:', error);
      
      let errorMessage = 'Error desconocido al guardar el documento';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
      } else if (error.response?.status === 413) {
        errorMessage = 'El archivo es demasiado grande para el servidor.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Inténtelo más tarde.';
      }
      
      toast({ 
        variant: "destructive", 
        title: "Error al guardar", 
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-700">
          <div>
            <DialogTitle className="text-xl font-semibold text-white">
              {isEditMode ? 'Editar Documento' : 'Nuevo Documento'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              {isEditMode 
                ? 'Modifica los detalles del documento y opcionalmente reemplaza el archivo' 
                : 'Complete los detalles del documento y seleccione un archivo para subirlo'
              }
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form id="documento-form" onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-white flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Título *
            </Label>
            <Input 
              id="titulo" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 ${errors.titulo ? 'border-red-500' : ''}`}
              placeholder="Ej: Manual de Calidad" 
            />
            {renderFieldError('titulo')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="version" className="text-white flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Versión *
            </Label>
            <Input 
              id="version" 
              name="version" 
              value={formData.version} 
              onChange={handleChange} 
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 ${errors.version ? 'border-red-500' : ''}`}
              placeholder="Ej: 1.0" 
            />
            {renderFieldError('version')}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
              Descripción
            </Label>
            <Textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500" 
              placeholder="Añade una breve descripción del documento"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="archivo" className="text-white flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Archivo {isEditMode ? '(Opcional: reemplazar existente)' : '*'}
            </Label>
            <Input 
              id="archivo" 
              type="file" 
              onChange={handleFileChange} 
              className={`bg-slate-700 border-slate-600 text-white file:text-slate-300 file:bg-slate-600 file:border-none file:px-3 file:py-1.5 file:rounded-md file:mr-3 hover:file:bg-slate-500 ${errors.archivo ? 'border-red-500' : ''}`}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
            />
            {renderFieldError('archivo')}
            
            {file && (
              <div className="bg-slate-700 p-3 rounded border border-slate-600">
                <p className="text-sm text-slate-300">
                  <strong>Archivo seleccionado:</strong> {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            
            {isEditMode && !file && documento?.archivo && (
              <div className="bg-slate-700 p-3 rounded border border-slate-600">
                <p className="text-sm text-slate-400">
                  <strong>Archivo actual:</strong> {documento.archivo}
                </p>
              </div>
            )}
            
            <p className="text-xs text-slate-400">
              Tipos permitidos: PDF, Word, Excel, imágenes (JPG, PNG, GIF), texto. Máximo 50MB.
            </p>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="documento-form" 
            disabled={isSaving} 
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving 
              ? `${isEditMode ? 'Guardando...' : 'Creando...'}` 
              : `${isEditMode ? 'Guardar Cambios' : 'Crear Documento'}`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentoModal;
