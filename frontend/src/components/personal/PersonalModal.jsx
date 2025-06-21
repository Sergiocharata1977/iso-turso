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
  const initialFormData = {
    numero: "",
    nombre: "",
    puesto: "",
    departamento: "",
    email: "",
    telefono: "",
    fechaIngreso: "",
    documentoIdentidad: "",
    direccion: "",
    formacionAcademica: [],
    experienciaLaboral: [],
    competencias: "",
    capacitacionesRecibidas: "",
    observaciones: "",
    imagen: null
  };

  const [formData, setFormData] = useState(initialFormData);

  const departamentos = ["Calidad", "Producción", "Administración", "Recursos Humanos", "Marketing", "Finanzas", "Ventas", "Logística", "Tecnología", "Seguridad", "Medio Ambiente", "Auditoría"];
  const puestos = {
    "Calidad": ["Gerente de Calidad", "Analista de Calidad", "Inspector de Calidad", "Auditor de Calidad"],
    "Producción": ["Gerente de Producción", "Supervisor de Producción", "Operario", "Técnico de Mantenimiento"],
    "Administración": ["Gerente Administrativo", "Asistente Administrativo", "Recepcionista"],
    "Recursos Humanos": ["Gerente de RRHH", "Analista de RRHH", "Especialista en Capacitación"],
    "Marketing": ["Gerente de Marketing", "Analista de Marketing", "Diseñador Gráfico"],
    "Finanzas": ["Director Financiero", "Contador", "Analista Financiero"],
    "Ventas": ["Gerente de Ventas", "Representante de Ventas", "Ejecutivo de Cuentas"],
    "Logística": ["Gerente de Logística", "Coordinador de Distribución", "Encargado de Almacén"],
    "Tecnología": ["Gerente de TI", "Desarrollador", "Analista de Sistemas", "Soporte Técnico"],
    "Seguridad": ["Jefe de Seguridad", "Especialista en HSE", "Técnico en Seguridad"],
    "Medio Ambiente": ["Responsable de Medio Ambiente", "Analista Ambiental"],
    "Auditoría": ["Auditor Interno", "Auditor Senior"]
  };

  useEffect(() => {
    if (person) {
      setFormData({
        ...initialFormData,
        ...person,
        formacionAcademica: person.formacion_academica ? JSON.parse(person.formacion_academica) : [],
        experienciaLaboral: person.experiencia_laboral ? JSON.parse(person.experiencia_laboral) : [],
        fechaIngreso: person.fecha_ingreso?.split('T')[0] || "",
        documentoIdentidad: person.documento_identidad || "",
        capacitacionesRecibidas: person.capacitaciones_recibidas || ""
      });
    } else {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData({
        ...initialFormData,
        numero: `P${year}${month}-${random}`,
        fechaIngreso: new Date().toISOString().split('T')[0],
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

  const addFormacionAcademica = () => setFormData(prev => ({ ...prev, formacionAcademica: [...prev.formacionAcademica, { titulo: "", institucion: "", fecha: "" }] }));
  const removeFormacionAcademica = (index) => setFormData(prev => ({ ...prev, formacionAcademica: prev.formacionAcademica.filter((_, i) => i !== index) }));
  const updateFormacionAcademica = (index, field, value) => {
    const newFormacion = [...formData.formacionAcademica];
    newFormacion[index][field] = value;
    setFormData(prev => ({ ...prev, formacionAcademica: newFormacion }));
  };

  const addExperienciaLaboral = () => setFormData(prev => ({ ...prev, experienciaLaboral: [...prev.experienciaLaboral, { empresa: "", puesto: "", fechaInicio: "", fechaFin: "", descripcion: "" }] }));
  const removeExperienciaLaboral = (index) => setFormData(prev => ({ ...prev, experienciaLaboral: prev.experienciaLaboral.filter((_, i) => i !== index) }));
  const updateExperienciaLaboral = (index, field, value) => {
    const newExperiencia = [...formData.experienciaLaboral];
    newExperiencia[index][field] = value;
    setFormData(prev => ({ ...prev, experienciaLaboral: newExperiencia }));
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
    const dataToSave = {
      ...formData,
      formacion_academica: JSON.stringify(formData.formacionAcademica),
      experiencia_laboral: JSON.stringify(formData.experienciaLaboral),
    };
    delete dataToSave.formacionAcademica;
    delete dataToSave.experienciaLaboral;
    onSave(dataToSave);
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
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="datos-principales" className="data-[state=active]:bg-slate-600 text-white">Datos Principales</TabsTrigger>
              <TabsTrigger value="competencias" className="data-[state=active]:bg-slate-600 text-white">Competencias</TabsTrigger>
              <TabsTrigger value="formacion" className="data-[state=active]:bg-slate-600 text-white">Formación</TabsTrigger>
              <TabsTrigger value="experiencia" className="data-[state=active]:bg-slate-600 text-white">Experiencia</TabsTrigger>
            </TabsList>

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
                    <Label htmlFor="numero" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Número</Label>
                    <Input id="numero" name="numero" value={formData.numero} readOnly disabled className={inputStyles} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaIngreso" className="text-white flex items-center gap-2"><Calendar className="h-4 w-4" /> Fecha de Ingreso</Label>
                    <Input id="fechaIngreso" name="fechaIngreso" type="date" value={formData.fechaIngreso} onChange={handleChange} required className={inputStyles} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="nombre" className="text-white flex items-center gap-2"><User className="h-4 w-4" /> Nombre Completo</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className={inputStyles} placeholder="Nombre completo del empleado"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento" className="text-white flex items-center gap-2"><Building2 className="h-4 w-4" /> Departamento</Label>
                    <Select name="departamento" onValueChange={(value) => handleSelectChange('departamento', value)} value={formData.departamento}>
                      <SelectTrigger className={inputStyles}><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-white">
                        {departamentos.map(dep => <SelectItem key={dep} value={dep} className="hover:bg-slate-600">{dep}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="puesto" className="text-white flex items-center gap-2"><Briefcase className="h-4 w-4" /> Puesto</Label>
                    <Select name="puesto" onValueChange={(value) => handleSelectChange('puesto', value)} value={formData.puesto} disabled={!formData.departamento}>
                      <SelectTrigger className={inputStyles}><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-white">
                        {formData.departamento && puestos[formData.departamento]?.map(p => <SelectItem key={p} value={p} className="hover:bg-slate-600">{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="documentoIdentidad" className="text-white flex items-center gap-2"><FileText className="h-4 w-4" /> Documento de Identidad</Label>
                    <Input id="documentoIdentidad" name="documentoIdentidad" value={formData.documentoIdentidad} onChange={handleChange} className={inputStyles} placeholder="Número de documento"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="text-white flex items-center gap-2"><MapPin className="h-4 w-4" /> Dirección</Label>
                    <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className={inputStyles} placeholder="Dirección completa"/>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competencias" className="mt-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="competencias" className="text-white flex items-center gap-2"><Award className="h-4 w-4" /> Competencias</Label>
                    <Textarea id="competencias" name="competencias" value={formData.competencias} onChange={handleChange} className={inputStyles} placeholder="Listar competencias clave..."/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="capacitacionesRecibidas" className="text-white flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Capacitaciones Recibidas</Label>
                    <Textarea id="capacitacionesRecibidas" name="capacitacionesRecibidas" value={formData.capacitacionesRecibidas} onChange={handleChange} className={inputStyles} placeholder="Listar capacitaciones..."/>
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
              {formData.formacionAcademica.map((formacion, index) => (
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
              {formData.experienciaLaboral.map((experiencia, index) => (
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
                      <Input type="date" value={experiencia.fechaInicio} onChange={(e) => updateExperienciaLaboral(index, 'fechaInicio', e.target.value)} required className={inputStyles}/>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Fecha de Fin</Label>
                      <Input type="date" value={experiencia.fechaFin} onChange={(e) => updateExperienciaLaboral(index, 'fechaFin', e.target.value)} className={inputStyles}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><FileText className="h-4 w-4"/> Descripción</Label>
                    <Textarea value={experiencia.descripcion} onChange={(e) => updateExperienciaLaboral(index, 'descripcion', e.target.value)} placeholder="Descripción de responsabilidades..." className={inputStyles}/>
                  </div>
                </div>
              ))}
            </TabsContent>
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
