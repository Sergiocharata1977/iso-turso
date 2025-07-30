import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter, Download, Plus, LayoutGrid, Table, Eye, Edit, Calendar, Users, FileText, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import NuevaMinutaModal from '@/components/direccion/NuevaMinutaModal';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDireccionConfig, useUpdateDireccionConfig, useMinutas, useCreateMinuta } from '@/services/direccionServiceWithQuery';

const TextTabContent = ({ title, description, content, fieldName, onSave, isSaving }) => {
  const [text, setText] = useState(content || '');

  React.useEffect(() => {
    setText(content || '');
  }, [content]);

  const handleSave = () => {
    onSave({ [fieldName]: text });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15}
          className="w-full p-2 border rounded"
          disabled={isSaving}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ImageTabContent = ({ title, description, imageUrl, onSave, isSaving }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center min-h-[200px] flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="max-w-full h-auto mx-auto rounded-md" />
          ) : (
            <p className="text-gray-500">No hay imagen cargada.</p>
          )}
        </div>
        <Input type="file" className="w-full" disabled={true} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => onSave({})} disabled={true}>
          Subir Imagen (Próximamente)
        </Button>
      </CardFooter>
    </Card>
  );
};

const CompromisoExcelencia = ({ config, onSave, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    compromiso_titulo: config?.compromiso_titulo || 'Compromiso con la Excelencia en la Agricultura',
    compromiso_descripcion: config?.compromiso_descripcion || '"Los Señores del Agro" se compromete a ser el proveedor líder de fertilizantes, semillas y servicios logísticos de alta calidad para el sector agrícola.',
    compromiso_satisfaccion: config?.compromiso_satisfaccion || 'Entender y exceder las expectativas de nuestros clientes, proporcionando productos y servicios que cumplan con los requisitos establecidos y mejoren su productividad y rentabilidad.',
    compromiso_calidad: config?.compromiso_calidad || 'Asegurar la calidad de nuestros agroquímicos, semillas y servicios logísticos, cumpliendo con las normativas vigentes y los estándares más altos de la industria.',
    compromiso_mejora: config?.compromiso_mejora || 'Promover una cultura de mejora continua en todos los niveles de la organización, identificando y aplicando oportunidades para optimizar nuestros procesos y aumentar la eficiencia.',
    compromiso_personal: config?.compromiso_personal || 'Desarrollar y mantener un equipo de colaboradores altamente capacitado y motivado, que cuente con los conocimientos y habilidades necesarias para cumplir con los objetivos de calidad.'
  });

  const handleSave = async () => {
    try {
      await onSave(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar compromiso:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      compromiso_titulo: config?.compromiso_titulo || 'Compromiso con la Excelencia en la Agricultura',
      compromiso_descripcion: config?.compromiso_descripcion || '"Los Señores del Agro" se compromete a ser el proveedor líder de fertilizantes, semillas y servicios logísticos de alta calidad para el sector agrícola.',
      compromiso_satisfaccion: config?.compromiso_satisfaccion || 'Entender y exceder las expectativas de nuestros clientes, proporcionando productos y servicios que cumplan con los requisitos establecidos y mejoren su productividad y rentabilidad.',
      compromiso_calidad: config?.compromiso_calidad || 'Asegurar la calidad de nuestros agroquímicos, semillas y servicios logísticos, cumpliendo con las normativas vigentes y los estándares más altos de la industria.',
      compromiso_mejora: config?.compromiso_mejora || 'Promover una cultura de mejora continua en todos los niveles de la organización, identificando y aplicando oportunidades para optimizar nuestros procesos y aumentar la eficiencia.',
      compromiso_personal: config?.compromiso_personal || 'Desarrollar y mantener un equipo de colaboradores altamente capacitado y motivado, que cuente con los conocimientos y habilidades necesarias para cumplir con los objetivos de calidad.'
    });
    setIsEditing(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editData.compromiso_titulo}
                onChange={(e) => setEditData({...editData, compromiso_titulo: e.target.value})}
                className="text-xl font-semibold mb-2"
                placeholder="Título del compromiso"
              />
            ) : (
              <CardTitle>{config?.compromiso_titulo || 'Compromiso con la Excelencia en la Agricultura'}</CardTitle>
            )}
            {isEditing ? (
              <Textarea
                value={editData.compromiso_descripcion}
                onChange={(e) => setEditData({...editData, compromiso_descripcion: e.target.value})}
                className="mt-2"
                placeholder="Descripción del compromiso"
                rows={2}
              />
            ) : (
              <CardDescription>
                {config?.compromiso_descripcion || '"Los Señores del Agro" se compromete a ser el proveedor líder de fertilizantes, semillas y servicios logísticos de alta calidad para el sector agrícola.'}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Satisfacción del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.compromiso_satisfaccion}
                  onChange={(e) => setEditData({...editData, compromiso_satisfaccion: e.target.value})}
                  placeholder="Describa el compromiso con la satisfacción del cliente"
                  rows={3}
                />
              ) : (
                <p>{config?.compromiso_satisfaccion || 'Entender y exceder las expectativas de nuestros clientes, proporcionando productos y servicios que cumplan con los requisitos establecidos y mejoren su productividad y rentabilidad.'}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calidad de los productos y servicios</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.compromiso_calidad}
                  onChange={(e) => setEditData({...editData, compromiso_calidad: e.target.value})}
                  placeholder="Describa el compromiso con la calidad"
                  rows={3}
                />
              ) : (
                <p>{config?.compromiso_calidad || 'Asegurar la calidad de nuestros agroquímicos, semillas y servicios logísticos, cumpliendo con las normativas vigentes y los estándares más altos de la industria.'}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mejora continua</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.compromiso_mejora}
                  onChange={(e) => setEditData({...editData, compromiso_mejora: e.target.value})}
                  placeholder="Describa el compromiso con la mejora continua"
                  rows={3}
                />
              ) : (
                <p>{config?.compromiso_mejora || 'Promover una cultura de mejora continua en todos los niveles de la organización, identificando y aplicando oportunidades para optimizar nuestros procesos y aumentar la eficiencia.'}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal competente</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.compromiso_personal}
                  onChange={(e) => setEditData({...editData, compromiso_personal: e.target.value})}
                  placeholder="Describa el compromiso con el personal"
                  rows={3}
                />
              ) : (
                <p>{config?.compromiso_personal || 'Desarrollar y mantener un equipo de colaboradores altamente capacitado y motivado, que cuente con los conocimientos y habilidades necesarias para cumplir con los objetivos de calidad.'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

const PlanificacionDireccionPageWithQuery = () => {
  const [viewMode, setViewMode] = useState('tarjetas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usar React Query para obtener datos
  const { 
    data: config = {}, 
    isLoading: isLoadingConfig, 
    error: configError 
  } = useDireccionConfig();

  const { 
    data: minutas = [], 
    isLoading: isLoadingMinutas, 
    error: minutasError 
  } = useMinutas();

  // Usar React Query para mutaciones
  const { 
    mutate: updateConfig, 
    isPending: isSavingConfig 
  } = useUpdateDireccionConfig();

  const { 
    mutate: createMinuta, 
    isPending: isCreatingMinuta 
  } = useCreateMinuta({
    onSuccess: () => {
      setIsModalOpen(false);
    }
  });

  const isLoading = isLoadingConfig || isLoadingMinutas;
  const error = configError || minutasError;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-teal-500"/></div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md text-center">
      Error al cargar los datos: {error.message}
    </div>;
  }

  const handleSave = (updatedData) => {
    updateConfig(updatedData);
  };

  const handleCreateMinuta = (formData) => {
    createMinuta(formData);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Planificación y Revisión por la Dirección</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Reunión
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar políticas, procesos, reuniones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las áreas</SelectItem>
            <SelectItem value="calidad">Calidad</SelectItem>
            <SelectItem value="produccion">Producción</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'tarjetas' ? 'default' : 'outline'}
            onClick={() => setViewMode('tarjetas')}
            size="icon"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'tabla' ? 'default' : 'outline'}
            onClick={() => setViewMode('tabla')}
            size="icon"
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CompromisoExcelencia config={config} onSave={handleSave} isSaving={isSavingConfig} />

      {/* Vista de tarjetas */}
      {viewMode === 'tarjetas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(minutas || [])
            .filter(item => 
              item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.titulo}</CardTitle>
                    <Badge variant="secondary">
                      Minuta
                    </Badge>
                  </div>
                  <CardDescription>
                    {item.created_at && format(new Date(item.created_at), 'PPP', { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{item.descripcion}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{item.responsable || 'Sin responsable'}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}

          {(minutas || []).length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No hay minutas registradas</h3>
              <p className="text-gray-500">Comience creando una nueva minuta de revisión</p>
            </div>
          )}
        </div>
      )}

      {/* Vista de tabla */}
      {viewMode === 'tabla' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Minutas de Revisión por la Dirección</h2>
          
          {(minutas || []).length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No hay minutas programadas</h3>
              <p className="text-gray-500">Comience creando una nueva minuta de revisión</p>
            </div>
          ) : (
            <TableComponent>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(minutas || [])
                  .filter(item => 
                    item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.titulo}</TableCell>
                      <TableCell>{item.responsable || 'Sin responsable'}</TableCell>
                      <TableCell>
                        {item.created_at && format(new Date(item.created_at), 'PPP', { locale: es })}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.descripcion || 'Sin descripción'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </TableComponent>
          )}
        </div>
      )}
      
      {/* Tabs para la configuración del sistema */}
      <div className="mt-8">
        <Tabs defaultValue="politica" className="w-full">

        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="politica">Política de Calidad</TabsTrigger>
          <TabsTrigger value="alcance">Alcance</TabsTrigger>
          <TabsTrigger value="estrategia">Estrategia</TabsTrigger>
          <TabsTrigger value="organigrama">Organigrama</TabsTrigger>
          <TabsTrigger value="mapa_procesos">Mapa de Procesos</TabsTrigger>
        </TabsList>

        <TabsContent value="politica">
          <TextTabContent 
            title="Política de Calidad"
            description="Defina la política de calidad de la organización. Este texto será visible para todos los miembros."
            content={config?.politica_calidad}
            fieldName="politica_calidad"
            onSave={handleSave}
            isSaving={isSavingConfig}
          />
        </TabsContent>

        <TabsContent value="alcance">
          <TextTabContent 
            title="Alcance del Sistema de Gestión"
            description="Especifique los límites y la aplicabilidad del Sistema de Gestión de Calidad."
            content={config?.alcance}
            fieldName="alcance"
            onSave={handleSave}
            isSaving={isSavingConfig}
          />
        </TabsContent>

        <TabsContent value="estrategia">
          <TextTabContent 
            title="Estrategia Organizacional"
            description="Describa la dirección estratégica y los objetivos a largo plazo de la empresa."
            content={config?.estrategia}
            fieldName="estrategia"
            onSave={handleSave}
            isSaving={isSavingConfig}
          />
        </TabsContent>

        <TabsContent value="organigrama">
          <ImageTabContent 
            title="Organigrama de la Empresa"
            description="Suba una imagen del organigrama actualizado de la organización."
            imageUrl={config?.organigrama_url}
            onSave={handleSave}
            isSaving={isSavingConfig}
          />
        </TabsContent>

        <TabsContent value="mapa_procesos">
          <ImageTabContent 
            title="Mapa de Interrelación de Procesos"
            description="Suba una imagen que muestre cómo interactúan los procesos del SGC."
            imageUrl={config?.mapa_procesos_url}
            onSave={handleSave}
            isSaving={isSavingConfig}
          />
        </TabsContent>
      </Tabs>
      </div>

      <NuevaMinutaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateMinuta}
      />
    </div>
  );
};

export default PlanificacionDireccionPageWithQuery; 