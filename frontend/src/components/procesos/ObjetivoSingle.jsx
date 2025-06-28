import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Calendar, User, CheckCircle, Clock, Flag, Pencil, Trash2, TrendingUp, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getEstadoInfo = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'en progreso':
      return { text: 'En Progreso', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'completado':
      return { text: 'Completado', className: 'bg-green-100 text-green-800 border-green-200' };
    case 'activo':
        return { text: 'Activo', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'cancelado':
      return { text: 'Cancelado', className: 'bg-red-100 text-red-800 border-red-200' };
    default:
      return { text: estado || 'No definido', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

const InfoCard = ({ icon: Icon, title, value, className }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ObjetivoSingle = ({ objetivo, onBack, onEdit, onDelete }) => {
  if (!objetivo) return null;

  const { text: estadoText, className: estadoClassName } = getEstadoInfo(objetivo.estado);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gray-50/50">
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className='flex items-center gap-4'>
                <Button onClick={onBack} variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Detalle del Objetivo</h1>
                    <p className="text-sm text-gray-500">Sistema de Gestión de Calidad ISO 9001</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => onEdit(objetivo)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button variant="destructive" onClick={() => onDelete(objetivo.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                </Button>
            </div>
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card className="border-l-4 border-teal-500">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">{objetivo.descripcion}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono mt-1">Código: {objetivo.codigo}</p>
                </div>
                <Badge variant="outline" className={estadoClassName}>{estadoText}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
             <InfoCard icon={Target} title="Meta del Objetivo" value={objetivo.meta || 'N/A'} />
             <InfoCard icon={User} title="Responsable" value={objetivo.responsable || 'N/A'} />
             <InfoCard icon={Calendar} title="Plazo" value={`${formatDate(objetivo.fecha_inicio)} - ${formatDate(objetivo.fecha_fin)}`} />
          </CardContent>
        </Card>

        <Tabs defaultValue="indicadores" className="w-full">
          <TabsList>
            <TabsTrigger value="indicadores">
                <TrendingUp className='h-4 w-4 mr-2' />
                Indicadores
            </TabsTrigger>
            <TabsTrigger value="planes">
                <ListChecks className='h-4 w-4 mr-2' />
                Planes de Acción
            </TabsTrigger>
          </TabsList>
          <TabsContent value="indicadores">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Próximamente: Aquí se mostrarán los indicadores asociados para medir el progreso de este objetivo.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="planes">
            <Card>
              <CardHeader>
                <CardTitle>Planes de Acción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Próximamente: Aquí se listarán los planes de acción detallados para alcanzar este objetivo.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ObjetivoSingle;
