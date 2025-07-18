import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText
} from "lucide-react";
import { capacitacionesService } from "@/services/capacitacionesService";
import CapacitacionModal from "./CapacitacionModal";
import { personalService } from '@/services/personalService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CapacitacionSingle = ({ capacitacionId, onBack }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [capacitacion, setCapacitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [asistentes, setAsistentes] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loadingAsistentes, setLoadingAsistentes] = useState(true);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [temas, setTemas] = useState([]);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalForm, setEvalForm] = useState({ empleado_id: '', tema_id: '', calificacion: '', comentarios: '', fecha_evaluacion: '' });
  const [editEvalId, setEditEvalId] = useState(null);
  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(true);
  // Estado para el modal de asistentes y búsqueda
  const [asistenteModalOpen, setAsistenteModalOpen] = useState(false);
  const [busquedaAsistente, setBusquedaAsistente] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);
  // Estado para edición/creación inline de evaluaciones
  const [editEvalInlineId, setEditEvalInlineId] = useState(null);
  const [inlineEvalForm, setInlineEvalForm] = useState({ empleado_id: '', tema_id: '', calificacion: '', comentarios: '', fecha_evaluacion: '' });

  // Usar el ID desde props o desde params
  const id = capacitacionId || paramId;

  useEffect(() => {
    if (id) {
      fetchCapacitacion();
      fetchAsistentes();
      fetchPersonal();
      fetchTemas();
      fetchEvaluaciones();
    }
  }, [id]);

  const fetchCapacitacion = async () => {
    try {
      setLoading(true);
      console.log(`🔍 Cargando capacitación ID: ${id}`);
      const data = await capacitacionesService.getById(id);
      setCapacitacion(data);
      console.log('✅ Capacitación cargada:', data);
    } catch (error) {
      console.error("❌ Error al obtener capacitación:", error);
      toast.error("Error al cargar la capacitación");
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchAsistentes = async () => {
    setLoadingAsistentes(true);
    try {
      const data = await capacitacionesService.getAsistentes(id);
      setAsistentes(data);
    } catch (error) {
      toast.error('Error al cargar asistentes');
    } finally {
      setLoadingAsistentes(false);
    }
  };

  const fetchPersonal = async () => {
    try {
      const data = await personalService.getAllPersonal();
      setPersonal(data);
    } catch (error) {
      toast.error('Error al cargar personal');
    }
  };

  const fetchTemas = async () => {
    try {
      const data = await capacitacionesService.getTemas(id);
      setTemas(data);
    } catch (error) {
      toast.error('Error al cargar temas');
    }
  };

  const fetchEvaluaciones = async () => {
    setLoadingEvaluaciones(true);
    try {
      const data = await capacitacionesService.getEvaluaciones(id);
      setEvaluaciones(data);
    } catch (error) {
      toast.error('Error al cargar evaluaciones');
    } finally {
      setLoadingEvaluaciones(false);
    }
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      await capacitacionesService.update(id, formData);
      toast.success("Capacitación actualizada exitosamente");
      setModalOpen(false);
      fetchCapacitacion(); // Recargar datos
    } catch (error) {
      console.error('Error al actualizar capacitación:', error);
      toast.error("Error al actualizar la capacitación");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de que desea eliminar esta capacitación?")) {
      try {
        await capacitacionesService.delete(id);
        toast.success("Capacitación eliminada exitosamente");
        handleBack();
      } catch (error) {
        console.error("Error al eliminar capacitación:", error);
        toast.error("Error al eliminar la capacitación");
      }
    }
  };

  const handleToggleAsistente = async (empleado) => {
    const yaEsAsistente = asistentes.some(a => a.empleado_id === empleado.id);
    try {
      if (yaEsAsistente) {
        // Buscar el id del registro de asistente
        const asist = asistentes.find(a => a.empleado_id === empleado.id);
        await capacitacionesService.removeAsistente(id, asist.id);
        setAsistentes(prev => prev.filter(a => a.empleado_id !== empleado.id));
        toast.success('Asistente eliminado');
      } else {
        const nuevo = await capacitacionesService.addAsistente(id, empleado.id);
        setAsistentes(prev => [...prev, nuevo]);
        toast.success('Asistente agregado');
      }
    } catch (error) {
      toast.error('Error al actualizar asistentes');
    }
  };

  const handleOpenEvalModal = (empleado_id = '', tema_id = '', evaluacion = null) => {
    if (evaluacion) {
      setEvalForm({
        empleado_id: evaluacion.empleado_id,
        tema_id: evaluacion.tema_id,
        calificacion: evaluacion.calificacion || '',
        comentarios: evaluacion.comentarios || '',
        fecha_evaluacion: evaluacion.fecha_evaluacion || ''
      });
      setEditEvalId(evaluacion.id);
    } else {
      setEvalForm({ empleado_id, tema_id, calificacion: '', comentarios: '', fecha_evaluacion: '' });
      setEditEvalId(null);
    }
    setEvalModalOpen(true);
  };

  const handleEvalFormChange = (field, value) => {
    setEvalForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEvaluacion = async (e) => {
    e.preventDefault();
    try {
      if (editEvalId) {
        await capacitacionesService.updateEvaluacion(id, editEvalId, evalForm);
        toast.success('Evaluación actualizada');
      } else {
        await capacitacionesService.addEvaluacion(id, evalForm);
        toast.success('Evaluación agregada');
      }
      setEvalModalOpen(false);
      fetchEvaluaciones();
    } catch (error) {
      toast.error('Error al guardar evaluación');
    }
  };

  const handleDeleteEvaluacion = async (evalId) => {
    if (window.confirm('¿Eliminar esta evaluación?')) {
      try {
        await capacitacionesService.deleteEvaluacion(id, evalId);
        toast.success('Evaluación eliminada');
        fetchEvaluaciones();
      } catch (error) {
        toast.error('Error al eliminar evaluación');
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/capacitaciones");
    }
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'programada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en curso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'programada':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'en curso':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'completada':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'cancelada':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const formatDateShort = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  // Nueva función para buscar empleados por nombre y apellido, filtrando por organización
  const buscarEmpleados = async (query) => {
    setBuscando(true);
    try {
      // Suponiendo que personalService.getByNombreApellido(query) filtra por organización automáticamente
      const data = await personalService.getByNombreApellido(query);
      setResultadosBusqueda(data);
    } catch (error) {
      toast.error('Error al buscar empleados');
    } finally {
      setBuscando(false);
    }
  };

  // Nueva función para agregar asistente desde el modal
  const handleAgregarAsistente = async (empleado) => {
    try {
      const nuevo = await capacitacionesService.addAsistente(id, empleado.id);
      setAsistentes(prev => [...prev, nuevo]);
      toast.success('Asistente agregado');
      setBusquedaAsistente("");
      setResultadosBusqueda([]);
      setAsistenteModalOpen(false);
    } catch (error) {
      toast.error('Error al agregar asistente');
    }
  };

  // Modificar handleToggleAsistente para solo eliminar
  const handleEliminarAsistente = async (asistente) => {
    try {
      await capacitacionesService.removeAsistente(id, asistente.id);
      setAsistentes(prev => prev.filter(a => a.id !== asistente.id));
      // Eliminar evaluaciones asociadas a este asistente
      setEvaluaciones(prev => prev.filter(ev => ev.empleado_id !== asistente.empleado_id));
      toast.success('Asistente eliminado');
    } catch (error) {
      toast.error('Error al eliminar asistente');
    }
  };

  const handleStartInlineEval = (ev = null) => {
    if (ev) {
      setEditEvalInlineId(ev.id);
      setInlineEvalForm({
        empleado_id: ev.empleado_id,
        tema_id: ev.tema_id,
        calificacion: ev.calificacion || '',
        comentarios: ev.comentarios || '',
        fecha_evaluacion: ev.fecha_evaluacion || ''
      });
    } else {
      setEditEvalInlineId('new');
      setInlineEvalForm({ empleado_id: '', tema_id: '', calificacion: '', comentarios: '', fecha_evaluacion: '' });
    }
  };

  const handleInlineEvalChange = (field, value) => {
    setInlineEvalForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveInlineEval = async () => {
    try {
      if (editEvalInlineId === 'new') {
        await capacitacionesService.addEvaluacion(id, inlineEvalForm);
        toast.success('Evaluación agregada');
      } else {
        await capacitacionesService.updateEvaluacion(id, editEvalInlineId, inlineEvalForm);
        toast.success('Evaluación actualizada');
      }
      setEditEvalInlineId(null);
      setInlineEvalForm({ empleado_id: '', tema_id: '', calificacion: '', comentarios: '', fecha_evaluacion: '' });
      fetchEvaluaciones();
    } catch (error) {
      toast.error('Error al guardar evaluación');
    }
  };

  const handleCancelInlineEval = () => {
    setEditEvalInlineId(null);
    setInlineEvalForm({ empleado_id: '', tema_id: '', calificacion: '', comentarios: '', fecha_evaluacion: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!capacitacion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Capacitación no encontrada</h2>
            <p className="text-gray-600 mb-6">La capacitación que buscas no existe o ha sido eliminada.</p>
            <Button onClick={handleBack} className="bg-slate-800 hover:bg-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Capacitaciones
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalle de Capacitación</h1>
              <p className="text-gray-600 text-sm">CAP-{capacitacion.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleEdit}
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {capacitacion.titulo}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className={getEstadoBadgeColor(capacitacion.estado)}>
                        <span className="mr-1">{getEstadoIcon(capacitacion.estado)}</span>
                        {capacitacion.estado}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Creado el {formatDateShort(capacitacion.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {capacitacion.descripcion || "No se ha proporcionado una descripción para esta capacitación."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Sección de Asistentes (formato unificado y botón verde) */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  Asistentes
                </CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAsistenteModalOpen(true)}>
                  + Agregar Asistente
                </Button>
              </CardHeader>
              <CardContent>
                {loadingAsistentes ? (
                  <div className="text-gray-500">Cargando asistentes...</div>
                ) : asistentes.length === 0 ? (
                  <div className="text-gray-400">No hay asistentes registrados.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {asistentes.map((asistente) => (
                      <li key={asistente.id} className="flex items-center gap-3 py-2">
                        <span className="font-medium text-gray-900">{asistente.nombres} {asistente.apellidos}</span>
                        <span className="text-gray-500 text-sm">{asistente.email}</span>
                        <Button size="sm" variant="ghost" className="text-red-600 ml-auto" onClick={() => handleEliminarAsistente(asistente)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="text-xs text-gray-400 mt-2">Solo puedes agregar empleados existentes de tu organización.</div>
              </CardContent>
            </Card>
            {/* Sección de Evaluación de Capacitaciones */}
            <Card className="bg-white border border-gray-200 shadow-sm mt-8">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Evaluación de Capacitaciones
                </CardTitle>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded shadow"
                  onClick={() => handleStartInlineEval()}
                >
                  + Nueva Evaluación
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Asistente</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comentarios</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {editEvalInlineId === 'new' && (
                        <tr className="bg-blue-50">
                          <td className="px-4 py-2">
                            <select className="w-full border rounded px-2 py-1" value={inlineEvalForm.empleado_id} onChange={e => handleInlineEvalChange('empleado_id', e.target.value)} required>
                              <option value="">Selecciona asistente</option>
                              {asistentes.map(a => (
                                <option key={a.empleado_id} value={a.empleado_id}>{a.nombres} {a.apellidos}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <select className="w-full border rounded px-2 py-1" value={inlineEvalForm.tema_id} onChange={e => handleInlineEvalChange('tema_id', e.target.value)} required>
                              <option value="">Selecciona tema</option>
                              {temas.map(t => (
                                <option key={t.id} value={t.id}>{t.titulo}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input type="number" className="w-full border rounded px-2 py-1" value={inlineEvalForm.calificacion} onChange={e => handleInlineEvalChange('calificacion', e.target.value)} required min="0" max="100" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="text" className="w-full border rounded px-2 py-1" value={inlineEvalForm.comentarios} onChange={e => handleInlineEvalChange('comentarios', e.target.value)} />
                          </td>
                          <td className="px-4 py-2">
                            <input type="date" className="w-full border rounded px-2 py-1" value={inlineEvalForm.fecha_evaluacion} onChange={e => handleInlineEvalChange('fecha_evaluacion', e.target.value)} required />
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveInlineEval}>Guardar</Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelInlineEval}>Cancelar</Button>
                          </td>
                        </tr>
                      )}
                      {evaluaciones.length === 0 && editEvalInlineId !== 'new' ? (
                        <tr>
                          <td colSpan={6} className="text-center text-gray-400 py-6">No hay evaluaciones registradas.</td>
                        </tr>
                      ) : (
                        evaluaciones.map((ev) => {
                          if (editEvalInlineId === ev.id) {
                            return (
                              <tr key={ev.id} className="bg-blue-50">
                                <td className="px-4 py-2">
                                  <select className="w-full border rounded px-2 py-1" value={inlineEvalForm.empleado_id} onChange={e => handleInlineEvalChange('empleado_id', e.target.value)} required disabled>
                                    <option value="">Selecciona asistente</option>
                                    {asistentes.map(a => (
                                      <option key={a.empleado_id} value={a.empleado_id}>{a.nombres} {a.apellidos}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-2">
                                  <select className="w-full border rounded px-2 py-1" value={inlineEvalForm.tema_id} onChange={e => handleInlineEvalChange('tema_id', e.target.value)} required disabled>
                                    <option value="">Selecciona tema</option>
                                    {temas.map(t => (
                                      <option key={t.id} value={t.id}>{t.titulo}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-2">
                                  <input type="number" className="w-full border rounded px-2 py-1" value={inlineEvalForm.calificacion} onChange={e => handleInlineEvalChange('calificacion', e.target.value)} required min="0" max="100" />
                                </td>
                                <td className="px-4 py-2">
                                  <input type="text" className="w-full border rounded px-2 py-1" value={inlineEvalForm.comentarios} onChange={e => handleInlineEvalChange('comentarios', e.target.value)} />
                                </td>
                                <td className="px-4 py-2">
                                  <input type="date" className="w-full border rounded px-2 py-1" value={inlineEvalForm.fecha_evaluacion} onChange={e => handleInlineEvalChange('fecha_evaluacion', e.target.value)} required />
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveInlineEval}>Guardar</Button>
                                  <Button size="sm" variant="ghost" onClick={handleCancelInlineEval}>Cancelar</Button>
                                </td>
                              </tr>
                            );
                          }
                          const asistente = asistentes.find(a => a.empleado_id === ev.empleado_id);
                          const tema = temas.find(t => t.id === ev.tema_id);
                          return (
                            <tr key={ev.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 font-medium text-gray-900">{asistente ? `${asistente.nombres} ${asistente.apellidos}` : '-'}</td>
                              <td className="px-4 py-2">{tema ? tema.titulo : '-'}</td>
                              <td className="px-4 py-2">{ev.calificacion}</td>
                              <td className="px-4 py-2">{ev.comentarios}</td>
                              <td className="px-4 py-2">{formatDateShort(ev.fecha_evaluacion)}</td>
                              <td className="px-4 py-2 flex gap-2">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStartInlineEval(ev)}>
                                  Editar
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteEvaluacion(ev.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de Fechas */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Programación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</p>
                  <p className="text-gray-900 font-medium">{formatDate(capacitacion.fecha_inicio)}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">Última Actualización</p>
                  <p className="text-gray-600 text-sm">
                    {capacitacion.updated_at ? formatDateShort(capacitacion.updated_at) : 'Sin actualizaciones'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Sistema */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="text-sm font-mono text-gray-900">{capacitacion.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge className={getEstadoBadgeColor(capacitacion.estado)} variant="outline">
                    {capacitacion.estado}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Fecha Creación</span>
                  <span className="text-sm text-gray-900">{formatDateShort(capacitacion.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Edición */}
        <CapacitacionModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          capacitacion={capacitacion}
        />

        {/* Modal Evaluación */}
        <Dialog open={evalModalOpen} onOpenChange={setEvalModalOpen}>
          <DialogContent className="max-w-lg bg-white">
            <DialogHeader>
              <DialogTitle>{editEvalId ? 'Editar Evaluación' : 'Nueva Evaluación'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEvaluacion} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asistente</label>
                <Select value={evalForm.empleado_id} onValueChange={v => handleEvalFormChange('empleado_id', v)} required disabled={!!editEvalId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un asistente" />
                  </SelectTrigger>
                  <SelectContent>
                    {personal.filter(emp => asistentes.some(a => a.empleado_id === emp.id)).map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.nombres} {emp.apellidos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema tratado</label>
                <Select value={evalForm.tema_id} onValueChange={v => handleEvalFormChange('tema_id', v)} required disabled={!!editEvalId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {temas.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.titulo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                <Input type="number" min={1} max={10} value={evalForm.calificacion} onChange={e => handleEvalFormChange('calificacion', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                <Textarea value={evalForm.comentarios} onChange={e => handleEvalFormChange('comentarios', e.target.value)} rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de evaluación</label>
                <Input type="date" value={evalForm.fecha_evaluacion} onChange={e => handleEvalFormChange('fecha_evaluacion', e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEvalModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">{editEvalId ? 'Actualizar' : 'Guardar'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal azul para agregar asistente */}
        <Dialog open={asistenteModalOpen} onOpenChange={setAsistenteModalOpen}>
          <DialogContent className="max-w-lg bg-blue-50 border-blue-200">
            <DialogHeader>
              <DialogTitle>Agregar Asistente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Buscar por nombre o apellido..."
                value={busquedaAsistente}
                onChange={e => {
                  setBusquedaAsistente(e.target.value);
                  if (e.target.value.length > 2) buscarEmpleados(e.target.value);
                  else setResultadosBusqueda([]);
                }}
                className="bg-white"
              />
              {buscando && <div className="text-blue-600">Buscando...</div>}
              <ul className="divide-y divide-blue-100 max-h-60 overflow-y-auto">
                {resultadosBusqueda.map(emp => (
                  <li key={emp.id} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-blue-100 rounded px-2" onClick={() => handleAgregarAsistente(emp)}>
                    <span className="font-medium text-gray-900">{emp.nombres} {emp.apellidos}</span>
                    <span className="text-gray-500 text-sm">{emp.email}</span>
                  </li>
                ))}
                {busquedaAsistente.length > 2 && !buscando && resultadosBusqueda.length === 0 && (
                  <li className="text-blue-400 py-2 px-2">No se encontraron empleados.</li>
                )}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CapacitacionSingle;
