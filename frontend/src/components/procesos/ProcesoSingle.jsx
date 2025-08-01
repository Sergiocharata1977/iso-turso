import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import procesosService from '@/services/procesosService';
import { puestosService } from '@/services/puestosService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Hash, GitBranch, Users, Target, Maximize, Book, Workflow, FileText, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { relacionesService } from '@/services/relacionesService';
import normasService from '@/services/normasService';
import documentosService from '@/services/documentosService';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProcesoSingle = () => {
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [showPuestoSelect, setShowPuestoSelect] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [isSavingPuesto, setIsSavingPuesto] = useState(false);
  const [normasRelacionadas, setNormasRelacionadas] = useState([]);
  const [documentosRelacionados, setDocumentosRelacionados] = useState([]);
  const [todasNormas, setTodasNormas] = useState([]);
  const [todosDocumentos, setTodosDocumentos] = useState([]);
  const [normaSeleccionada, setNormaSeleccionada] = useState('');
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState('');
  const [loadingRelaciones, setLoadingRelaciones] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProceso = async () => {
      try {
        setLoading(true);
        const data = await procesosService.getProcesoById(id);
        setProceso(data);
      } catch (err) {
        setError('No se pudo cargar el proceso. Es posible que haya sido eliminado.');
        toast({
          title: 'Error',
          description: 'No se pudo cargar el proceso. Inténtalo de nuevo más tarde.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProceso();
      loadPuestos();
    }
  }, [id]);

  useEffect(() => {
    if (proceso) {
      cargarRelaciones();
      cargarOpciones();
    }
  }, [proceso]);

  // Cargar puestos reales
  const loadPuestos = async () => {
    try {
      const data = await puestosService.getAll(user?.organization_id);
      setPuestos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los puestos",
        variant: "destructive"
      });
    }
  };

  // Guardar puesto responsable seleccionado
  const handleSavePuesto = async () => {
    if (!selectedPuesto) return;
    setIsSavingPuesto(true);
    try {
      await procesosService.updateProceso(proceso.id, {
        ...proceso,
        puesto_responsable_id: selectedPuesto,
        organization_id: user.organization_id
      });
      toast({
        title: "Responsable asignado",
        description: "La relación con el puesto responsable se ha guardado correctamente.",
        variant: "success"
      });
      setShowPuestoSelect(false);
      // Recargar el proceso para mostrar la actualización
      const updatedProceso = await procesosService.getProcesoById(id);
      setProceso(updatedProceso);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el puesto responsable",
        variant: "destructive"
      });
    } finally {
      setIsSavingPuesto(false);
    }
  };

  const cargarRelaciones = async () => {
    setLoadingRelaciones(true);
    try {
      const normas = await relacionesService.getEntidadesRelacionadas('proceso', proceso.id, 'norma');
      setNormasRelacionadas(normas);
      const docs = await relacionesService.getEntidadesRelacionadas('proceso', proceso.id, 'documento');
      setDocumentosRelacionados(docs);
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudieron cargar las relaciones', variant: 'destructive' });
    } finally {
      setLoadingRelaciones(false);
    }
  };

  const cargarOpciones = async () => {
    try {
      const normas = await normasService.getNormas();
      setTodasNormas(normas);
      const docs = await documentosService.getDocumentos();
      setTodosDocumentos(docs);
    } catch (e) {}
  };

  const handleAgregarNorma = async () => {
    if (!normaSeleccionada) return;
    try {
      await relacionesService.create({ 
        organization_id: user.organization_id,
        origen_tipo: 'proceso', 
        origen_id: proceso.id, 
        destino_tipo: 'norma', 
        destino_id: normaSeleccionada,
        usuario_creador: user.id
      });
      setNormaSeleccionada('');
      cargarRelaciones();
      toast({ title: 'Norma asociada', description: 'Norma asociada correctamente', variant: 'success' });
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };
  const handleQuitarNorma = async (relacionId) => {
    try {
      await relacionesService.delete(relacionId);
      cargarRelaciones();
      toast({ title: 'Norma quitada', description: 'Relación eliminada', variant: 'success' });
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };
  const handleAgregarDocumento = async () => {
    if (!documentoSeleccionado) return;
    try {
      await relacionesService.create({ 
        organization_id: user.organization_id,
        origen_tipo: 'proceso', 
        origen_id: proceso.id, 
        destino_tipo: 'documento', 
        destino_id: documentoSeleccionado,
        usuario_creador: user.id
      });
      setDocumentoSeleccionado('');
      cargarRelaciones();
      toast({ title: 'Documento asociado', description: 'Documento asociado correctamente', variant: 'success' });
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };
  const handleQuitarDocumento = async (relacionId) => {
    try {
      await relacionesService.delete(relacionId);
      cargarRelaciones();
      toast({ title: 'Documento quitado', description: 'Relación eliminada', variant: 'success' });
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Cargando detalles del proceso...</p></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error al Cargar</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Button variant="outline" onClick={() => navigate('/procesos')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Procesos
        </Button>
      </div>
    );
  }

  if (!proceso) {
    return null;
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header Principal */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button onClick={() => navigate('/procesos')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Procesos: {proceso.nombre}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sistema de Gestión de Calidad ISO 9001
            </p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Layout principal: contenido + relaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (contenido del proceso) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  {proceso.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Hash className="w-4 h-4 mr-2" />
                    <strong>Código:</strong><span className="ml-2">{proceso.codigo}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GitBranch className="w-4 h-4 mr-2" />
                    <strong>Versión:</strong><span className="ml-2">{proceso.version}</span>
                  </div>
                  <div className="flex items-center text-gray-600 sm:col-span-2 md:col-span-1">
                    <Users className="w-4 h-4 mr-2" />
                    <strong>Funciones:</strong><span className="ml-2">{proceso.funciones_involucradas || 'No definidas'}</span>
                  </div>
                </div>
                {/* Mostrar responsable actual */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <strong>Responsable:</strong>
                    <span className="ml-2">{proceso.puesto_responsable?.nombre || 'No asignado'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Target className="w-5 h-5 mr-2" />1. Objetivo</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.objetivo || 'No definido.'}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Maximize className="w-5 h-5 mr-2" />2. Alcance</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.alcance || 'No definido.'}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Book className="w-5 h-5 mr-2" />3. Definiciones y Abreviaturas</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.definiciones_abreviaturas || 'No definidas.'}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Workflow className="w-5 h-5 mr-2" />4. Desarrollo del Proceso</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.desarrollo || 'No definido.'}</p></CardContent>
            </Card>
          </div>

          {/* Columna de relaciones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Relaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {/* Botón para asignar/cambiar puesto responsable */}
                  {!showPuestoSelect ? (
                    <Button 
                      className="btn-relacion-exclusive w-full" 
                      onClick={() => { 
                        setShowPuestoSelect(true); 
                        setSelectedPuesto(proceso.puesto_responsable_id || ''); 
                      }}
                    >
                      {proceso.puesto_responsable ? 'Cambiar Responsable' : 'Asignar Responsable'}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <select 
                        value={selectedPuesto || ''} 
                        onChange={(e) => setSelectedPuesto(e.target.value)} 
                        className="w-full p-2 border rounded"
                      >
                        <option value="" disabled>Seleccione un puesto responsable</option>
                        {puestos.map((p) => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSavePuesto} 
                          disabled={!selectedPuesto || isSavingPuesto} 
                          className="btn-relacion-exclusive flex-1"
                        >
                          {isSavingPuesto ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPuestoSelect(false)} 
                          disabled={isSavingPuesto}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Aquí se pueden agregar más relaciones en el futuro */}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Normas aplicables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <Select value={normaSeleccionada} onValueChange={setNormaSeleccionada}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Seleccionar norma" />
                    </SelectTrigger>
                    <SelectContent>
                      {todasNormas.map(norma => (
                        <SelectItem key={norma.id} value={String(norma.id)}>{norma.codigo} - {norma.titulo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAgregarNorma} disabled={!normaSeleccionada}>Agregar</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {normasRelacionadas.map(rel => (
                    <Badge key={rel.id} className="bg-emerald-700 text-white flex items-center gap-1">
                      {rel.destino_id} <button onClick={() => handleQuitarNorma(rel.id)} className="ml-1 text-xs">✕</button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <Select value={documentoSeleccionado} onValueChange={setDocumentoSeleccionado}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Seleccionar documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {todosDocumentos.map(doc => (
                        <SelectItem key={doc.id} value={String(doc.id)}>{doc.titulo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAgregarDocumento} disabled={!documentoSeleccionado}>Agregar</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {documentosRelacionados.map(rel => (
                    <Badge key={rel.id} className="bg-blue-700 text-white flex items-center gap-1">
                      {rel.destino_id} <button onClick={() => handleQuitarDocumento(rel.id)} className="ml-1 text-xs">✕</button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcesoSingle;
