import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import personalService from '@/services/personalService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Building2, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const PersonalSingle = () => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        const data = await personalService.getPersonalById(id);
        setPerson(data);
      } catch (err) {
        setError('No se pudo cargar la información del empleado.');
        toast({
          title: 'Error',
          description: 'No se pudo cargar el registro. Inténtalo de nuevo más tarde.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPerson();
    }
  }, [id, toast]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-slate-400">Cargando detalles del empleado...</p></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold text-red-500">Error al Cargar</h2>
        <p className="text-slate-400 mt-2">{error}</p>
        <Button variant="outline" onClick={() => navigate('/personal')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Personal
        </Button>
      </div>
    );
  }

  if (!person) {
    return null; 
  }

  const infoItems = [
    { icon: Mail, label: 'Email', value: person.email },
    { icon: Phone, label: 'Teléfono', value: person.telefono },
    { icon: Building2, label: 'Departamento', value: person.departamento },
    { icon: Briefcase, label: 'Cargo', value: person.cargo },
    { icon: Calendar, label: 'Fecha de Ingreso', value: person.fecha_ingreso ? new Date(person.fecha_ingreso).toLocaleDateString() : 'No disponible' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto text-white">
      <Button variant="outline" size="sm" onClick={() => navigate('/personal')} className="mb-6 bg-transparent border-slate-600 hover:bg-slate-800">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Personal
      </Button>

      <Card className="bg-slate-800 border-slate-700 shadow-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                    <div className="p-3 bg-slate-700 rounded-full mr-4">
                        <User className="w-8 h-8 text-teal-400" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl md:text-3xl font-bold text-slate-100">{person.nombres} {person.apellidos}</CardTitle>
                        <p className="text-teal-400 font-medium">{person.cargo}</p>
                    </div>
                </div>
                <Badge className={`${person.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'} text-white`}>{person.estado}</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="border-t border-slate-700 my-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {infoItems.map((item, index) => (
                    <div key={index} className="flex items-start">
                        <item.icon className="w-5 h-5 mr-3 mt-1 text-slate-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-slate-400">{item.label}</p>
                            <p className="font-medium text-slate-100">{item.value || 'No especificado'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalSingle;
