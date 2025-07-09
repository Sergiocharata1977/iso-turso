import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, User, Download, Filter, Grid, List, ArrowLeft, Mail, Phone, MapPin, Calendar, Building, Award, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import personalService from '@/services/personalService';
import PersonalModal from './PersonalModal';
import PersonalTableView from './PersonalTableView';
import PersonalCard from './PersonalCard';
import { useToast } from "@/components/ui/use-toast";

const PersonalListing = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid o list
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const data = await personalService.getAllPersonal();
      console.log('Datos recibidos del servicio:', data);
      
      // Procesar los datos - solo incluir registros con ID válido
      const validPersonal = Array.isArray(data) ? data.map((person, index) => ({
        ...person,
        nombres: person.nombres || person.nombre || '',
        apellidos: person.apellidos || person.apellido || '',
        documento_identidad: person.documento_identidad || person.dni || '',
        // Solo agregar ID temporal si realmente no tiene ID y es necesario para la UI
        displayId: person.id || `temp-${index}`,
        isTemporary: !person.id
      })).filter(person => person.id || person.isTemporary) : [];
      
      setPersonal(validPersonal);
    } catch (error) {
      setError(error.message);
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el personal." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (person = null) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  // Navega al detalle del personal. Si el registro no tiene un ID real (ej. temporal),
  // igualmente navegamos y pasamos la información por estado para que el detalle se muestre
  // sin requerir otra llamada al backend.
  const handleCardClick = (person) => {
    if (!person) return;

    // Si es un registro temporal, usar el displayId para la URL pero siempre pasar los datos
    const urlId = person.id || person.displayId;
    navigate(`/personal/${urlId}`, { state: { person } });
  };

  const handleSave = async (personData) => {
    try {
      if (selectedPerson) {
        await personalService.updatePersonal(selectedPerson.id, personData);
        toast({ title: "Éxito", description: "Personal actualizado correctamente." });
      } else {
        await personalService.createPersonal(personData);
        toast({ title: "Éxito", description: "Personal creado correctamente." });
      }
      handleCloseModal();
      fetchPersonal();
    } catch (error) {
      console.error('Error saving person:', error);
      
      // Manejar errores específicos del backend
      let errorMessage = "No se pudo guardar el registro.";
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.error === 'DUPLICATE_DOCUMENTO_IDENTIDAD') {
          errorMessage = "Ya existe una persona con este documento de identidad.";
        } else if (errorData.error === 'DUPLICATE_EMAIL') {
          errorMessage = "Ya existe una persona con este email.";
        } else if (errorData.error === 'DUPLICATE_NUMERO_LEGAJO') {
          errorMessage = "Ya existe una persona con este número de legajo.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: errorMessage 
      });
    }
  };

  const handleDelete = async (person) => {
    if (person.isTemporary || person.id?.toString().startsWith('temp-')) {
      toast({ variant: "destructive", title: "Error", description: "No se puede eliminar este registro temporal." });
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await personalService.deletePersonal(person.id);
        toast({ title: "Éxito", description: "Personal eliminado correctamente." });
        fetchPersonal();
      } catch (error) {
        console.error('Error deleting person:', error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el registro." });
      }
    }
  };

  const handleExport = () => {
    toast({ title: "Exportar", description: "Función de exportación en desarrollo." });
  };

  const handleFilters = () => {
    toast({ title: "Filtros", description: "Función de filtros en desarrollo." });
  };

  const filteredPersonal = Array.isArray(personal) ? personal.filter(person =>
    `${person.nombres || ''} ${person.apellidos || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.puesto && person.puesto.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (person.departamento && person.departamento.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (person.documento_identidad && person.documento_identidad.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : '';
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || 'SN';
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
          <p className="text-gray-600">Cargando personal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPersonal}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Reintentar
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
              <p className="text-sm text-gray-600">Administra los empleados de la organización según ISO 9001</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              + Nuevo Personal
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar personal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            
            <button
              onClick={handleFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <PersonalTableView 
            personal={filteredPersonal}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPersonal.map(person => (
              <div 
                key={person.id || person.displayId} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCardClick(person)}
              >
                <div className="p-6">
                  {/* Avatar y Estado */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {person.imagen ? (
                        <img 
                          src={person.imagen} 
                          alt={`${person.nombres} ${person.apellidos}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(person.nombres, person.apellidos)
                      )}
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.estado)}`}>
                      {getStatusIcon(person.estado)}
                      <span className="ml-1">{person.estado || 'Activo'}</span>
                    </div>
                  </div>

                  {/* Información Principal */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {person.nombres} {person.apellidos}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {person.puesto || 'Cargo no especificado'}
                    </p>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{person.departamento || 'Sin departamento'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>{person.documento_identidad || 'Sin documento'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{person.email || 'Sin email'}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(person); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(person); }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar"
                      disabled={person.isTemporary || person.id?.toString().startsWith('temp-')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {filteredPersonal.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay personal registrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando el primer empleado a la organización.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Agregar Personal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PersonalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          person={selectedPerson}
        />
      )}
    </div>
  );
};

export default PersonalListing;
