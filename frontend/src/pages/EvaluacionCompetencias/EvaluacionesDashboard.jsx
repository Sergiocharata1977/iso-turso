import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Calendar, 
  Award, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { evaluacionesService } from '@/services/evaluacionesService';

const EvaluacionesDashboard = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 [Dashboard] Cargando evaluaciones...');
      
      // Cargar solo evaluaciones por ahora
      const evaluacionesData = await evaluacionesService.getAll();
      setEvaluaciones(evaluacionesData || []);

      console.log('✅ [Dashboard] Evaluaciones cargadas:', evaluacionesData?.length || 0);

    } catch (error) {
      console.error('❌ [Dashboard] Error al cargar datos:', error);
      // Mostrar error sin toast por ahora
      alert('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar evaluaciones por término de búsqueda
  const filteredEvaluaciones = evaluaciones.filter(evaluacion =>
    evaluacion.empleado_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluacion.empleado_apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluacion.evaluador_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas básicas
  const calcularEstadisticas = () => {
    const totalEvaluaciones = evaluaciones.length;
    const evaluacionesCompletadas = evaluaciones.filter(e => e.estado === 'completada').length;
    const empleadosEvaluados = new Set(evaluaciones.map(e => e.empleado_id)).size;
    const promedioGeneral = evaluaciones.length > 0 ? 
      evaluaciones.reduce((sum, e) => sum + (e.promedio_puntaje || 0), 0) / evaluaciones.length : 0;

    return {
      totalEvaluaciones,
      evaluacionesCompletadas,
      empleadosEvaluados,
      promedioGeneral: promedioGeneral.toFixed(1)
    };
  };

  const stats = calcularEstadisticas();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      'completada': 'default',
      'pendiente': 'secondary',
      'en_progreso': 'outline'
    };
    
    const colors = {
      'completada': 'bg-green-600',
      'pendiente': 'bg-yellow-600',
      'en_progreso': 'bg-blue-600'
    };

    return (
      <Badge variant={variants[estado]} className={colors[estado]}>
        {estado === 'completada' ? 'Completada' : 
         estado === 'pendiente' ? 'Pendiente' : 'En Progreso'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando dashboard de evaluaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard de Evaluaciones</h1>
          <p className="text-slate-400">Control y seguimiento de evaluaciones individuales 1 a 1</p>
        </div>
        <Button 
          onClick={loadDashboardData}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Evaluaciones</CardTitle>
            <Award className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalEvaluaciones}</div>
            <p className="text-xs text-slate-400">Evaluaciones registradas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.evaluacionesCompletadas}</div>
            <p className="text-xs text-slate-400">
              {stats.totalEvaluaciones > 0 ? 
                `${((stats.evaluacionesCompletadas / stats.totalEvaluaciones) * 100).toFixed(1)}% del total` : 
                '0% del total'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Empleados Evaluados</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.empleadosEvaluados}</div>
            <p className="text-xs text-slate-400">Empleados únicos</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Promedio General</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.promedioGeneral}</div>
            <p className="text-xs text-slate-400">Puntuación promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Evaluaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por empleado o evaluador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Evaluaciones */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Evaluaciones Registradas ({filteredEvaluaciones.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvaluaciones.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {searchTerm ? 'No se encontraron evaluaciones que coincidan con la búsqueda' : 'No hay evaluaciones registradas'}
              </p>
              {!searchTerm && (
                <p className="text-slate-500 text-sm mt-2">
                  Las evaluaciones individuales aparecerán aquí una vez que se creen
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvaluaciones.map((evaluacion) => (
                <div
                  key={evaluacion.id}
                  className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">
                        {evaluacion.empleado_nombre} {evaluacion.empleado_apellido}
                      </h3>
                      {getEstadoBadge(evaluacion.estado)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(evaluacion.fecha_evaluacion)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Evaluador: {evaluacion.evaluador_nombre || 'N/A'}
                      </span>
                      {evaluacion.competencias_evaluadas && (
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {evaluacion.competencias_evaluadas} competencias
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white hover:bg-slate-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white hover:bg-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluacionesDashboard;
