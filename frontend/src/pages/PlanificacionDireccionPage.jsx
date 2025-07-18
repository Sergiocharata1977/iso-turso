import React, { useState, useEffect } from 'react';
import { direccionService } from '@/services/direccionService';
import { reunionesService } from '@/services/reunionesService';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter, Download, Plus, LayoutGrid, Table, Eye, Edit, Calendar, Users, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import NuevaReunionModal from '@/components/direccion/NuevaReunionModal';
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



const TextTabContent = ({ title, description, content, fieldName, onSave, isSaving }) => {
  const [text, setText] = useState(content || '');

  useEffect(() => {
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
  // La lógica de subida de archivos se implementará más adelante
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

const PlanificacionDireccionPage = () => {
  const [config, setConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('tarjetas'); // 'tarjetas' o 'tabla'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('todas'); // Cambiado de '' a 'todas'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reuniones, setReuniones] = useState([]); // Aquí almacenaremos las reuniones
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Cargar configuración
        try {
          const configData = await direccionService.getConfiguracion();
          setConfig(configData);
        } catch (configErr) {
          console.error('Error al cargar configuración:', configErr);
          setConfig({}); // Configuración vacía por defecto
        }
        
        // Cargar reuniones
        try {
          const reunionesData = await reunionesService.getAllReuniones();
          setReuniones(reunionesData || []);
        } catch (reunionesErr) {
          console.error('Error al cargar reuniones:', reunionesErr);
          setReuniones([]); // Lista vacía por defecto
        }
      } catch (err) {
        console.error('Error general:', err);
        setError('Error al cargar los datos.');
        toast({
          title: "Error de Carga",
          description: err.message || "No se pudo obtener la información del servidor.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Removido toast de las dependencias para evitar bucle infinito

  const handleSave = async (updatedData) => {
    setIsSaving(true);
    try {
      const updatedConfig = await direccionService.updateConfiguracion(updatedData);
      setConfig(updatedConfig);
      toast({
        title: "Éxito",
        description: "La configuración se ha guardado correctamente.",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      toast({
        title: "Error al Guardar",
        description: err.message || "No se pudo guardar la configuración.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-teal-500"/></div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md text-center">{error}</div>;
  }

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

      <CompromisoExcelencia config={config} onSave={handleSave} isSaving={isSaving} />

      {viewMode === 'tabla' ? (
        <Card>
          <CardHeader>
            <CardTitle>Reuniones de Revisión por la Dirección</CardTitle>
          </CardHeader>
          <CardContent>
            <TableComponent>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(reuniones || [])
                  .filter(reunion => 
                    (searchTerm === '' || reunion.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (filterArea === 'todas' || reunion.area === filterArea)
                  )
                  .map((reunion) => (
                  <TableRow key={reunion.id}>
                    <TableCell>{reunion.fecha_hora ? format(new Date(reunion.fecha_hora), 'dd/MM/yyyy', { locale: es }) : 'Sin fecha'}</TableCell>
                    <TableCell className="font-medium">{reunion.titulo}</TableCell>
                    <TableCell>
                      {reunion.area === 'calidad' && 'Calidad'}
                      {reunion.area === 'produccion' && 'Producción'}
                      {reunion.area === 'comercial' && 'Comercial'}
                      {reunion.area === 'direccion' && 'Dirección'}
                      {!reunion.area && 'General'}
                    </TableCell>
                    <TableCell>
                      {reunion.estado === 'planificada' && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">Planificada</Badge>
                      )}
                      {reunion.estado === 'en_curso' && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">En curso</Badge>
                      )}
                      {reunion.estado === 'completada' && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">Completada</Badge>
                      )}
                      {reunion.estado === 'cancelada' && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">Cancelada</Badge>
                      )}
                    </TableCell>
                    <TableCell>{reunion.participantes_count || 0} participantes</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Editar reunión">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(reuniones || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No hay reuniones registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableComponent>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Reuniones de Revisión por la Dirección</h2>
          
          {(reuniones || []).length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col items-center justify-center gap-2">
                <Calendar className="h-12 w-12 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-600">No hay reuniones programadas</h3>
                <p className="text-gray-500 max-w-md">Crea una nueva reunión para comenzar a planificar la revisión por la dirección.</p>
                <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Reunión
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(reuniones || [])
                .filter(reunion => 
                  (searchTerm === '' || reunion.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (filterArea === 'todas' || reunion.area === filterArea)
                )
                .map(reunion => (
                  <Card key={reunion.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-teal-500">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-2" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg group-hover:text-teal-600">{reunion.titulo}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${reunion.estado === 'planificada' ? 'bg-blue-100 text-blue-800' : ''}
                            ${reunion.estado === 'en_curso' ? 'bg-amber-100 text-amber-800' : ''}
                            ${reunion.estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
                            ${reunion.estado === 'cancelada' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {reunion.estado === 'planificada' && 'Planificada'}
                          {reunion.estado === 'en_curso' && 'En curso'}
                          {reunion.estado === 'completada' && 'Completada'}
                          {reunion.estado === 'cancelada' && 'Cancelada'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {reunion.fecha_hora ? format(new Date(reunion.fecha_hora), "EEEE d 'de' MMMM 'de' yyyy, HH:mm 'hs'" , { locale: es }) : 'Fecha no definida'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Users className="h-4 w-4" />
                        <span>{reunion.participantes_count || 0} participantes</span>
                      </div>
                      {reunion.temas && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Temas:</strong> {reunion.temas.length > 100 ? `${reunion.temas.substring(0, 100)}...` : reunion.temas}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{reunion.documentos_count || 0} documentos</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              }
            </div>
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
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="alcance">
          <TextTabContent 
            title="Alcance del Sistema de Gestión"
            description="Especifique los límites y la aplicabilidad del Sistema de Gestión de Calidad."
            content={config?.alcance}
            fieldName="alcance"
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="estrategia">
          <TextTabContent 
            title="Estrategia Organizacional"
            description="Describa la dirección estratégica y los objetivos a largo plazo de la empresa."
            content={config?.estrategia}
            fieldName="estrategia"
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="organigrama">
          <ImageTabContent 
            title="Organigrama de la Empresa"
            description="Suba una imagen del organigrama actualizado de la organización."
            imageUrl={config?.organigrama_url}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="mapa_procesos">
          <ImageTabContent 
            title="Mapa de Interrelación de Procesos"
            description="Suba una imagen que muestre cómo interactúan los procesos del SGC."
            imageUrl={config?.mapa_procesos_url}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
      </div>

      <NuevaReunionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (formData) => {
          try {
            // Guardar la reunión en el backend
            const nuevaReunion = await reunionesService.createReunion(formData);
            
            // Actualizar la lista de reuniones
            setReuniones(prevReuniones => [...prevReuniones, nuevaReunion]);
            
            setIsModalOpen(false);
            toast({
              title: "Éxito",
              description: "Reunión creada correctamente",
              className: "bg-green-500 text-white",
            });
          } catch (error) {
            console.error('Error al crear la reunión:', error);
            toast({
              title: "Error",
              description: error.message || "No se pudo crear la reunión",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default PlanificacionDireccionPage;
