import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Pencil,         // For Edit button
  Building2,      // For Departamento icon
  User,           // For Supervisor icon
  GraduationCap,  // For Requisitos tab content (later)
  ClipboardList,  // For Requisitos tab content (later)
  Award,          // For Competencias (later)
  Clock,          // For Requisitos tab content (later)
  Save,           // For Guardar button
  FileText        // For Código icon
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper functions (will be adapted later)
const renderFuncionesPlaceholder = (puesto) => {
  if (!puesto?.principales_responsabilidades) {
    return <p className="text-sm text-gray-500 mt-2">No hay funciones definidas.</p>;
  }

  const funciones = puesto.principales_responsabilidades.split('\n').filter(f => f.trim());

  if (funciones.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No hay funciones definidas.</p>;
  }

  return (
    <div className="mt-1">
      <h3 className="text-md font-semibold text-gray-700 mb-4">Principales funciones y responsabilidades del puesto</h3>
      <ul className="space-y-3">
        {funciones.map((funcion, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 bg-emerald-500 text-white text-xs font-semibold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-3 mt-1">
              {index + 1}
            </span>
            <span className="text-sm text-gray-700 leading-relaxed">{funcion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderCompetenciasPlaceholder = (puesto) => {
  if (!puesto?.competencias_necesarias) return null;
  return (
    <Card className="border border-gray-200 shadow-sm mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Competencias Necesarias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {puesto.competencias_necesarias.split('\n').filter(c => c.trim()).map((competencia, index) => (
            <Badge key={index} variant="outline">{competencia}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const renderRequisitosPlaceholder = (puesto) => (
  <div className="space-y-4 mt-4">
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader><CardTitle className="text-lg font-semibold text-gray-700">Formación Requerida</CardTitle></CardHeader>
      <CardContent><p className="text-gray-600">{puesto.formacion_requerida || "No especificado"}</p></CardContent>
    </Card>
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader><CardTitle className="text-lg font-semibold text-gray-700">Experiencia Requerida</CardTitle></CardHeader>
      <CardContent><p className="text-gray-600">{puesto.experiencia_requerida || "No especificado"}</p></CardContent>
    </Card>
    {renderCompetenciasPlaceholder(puesto)} {/* Competencias moved here for now */}
  </div>
);

const renderPersonalPlaceholder = (puesto) => {
  if (!puesto?.puestos_a_cargo || puesto.puestos_a_cargo.length === 0) {
    return <p className="text-gray-500 mt-4">No hay personal a cargo.</p>;
  }
  return (
    <Card className="border border-gray-200 shadow-sm mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-700">Personal a Cargo</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          {puesto.puestos_a_cargo.map((item, index) => (
            <li key={index}>{item.titulo_puesto}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

function PuestoSingle({ puesto, onBack, onEdit, onDelete }) {
  if (!puesto) {
    return (
      <div className="flex items-center justify-center h-96 p-6 md:p-8">
        <p className="text-gray-600">No se encontró información del puesto.</p>
      </div>
    );
  }

  const handleSave = () => {
    // Placeholder for save logic. Potentially call onEdit or a new onSave prop.
    console.log("Guardar puesto:", puesto);
    if (onEdit) {
      // Assuming onEdit might be used to submit changes if the component handles form state
      // Or, it might just toggle an edit mode elsewhere.
      // For now, let's simulate it could be a save action.
      // onEdit(puesto); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 py-4 px-8 sm:py-6 sm:px-10 lg:py-8 lg:px-16 bg-background text-foreground overflow-y-auto"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Definición de Puesto</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Sistema de Gestión de Calidad ISO 9001</p>
        </div>
        <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => onEdit(puesto)} className="flex-grow sm:flex-grow-0">
            <Pencil className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Editar
          </Button>
          <Button
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex-grow sm:flex-grow-0"
            onClick={handleSave}
          >
            <Save className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Top Puesto Card */}
      <Card className="overflow-hidden relative border border-gray-200 shadow-md bg-white">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-emerald-500"></div>
        <CardHeader className="pl-5 pr-4 py-4 sm:pl-6 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            <div className="mb-2 sm:mb-0">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">{puesto.titulo_puesto}</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {puesto.proposito_general?.substring(0, 120) + (puesto.proposito_general?.length > 120 ? "..." : "") || "Detalles de la posición."}
              </CardDescription>
            </div>
            <Badge
              className={`px-2.5 py-1 text-xs font-medium rounded-full self-start sm:self-center whitespace-nowrap
                ${puesto.estado_puesto === "activo"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"}`}
            >
              {puesto.estado_puesto ? puesto.estado_puesto.charAt(0).toUpperCase() + puesto.estado_puesto.slice(1) : 'N/A'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-lg">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Código</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{puesto.codigo_puesto || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2.5 sm:p-3 bg-purple-50 rounded-lg">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Departamento</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{puesto.departamento_nombre || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4">
            <div className="p-2.5 sm:p-3 bg-orange-50 rounded-lg">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Supervisor</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{puesto.reporta_a_puesto_nombre || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción del Puesto Card */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-700">Descripción del Puesto</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 leading-relaxed">
          <p>{puesto.proposito_general || "No se proporcionó una descripción."}</p>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-0 pt-5 px-5 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">Información Detallada</CardTitle>
            <Tabs defaultValue="funciones" className="w-full">
              <TabsList className="border-b border-gray-200">
                <TabsTrigger value="funciones" className="pb-2.5 pt-3 px-1 mr-3 sm:mr-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 text-gray-500 hover:text-emerald-500 focus-visible:ring-offset-0 focus-visible:ring-0">
                  Funciones y Responsabilidades
                </TabsTrigger>
                <TabsTrigger value="requisitos" className="pb-2.5 pt-3 px-1 mr-3 sm:mr-4 text-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 text-gray-500 hover:text-emerald-500 focus-visible:ring-offset-0 focus-visible:ring-0">
                  Requisitos
                </TabsTrigger>
                <TabsTrigger value="personal" className="pb-2.5 pt-3 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 text-gray-500 hover:text-emerald-500 focus-visible:ring-offset-0 focus-visible:ring-0">
                  Personal
                </TabsTrigger>
              </TabsList>
              <div className="pt-4 pb-2">
                <TabsContent value="funciones">
                  {renderFuncionesPlaceholder(puesto)}
                </TabsContent>
                <TabsContent value="requisitos">
                  {renderRequisitosPlaceholder(puesto)}
                </TabsContent>
                <TabsContent value="personal">
                  {renderPersonalPlaceholder(puesto)}
                </TabsContent>
              </div>
            </Tabs>
        </CardHeader>
      </Card>

    </motion.div>
  );
}

export default PuestoSingle;
