import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  BarChart3, 
  ChevronDown, 
  ChevronRight,
  Users,
  Calendar,
  Hash
} from 'lucide-react';
import sgcHierarchyService from '@/services/sgcHierarchyService';

const HierarchyLevel = ({ title, icon: Icon, items, level, onToggle, isExpanded }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-1 h-8 w-8"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <Icon className="h-5 w-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title} ({items.length})
        </h3>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8"
        >
          {items.map((item, index) => (
            <Card key={item.id || `item-${index}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {item.nombre || item.nombre_objetivo || item.titulo}
                  <Badge variant="secondary" className="text-xs">
                    {String(item.id || '').slice(-6) || 'N/A'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.descripcion || 'Sin descripción'}
                </p>
                {item.responsable && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span>{item.responsable}</span>
                  </div>
                )}
                {item.meta && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Target className="h-3 w-3" />
                    <span>Meta: {item.meta}</span>
                  </div>
                )}
                {item.frecuencia_medicion && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{item.frecuencia_medicion}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

const SGCHierarchyView = () => {
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState({
    procesos: true,
    objetivos: true,
    indicadores: true,
    mediciones: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadHierarchy();
  }, []);

  const loadHierarchy = async () => {
    try {
      setLoading(true);
      const response = await sgcHierarchyService.getHierarchy();
      console.log('🏗️ Jerarquía SGC cargada:', response);
      setHierarchy(response.data || response);
    } catch (error) {
      console.error('❌ Error cargando jerarquía SGC:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la jerarquía SGC',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const getStats = () => {
    if (!hierarchy) return { procesos: 0, objetivos: 0, indicadores: 0, mediciones: 0 };
    
    const procesos = hierarchy.procesos || [];
    const objetivos = procesos.reduce((acc, proc) => acc + (proc.objetivos?.length || 0), 0);
    const indicadores = procesos.reduce((acc, proc) => acc + (proc.indicadores?.length || 0), 0);
    const mediciones = procesos.reduce((acc, proc) => {
      return acc + (proc.indicadores?.reduce((sum, ind) => sum + (ind.mediciones?.length || 0), 0) || 0);
    }, 0);
    
    return { procesos: procesos.length, objetivos, indicadores, mediciones };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando jerarquía SGC...</p>
        </div>
      </div>
    );
  }

  if (!hierarchy) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">La jerarquía SGC no está disponible en este momento.</p>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Jerarquía SGC</h1>
            <p className="text-emerald-100">Vista piramidal del Sistema de Gestión de Calidad</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Procesos</span>
            </div>
            <p className="text-2xl font-bold">{stats.procesos}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Objetivos</span>
            </div>
            <p className="text-2xl font-bold">{stats.objetivos}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Indicadores</span>
            </div>
            <p className="text-2xl font-bold">{stats.indicadores}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Mediciones</span>
            </div>
            <p className="text-2xl font-bold">{stats.mediciones}</p>
          </div>
        </div>
      </div>

      {/* Hierarchy Levels */}
      <div className="space-y-6">
        {/* Procesos */}
        <HierarchyLevel
          title="Procesos"
          icon={FileText}
          items={hierarchy.procesos || []}
          level="procesos"
          onToggle={() => toggleLevel('procesos')}
          isExpanded={expandedLevels.procesos}
        />

        {/* Objetivos de Calidad */}
        <HierarchyLevel
          title="Objetivos de Calidad"
          icon={Target}
          items={hierarchy.procesos?.flatMap(p => p.objetivos || []) || []}
          level="objetivos"
          onToggle={() => toggleLevel('objetivos')}
          isExpanded={expandedLevels.objetivos}
        />

        {/* Indicadores */}
        <HierarchyLevel
          title="Indicadores de Calidad"
          icon={TrendingUp}
          items={hierarchy.procesos?.flatMap(p => p.indicadores || []) || []}
          level="indicadores"
          onToggle={() => toggleLevel('indicadores')}
          isExpanded={expandedLevels.indicadores}
        />

        {/* Mediciones */}
        <HierarchyLevel
          title="Mediciones"
          icon={BarChart3}
          items={hierarchy.procesos?.flatMap(p => 
            p.indicadores?.flatMap(ind => ind.mediciones || []) || []
          ) || []}
          level="mediciones"
          onToggle={() => toggleLevel('mediciones')}
          isExpanded={expandedLevels.mediciones}
        />
      </div>
    </div>
  );
};

export default SGCHierarchyView; 