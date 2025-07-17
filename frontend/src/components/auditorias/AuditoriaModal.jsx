import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText, X, Target, CheckSquare, RefreshCw, AlertCircle
} from 'lucide-react';
import personalService from '../../services/personalService.js';

const AuditoriaModal = ({ isOpen, onClose, onSave, auditoria }) => {
  const isEditMode = Boolean(auditoria);

  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    tipo: 'interna',
    fecha_programada: '',
    responsable_personal_id: null,
    objetivos: '',
    alcance: '',
    criterios_auditoria: '',
    procesos: [],
    participantes: []
  });

  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para generar código automático
  const generateAuditCode = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `AUD-${currentYear}-${currentMonth}-${randomNum}`;
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (auditoria) {
        setFormData({
          codigo: auditoria.codigo || '',
          titulo: auditoria.titulo || '',
          tipo: auditoria.tipo || 'interna',
          fecha_programada: auditoria.fecha_programada ? new Date(auditoria.fecha_programada).toISOString().split('T')[0] : '',
          responsable_personal_id: auditoria.responsable_personal_id || null,
          objetivos: auditoria.objetivos || '',
          alcance: auditoria.alcance || '',
          criterios_auditoria: auditoria.criterios_auditoria || '',
          procesos: auditoria.procesos?.map(p => ({
            ...p,
            proceso_id: p.proceso_id || undefined,
            responsable_area_personal_id: p.responsable_area_personal_id || undefined
          })) || [],
          participantes: auditoria.participantes?.map(p => ({
            ...p,
            personal_id: p.personal_id || undefined
          })) || []
        });
      } else {
        // Generar código automático para nueva auditoría
        setFormData({
          codigo: generateAuditCode(),
          titulo: '',
          tipo: 'interna',
          fecha_programada: '',
          responsable_personal_id: null,
          objetivos: '',
          alcance: '',
          criterios_auditoria: '',
          procesos: [],
          participantes: []
        });
      }
    }
  }, [isOpen, auditoria]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos para auditoría...');

      // Cargar personal
      const personalRes = await personalService.getAllPersonal();
      console.log('👥 Personal cargado:', personalRes);

      const personalData = personalRes?.data || personalRes || [];
      setPersonal(personalData);

      console.log('✅ Personal final:', personalData);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      // Datos mock temporales si hay error
      const mockPersonal = [
        { id: 1, nombre: 'Juan', apellido: 'Pérez', puesto: 'Gerente de Calidad' },
        { id: 2, nombre: 'María', apellido: 'García', puesto: 'Auditor Interno' },
        { id: 3, nombre: 'Carlos', apellido: 'López', puesto: 'Responsable de Procesos' },
        { id: 4, nombre: 'Ana', apellido: 'Martínez', puesto: 'Coordinadora de Calidad' },
        { id: 5, nombre: 'Luis', apellido: 'Rodríguez', puesto: 'Jefe de Operaciones' }
      ];
      setPersonal(mockPersonal);
      console.log('🔧 Usando datos mock de personal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.codigo || !formData.titulo || !formData.fecha_programada) {
      alert('Los campos código, título y fecha programada son obligatorios');
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error guardando auditoría:', error);
    }
  };

  const addProceso = () => {
    const newProcesoId = `proceso-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFormData(prev => ({
      ...prev,
      procesos: [...prev.procesos, {
        id: newProcesoId,
        proceso_id: undefined,
        punto_norma: '',
        criterio_evaluacion: '',
        responsable_area_personal_id: undefined
      }]
    }));
  };

  const removeProceso = (index) => {
    setFormData(prev => ({
      ...prev,
      procesos: prev.procesos.filter((_, i) => i !== index)
    }));
  };

  const updateProceso = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      procesos: prev.procesos.map((proceso, i) =>
        i === index ? { ...proceso, [field]: value } : proceso
      )
    }));
  };

  const addParticipante = () => {
    const newParticipanteId = `participante-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFormData(prev => ({
      ...prev,
      participantes: [...prev.participantes, {
        id: newParticipanteId,
        personal_id: undefined,
        rol: 'auditor',
        observaciones: ''
      }]
    }));
  };

  const removeParticipante = (index) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.filter((_, i) => i !== index)
    }));
  };

  const updateParticipante = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.map((participante, i) =>
        i === index ? { ...participante, [field]: value } : participante
      )
    }));
  };

  const getTipoOptions = () => [
    { value: 'interna', label: 'Auditoría Interna' },
    { value: 'externa', label: 'Auditoría Externa' },
    { value: 'seguimiento', label: 'Auditoría de Seguimiento' },
    { value: 'certificacion', label: 'Auditoría de Certificación' }
  ];

  const getRolOptions = () => [
    { value: 'auditor_lider', label: 'Auditor Líder' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'auditado', label: 'Auditado' },
    { value: 'observador', label: 'Observador' },
    { value: 'acompañante', label: 'Acompañante' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica - SIMPLIFICADA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Planificación de Auditoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Código y Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código de Auditoría *</Label>
                <div className="flex gap-2">
                  <Input
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    placeholder="Ej: AUD-2025-001"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, codigo: generateAuditCode() }))}
                    className="px-3"
                    title="Generar nuevo código"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Auditoría *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTipoOptions().map(option => (
                      <SelectItem key={`tipo-${option.value}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="titulo">Título de la Auditoría *</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Auditoría del Sistema de Gestión de Calidad"
                required
              />
            </div>

            {/* Solo Fecha Programada */}
            <div>
              <Label htmlFor="fecha_programada">Fecha Programada *</Label>
              <Input
                id="fecha_programada"
                name="fecha_programada"
                type="date"
                value={formData.fecha_programada}
                onChange={handleChange}
                required
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Objetivos y Alcance - SIMPLIFICADO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Objetivos y Alcance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="objetivos">Objetivos de la Auditoría</Label>
              <Textarea
                id="objetivos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
                placeholder="Verificar el cumplimiento de los requisitos de la norma ISO 9001..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="alcance">Alcance</Label>
              <Textarea
                id="alcance"
                name="alcance"
                value={formData.alcance}
                onChange={handleChange}
                placeholder="Procesos de gestión de calidad, atención al cliente y mejora continua..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="criterios_auditoria">Criterios de Auditoría</Label>
              <Textarea
                id="criterios_auditoria"
                name="criterios_auditoria"
                value={formData.criterios_auditoria}
                onChange={handleChange}
                placeholder="ISO 9001:2015, procedimientos internos, manual de calidad..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Nota Informativa */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Planificación Básica</p>
                <p>
                  Esta es la planificación inicial de la auditoría. Una vez creada, podrás agregar:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Procesos específicos a auditar</li>
                  <li>Puntos de la norma a evaluar</li>
                  <li>Participantes del equipo auditor</li>
                  <li>Documentos y evidencias relacionadas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <CheckSquare className="w-4 h-4 mr-2" />
            {isEditMode ? 'Actualizar' : 'Crear'} Auditoría
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuditoriaModal;
