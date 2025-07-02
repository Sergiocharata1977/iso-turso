import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Edit, FileText, Download, Filter, Upload, LayoutGrid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import documentosService from '../../services/documentosService';
import DocumentoModal from './DocumentoModal';
import GenericCard from '@/components/ui/GenericCard';
import ListingHeader from '../common/ListingHeader';

const DocumentosListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [documentos, setDocumentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const fetchDocumentos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await documentosService.getDocumentos();
      setDocumentos(data || []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      toast({ variant: "destructive", title: "Error", description: "Error al cargar los documentos." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const filteredDocumentos = useMemo(() => {
    if (!searchTerm.trim()) return documentos;
    const searchLower = searchTerm.toLowerCase();
    return documentos.filter(doc => 
      doc.titulo?.toLowerCase().includes(searchLower) ||
      doc.descripcion?.toLowerCase().includes(searchLower) ||
      doc.version?.toLowerCase().includes(searchLower)
    );
  }, [documentos, searchTerm]);

  const handleViewSingle = useCallback((id) => navigate(`/documentos/${id}`), [navigate]);
  const handleNewDocumento = () => {
    setSelectedDocumento(null);
    setIsModalOpen(true);
  };
  const handleEdit = useCallback((documento) => {
    setSelectedDocumento(documento);
    setIsModalOpen(true);
  }, []);
  const handleDelete = useCallback((documento) => {
    setDocumentoToDelete(documento);
    setDeleteDialogOpen(true);
  }, []);

  const handleDownload = useCallback(async (documento) => {
    try {
      await documentosService.downloadDocumento(documento.id);
      toast({ title: "Descarga iniciada", description: `Descargando ${documento.archivo_nombre || 'documento'}` });
    } catch (error) {
      console.error('Error al descargar documento:', error);
      toast({ variant: "destructive", title: "Error", description: "Error al descargar el documento" });
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!documentoToDelete) return;
    try {
      await documentosService.deleteDocumento(documentoToDelete.id);
      setDocumentos(prev => prev.filter(d => d.id !== documentoToDelete.id));
      toast({ title: "Éxito", description: "Documento eliminado correctamente" });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast({ variant: "destructive", title: "Error", description: "Error al eliminar el documento" });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentoToDelete(null);
    }
  }, [documentoToDelete]);

  const renderGridContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <GenericCard.Skeleton theme="light" key={i} />)}
        </div>
      );
    }
    if (filteredDocumentos.length === 0) return renderEmptyState();
    return (
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocumentos.map(doc => (
          <GenericCard
            theme="light"
            key={doc.id}
            icon={FileText}
            title={doc.titulo}
            subtitle={`Versión: ${doc.version}`}
            description={doc.descripcion}
            tags={[`Creado: ${new Date(doc.fecha_creacion).toLocaleDateString()}`]}
            onCardClick={() => handleViewSingle(doc.id)}
            actions={[
              { icon: Edit, onClick: (e) => { e.stopPropagation(); handleEdit(doc); }, tooltip: 'Editar' },
              { icon: Trash2, onClick: (e) => { e.stopPropagation(); handleDelete(doc); }, tooltip: 'Eliminar' },
              { icon: Download, onClick: (e) => { e.stopPropagation(); handleDownload(doc); }, tooltip: 'Descargar' },
            ]}
          />
        ))}
      </motion.div>
    );
  };

  const renderListContent = () => {
    if (isLoading) {
      return <div className="text-center py-10">Cargando...</div>; // O un skeleton de tabla
    }
    if (filteredDocumentos.length === 0) return renderEmptyState();
    return (
      <motion.div layout className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Título</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Versión</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha Creación</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredDocumentos.map(doc => (
              <motion.tr key={doc.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => handleViewSingle(doc.id)}>
                <td className="p-4 whitespace-nowrap">{doc.titulo}</td>
                <td className="p-4 whitespace-nowrap">{doc.version}</td>
                <td className="p-4 whitespace-nowrap">{new Date(doc.fecha_creacion).toLocaleDateString()}</td>
                <td className="p-4 whitespace-nowrap text-right">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(doc); }}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(doc); }}><Trash2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}><Download className="h-4 w-4" /></Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-10">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay documentos</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {searchTerm ? 'No se encontraron documentos que coincidan con tu búsqueda.' : 'Comienza creando un nuevo documento.'}
      </p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <ListingHeader
        title="Gestión de Documentos"
        subtitle="Administra los documentos y archivos del sistema"
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onAddNew={handleNewDocumento}
        addNewLabel="Nuevo Documento"
        actionButtons={[
          <Button key="export" variant="outline"><Upload className="mr-2 h-4 w-4" /> Exportar</Button>,
          <Button key="filter" variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
        ]}
      >
        <div className="flex items-center space-x-1 border border-gray-200 dark:border-slate-700 rounded-lg p-1">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="h-5 w-5" /></Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="h-5 w-5" /></Button>
        </div>
      </ListingHeader>

      <motion.div layout className="mt-6">
        {viewMode === 'grid' ? renderGridContent() : renderListContent()}
      </motion.div>

      {isModalOpen && (
        <DocumentoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchDocumentos}
          documento={selectedDocumento}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el documento{' '}
              <span className="font-semibold">{documentoToDelete?.titulo}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentosListing;
