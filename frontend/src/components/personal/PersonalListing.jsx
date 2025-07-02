import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, User } from 'lucide-react';
import personalService from '@/services/personalService';
import PersonalModal from './PersonalModal';
import GenericCard from '../ui/GenericCard';
import ListingHeader from '../common/ListingHeader';
import { useToast } from "@/components/ui/use-toast";

const PersonalListing = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const data = await personalService.getAllPersonal();
      setPersonal(data || []);
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
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el registro." });
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

  const filteredPersonal = personal.filter(person =>
    `${person.nombres} ${person.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.cargo && person.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="text-center p-4 text-white">Cargando personal...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <ListingHeader
        title="Gestión de Personal"
        subtitle="Administra los empleados de la organización"
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAddNew={() => handleOpenModal()}
        addNewLabel="Nuevo Personal"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPersonal.map(person => (
          <GenericCard
            theme="light"
            key={person.id}
            icon={User}
            title={`${person.nombres} ${person.apellidos}`}
            description={person.cargo || 'Cargo no especificado'}
            tags={[`Depto: ${person.departamento || 'N/A'}`]}
            onCardClick={() => navigate(`/personal/${person.id}`)}
            actions={[
              {
                icon: Edit,
                onClick: (e) => { e.stopPropagation(); handleOpenModal(person); },
                tooltip: 'Editar Personal',
              },
              {
                icon: Trash2,
                onClick: (e) => { e.stopPropagation(); handleDelete(person.id); },
                tooltip: 'Eliminar Personal',
              },
            ]}
          />
        ))}
      </div>

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
