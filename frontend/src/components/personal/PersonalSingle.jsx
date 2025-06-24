import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  CheckCircle,
  UserCog,
  FileText,
  Users,
  Building2,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Award
} from "lucide-react";

function PersonalSingle({ person, onBack, onEdit, onDelete }) {
  // Generar iniciales para el avatar
  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : '';
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  // Datos de ejemplo para funciones, responsabilidades, etc.
  const empleadoData = {
    funciones: [
      "Desarrollar y mantener el SGC",
      "Gestionar auditorías internas y externas", 
      "Coordinar acciones correctivas y preventivas",
      "Analizar datos para la mejora continua",
      "Capacitar al personal en temas de calidad"
    ],
    responsabilidades: [
      "Asegurar el cumplimiento de los requisitos ISO 9001",
      "Implementar mejoras en los procesos de calidad",
      "Coordinar con diferentes departamentos",
      "Reportar indicadores de calidad a la dirección",
      "Mantener la documentación del sistema actualizada"
    ],
    requisitos: {
      educacion: "Ingeniería Industrial o carrera afín",
      experiencia: "Mínimo 3 años en sistemas de calidad",
      certificaciones: "ISO 9001 Lead Auditor deseable",
      competencias: "Liderazgo, análisis de datos, comunicación"
    },
    contacto: {
      email: person.email || "sin.email@empresa.com",
      telefono: person.telefono || "+54 11 1234-5678",
      fechaIngreso: person.fecha_ingreso || "01/01/2020"
    },
    certificaciones: ["ISO 9001 Lead Auditor", "Six Sigma Green Belt"]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto p-6"
    >
      {/* Header Principal */}
      <div className="bg-white border-b border-gray-200 p-6 mb-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Perfil de Personal</h1>
              <p className="text-gray-600">Sistema de Gestión de Calidad ISO 9001</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onEdit(person)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onDelete(person.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Card Principal del Empleado */}
      <Card className="border-l-4 border-l-green-500 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={person.imagen} 
                  alt={`${person.nombres} ${person.apellidos}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white text-2xl font-bold">
                  {getInitials(person.nombres, person.apellidos)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Información Básica */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {person.nombres} {person.apellidos}
                </h2>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Activo
                </Badge>
              </div>
              <p className="text-lg text-gray-600 mb-4">{person.puesto || "Puesto no especificado"}</p>

              {/* Tarjetas Informativas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Código</p>
                      <p className="text-sm font-bold text-blue-800">
                        {person.numero || "P202501-001"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-xs text-purple-600 font-medium">Departamento</p>
                      <p className="text-sm font-bold text-purple-800">
                        {person.departamento || "Calidad"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-xs text-orange-600 font-medium">Supervisor</p>
                      <p className="text-sm font-bold text-orange-800">
                        {person.supervisor || "Director General"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción del Puesto */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Descripción del Puesto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed text-justify">
            {person.observaciones || 
            "Responsable de implementar, mantener y mejorar el Sistema de Gestión de Calidad, asegurando el cumplimiento de los requisitos de la norma ISO 9001. Coordina las actividades de calidad en toda la organización y lidera las iniciativas de mejora continua."}
          </p>
        </CardContent>
      </Card>

      {/* Sistema de Tabs */}
      <Tabs defaultValue="funciones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="funciones" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Funciones
          </TabsTrigger>
          <TabsTrigger value="responsabilidades" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Responsabilidades
          </TabsTrigger>
          <TabsTrigger value="requisitos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Requisitos
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funciones">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Funciones Principales</h3>
              <ol className="space-y-3">
                {empleadoData.funciones.map((funcion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{funcion}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responsabilidades">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Responsabilidades</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-3">
                  {empleadoData.responsabilidades.map((responsabilidad, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700">{responsabilidad}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisitos">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Requisitos del Puesto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-800">Educación</h4>
                  </div>
                  <p className="text-gray-700">{empleadoData.requisitos.educacion}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-green-800">Experiencia</h4>
                  </div>
                  <p className="text-gray-700">{empleadoData.requisitos.experiencia}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-purple-800">Certificaciones</h4>
                  </div>
                  <p className="text-gray-700">{empleadoData.requisitos.certificaciones}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-medium text-orange-800">Competencias</h4>
                  </div>
                  <p className="text-gray-700">{empleadoData.requisitos.competencias}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Contacto</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{empleadoData.contacto.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{empleadoData.contacto.telefono}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">Ingreso: {empleadoData.contacto.fechaIngreso}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Certificaciones</h4>
                  <div className="space-y-2">
                    {empleadoData.certificaciones.map((cert, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default PersonalSingle;
