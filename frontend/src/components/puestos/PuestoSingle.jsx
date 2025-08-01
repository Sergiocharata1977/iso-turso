import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Briefcase, GraduationCap, Clock, Building2, Users, Pencil, FileText } from 'lucide-react';
import { puestosService } from '@/services/puestosService';
import { departamentosService } from '@/services/departamentos';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { relacionesService } from '@/services/relacionesService';
import normasService from '@/services/normasService';
import documentosService from '@/services/documentosService';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PuestoSingle({ puestoId, onBack, onEdit }) {
  const [puesto, setPuesto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState([]);
  const [showDeptoSelect, setShowDeptoSelect] = useState(false);
  const [selectedDepto, setSelectedDepto] = useState(null);
  const [isSavingDepto, setIsSavingDepto] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [normasRelacionadas, setNormasRelacionadas] = useState([]);
  const [documentosRelacionados, setDocumentosRelacionados] = useState([]);
  const [todasNormas, setTodasNormas] = useState([]);
  const [todosDocumentos, setTodosDocumentos] = useState([]);
  const [normaSeleccionada, setNormaSeleccionada] = useState('');
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState('');
  const [loadingRelaciones, setLoadingRelaciones] = useState(false);

  useEffect(() => {
    loadPuesto();
    loadDepartamentos();
  }, [puestoId]);

  useEffect(() => {
    if (puesto) {
      cargarRelaciones();
      cargarOpciones();
    }
  }, [puesto]);

  // Cargar puesto con organization_id
  const loadPuesto = async () => {
    try {
      setIsLoading(true);
      console.log('Cargando puesto con ID:', puestoId, 'para organización:', user.organization_id);
      const data = await puestosService.getById(puestoId, user.organization_id);
      console.log('Datos del puesto recibidos:', data);
      setPuesto(data);
    } catch (error) {
      console.error('Error al cargar puesto:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del puesto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar departamentos reales
  const loadDepartamentos = async () => {
    try {
      const data = await departamentosService.getAll();
      setDepartamentos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los departamentos",
        variant: "destructive"
      });
    }
  };

  // Guardar departamento seleccionado
  const handleSaveDepto = async () => {
    if (!selectedDepto) return;
    setIsSavingDepto(true);
    try {
      await puestosService.update(puesto.id, {
        ...puesto,
        departamento_id: selectedDepto,
        organization_id: user.organization_id
      });
      toast({
        title: "Departamento asignado",
        description: "La relación con el departamento se ha guardado correctamente.",
        variant: "success"
      });
      setShowDeptoSelect(false);
      loadPuesto();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el departamento",
        variant: "destructive"
      });
    } finally {
      setIsSavingDepto(false);
    }
  };

  const cargarRelaciones = async () => {
    setLoadingRelaciones(true);
    try {
      const normas = await relacionesService.getEntidadesRelacionadas('puesto', puesto.id, 'norma');
      setNormasRelacionadas(normas);
      const docs = await relacionesService.getEntidadesRelacionadas('puesto', puesto.id, 'documento');
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
        origen_tipo: 'puesto', 
        origen_id: puesto.id, 
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
        origen_tipo: 'puesto', 
        origen_id: puesto.id, 
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

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!puesto) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No se encontró el puesto</h3>
        <p className="mt-2 text-muted-foreground">ID: {puestoId}</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-2xl font-bold">{puesto.nombre}</h2>
        </div>
        <Button onClick={() => onEdit(puesto)}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Layout principal: info + relaciones a la derecha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Detalles del Puesto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Descripción</h4>
                <p className="mt-1">{puesto.descripcion || 'Sin descripción'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Departamento</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  <span>{puesto.departamento?.nombre || 'No asignado'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requisitos debajo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Requisitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Experiencia
                </h4>
                <p className="mt-1">{puesto.requisitos_experiencia || 'No especificada'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Formación
                </h4>
                <p className="mt-1">{puesto.requisitos_formacion || 'No especificada'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna de relaciones */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Relaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Botón para asignar/cambiar departamento */}
                {!showDeptoSelect ? (
                  <Button className="btn-relacion-exclusive w-full" onClick={() => { setShowDeptoSelect(true); setSelectedDepto(puesto.departamento?.id || ''); }}>
                    {puesto.departamento ? 'Cambiar Departamento' : 'Asignar Departamento'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Select value={selectedDepto || ''} onValueChange={setSelectedDepto} className="w-full">
                      <option value="" disabled>Seleccione un departamento</option>
                      {departamentos.map((d) => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </Select>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveDepto} disabled={!selectedDepto || isSavingDepto} className="btn-relacion-exclusive">
                        {isSavingDepto ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowDeptoSelect(false)} disabled={isSavingDepto}>Cancelar</Button>
                    </div>
                  </div>
                )}
                {/* Aquí se pueden agregar más relaciones en el futuro */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 