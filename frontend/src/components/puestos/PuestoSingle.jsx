import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Briefcase, GraduationCap, Clock, Building2, Users, Pencil } from 'lucide-react';
import { puestosService } from '@/services/puestosService';
import { useToast } from '@/components/ui/use-toast';

export default function PuestoSingle({ puestoId, onBack, onEdit }) {
  const [puesto, setPuesto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPuesto();
  }, [puestoId]);

  const loadPuesto = async () => {
    try {
      setIsLoading(true);
      const data = await puestosService.getById(puestoId);
      setPuesto(data);
    } catch (error) {
      console.error('Error al cargar puesto:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del puesto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!puesto) {
    return <div>No se encontró el puesto</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-2xl font-bold">{puesto.nombre}</h2>
        </div>
        <Button onClick={() => onEdit(puesto)}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Detalles del Puesto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Descripción</h4>
              <p className="mt-1">{puesto.descripcion || 'Sin descripción'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Departamento</h4>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                <span>{puesto.departamento?.nombre || 'No asignado'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Requisitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Experiencia
              </h4>
              <p className="mt-1">{puesto.requisitos_experiencia || 'No especificada'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Formación
              </h4>
              <p className="mt-1">{puesto.requisitos_formacion || 'No especificada'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 