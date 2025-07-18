import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User, Building, Award, Clock, CheckCircle, AlertCircle, Plus, Briefcase, GraduationCap, Star } from 'lucide-react';
import { personalService } from '@/services/personalService';
import { puestosService } from '@/services/puestosService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Select } from "@/components/ui/select";
// Importar los modales
import ExperienciaModal from './ExperienciaModal';
import FormacionModal from './FormacionModal';
import HabilidadesModal from './HabilidadesModal';
import CapacitacionPersonalModal from './CapacitacionPersonalModal';

const PersonalSingle = ({ initialPerson = null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Obtener datos del state si están disponibles
  const personFromState = location.state?.person;
  const initialData = initialPerson || personFromState;
  
  const [person, setPerson] = useState(initialData);
  const [loading, setLoading] = useState(initialData ? false : true);
  const [error, setError] = useState(null);

  // Estados para los modales
  const [experienciaModal, setExperienciaModal] = useState({ isOpen: false, experiencia: null });
  const [formacionModal, setFormacionModal] = useState({ isOpen: false, formacion: null });
  const [habilidadesModal, setHabilidadesModal] = useState({ isOpen: false, habilidad: null });
  const [capacitacionPersonalModal, setCapacitacionPersonalModal] = useState({ isOpen: false, capacitacion: null });

  // Estados para los datos adicionales (simularemos datos por ahora)
  const [experiencias, setExperiencias] = useState([
    {
      id: 1,
      empresa: "TechCorp S.A.",
      puesto: "Desarrollador Senior",
      fecha_inicio: "2020-01-15",
      fecha_fin: "2023-12-31",
      descripcion: "Desarrollo de aplicaciones web usando React y Node.js"
    }
  ]);

  const [formaciones, setFormaciones] = useState([
    {
      id: 1,
      titulo: "Ingeniería en Sistemas",
      institucion: "Universidad Nacional",
      fecha: "2019-12-15"
    }
  ]);

  const [habilidades, setHabilidades] = useState([
    { id: 1, habilidad: "JavaScript", nivel: "Avanzado" },
    { id: 2, habilidad: "Inglés", nivel: "B2" },
    { id: 3, habilidad: "Liderazgo", nivel: "Intermedio" }
  ]);

  const [capacitacionesPersonales, setCapacitacionesPersonales] = useState([
    {
      id: 1,
      titulo: "Curso de Excel Avanzado",
      institucion: "Instituto de Informática",
      fecha_inicio: "2018-03-15",
      fecha_fin: "2018-04-20",
      duracion: "40 horas",
      tipo: "curso",
      certificado: "si",
      descripcion: "Manejo avanzado de Excel: fórmulas, tablas dinámicas, macros y análisis de datos"
    },
    {
      id: 2,
      titulo: "Certificación en Gestión de Proyectos",
      institucion: "PMI Chapter",
      fecha_inicio: "2019-06-01",
      fecha_fin: "2019-08-30",
      duracion: "120 horas",
      tipo: "certificacion",
      certificado: "si",
      descripcion: "Metodologías de gestión de proyectos, PMI framework, herramientas de planificación"
    }
  ]);

  const [puestos, setPuestos] = useState([]);
  const [showPuestoSelect, setShowPuestoSelect] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [isSavingPuesto, setIsSavingPuesto] = useState(false);

  useEffect(() => {
    // Si ya tenemos los datos (vía props o state), no necesitamos volver a cargar.
    if (initialData) return;

    // Solo intentar cargar desde el backend si el ID no es temporal
    if (id && !id.toString().startsWith('temp-')) {
      fetchPersonal();
    } else if (id && id.toString().startsWith('temp-')) {
      // Si es un ID temporal y no tenemos datos, mostrar error
      setError('No se pueden cargar los datos de este registro temporal');
      setLoading(false);
    }
    loadPuestos();
  }, [id]);

  // Funciones para manejar los modales de Experiencia
  const openExperienciaModal = (experiencia = null) => {
    setExperienciaModal({ isOpen: true, experiencia });
  };

  const closeExperienciaModal = () => {
    setExperienciaModal({ isOpen: false, experiencia: null });
  };

  const handleSaveExperiencia = (experienciaData) => {
    if (experienciaModal.experiencia) {
      // Editar experiencia existente
      setExperiencias(prev => prev.map(exp => 
        exp.id === experienciaModal.experiencia.id 
          ? { ...exp, ...experienciaData }
          : exp
      ));
      toast({ title: "Éxito", description: "Experiencia actualizada correctamente." });
    } else {
      // Agregar nueva experiencia
      const newExperiencia = {
        id: Date.now(), // ID temporal
        ...experienciaData
      };
      setExperiencias(prev => [...prev, newExperiencia]);
      toast({ title: "Éxito", description: "Experiencia agregada correctamente." });
    }
  };

  // Funciones para manejar los modales de Formación
  const openFormacionModal = (formacion = null) => {
    setFormacionModal({ isOpen: true, formacion });
  };

  const closeFormacionModal = () => {
    setFormacionModal({ isOpen: false, formacion: null });
  };

  const handleSaveFormacion = (formacionData) => {
    if (formacionModal.formacion) {
      // Editar formación existente
      setFormaciones(prev => prev.map(form => 
        form.id === formacionModal.formacion.id 
          ? { ...form, ...formacionData }
          : form
      ));
      toast({ title: "Éxito", description: "Formación actualizada correctamente." });
    } else {
      // Agregar nueva formación
      const newFormacion = {
        id: Date.now(), // ID temporal
        ...formacionData
      };
      setFormaciones(prev => [...prev, newFormacion]);
      toast({ title: "Éxito", description: "Formación agregada correctamente." });
    }
  };

  // Funciones para manejar los modales de Habilidades
  const openHabilidadesModal = (habilidad = null) => {
    setHabilidadesModal({ isOpen: true, habilidad });
  };

  const closeHabilidadesModal = () => {
    setHabilidadesModal({ isOpen: false, habilidad: null });
  };

  const handleSaveHabilidad = (habilidadData) => {
    if (habilidadesModal.habilidad) {
      // Editar habilidad existente
      setHabilidades(prev => prev.map(hab => 
        hab.id === habilidadesModal.habilidad.id 
          ? { ...hab, ...habilidadData }
          : hab
      ));
      toast({ title: "Éxito", description: "Habilidad actualizada correctamente." });
    } else {
      // Agregar nueva habilidad
      const newHabilidad = {
        id: Date.now(), // ID temporal
        ...habilidadData
      };
      setHabilidades(prev => [...prev, newHabilidad]);
      toast({ title: "Éxito", description: "Habilidad agregada correctamente." });
    }
  };

  // Funciones para manejar los modales de Capacitaciones Personales
  const openCapacitacionPersonalModal = (capacitacion = null) => {
    setCapacitacionPersonalModal({ isOpen: true, capacitacion });
  };

  const closeCapacitacionPersonalModal = () => {
    setCapacitacionPersonalModal({ isOpen: false, capacitacion: null });
  };

  const handleSaveCapacitacionPersonal = (capacitacionData) => {
    if (capacitacionPersonalModal.capacitacion) {
      // Editar capacitación existente
      setCapacitacionesPersonales(prev => prev.map(cap => 
        cap.id === capacitacionPersonalModal.capacitacion.id 
          ? { ...cap, ...capacitacionData }
          : cap
      ));
      toast({ title: "Éxito", description: "Capacitación actualizada correctamente." });
    } else {
      // Agregar nueva capacitación
      const newCapacitacion = {
        id: Date.now(), // ID temporal
        ...capacitacionData
      };
      setCapacitacionesPersonales(prev => [...prev, newCapacitacion]);
      toast({ title: "Éxito", description: "Capacitación agregada correctamente." });
    }
  };

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      console.log('Intentando cargar personal con ID:', id);
      const data = await personalService.getPersonalById(id);
      setPerson(data);
    } catch (error) {
      console.error('Error fetching personal with id', id, ':', error);
      setError(error.message);
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar la información del personal." });
    } finally {
      setLoading(false);
    }
  };

  // Cargar puestos reales
  const loadPuestos = async () => {
    try {
      const data = await puestosService.getAll(person?.organization_id);
      setPuestos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los puestos",
        variant: "destructive"
      });
    }
  };

  // Guardar puesto seleccionado
  const handleSavePuesto = async () => {
    if (!selectedPuesto) return;
    setIsSavingPuesto(true);
    try {
      await personalService.update(person.id, {
        ...person,
        puesto_id: selectedPuesto,
        organization_id: person.organization_id
      });
      toast({
        title: "Puesto asignado",
        description: "La relación con el puesto se ha guardado correctamente.",
        variant: "success"
      });
      setShowPuestoSelect(false);
      fetchPersonal();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el puesto",
        variant: "destructive"
      });
    } finally {
      setIsSavingPuesto(false);
    }
  };

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : '';
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactivo':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactivo':
        return <AlertCircle className="w-4 h-4" />;
      case 'suspendido':
        return <Clock className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del personal...</p>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error || 'No se encontró la información del personal'}</p>
          <button
            onClick={() => navigate('/personal')}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/personal')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detalle del Personal</h1>
                <p className="text-sm text-gray-600">Información completa del empleado</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/personal/${id}/edit`)}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {person.imagen ? (
                    <img 
                      src={person.imagen} 
                      alt={`${person.nombres} ${person.apellidos}`}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(person.nombres, person.apellidos)
                  )}
                </div>

                {/* Name and Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {person.nombres} {person.apellidos}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {person.puesto || 'Cargo no especificado'}
                </p>

                {/* Status */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(person.estado)}`}>
                  {getStatusIcon(person.estado)}
                  <span className="ml-2">{person.estado || 'Activo'}</span>
                </div>
              </div>
            </div>
            {/* Sección de relaciones: Asignar Puesto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Relación: Puesto
              </h3>
              {!showPuestoSelect ? (
                <button className="btn-relacion-exclusive w-full" onClick={() => { setShowPuestoSelect(true); setSelectedPuesto(person.puesto_id || ''); }}>
                  {person.puesto ? 'Cambiar Puesto' : 'Asignar Puesto'}
                </button>
              ) : (
                <div className="space-y-2">
                  <Select value={selectedPuesto || ''} onValueChange={setSelectedPuesto} className="w-full">
                    <option value="" disabled>Seleccione un puesto</option>
                    {puestos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </Select>
                  <div className="flex gap-2">
                    <button onClick={handleSavePuesto} disabled={!selectedPuesto || isSavingPuesto} className="btn-relacion-exclusive bg-emerald-600 text-white px-4 py-2 rounded">
                      {isSavingPuesto ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button onClick={() => setShowPuestoSelect(false)} disabled={isSavingPuesto} className="border px-4 py-2 rounded">Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{person.email || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-sm font-medium text-gray-900">{person.telefono || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="text-sm font-medium text-gray-900">{person.direccion || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Documento</p>
                    <p className="text-sm font-medium text-gray-900">{person.documento_identidad || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Cargo</p>
                    <p className="text-sm font-medium text-gray-900">{person.puesto || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Departamento</p>
                    <p className="text-sm font-medium text-gray-900">{person.departamento || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Ingreso</p>
                    <p className="text-sm font-medium text-gray-900">
                      {person.fecha_ingreso ? new Date(person.fecha_ingreso).toLocaleDateString('es-ES') : 'No especificado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(person.estado)}`}>
                      {person.estado || 'Activo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ISO 9001 Compliance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cumplimiento ISO 9001</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Capacitaciones Completadas</h4>
                  <p className="text-2xl font-bold text-blue-600">8/10</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Evaluaciones de Desempeño</h4>
                  <p className="text-2xl font-bold text-green-600">Aprobado</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">Certificaciones Vigentes</h4>
                  <p className="text-2xl font-bold text-yellow-600">3 Activas</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900 mb-2">Última Auditoría</h4>
                  <p className="text-2xl font-bold text-purple-600">02/11/2024</p>
                </div>
              </div>
            </div>

            {/* Experiencia Laboral */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experiencia Laboral
                </h3>
                <button
                  onClick={() => openExperienciaModal()}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {experiencias.length > 0 ? experiencias.map((exp) => (
                  <div key={exp.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => openExperienciaModal(exp)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.puesto}</h4>
                        <p className="text-sm text-gray-600">{exp.empresa}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(exp.fecha_inicio).toLocaleDateString('es-ES')} - 
                          {exp.fecha_fin ? new Date(exp.fecha_fin).toLocaleDateString('es-ES') : 'Presente'}
                        </p>
                        {exp.descripcion && (
                          <p className="text-sm text-gray-600 mt-2">{exp.descripcion}</p>
                        )}
                      </div>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay experiencia laboral registrada</p>
                    <button
                      onClick={() => openExperienciaModal()}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Agregar primera experiencia
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Formación Académica */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Formación Académica
                </h3>
                <button
                  onClick={() => openFormacionModal()}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {formaciones.length > 0 ? formaciones.map((form) => (
                  <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => openFormacionModal(form)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{form.titulo}</h4>
                        <p className="text-sm text-gray-600">{form.institucion}</p>
                        <p className="text-sm text-gray-500">
                          Finalizado: {new Date(form.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay formación académica registrada</p>
                    <button
                      onClick={() => openFormacionModal()}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Agregar primera formación
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Habilidades e Idiomas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Habilidades e Idiomas
                </h3>
                <button
                  onClick={() => openHabilidadesModal()}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habilidades.length > 0 ? habilidades.map((hab) => (
                  <div key={hab.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer" onClick={() => openHabilidadesModal(hab)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{hab.habilidad}</h4>
                        <p className="text-sm text-gray-600">{hab.nivel}</p>
                      </div>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay habilidades o idiomas registrados</p>
                    <button
                      onClick={() => openHabilidadesModal()}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Agregar primera habilidad
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Capacitaciones Personales (Legajo) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Capacitaciones Personales
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Legajo</span>
                </h3>
                <button
                  onClick={() => openCapacitacionPersonalModal()}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {capacitacionesPersonales.length > 0 ? capacitacionesPersonales.map((cap) => (
                  <div key={cap.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => openCapacitacionPersonalModal(cap)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900">{cap.titulo}</h4>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            cap.certificado === 'si' ? 'bg-green-100 text-green-800' :
                            cap.certificado === 'no' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cap.certificado === 'si' ? 'Certificado' : 
                             cap.certificado === 'no' ? 'Sin certificado' : 'En proceso'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{cap.institucion}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{cap.duracion}</span>
                          <span className="mx-2">•</span>
                          <span>{cap.tipo}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(cap.fecha_inicio).toLocaleDateString('es-ES')} - 
                          {cap.fecha_fin ? new Date(cap.fecha_fin).toLocaleDateString('es-ES') : 'En curso'}
                        </p>
                        {cap.descripcion && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{cap.descripcion}</p>
                        )}
                      </div>
                      <Edit className="w-4 h-4 text-gray-400 ml-4" />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay capacitaciones personales registradas</p>
                    <p className="text-sm text-gray-400 mt-1">Registra las capacitaciones previas del empleado</p>
                    <button
                      onClick={() => openCapacitacionPersonalModal()}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Agregar primera capacitación
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        <ExperienciaModal
          isOpen={experienciaModal.isOpen}
          onClose={closeExperienciaModal}
          onSave={handleSaveExperiencia}
          experiencia={experienciaModal.experiencia}
        />

        <FormacionModal
          isOpen={formacionModal.isOpen}
          onClose={closeFormacionModal}
          onSave={handleSaveFormacion}
          formacion={formacionModal.formacion}
        />

        <HabilidadesModal
          isOpen={habilidadesModal.isOpen}
          onClose={closeHabilidadesModal}
          onSave={handleSaveHabilidad}
          habilidad={habilidadesModal.habilidad}
        />

        <CapacitacionPersonalModal
          isOpen={capacitacionPersonalModal.isOpen}
          onClose={closeCapacitacionPersonalModal}
          onSave={handleSaveCapacitacionPersonal}
          capacitacion={capacitacionPersonalModal.capacitacion}
        />
      </div>
    </div>
  );
};

export default PersonalSingle;
