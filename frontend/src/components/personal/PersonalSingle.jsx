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

export default function PersonalSingle({ initialPerson = null, onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  console.log('🎯 PersonalSingle renderizado con ID:', id);
  console.log('📍 Location state:', location.state);
  console.log('👤 Initial person:', initialPerson);
  console.log('🌍 PersonalSingle URL:', window.location.href);
  console.log('🗺️ PersonalSingle Pathname:', window.location.pathname);
  
  // Obtener datos iniciales si se pasan como props
  const initialData = location.state?.person || initialPerson;

  // Función para manejar el regreso al listado
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/app/personal');
    }
  };

  const [person, setPerson] = useState(initialData || {});
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  // Estados para modales
  const [experienciaModal, setExperienciaModal] = useState({ isOpen: false, experiencia: null });
  const [formacionModal, setFormacionModal] = useState({ isOpen: false, formacion: null });
  const [habilidadesModal, setHabilidadesModal] = useState({ isOpen: false, habilidad: null });
  const [capacitacionPersonalModal, setCapacitacionPersonalModal] = useState({ isOpen: false, capacitacion: null });

  // Estados para relaciones usando relaciones_sgc
  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [showPuestoSelect, setShowPuestoSelect] = useState(false);
  const [showDepartamentoSelect, setShowDepartamentoSelect] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [isSavingPuesto, setIsSavingPuesto] = useState(false);
  const [isSavingDepartamento, setIsSavingDepartamento] = useState(false);

  // Datos de ejemplo para experiencia laboral
  const [experienciaLaboral, setExperienciaLaboral] = useState([
    {
      id: 1,
      empresa: "Empresa ABC",
      cargo: "Analista de Sistemas",
      fecha_inicio: "2020-01-15",
      fecha_fin: "2022-06-30",
      descripcion: "Desarrollo y mantenimiento de aplicaciones web, análisis de requerimientos, implementación de mejoras en sistemas existentes"
    },
    {
      id: 2,
      empresa: "Startup XYZ",
      cargo: "Desarrollador Full Stack",
      fecha_inicio: "2022-07-01",
      fecha_fin: "2023-12-31",
      descripcion: "Desarrollo completo de aplicaciones web usando React, Node.js y PostgreSQL. Participación en diseño de arquitectura y mentoring de desarrolladores junior"
    }
  ]);

  // Datos de ejemplo para formación académica
  const [formacionAcademica, setFormacionAcademica] = useState([
    {
      id: 1,
      titulo: "Ingeniería en Sistemas de Información",
      institucion: "Universidad Nacional",
      fecha_inicio: "2016-03-01",
      fecha_fin: "2020-12-15",
      estado: "Completado",
      descripcion: "Carrera completa con especialización en desarrollo de software y gestión de proyectos"
    },
    {
      id: 2,
      titulo: "Maestría en Gestión de Tecnologías de la Información",
      institucion: "Universidad Tecnológica",
      fecha_inicio: "2021-03-01",
      fecha_fin: "2023-06-30",
      estado: "En curso",
      descripcion: "Programa de posgrado enfocado en estrategias de TI y transformación digital"
    }
  ]);

  // Datos de ejemplo para habilidades y competencias
  const [habilidadesCompetencias, setHabilidadesCompetencias] = useState([
    {
      id: 1,
      categoria: "Lenguajes de Programación",
      habilidades: ["JavaScript", "Python", "Java", "C#", "SQL"]
    },
    {
      id: 2,
      categoria: "Frameworks y Tecnologías",
      habilidades: ["React", "Node.js", "Express", "Django", "Spring Boot"]
    },
    {
      id: 3,
      categoria: "Herramientas y Metodologías",
      habilidades: ["Git", "Docker", "Agile", "Scrum", "DevOps"]
    },
    {
      id: 4,
      categoria: "Habilidades Blandas",
      habilidades: ["Liderazgo", "Comunicación", "Trabajo en equipo", "Resolución de problemas"]
    }
  ]);

  // Datos de ejemplo para capacitaciones personales
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

  useEffect(() => {
    console.log('🔄 useEffect ejecutado con ID:', id);
    console.log('📊 Initial data:', initialData);
    
    // Si ya tenemos los datos (vía props o state), no necesitamos volver a cargar.
    if (initialData) {
      console.log('✅ Usando datos iniciales, no cargando desde backend');
      return;
    }

    // Solo intentar cargar desde el backend si el ID no es temporal
    if (id && !id.toString().startsWith('temp-')) {
      console.log('🔄 Cargando datos desde backend para ID:', id);
      fetchPersonal();
    } else if (id && id.toString().startsWith('temp-')) {
      // Si es un ID temporal y no tenemos datos, mostrar error
      console.log('❌ ID temporal detectado:', id);
      setError('No se pueden cargar los datos de este registro temporal');
      setLoading(false);
    }
    loadPuestos();
    loadDepartamentos();
  }, [id]);

  // Funciones para manejar los modales de Experiencia
  const openExperienciaModal = (experiencia = null) => {
    setExperienciaModal({ isOpen: true, experiencia });
  };

  const closeExperienciaModal = () => {
    setExperienciaModal({ isOpen: false, experiencia: null });
  };

  const handleSaveExperiencia = (experienciaData) => {
    if (experienciaData.id) {
      // Actualizar experiencia existente
      setExperienciaLaboral(prev => 
        prev.map(exp => exp.id === experienciaData.id ? experienciaData : exp)
      );
    } else {
      // Agregar nueva experiencia
      const newExperiencia = {
        ...experienciaData,
        id: Date.now()
      };
      setExperienciaLaboral(prev => [...prev, newExperiencia]);
    }
    closeExperienciaModal();
    toast({
      title: "Experiencia guardada",
      description: "La experiencia laboral se ha guardado correctamente.",
      variant: "success"
    });
  };

  // Funciones para manejar los modales de Formación
  const openFormacionModal = (formacion = null) => {
    setFormacionModal({ isOpen: true, formacion });
  };

  const closeFormacionModal = () => {
    setFormacionModal({ isOpen: false, formacion: null });
  };

  const handleSaveFormacion = (formacionData) => {
    if (formacionData.id) {
      // Actualizar formación existente
      setFormacionAcademica(prev => 
        prev.map(form => form.id === formacionData.id ? formacionData : form)
      );
    } else {
      // Agregar nueva formación
      const newFormacion = {
        ...formacionData,
        id: Date.now()
      };
      setFormacionAcademica(prev => [...prev, newFormacion]);
    }
    closeFormacionModal();
    toast({
      title: "Formación guardada",
      description: "La formación académica se ha guardado correctamente.",
      variant: "success"
    });
  };

  // Funciones para manejar los modales de Habilidades
  const openHabilidadesModal = (habilidad = null) => {
    setHabilidadesModal({ isOpen: true, habilidad });
  };

  const closeHabilidadesModal = () => {
    setHabilidadesModal({ isOpen: false, habilidad: null });
  };

  const handleSaveHabilidad = (habilidadData) => {
    if (habilidadData.id) {
      // Actualizar habilidad existente
      setHabilidadesCompetencias(prev => 
        prev.map(hab => hab.id === habilidadData.id ? habilidadData : hab)
      );
    } else {
      // Agregar nueva habilidad
      const newHabilidad = {
        ...habilidadData,
        id: Date.now()
      };
      setHabilidadesCompetencias(prev => [...prev, newHabilidad]);
    }
    closeHabilidadesModal();
    toast({
      title: "Habilidad guardada",
      description: "Las habilidades y competencias se han guardado correctamente.",
      variant: "success"
    });
  };

  // Funciones para manejar los modales de Capacitación Personal
  const openCapacitacionPersonalModal = (capacitacion = null) => {
    setCapacitacionPersonalModal({ isOpen: true, capacitacion });
  };

  const closeCapacitacionPersonalModal = () => {
    setCapacitacionPersonalModal({ isOpen: false, capacitacion: null });
  };

  const handleSaveCapacitacionPersonal = (capacitacionData) => {
    if (capacitacionData.id) {
      // Actualizar capacitación existente
      setCapacitacionesPersonales(prev => 
        prev.map(cap => cap.id === capacitacionData.id ? capacitacionData : cap)
      );
    } else {
      // Agregar nueva capacitación
      const newCapacitacion = {
        ...capacitacionData,
        id: Date.now()
      };
      setCapacitacionesPersonales(prev => [...prev, newCapacitacion]);
    }
    closeCapacitacionPersonalModal();
    toast({
      title: "Capacitación guardada",
      description: "La capacitación personal se ha guardado correctamente.",
      variant: "success"
    });
  };

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      console.log('Intentando cargar personal con ID:', id);
      
      // Usar el nuevo método que incluye relaciones
      const data = await personalService.getPersonalConRelaciones(id, user?.organization_id);
      setPerson(data);
    } catch (error) {
      console.error('Error fetching personal with id', id, ':', error);
      setError(error.message);
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar la información del personal." });
    } finally {
      setLoading(false);
    }
  };

  // Cargar puestos disponibles usando el nuevo servicio
  const loadPuestos = async () => {
    try {
      const data = await personalService.getPuestosDisponibles(user?.organization_id);
      setPuestos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los puestos",
        variant: "destructive"
      });
    }
  };

  // Cargar departamentos disponibles usando el nuevo servicio
  const loadDepartamentos = async () => {
    try {
      const data = await personalService.getDepartamentosDisponibles(user?.organization_id);
      setDepartamentos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los departamentos",
        variant: "destructive"
      });
    }
  };

  // Guardar puesto seleccionado usando relaciones_sgc
  const handleSavePuesto = async () => {
    if (!selectedPuesto) return;
    setIsSavingPuesto(true);
    try {
      await personalService.asignarPuesto(
        person.id, 
        selectedPuesto, 
        user?.organization_id, 
        user?.id
      );
      toast({
        title: "Puesto asignado",
        description: "La relación con el puesto se ha guardado correctamente usando relaciones_sgc.",
        variant: "success"
      });
      setShowPuestoSelect(false);
      fetchPersonal(); // Recargar para mostrar la nueva relación
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

  // Guardar departamento seleccionado usando relaciones_sgc
  const handleSaveDepartamento = async () => {
    if (!selectedDepartamento) return;
    setIsSavingDepartamento(true);
    try {
      await personalService.asignarDepartamento(
        person.id, 
        selectedDepartamento, 
        user?.organization_id, 
        user?.id
      );
      toast({
        title: "Departamento asignado",
        description: "La relación con el departamento se ha guardado correctamente usando relaciones_sgc.",
        variant: "success"
      });
      setShowDepartamentoSelect(false);
      fetchPersonal(); // Recargar para mostrar la nueva relación
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el departamento",
        variant: "destructive"
      });
    } finally {
      setIsSavingDepartamento(false);
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
    console.log('⏳ PersonalSingle en estado de carga...');
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
    console.log('❌ PersonalSingle con error o sin datos:', { error, person });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error || 'No se encontró la información del personal'}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ PersonalSingle renderizando componente principal con datos:', person);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {person.nombres} {person.apellidos}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
            </div>
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
                  {person.puesto_actual?.nombre || person.puesto || 'Cargo no especificado'}
                </p>

                {/* Status */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(person.estado)}`}>
                  {getStatusIcon(person.estado)}
                  <span className="ml-2">{person.estado || 'Activo'}</span>
                </div>
              </div>
            </div>

            {/* Sección de relaciones usando relaciones_sgc */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Relaciones del Sistema (relaciones_sgc)
              </h3>
              
              {/* Asignar Puesto */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Puesto Actual:</h4>
                {person.puesto_actual ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 rounded border">
                    <span className="text-sm">{person.puesto_actual.nombre}</span>
                    <button 
                      onClick={() => { setShowPuestoSelect(true); setSelectedPuesto(person.puesto_actual.id); }}
                      className="text-xs text-emerald-600 hover:text-emerald-800"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn-relacion-exclusive w-full" 
                    onClick={() => { setShowPuestoSelect(true); setSelectedPuesto(''); }}
                  >
                    Asignar Puesto
                  </button>
                )}
              </div>

              {/* Asignar Departamento */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Departamento Actual:</h4>
                {person.departamento_actual ? (
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                    <span className="text-sm">{person.departamento_actual.nombre}</span>
                    <button 
                      onClick={() => { setShowDepartamentoSelect(true); setSelectedDepartamento(person.departamento_actual.id); }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn-relacion-exclusive w-full" 
                    onClick={() => { setShowDepartamentoSelect(true); setSelectedDepartamento(''); }}
                  >
                    Asignar Departamento
                  </button>
                )}
              </div>

              {/* Selectores de Puesto y Departamento */}
              {showPuestoSelect && (
                <div className="space-y-2 mb-4">
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

              {showDepartamentoSelect && (
                <div className="space-y-2">
                  <Select value={selectedDepartamento || ''} onValueChange={setSelectedDepartamento} className="w-full">
                    <option value="" disabled>Seleccione un departamento</option>
                    {departamentos.map((d) => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </Select>
                  <div className="flex gap-2">
                    <button onClick={handleSaveDepartamento} disabled={!selectedDepartamento || isSavingDepartamento} className="btn-relacion-exclusive bg-blue-600 text-white px-4 py-2 rounded">
                      {isSavingDepartamento ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button onClick={() => setShowDepartamentoSelect(false)} disabled={isSavingDepartamento} className="border px-4 py-2 rounded">Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Legajo</label>
                  <p className="mt-1 text-sm text-gray-900">{person.numero_legajo || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
                  <p className="mt-1 text-sm text-gray-900">{person.documento_identidad || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {person.email || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {person.telefono || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {person.fecha_ingreso || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {person.direccion || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Experiencia Laboral
                </h3>
                <button
                  onClick={() => openExperienciaModal()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {experienciaLaboral.map((experiencia) => (
                  <div key={experiencia.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{experiencia.cargo}</h4>
                        <p className="text-sm text-gray-600">{experiencia.empresa}</p>
                        <p className="text-sm text-gray-500">
                          {experiencia.fecha_inicio} - {experiencia.fecha_fin || 'Presente'}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">{experiencia.descripcion}</p>
                      </div>
                      <button
                        onClick={() => openExperienciaModal(experiencia)}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Formación Académica
                </h3>
                <button
                  onClick={() => openFormacionModal()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {formacionAcademica.map((formacion) => (
                  <div key={formacion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{formacion.titulo}</h4>
                        <p className="text-sm text-gray-600">{formacion.institucion}</p>
                        <p className="text-sm text-gray-500">
                          {formacion.fecha_inicio} - {formacion.fecha_fin || 'En curso'}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          formacion.estado === 'Completado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {formacion.estado}
                        </span>
                        <p className="text-sm text-gray-700 mt-2">{formacion.descripcion}</p>
                      </div>
                      <button
                        onClick={() => openFormacionModal(formacion)}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Habilidades y Competencias
                </h3>
                <button
                  onClick={() => openHabilidadesModal()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {habilidadesCompetencias.map((categoria) => (
                  <div key={categoria.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{categoria.categoria}</h4>
                        <div className="flex flex-wrap gap-2">
                          {categoria.habilidades.map((habilidad, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {habilidad}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => openHabilidadesModal(categoria)}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Capacitaciones Personales
                </h3>
                <button
                  onClick={() => openCapacitacionPersonalModal()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </button>
              </div>
              <div className="space-y-4">
                {capacitacionesPersonales.map((capacitacion) => (
                  <div key={capacitacion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{capacitacion.titulo}</h4>
                        <p className="text-sm text-gray-600">{capacitacion.institucion}</p>
                        <p className="text-sm text-gray-500">
                          {capacitacion.fecha_inicio} - {capacitacion.fecha_fin}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">Duración: {capacitacion.duracion}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            capacitacion.certificado === 'si' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {capacitacion.certificado === 'si' ? 'Certificado' : 'Sin certificado'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{capacitacion.descripcion}</p>
                      </div>
                      <button
                        onClick={() => openCapacitacionPersonalModal(capacitacion)}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
  );
}
