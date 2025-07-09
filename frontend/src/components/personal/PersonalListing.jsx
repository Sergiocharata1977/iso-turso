import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, User, Download, Filter, Grid, List } from 'lucide-react';
import personalService from '@/services/personalService';
import PersonalModal from './PersonalModal';
import PersonalTableView from './PersonalTableView';
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
      setPersonal(Array.isArray(data) ? data : []);
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

  const handleCardClick = (person) => {
    navigate(`/personal/${person.id}`);
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await personalService.deletePersonal(id);
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
    (person.documento_identidad && person.documento_identidad.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : '';
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center p-4 text-white">Cargando personal...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Personal</h1>
            <p className="text-gray-600 mt-1">Administra los empleados de la organización según ISO 9001</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            + Nuevo Personal
          </button>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between gap-4">
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
              key={person.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick(person)}
            >
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(person.estado)}`}>
                  {person.estado || 'Activo'}
                </span>
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Departamento:</span>
                  <span className="text-gray-900 font-medium">{person.departamento || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Doc:</span>
                  <span className="text-gray-900">{person.documento_identidad || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900 truncate">{person.email || 'N/A'}</span>
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
                  onClick={(e) => { e.stopPropagation(); handleDelete(person.id); }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
