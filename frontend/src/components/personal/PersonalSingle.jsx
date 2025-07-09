import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User, Building, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import personalService from '@/services/personalService';
import { useToast } from "@/components/ui/use-toast";

const PersonalSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPersonal();
    }
  }, [id]);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const data = await personalService.getPersonalById(id);
      setPerson(data);
    } catch (error) {
      setError(error.message);
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar la información del personal." });
    } finally {
      setLoading(false);
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSingle;
