import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, User, Download, Filter, Grid, List, ArrowLeft, Mail, Phone, MapPin, Calendar, Building, Award, CheckCircle, AlertCircle, Clock, Users, Eye, UserCheck } from 'lucide-react';
import { personalService } from '@/services/personalService';
import PersonalModal from './PersonalModal';
import PersonalTableView from './PersonalTableView';
import PersonalCard from './PersonalCard';
import UnifiedHeader from '../common/UnifiedHeader';
import UnifiedCard from '../common/UnifiedCard';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { PersonalCardSkeleton, TableSkeleton, HeaderSkeleton } from "@/components/ui/skeleton";

const PersonalListing = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
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
      
      const validPersonal = Array.isArray(data) ? data.map((person, index) => ({
        ...person,
        nombres: person.nombres || person.nombre || '',
        apellidos: person.apellidos || person.apellido || '',
        documento_identidad: person.documento_identidad || person.dni || '',
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

  const handleCardClick = (person) => {
    console.log('🔍 handleCardClick INICIADO con:', person);
    if (!person) {
      console.log('❌ handleCardClick: person es null o undefined');
      return;
    }
    if (!person.id) {
      console.log('❌ handleCardClick: person.id es null o undefined');
      return;
    }
    console.log('🎯 Navegando a:', `/app/personal/${person.id}`);
    console.log('📍 Estado a pasar:', { person: person });
    console.log('🌍 URL actual:', window.location.href);
    console.log('🗺️ Pathname actual:', window.location.pathname);
    // Navegar al componente single con el ID del personal
    navigate(`/app/personal/${person.id}`, { 
      state: { person: person } 
    });
    console.log('🚀 Navigate ejecutado');
    // Verificar después de un momento
    setTimeout(() => {
      console.log('🔍 URL después de navigate:', window.location.href);
      console.log('🔍 Pathname después de navigate:', window.location.pathname);
    }, 100);
    console.log('✅ handleCardClick COMPLETADO');
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
        return CheckCircle;
      case 'inactivo':
        return AlertCircle;
      case 'suspendido':
        return Clock;
      default:
        return User;
    }
  };

  const getStats = () => {
    const total = personal.length;
    const activos = personal.filter(p => p.estado?.toLowerCase() === 'activo').length;
    const inactivos = personal.filter(p => p.estado?.toLowerCase() === 'inactivo').length;
    const conPuesto = personal.filter(p => p.puesto).length;
    
    return { total, activos, inactivos, conPuesto };
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 h-20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-1">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

  const stats = getStats();

  const renderGridView = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 h-20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-1">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredPersonal.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontró personal.</p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            <User className="h-4 w-4 mr-2" />
            Agregar primera persona
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPersonal.map((person) => {
          const StatusIcon = getStatusIcon(person.estado);
          const fields = [
            ...(person.puesto ? [{ 
              icon: Building, 
              label: "Puesto", 
              value: person.puesto 
            }] : []),
            ...(person.email ? [{ 
              icon: Mail, 
              label: "Email", 
              value: person.email 
            }] : []),
            ...(person.telefono ? [{ 
              icon: Phone, 
              label: "Teléfono", 
              value: person.telefono 
            }] : []),
            ...(person.documento_identidad ? [{ 
              icon: User, 
              label: "Documento", 
              value: person.documento_identidad 
            }] : [])
          ];

          console.log('🎨 Renderizando tarjeta para:', person.nombres, person.apellidos, 'ID:', person.id);
          return (
            <UnifiedCard
              key={person.displayId}
              title={`${person.nombres} ${person.apellidos}`}
              subtitle={person.numero_legajo}
              description={person.puesto || 'Sin puesto asignado'}
              status={person.estado || 'activo'}
              fields={fields}
              icon={Users}
              primaryColor="emerald"
              onView={() => handleCardClick(person)}
              onEdit={() => handleOpenModal(person)}
              onDelete={() => handleDelete(person)}
            />
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <PersonalTableView
        personal={filteredPersonal}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <UnifiedHeader
        title="Gestión de Personal"
        description="Administra los empleados de la organización según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={() => handleOpenModal()}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        newButtonText="Nuevo Personal"
        totalCount={personal.length}
        lastUpdated="hoy"
        icon={Users}
        primaryColor="emerald"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Puesto</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conPuesto}</div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <PersonalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        person={selectedPerson}
        onSave={handleSave}
      />
    </div>
  );
};

export default PersonalListing;
