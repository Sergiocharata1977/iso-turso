import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus, Trash2, X, User, Mail, Phone, Building2, Briefcase, Calendar, FileText, GraduationCap, Award, MapPin, Image as ImageIcon
} from "lucide-react";

function PersonalModal({ isOpen, onClose, onSave, person }) {
  const isEditMode = Boolean(person);

  const initialFormData = {
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    documento_identidad: "",
    fecha_nacimiento: "",
    nacionalidad: "",
    direccion: "",
    telefono_emergencia: "",
    fecha_contratacion: "",
    numero_legajo: "",
    estado: "Activo",
    formacion_academica: [],
    experiencia_laboral: [],
    habilidades_idiomas: []
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (person) {
      setFormData({
        ...initialFormData,
        ...person,
        formacion_academica: person.formacion_academica ? JSON.parse(person.formacion_academica) : [],
        experiencia_laboral: person.experiencia_laboral ? JSON.parse(person.experiencia_laboral) : [],
        habilidades_idiomas: person.habilidades_idiomas ? JSON.parse(person.habilidades_idiomas) : [],
        fecha_contratacion: person.fecha_contratacion?.split('T')[0] || "",
        documento_identidad: person.documento_identidad || "",
      });
    } else {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData({
        ...initialFormData,
        numero_legajo: `P${year}${month}-${random}`,
        fecha_contratacion: new Date().toISOString().split('T')[0],
      });
    }
  }, [person, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFormacionAcademica = () => setFormData(prev => ({ ...prev, formacion_academica: [...prev.formacion_academica, { titulo: "", institucion: "", fecha: "" }] }));
  const removeFormacionAcademica = (index) => setFormData(prev => ({ ...prev, formacion_academica: prev.formacion_academica.filter((_, i) => i !== index) }));
  const updateFormacionAcademica = (index, field, value) => {
    const newFormacion = [...formData.formacion_academica];
    newFormacion[index][field] = value;
    setFormData(prev => ({ ...prev, formacion_academica: newFormacion }));
  };

  const addExperienciaLaboral = () => setFormData(prev => ({ ...prev, experiencia_laboral: [...prev.experiencia_laboral, { empresa: "", puesto: "", fecha_inicio: "", fecha_fin: "", descripcion: "" }] }));
  const removeExperienciaLaboral = (index) => setFormData(prev => ({ ...prev, experiencia_laboral: prev.experiencia_laboral.filter((_, i) => i !== index) }));
  const updateExperienciaLaboral = (index, field, value) => {
    const newExperiencia = [...formData.experiencia_laboral];
    newExperiencia[index][field] = value;
    setFormData(prev => ({ ...prev, experiencia_laboral: newExperiencia }));
  };

  const addHabilidadIdioma = () => setFormData(prev => ({ ...prev, habilidades_idiomas: [...prev.habilidades_idiomas, { habilidad: "", nivel: "" }] }));
  const removeHabilidadIdioma = (index) => setFormData(prev => ({ ...prev, habilidades_idiomas: prev.habilidades_idiomas.filter((_, i) => i !== index) }));
  const updateHabilidadIdioma = (index, field, value) => {
    const newHabilidad = [...formData.habilidades_idiomas];
    newHabilidad[index][field] = value;
    setFormData(prev => ({ ...prev, habilidades_idiomas: newHabilidad }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imagen: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
    const dataToSave = {
      ...formData,
      formacion_academica: JSON.stringify(formData.formacion_academica),
      experiencia_laboral: JSON.stringify(formData.experiencia_laboral),
      habilidades_idiomas: JSON.stringify(formData.habilidades_idiomas),
    };
      onSave(dataToSave);
    } else {
      // En modo creación, solo guardamos los datos principales.
      const { 
        formacion_academica, 
        experiencia_laboral, 
        habilidades_idiomas, 
        ...dataToSave 
      } = formData;
    onSave(dataToSave);
    }

    onClose();
  };

  const inputStyles = "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">{person ? "Editar Personal" : "Nuevo Personal"}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} id="personal-form" className="space-y-6">
          <Tabs defaultValue="datos-principales" className="w-full">
            {isEditMode ? (
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="datos-principales" className="data-[state=active]:bg-slate-600 text-white">Datos Principales</TabsTrigger>
              <TabsTrigger value="competencias" className="data-[state=active]:bg-slate-600 text-white">Competencias</TabsTrigger>
              <TabsTrigger value="formacion" className="data-[state=active]:bg-slate-600 text-white">Formación</TabsTrigger>
              <TabsTrigger value="experiencia" className="data-[state=active]:bg-slate-600 text-white">Experiencia</TabsTrigger>
              <TabsTrigger value="habilidades" className="data-[state=active]:bg-slate-600 text-white">Habilidades e Idiomas</TabsTrigger>
            </TabsList>
            ) : (
              <div className="border-b border-slate-700 pb-2 mb-4">
                <h3 className="text-lg font-medium text-white">Complete los datos principales para crear el perfil.</h3>
                <p className="text-sm text-slate-400">Podrá agregar formación, experiencia y más detalles después de la creación.</p>
              </div>
            )}

            <TabsContent value="datos-principales" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna de Imagen */}
                <div className="md:col-span-1 space-y-2">
                  <Label htmlFor="imagen" className="text-white flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Imagen de Perfil</Label>
                  <Input id="imagen" type="file" onChange={handleImageChange} className={`${inputStyles} cursor-pointer file:text-teal-400`}/>
                  {formData.imagen && (
                    <div className="mt-4 p-2 border border-slate-600 rounded-md bg-slate-700 flex justify-center">
                      <img src={formData.imagen} alt="Perfil" className="w-32 h-32 object-cover rounded-full" />
                    </div>
                  )}
                </div>

                {/* Columna de Datos */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numero_legajo" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Número de Legajo</Label>
                    <Input id="numero_legajo" name="numero_legajo" value={formData.numero_legajo} readOnly disabled className={inputStyles} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_contratacion" className="text-white flex items-center gap-2"><Calendar className="h-4 w-4" /> Fecha de Contratación</Label>
                    <Input id="fecha_contratacion" name="fecha_contratacion" type="date" value={formData.fecha_contratacion} onChange={handleChange} required className={inputStyles} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="nombres" className="text-white flex items-center gap-2"><User className="h-4 w-4" /> Nombres</Label>
                    <Input id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required className={inputStyles} placeholder="Nombres del empleado"/>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="apellidos" className="text-white flex items-center gap-2"><User className="h-4 w-4" /> Apellidos</Label>
                    <Input id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required className={inputStyles} placeholder="Apellidos del empleado"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputStyles} placeholder="correo@empresa.com"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-white flex items-center gap-2"><Phone className="h-4 w-4" /> Teléfono</Label>
                    <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className={inputStyles} placeholder="Número de teléfono"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documento_identidad" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Documento de Identidad</Label>
                    <Input id="documento_identidad" name="documento_identidad" value={formData.documento_identidad} onChange={handleChange} className={inputStyles} placeholder="Número de documento"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="text-white flex items-center gap-2"><MapPin className="h-4 w-4" /> Dirección</Label>
                    <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className={inputStyles} placeholder="Dirección completa"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono_emergencia" className="text-white flex items-center gap-2"><Phone className="h-4 w-4" /> Teléfono de Emergencia</Label>
                    <Input id="telefono_emergencia" name="telefono_emergencia" value={formData.telefono_emergencia} onChange={handleChange} className={inputStyles} placeholder="Número de teléfono de emergencia"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_nacimiento" className="text-white flex items-center gap-2"><Calendar className="h-4 w-4" /> Fecha de Nacimiento</Label>
                    <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} className={inputStyles} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nacionalidad" className="text-white flex items-center gap-2"><MapPin className="h-4 w-4" /> Nacionalidad</Label>
                    <Input id="nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} className={inputStyles} placeholder="Nacionalidad del empleado"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleSelectChange('estado', value)} required>
                      <SelectTrigger className={`${inputStyles} flex items-center justify-between w-full`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {isEditMode && (
              <>
            <TabsContent value="competencias" className="mt-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="competencias" className="text-white flex items-center gap-2"><Award className="h-4 w-4" /> Competencias</Label>
                    <Textarea id="competencias" name="competencias" value={formData.competencias} onChange={handleChange} className={inputStyles} placeholder="Listar competencias clave..."/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="capacitaciones_recibidas" className="text-white flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Capacitaciones Recibidas</Label>
                    <Textarea id="capacitaciones_recibidas" name="capacitaciones_recibidas" value={formData.capacitaciones_recibidas} onChange={handleChange} className={inputStyles} placeholder="Listar capacitaciones..."/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="observaciones" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Observaciones</Label>
                    <Textarea id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleChange} className={inputStyles} placeholder="Anotaciones adicionales..."/>
                </div>
            </TabsContent>

            <TabsContent value="formacion" className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Historial Académico</h3>
                <Button type="button" onClick={addFormacionAcademica} className="bg-slate-700 border border-slate-600 text-white hover:bg-slate-600">
                  <Plus className="h-4 w-4 mr-2" /> Agregar Formación
                </Button>
              </div>
              {formData.formacion_academica.map((formacion, index) => (
                <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-4 bg-slate-900/20 relative">
                   <Button type="button" variant="ghost" size="icon" onClick={() => removeFormacionAcademica(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-slate-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><GraduationCap className="h-4 w-4"/> Título</Label>
                      <Input value={formacion.titulo} onChange={(e) => updateFormacionAcademica(index, 'titulo', e.target.value)} required className={inputStyles} placeholder="Ej: Ing. en Sistemas"/>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Building2 className="h-4 w-4"/> Institución</Label>
                      <Input value={formacion.institucion} onChange={(e) => updateFormacionAcademica(index, 'institucion', e.target.value)} required className={inputStyles} placeholder="Nombre de la universidad"/>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Fecha</Label>
                      <Input type="date" value={formacion.fecha} onChange={(e) => updateFormacionAcademica(index, 'fecha', e.target.value)} required className={inputStyles}/>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="experiencia" className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Experiencia Laboral</h3>
                <Button type="button" onClick={addExperienciaLaboral} className="bg-slate-700 border border-slate-600 text-white hover:bg-slate-600">
                  <Plus className="h-4 w-4 mr-2" /> Agregar Experiencia
                </Button>
              </div>
              {formData.experiencia_laboral.map((experiencia, index) => (
                <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-6 bg-slate-900/20 relative">
                   <Button type="button" variant="ghost" size="icon" onClick={() => removeExperienciaLaboral(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-slate-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Building2 className="h-4 w-4"/> Empresa</Label>
                      <Input value={experiencia.empresa} onChange={(e) => updateExperienciaLaboral(index, 'empresa', e.target.value)} required className={inputStyles} placeholder="Nombre de la empresa"/>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Briefcase className="h-4 w-4"/> Puesto</Label>
                      <Input value={experiencia.puesto} onChange={(e) => updateExperienciaLaboral(index, 'puesto', e.target.value)} required className={inputStyles} placeholder="Cargo ocupado"/>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Fecha de Inicio</Label>
                      <Input type="date" value={experiencia.fecha_inicio} onChange={(e) => updateExperienciaLaboral(index, 'fecha_inicio', e.target.value)} required className={inputStyles}/>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Fecha de Fin</Label>
                      <Input type="date" value={experiencia.fecha_fin} onChange={(e) => updateExperienciaLaboral(index, 'fecha_fin', e.target.value)} className={inputStyles}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><FileText className="h-4 w-4"/> Descripción</Label>
                    <Textarea value={experiencia.descripcion} onChange={(e) => updateExperienciaLaboral(index, 'descripcion', e.target.value)} placeholder="Descripción de responsabilidades..." className={inputStyles}/>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="habilidades" className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Habilidades e Idiomas</h3>
                <Button type="button" onClick={addHabilidadIdioma} className="bg-slate-700 border border-slate-600 text-white hover:bg-slate-600">
                      <Plus className="h-4 w-4 mr-2" /> Agregar Habilidad/Idioma
                </Button>
              </div>
              {formData.habilidades_idiomas.map((habilidad, index) => (
                <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-4 bg-slate-900/20 relative">
                   <Button type="button" variant="ghost" size="icon" onClick={() => removeHabilidadIdioma(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-slate-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Award className="h-4 w-4"/> Habilidad/Idioma</Label>
                          <Input value={habilidad.habilidad} onChange={(e) => updateHabilidadIdioma(index, 'habilidad', e.target.value)} required className={inputStyles} placeholder="Ej: Inglés, Liderazgo"/>
                    </div>
                    <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Award className="h-4 w-4"/> Nivel</Label>
                          <Input value={habilidad.nivel} onChange={(e) => updateHabilidadIdioma(index, 'nivel', e.target.value)} required className={inputStyles} placeholder="Ej: Avanzado, B2"/>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
              </>
            )}

          </Tabs>
        </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" form="personal-form" className="bg-teal-600 text-white hover:bg-teal-700">
              {person ? "Guardar Cambios" : "Crear Personal"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PersonalModal;
