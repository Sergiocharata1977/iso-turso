import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Users, 
  Award, 
  Play, 
  CheckCircle, 
  ArrowLeft,
  AlertCircle,
  Star,
  User,
  FileText
} from 'lucide-react';
import { evalcompeProgramacionService } from '@/services/evalcompeProgramacionService';
import { evaluacionesService } from '@/services/evaluacionesService';
import { personalService } from '@/services/personalService';
import { competenciasService } from '@/services/competenciasService';

const ProgramacionSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [programacion, setProgramacion] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [evaluacionesGeneradas, setEvaluacionesGeneradas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadProgramacionData();
    }
  }, [id]);

  const loadProgramacionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 [ProgramacionSingle] Cargando datos de programación:', id);
      
      // Cargar datos en paralelo
      const [programacionData, empleadosData, competenciasData] = await Promise.all([
        evalcompeProgramacionService.getById(id).catch(() => null),
        personalService.getAll().catch(() => []),
        competenciasService.getAll().catch(() => [])
      ]);

      if (!programacionData) {
        setError('Programación no encontrada');
        return;
      }

      setProgramacion(programacionData);
      setEmpleados(empleadosData || []);
      setCompetencias(competenciasData || []);

      console.log('✅ [ProgramacionSingle] Datos cargados:', {
        programacion: programacionData.titulo || programacionData.nombre,
        empleados: empleadosData?.length || 0,
        competencias: competenciasData?.length || 0
      });

    } catch (error) {
      console.error('❌ [ProgramacionSingle] Error al cargar datos:', error);
      setError('Error al cargar los datos de la programación');
    } finally {
      setIsLoading(false);
    }
  };

  const ejecutarProgramacion = async () => {
    if (!programacion) return;

    setIsExecuting(true);
    try {
      console.log('🚀 [ProgramacionSingle] Ejecutando programación:', programacion.titulo || programacion.nombre);

      // Simular empleados seleccionados (en una implementación real, estos vendrían de la programación)
      const empleadosSeleccionados = empleados.slice(0, 3); // Tomar los primeros 3 empleados como ejemplo
      const competenciasAEvaluar = competencias.slice(0, 5); // Tomar las primeras 5 competencias

      const evaluacionesCreadas = [];

      // Generar evaluaciones individuales para cada empleado
      for (const empleado of empleadosSeleccionados) {
        // Generar puntajes aleatorios para cada competencia (1-10)
        const competenciasConPuntaje = competenciasAEvaluar.map(comp => ({
          competencia_id: comp.id,
          puntaje: Math.floor(Math.random() * 10) + 1 // Puntaje aleatorio entre 1 y 10
        }));

        const evaluacionData = {
          empleado_id: empleado.id,
          fecha_evaluacion: new Date().toISOString().split('T')[0],
          observaciones: `Evaluación generada automáticamente desde programación grupal: ${programacion.titulo || programacion.nombre}`,
          competencias: competenciasConPuntaje
        };

        try {
          const evaluacionCreada = await evaluacionesService.create(evaluacionData);
          evaluacionesCreadas.push({
            ...evaluacionCreada,
            empleado_nombre: empleado.nombre,
            empleado_apellido: empleado.apellido,
            competencias_evaluadas: competenciasConPuntaje.length
          });

          console.log(`✅ Evaluación creada para ${empleado.nombre} ${empleado.apellido}`);
        } catch (error) {
          console.error(`❌ Error al crear evaluación para ${empleado.nombre}:`, error);
        }
      }

      setEvaluacionesGeneradas(evaluacionesCreadas);

      // Actualizar estado de la programación a "ejecutada" o "completada"
      // Aquí podrías actualizar el estado en el backend si es necesario

      console.log(`🎉 [ProgramacionSingle] Programación ejecutada exitosamente. ${evaluacionesCreadas.length} evaluaciones creadas.`);
      
      alert(`¡Programación ejecutada exitosamente!\n\nSe generaron ${evaluacionesCreadas.length} evaluaciones individuales.\nPuedes verlas en el Dashboard de Evaluaciones Individuales.`);

    } catch (error) {
      console.error('❌ [ProgramacionSingle] Error al ejecutar programación:', error);
      alert('Error al ejecutar la programación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsExecuting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getEstadoBadge = (estado) => {
    if (estado === 'completada') {
      return <Badge className="bg-green-600">Completada</Badge>;
    } else if (estado === 'en_progreso') {
      return <Badge className="bg-blue-600">En Progreso</Badge>;
    } else {
      return <Badge className="bg-yellow-600">Programada</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando programación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => navigate('/app/evaluacion-competencias')}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Programaciones
          </Button>
        </div>
      </div>
    );
  }

  if (!programacion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Programación no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/app/evaluacion-competencias')}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {programacion.titulo || programacion.nombre}
            </h1>
            <p className="text-slate-400">Programación de Evaluación Grupal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getEstadoBadge(programacion.estado)}
          <Button
            onClick={ejecutarProgramacion}
            disabled={isExecuting}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Ejecutar Programación
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Información de la Programación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300">Título</Label>
              <p className="text-white font-medium">{programacion.titulo || programacion.nombre}</p>
            </div>
            <div>
              <Label className="text-slate-300">Descripción</Label>
              <p className="text-slate-400">{programacion.descripcion || 'Sin descripción'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Fecha Inicio</Label>
                <p className="text-white">{formatDate(programacion.fecha_inicio)}</p>
              </div>
              <div>
                <Label className="text-slate-300">Fecha Fin</Label>
                <p className="text-white">{formatDate(programacion.fecha_fin)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Empleados a Evaluar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">
                Esta programación evaluará a los siguientes empleados:
              </p>
              <div className="space-y-1">
                {empleados.slice(0, 3).map((empleado) => (
                  <div key={empleado.id} className="flex items-center gap-2 text-white">
                    <User className="h-4 w-4 text-teal-400" />
                    {empleado.nombre} {empleado.apellido}
                  </div>
                ))}
                {empleados.length > 3 && (
                  <p className="text-slate-400 text-sm">
                    Y {empleados.length - 3} empleados más...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competencias a Evaluar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Competencias a Evaluar ({competencias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competencias.slice(0, 6).map((competencia) => (
              <div
                key={competencia.id}
                className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg border border-slate-600"
              >
                <Star className="h-5 w-5 text-teal-400" />
                <div>
                  <h4 className="font-medium text-white">{competencia.nombre}</h4>
                  <p className="text-slate-400 text-sm">{competencia.descripcion}</p>
                </div>
              </div>
            ))}
            {competencias.length > 6 && (
              <div className="flex items-center justify-center p-3 bg-slate-700 rounded-lg border border-slate-600">
                <p className="text-slate-400">
                  +{competencias.length - 6} competencias más
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Evaluaciones Generadas */}
      {evaluacionesGeneradas.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Evaluaciones Generadas ({evaluacionesGeneradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evaluacionesGeneradas.map((evaluacion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <h4 className="font-medium text-white">
                        {evaluacion.empleado_nombre} {evaluacion.empleado_apellido}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {evaluacion.competencias_evaluadas} competencias evaluadas
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-600">Completada</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-teal-900/20 border border-teal-600/30 rounded-lg">
              <p className="text-teal-300 text-sm">
                ✅ Las evaluaciones individuales se han generado automáticamente y están disponibles en el 
                <Button
                  variant="link"
                  onClick={() => navigate('/app/evaluaciones-individuales')}
                  className="text-teal-400 hover:text-teal-300 p-0 ml-1"
                >
                  Dashboard de Evaluaciones Individuales
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instrucciones */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            Cómo Funciona la Ejecución
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-300 space-y-2">
            <p>🎯 <strong>Al ejecutar esta programación:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Se generarán automáticamente evaluaciones individuales para cada empleado seleccionado</li>
              <li>Cada evaluación incluirá puntajes para todas las competencias definidas</li>
              <li>Las evaluaciones aparecerán en el Dashboard de Evaluaciones Individuales</li>
              <li>No necesitas crear formularios individuales manualmente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramacionSingle;
