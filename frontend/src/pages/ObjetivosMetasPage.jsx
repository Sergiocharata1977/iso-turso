import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, 
  Search, 
  Download, 
  Grid3X3, 
  List, 
  Plus,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ObjetivosMetasPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [objetivos, setObjetivos] = useState([
    {
      id: 1,
      titulo: 'Mejorar la Satisfacción del Cliente',
      descripcion: 'Incrementar la satisfacción del cliente en un 15% mediante la mejora de la calidad de productos y servicios',
      tipo: 'Objetivo de Calidad',
      estado: 'En Progreso',
      responsable: 'Gerencia Comercial',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
      progreso: 65,
      metas: [
        { id: 1, descripcion: 'Reducir tiempo de respuesta en 20%', completada: true },
        { id: 2, descripcion: 'Implementar encuestas de satisfacción', completada: true },
        { id: 3, descripcion: 'Capacitar personal en atención al cliente', completada: false }
      ]
    },
    {
      id: 2,
      titulo: 'Optimizar Procesos Internos',
      descripcion: 'Reducir costos operativos en un 10% mediante la optimización de procesos y eliminación de desperdicios',
      tipo: 'Objetivo Operacional',
      estado: 'Completado',
      responsable: 'Gerencia de Operaciones',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-06-30',
      progreso: 100,
      metas: [
        { id: 1, descripcion: 'Mapear procesos críticos', completada: true },
        { id: 2, descripcion: 'Identificar oportunidades de mejora', completada: true },
        { id: 3, descripcion: 'Implementar mejoras identificadas', completada: true }
      ]
    },
    {
      id: 3,
      titulo: 'Desarrollar Competencias del Personal',
      descripcion: 'Capacitar al 100% del personal en competencias técnicas y blandas requeridas para sus funciones',
      tipo: 'Objetivo de Desarrollo',
      estado: 'Pendiente',
      responsable: 'RRHH',
      fecha_inicio: '2024-03-01',
      fecha_fin: '2024-12-31',
      progreso: 25,
      metas: [
        { id: 1, descripcion: 'Evaluar necesidades de capacitación', completada: true },
        { id: 2, descripcion: 'Desarrollar plan de capacitación', completada: false },
        { id: 3, descripcion: 'Ejecutar programa de capacitación', completada: false }
      ]
    }
  ]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Objetivo de Calidad':
        return 'bg-purple-100 text-purple-800';
      case 'Objetivo Operacional':
        return 'bg-blue-100 text-blue-800';
      case 'Objetivo de Desarrollo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredObjetivos = objetivos.filter(obj =>
    (obj.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     obj.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterEstado === 'todos' || obj.estado === filterEstado)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Objetivos y Metas</h1>
              <p className="text-green-100 mt-1">
                Gestión de objetivos estratégicos y metas organizacionales según ISO 9001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar objetivos y metas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Retrasado">Retrasado</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredObjetivos.length} elementos
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Objetivo
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjetivos.map((objetivo) => (
              <motion.div
                key={objetivo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{objetivo.titulo}</CardTitle>
                        <CardDescription className="mt-2">
                          {objetivo.descripcion}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTipoColor(objetivo.tipo)}>
                        {objetivo.tipo}
                      </Badge>
                      <Badge className={getEstadoColor(objetivo.estado)}>
                        {objetivo.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{objetivo.fecha_inicio} - {objetivo.fecha_fin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>Responsable: {objetivo.responsable}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{objetivo.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${objetivo.progreso}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Metas */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Target className="h-4 w-4" />
                          <span>Metas ({objetivo.metas.filter(m => m.completada).length}/{objetivo.metas.length})</span>
                        </div>
                        <div className="space-y-1">
                          {objetivo.metas.slice(0, 2).map((meta) => (
                            <div key={meta.id} className="flex items-center gap-2 text-xs">
                              {meta.completada ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Clock className="h-3 w-3 text-gray-400" />
                              )}
                              <span className={meta.completada ? 'line-through text-gray-500' : ''}>
                                {meta.descripcion}
                              </span>
                            </div>
                          ))}
                          {objetivo.metas.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{objetivo.metas.length - 2} metas más
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredObjetivos.map((objetivo) => (
              <motion.div
                key={objetivo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Target className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{objetivo.titulo}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{objetivo.descripcion}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{objetivo.fecha_inicio} - {objetivo.fecha_fin}</span>
                              <span>Responsable: {objetivo.responsable}</span>
                              <span>Progreso: {objetivo.progreso}%</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTipoColor(objetivo.tipo)}>
                                {objetivo.tipo}
                              </Badge>
                              <Badge className={getEstadoColor(objetivo.estado)}>
                                {objetivo.estado}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredObjetivos.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No se encontraron objetivos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer objetivo estratégico'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjetivosMetasPage; 