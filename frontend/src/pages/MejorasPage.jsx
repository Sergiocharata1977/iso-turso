import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HallazgosBoard from '@/components/mejoras/HallazgosBoard';
import HallazgosList from '@/components/mejoras/HallazgosList';
import HallazgoDetailModal from '@/components/mejoras/HallazgoDetailModal';
import NuevoHallazgoModal from '@/components/mejoras/NuevoHallazgoModal';
import hallazgosService from '@/services/hallazgosService';

const MejorasPage = () => {
  const [view, setView] = useState('board'); // 'board' or 'list'
  const [hallazgos, setHallazgos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHallazgo, setSelectedHallazgo] = useState(null);
  const [isNewHallazgoModalOpen, setIsNewHallazgoModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHallazgos = async () => {
    try {
      const data = await hallazgosService.getAllHallazgos();
      setHallazgos(data);
    } catch (error) {
      console.error("Error fetching hallazgos:", error);
    }
  };

  useEffect(() => {
    fetchHallazgos();
  }, []);

  const handleCardClick = (hallazgo) => {
    setSelectedHallazgo(hallazgo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHallazgo(null);
  };

  const handleRefresh = () => {
    fetchHallazgos();
  };

  const filteredHallazgos = useMemo(() => {
    if (!searchTerm) {
      return hallazgos;
    }
    return hallazgos.filter(h =>
      (h.codigo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (h.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (h.responsable?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [hallazgos, searchTerm]);

  const metrics = useMemo(() => {
    const total = hallazgos.length;
    const deteccion = hallazgos.filter(h => h.estado === 'Detección').length;
    const tratamiento = hallazgos.filter(h => h.estado === 'Tratamiento').length;
    const verificacion = hallazgos.filter(h => h.estado === 'Verificación').length;
    return { total, deteccion, tratamiento, verificacion };
  }, [hallazgos]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Sistema de Mejoras ISO 9001</h1>
            <p className="text-gray-500 dark:text-gray-400">Gestión de hallazgos y acciones correctivas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>
              <List className="mr-2 h-4 w-4" />
              Lista
            </Button>
            <Button variant={view === 'board' ? 'default' : 'outline'} onClick={() => setView('board')}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Tablero
            </Button>
            <Button className="ml-4 bg-slate-800 text-white hover:bg-slate-700" onClick={() => setIsNewHallazgoModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Hallazgo
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hallazgos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Detección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.deteccion}</div>
            <p className="text-xs text-muted-foreground">Requieren acción inmediata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tratamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tratamiento}</div>
            <p className="text-xs text-muted-foreground">Análisis y corrección</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Verificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.verificacion}</div>
            <p className="text-xs text-muted-foreground">Validando eficacia</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por código, descripción o responsable..."
            className="pl-10 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {view === 'board' ? (
        <HallazgosBoard hallazgos={filteredHallazgos} onCardClick={handleCardClick} onUpdate={handleRefresh} />
      ) : (
        <HallazgosList hallazgos={filteredHallazgos} onCardClick={handleCardClick} />
      )}

      {selectedHallazgo && (
        <HallazgoDetailModal
          hallazgo={selectedHallazgo}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleRefresh}
        />
      )}

      <NuevoHallazgoModal 
        isOpen={isNewHallazgoModalOpen}
        onClose={() => setIsNewHallazgoModalOpen(false)}
        onUpdate={() => {
          setIsNewHallazgoModalOpen(false);
          handleRefresh();
        }}
      />
    </div>
  );
};

export default MejorasPage;
