import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  LineChart,
  ArrowLeft,
  TrendingUp,
  Calendar
} from "lucide-react";
import MedicionModal from "./MedicionModal";
import { medicionesService } from "@/services"; // Asegúrate que la ruta sea correcta y medicionesService esté exportado

function MedicionesListing({ indicadorId, indicadorTitulo, objetivoId, objetivoTitulo, procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicion, setSelectedMedicion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mediciones, setMediciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMediciones();
  }, [indicadorId]);

  const loadMediciones = async () => {
    setIsLoading(true);
    try {
      const result = await medicionesService.getByIndicador(indicadorId);
      setMediciones(result || []); 
    } catch (error) {
      console.error("Error al cargar mediciones:", error);
      toast({
        title: "Error al cargar mediciones",
        description: error.message || "No se pudieron obtener los datos de las mediciones.",
        variant: "destructive"
      });
      setMediciones([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (medicionData) => {
    try {
      // El ID debe ser manejado por el backend, no generado en el frontend (Date.now() no es ideal para IDs persistentes)
      // Si el backend asigna el ID, no es necesario pasarlo en la creación.
      // Para actualización, el ID del selectedMedicion es el correcto.
      const dataToSave = {
        ...medicionData,
        indicador_id: indicadorId, // Asegurar que el ID del indicador se envía
        // indicador_titulo no debería ser parte del modelo de datos de medición, sino del indicador
      };

      if (selectedMedicion && selectedMedicion.id) {
        await medicionesService.update(selectedMedicion.id, dataToSave);
        toast({
          title: "Medición actualizada",
          description: "Los datos de la medición han sido actualizados exitosamente."
        });
      } else {
        await medicionesService.create(dataToSave);
        toast({
          title: "Medición creada",
          description: "Se ha agregado una nueva medición exitosamente."
        });
      }
      setIsModalOpen(false);
      setSelectedMedicion(null);
      loadMediciones(); // Recargar mediciones para reflejar los cambios
    } catch (error) {
      console.error("Error al guardar medición:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "Ocurrió un error al guardar la medición.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (medicion) => {
    setSelectedMedicion(medicion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Aquí podrías añadir una confirmación antes de borrar, ej. usando un diálogo
      await medicionesService.delete(id);
      toast({
        title: "Medición eliminada",
        description: "La medición ha sido eliminada exitosamente."
      });
      loadMediciones(); // Recargar mediciones para reflejar los cambios
    } catch (error) {
      console.error(`Error al eliminar medición con ID ${id}:`, error);
      toast({
        title: "Error al eliminar",
        description: error.message || "Ocurrió un error al eliminar la medición.",
        variant: "destructive"
      });
    }
  };


  const filteredMediciones = mediciones.filter(medicion =>
    medicion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicion.comentarios && medicion.comentarios.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb y título */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Indicadores
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{indicadorTitulo}</h2>
          <p className="text-muted-foreground">
            Mediciones del indicador para el objetivo: {objetivoTitulo}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar mediciones..."
              className="pl-8 h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => {
            setSelectedMedicion(null);
            setIsModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Medición
          </Button>
        </div>
      </div>

      {/* Lista de Mediciones */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando mediciones...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Medición</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Comentarios</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMediciones.map((medicion) => (
                  <motion.tr
                    key={medicion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <LineChart className="h-5 w-5 text-primary" />
                        <span className="font-medium">{medicion.titulo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{medicion.fecha}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{medicion.medicion}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        medicion.estado === "Conforme" 
                          ? "bg-green-100 text-green-800"
                          : medicion.estado === "No conforme"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {medicion.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{medicion.comentarios}</p>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(medicion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(medicion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredMediciones.length === 0 && (
              <div className="text-center py-12">
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay mediciones registradas para este indicador. Haz clic en "Nueva Medición" para comenzar.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <MedicionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicion(null);
        }}
        onSave={handleSave}
        medicion={selectedMedicion}
        indicadorId={indicadorId}
        indicadorTitulo={indicadorTitulo}
      />
    </div>
  );
}

export default MedicionesListing;
