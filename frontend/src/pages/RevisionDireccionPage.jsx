import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Search, 
  Download, 
  Grid3X3, 
  List, 
  Plus,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RevisionDireccionPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [revisiones, setRevisiones] = useState([
    {
      id: 1,
      titulo: 'Revisión Q1 2024',
      descripcion: 'Revisión por la dirección del primer trimestre 2024 - Análisis de indicadores y cumplimiento de objetivos',
      tipo: 'Revisión Trimestral',
      estado: 'Completada',
      responsable: 'Dirección General',
      fecha: '2024-03-31',
      participantes: 8,
      decisiones: 5,
      acciones: 12,
      documentos: 3
    },
    {
      id: 2,
      titulo: 'Revisión Q4 2023',
      descripcion: 'Revisión anual por la dirección del sistema de gestión - Evaluación de resultados anuales',
      tipo: 'Revisión Anual',
      estado: 'Completada',
      responsable: 'Dirección General',
      fecha: '2023-12-15',
      participantes: 10,
      decisiones: 8,
      acciones: 15,
      documentos: 5
    },
    {
      id: 3,
      titulo: 'Revisión Q2 2024',
      descripcion: 'Revisión por la dirección del segundo trimestre 2024 - Seguimiento de mejoras implementadas',
      tipo: 'Revisión Trimestral',
      estado: 'Programada',
      responsable: 'Dirección General',
      fecha: '2024-06-30',
      participantes: 0,
      decisiones: 0,
      acciones: 0,
      documentos: 0
    },
    {
      id: 4,
      titulo: 'Revisión Extraordinaria - Incidente de Calidad',
      descripcion: 'Revisión extraordinaria por incidente reportado en el área de producción',
      tipo: 'Revisión Extraordinaria',
      estado: 'En Progreso',
      responsable: 'Dirección General',
      fecha: '2024-04-15',
      participantes: 6,
      decisiones: 3,
      acciones: 7,
      documentos: 2
    }
  ]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Programada':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Revisión Anual':
        return 'bg-purple-100 text-purple-800';
      case 'Revisión Trimestral':
        return 'bg-blue-100 text-blue-800';
      case 'Revisión Extraordinaria':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Completada':
        return <CheckCircle className="h-4 w-4" />;
      case 'En Progreso':
        return <Clock className="h-4 w-4" />;
      case 'Programada':
        return <Calendar className="h-4 w-4" />;
      case 'Pendiente':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredRevisiones = revisiones.filter(rev =>
    (rev.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     rev.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterEstado === 'todos' || rev.estado === filterEstado)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Revisión por la Dirección</h1>
              <p className="text-blue-100 mt-1">
                Gestión de revisiones por la dirección según ISO 9001
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
                placeholder="Buscar revisiones por la dirección..."
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
                <SelectItem value="Programada">Programada</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredRevisiones.length} elementos
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Revisión
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRevisiones.map((revision) => (
              <motion.div
                key={revision.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{revision.titulo}</CardTitle>
                        <CardDescription className="mt-2">
                          {revision.descripcion}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTipoColor(revision.tipo)}>
                        {revision.tipo}
                      </Badge>
                      <Badge className={getEstadoColor(revision.estado)}>
                        {getEstadoIcon(revision.estado)}
                        <span className="ml-1">{revision.estado}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Fecha: {revision.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>Responsable: {revision.responsable}</span>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{revision.participantes} participantes</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <BarChart3 className="h-4 w-4 text-green-500" />
                          <span>{revision.decisiones} decisiones</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span>{revision.acciones} acciones</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-4 w-4 text-purple-500" />
                          <span>{revision.documentos} documentos</span>
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
            {filteredRevisiones.map((revision) => (
              <motion.div
                key={revision.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{revision.titulo}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{revision.descripcion}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>Fecha: {revision.fecha}</span>
                              <span>Responsable: {revision.responsable}</span>
                              <span>{revision.participantes} participantes</span>
                              <span>{revision.decisiones} decisiones</span>
                              <span>{revision.acciones} acciones</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTipoColor(revision.tipo)}>
                                {revision.tipo}
                              </Badge>
                              <Badge className={getEstadoColor(revision.estado)}>
                                {getEstadoIcon(revision.estado)}
                                <span className="ml-1">{revision.estado}</span>
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

        {filteredRevisiones.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No se encontraron revisiones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera revisión por la dirección'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisionDireccionPage; 