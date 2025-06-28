import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Pencil, 
  Trash2, 
  ClipboardCheck,
  Calendar,
  AlertCircle,
  Filter,
  PlusCircle,
  FileDown
} from "lucide-react";
import ReactECharts from 'echarts-for-react';
import AuditoriaModal from "./AuditoriaModal";
import AuditoriaSingle from "./AuditoriaSingle";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import auditoriasService from "@/services/auditorias";
import { apiService } from "@/services/apiService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function AuditoriasListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentAuditoria, setCurrentAuditoria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditorias, setAuditorias] = useState([]);
  const [activeTab, setActiveTab] = useState("list"); 
  const [procesoFiltro, setProcesoFiltro] = useState("");
  const [procesos, setProcesos] = useState([]);
  const [puestos, setPuestos] = useState([]); 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [auditoriaToDelete, setAuditoriaToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [auditoriasData, procesosData, puestosData] = await Promise.all([
        auditoriasService.getAllAuditorias(),
        apiService.get('/procesos'),
        apiService.get('/puestos') 
      ]);

      setAuditorias(auditoriasData || []);
      setProcesos(procesosData.data || []);
      setPuestos(puestosData.data || []);

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos. Verifique la conexión con el servidor.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuditoriaToAPI = async (auditoria) => {
    try {
      if (auditoria.id) {
        await auditoriasService.updateAuditoria(auditoria.id, auditoria);
      } else {
        await auditoriasService.createAuditoria(auditoria);
      }
      return true;
    } catch (error) {
      console.error("Error saving to API:", error);
      return false;
    }
  };

  const handleSave = async (auditoriaData) => {
    try {
      const isEditing = !!selectedAuditoria;
      if (auditoriaData.puesto_responsable_id) {
        auditoriaData.puesto_responsable_id = parseInt(auditoriaData.puesto_responsable_id, 10);
      }
      if (auditoriaData.proceso_id) {
        auditoriaData.proceso_id = parseInt(auditoriaData.proceso_id, 10);
      }

      const auditoria = {
        ...auditoriaData,
        id: isEditing ? selectedAuditoria.id : undefined,
        numero: auditoriaData.numero || `AUD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      };

      const success = await saveAuditoriaToAPI(auditoria);

      if (success) {
        toast({
          title: "Éxito",
          description: `Auditoría ${isEditing ? 'actualizada' : 'creada'} correctamente.`,
          className: "bg-green-500 text-white",
        });
        setIsModalOpen(false);
        setSelectedAuditoria(null);
        loadData();
      } else {
        throw new Error("Error al guardar en la API");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la auditoría.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (auditoria) => {
    setSelectedAuditoria(auditoria);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setAuditoriaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await auditoriasService.deleteAuditoria(auditoriaToDelete);
      toast({ title: "Eliminado", description: "La auditoría ha sido eliminada." });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la auditoría.", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
      setAuditoriaToDelete(null);
    }
  };

  const handleViewAuditoria = (auditoria) => {
    setCurrentAuditoria(auditoria);
    setShowSingle(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Planificada': return 'bg-blue-100 text-blue-800';
      case 'En Progreso': return 'bg-yellow-100 text-yellow-800';
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Auditorías", 14, 16);
    const tableColumn = ["Número", "Fecha", "Proceso", "Puesto Responsable", "Estado"];
    const tableRows = [];
    filteredAuditorias.forEach(auditoria => {
      const rowData = [
        auditoria.numero,
        new Date(auditoria.fecha_programada).toLocaleDateString(),
        procesos.find(p => p.id === auditoria.proceso_id)?.nombre || 'N/A',
        puestos.find(p => p.id === auditoria.puesto_responsable_id)?.nombre || 'N/A',
        auditoria.estado
      ];
      tableRows.push(rowData);
    });
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("reporte_auditorias.pdf");
  };

  const filteredAuditorias = auditorias.filter((auditoria) => {
    const searchTermLower = searchTerm.toLowerCase();
    const responsableName = puestos.find(p => p.id === auditoria.puesto_responsable_id)?.nombre || '';
    const matchesSearch = 
      auditoria.objetivo?.toLowerCase().includes(searchTermLower) ||
      responsableName.toLowerCase().includes(searchTermLower);
    const matchesProceso = procesoFiltro ? auditoria.proceso_id === parseInt(procesoFiltro) : true;
    return matchesSearch && matchesProceso;
  });

  if (showSingle) {
    return <AuditoriaSingle auditoria={currentAuditoria} onBack={() => setShowSingle(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50/50">
      <header className="bg-white shadow-sm p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Auditorías</h1>
            <p className="text-sm text-gray-600">Supervisa, planifica y gestiona todas las auditorías del sistema.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportToPDF}><FileDown className="h-4 w-4 mr-2"/>Exportar</Button>
            <Button onClick={() => { setSelectedAuditoria(null); setIsModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white"><PlusCircle className="h-4 w-4 mr-2"/>Nueva Auditoría</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar por objetivo o puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={procesoFiltro}
                  onChange={(e) => setProcesoFiltro(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 text-sm text-gray-600"
                >
                  <option value="">Todos los procesos</option>
                  {procesos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4 mx-auto"></div>
                <h2 className="text-xl font-semibold">Cargando...</h2>
            </div>
          </div>
        ) : activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuditorias.length > 0 ? (
              filteredAuditorias.map(auditoria => {
                const proceso = procesos.find(p => p.id === auditoria.proceso_id);
                const puestoResponsable = puestos.find(p => p.id === auditoria.puesto_responsable_id);
                return (
                  <motion.div
                    key={auditoria.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleViewAuditoria(auditoria)}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{auditoria.objetivo}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(auditoria.estado)}`}>
                          {auditoria.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{auditoria.numero}</p>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Proceso: {proceso?.nombre || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Responsable: {puestoResponsable?.nombre || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{new Date(auditoria.fecha_programada).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(auditoria); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); confirmDelete(auditoria.id); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No se encontraron auditorías. Haz clic en "Nueva Auditoría" para comenzar.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow"><ReactECharts option={{ title: { text: 'Dashboard en desarrollo' } }} /></div>
            <div className="bg-white p-4 rounded-lg shadow"><ReactECharts option={{ title: { text: 'Dashboard en desarrollo' } }} /></div>
          </div>
        )}
      </main>

      <AuditoriaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuditoria(null);
        }}
        onSave={handleSave}
        auditoria={selectedAuditoria}
        procesos={procesos}
        puestos={puestos}
      />

      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p className="py-4">¿Estás seguro de que deseas eliminar esta auditoría? Esta acción no se puede deshacer.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AuditoriasListing;
