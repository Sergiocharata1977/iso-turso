import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

const COLORS = ['#FF8042', '#00C49F', '#0088FE', '#FFBB28'];

const estadoDisplayMap = {
  d1_iniciado: 'Iniciado',
  d2_accion_inmediata_programada: 'Planificado',
  d3_accion_inmediata_finalizada: 'Ejecutado',
  t1_pendiente_ac: 'En Análisis',
  t2_cerrado: 'Cerrado',
};

const prioridadDisplayMap = {
    'alta': 'Alta',
    'media': 'Media',
    'baja': 'Baja',
};

export default function DashboardView({ hallazgos }) {

  const dataPorEstado = useMemo(() => {
    const counts = hallazgos.reduce((acc, h) => {
      const estado = estadoDisplayMap[h.estado] || 'Desconocido';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(name => ({ name, Cantidad: counts[name] }));
  }, [hallazgos]);

  const dataPorPrioridad = useMemo(() => {
    const counts = hallazgos.reduce((acc, h) => {
      const prioridad = prioridadDisplayMap[h.prioridad?.toLowerCase()] || 'No definida';
      acc[prioridad] = (acc[prioridad] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [hallazgos]);


  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Hallazgos por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPorEstado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hallazgos por Prioridad</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPorPrioridad}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataPorPrioridad.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
