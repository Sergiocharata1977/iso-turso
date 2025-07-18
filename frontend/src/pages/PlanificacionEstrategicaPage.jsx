import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  BarChart3
} from 'lucide-react';

const PlanificacionEstrategicaPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [planificaciones, setPlanificaciones] = useState([
    {
      id: 1,
      titulo: 'Plan Estratégico 2024',
      descripcion: 'Planificación estratégica anual para el cumplimiento de objetivos ISO 9001',
      fecha: '2024-01-15',
      estado: 'En Progreso',
      responsable: 'Dirección General',
      objetivos: 5,
      metas: 12
    },
    {
      id: 2,
      titulo: 'Plan de Mejora Continua',
      descripcion: 'Estrategias para la mejora continua de procesos y calidad',
      fecha: '2024-02-01',
      estado: 'Aprobado',
      responsable: 'Gerencia de Calidad',
      objetivos: 3,
      metas: 8
    },
    {
      id: 3,
      titulo: 'Plan de Desarrollo Organizacional',
      descripcion: 'Planificación del desarrollo y crecimiento organizacional',
      fecha: '2024-01-30',
      estado: 'Pendiente',
      responsable: 'RRHH',
      objetivos: 4,
      metas: 10
    }
  ]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPlanificaciones = planificaciones.filter(plan =>
    plan.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Planificación Estratégica</h1>
              <p className="text-orange-100 mt-1">
                Gestión estratégica y planificación organizacional según ISO 9001
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
                placeholder="Buscar planificaciones estratégicas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPlanificaciones.length} elementos
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
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Planificación
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlanificaciones.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.titulo}</CardTitle>
                        <CardDescription className="mt-2">
                          {plan.descripcion}
                        </CardDescription>
                      </div>
                      <Badge className={getEstadoColor(plan.estado)}>
                        {plan.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Fecha: {plan.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>Responsable: {plan.responsable}</span>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Target className="h-4 w-4 text-orange-500" />
                          <span>{plan.objetivos} objetivos</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>{plan.metas} metas</span>
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
            {filteredPlanificaciones.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Target className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{plan.titulo}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{plan.descripcion}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>Fecha: {plan.fecha}</span>
                              <span>Responsable: {plan.responsable}</span>
                              <span>{plan.objetivos} objetivos</span>
                              <span>{plan.metas} metas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getEstadoColor(plan.estado)}>
                          {plan.estado}
                        </Badge>
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

        {filteredPlanificaciones.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No se encontraron planificaciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera planificación estratégica'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanificacionEstrategicaPage; 