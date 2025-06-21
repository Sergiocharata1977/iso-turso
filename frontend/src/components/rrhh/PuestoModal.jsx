
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Importar DialogDescription
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useId } from "react";
import { 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap, 
  ClipboardList, 
  Shield, 
  Award, 
  Clock 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departamentosService } from "@/services/departamentos";
import { puestosService } from "@/services/puestosService"; // Asumiendo que este servicio existe
import { useToast } from "@/components/ui/use-toast";

function PuestoModal({ isOpen, onClose, onSave, puesto, isSaving }) {
  console.log("[PuestoModal] Rendering. isOpen:", isOpen, "puesto:", puesto ? puesto.titulo_puesto : null);
  // const titleId = useId();
  // const descriptionId = useId();
  const titleId = "puesto-modal-title";
  const descriptionId = "puesto-modal-description";
  console.log("[PuestoModal] Static IDs for Dialog: titleId:", titleId, "descriptionId:", descriptionId);
  const [formData, setFormData] = useState({
    titulo_puesto: "",
    departamento_id: "", // Cambiado de departamentoId
    reporta_a_puesto_id: "", // Cambiado de supervisor y para almacenar ID
    nivel: "",
    proposito_general: "",
    requisitos: "",
    competencias_necesarias: "",
    principales_responsabilidades: "",
    experiencia_requerida: "",
    formacion_requerida: "",
    estado_puesto: "activo"
  });

  const { toast } = useToast();
  const [departamentos, setDepartamentos] = useState([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
  const [puestosParaSupervisor, setPuestosParaSupervisor] = useState([]);
  const [loadingPuestos, setLoadingPuestos] = useState(false);

  useEffect(() => {
    const initializeModal = async () => {
      try {
        setLoadingDepartamentos(true);
        setLoadingPuestos(true);
        const depts = await departamentosService.getAll();
        const allPuestos = await puestosService.getAll();

        console.log("[PuestoModal] Datos recibidos de departamentosService:", depts);
        console.log("[PuestoModal] ¿depts es un array?", Array.isArray(depts));
        console.log("[PuestoModal] Datos recibidos de puestosService:", allPuestos);
        console.log("[PuestoModal] ¿allPuestos es un array?", Array.isArray(allPuestos));

        setDepartamentos(depts);
        
        const filteredPuestos = puesto ? allPuestos.filter(p => p.id !== puesto.id) : allPuestos;
        setPuestosParaSupervisor(filteredPuestos);

      } catch (error) {
        console.error("Error al cargar datos para selectores:", error);
        toast({
          title: "Error de Carga",
          description: "No se pudieron cargar los datos necesarios para el formulario.",
          variant: "destructive",
        });
      } finally {
        setLoadingDepartamentos(false);
        setLoadingPuestos(false);
      }

      if (puesto) {
        setFormData({
          ...puesto,
          departamento_id: puesto.departamento_id || "",
          reporta_a_puesto_id: puesto.reporta_a_puesto_id || "",
          titulo_puesto: puesto.titulo_puesto || "",
          nivel: puesto.nivel || "",
          proposito_general: puesto.proposito_general || "",
          requisitos: puesto.requisitos || "",
          competencias_necesarias: puesto.competencias_necesarias || "",
          principales_responsabilidades: puesto.principales_responsabilidades || "",
          experiencia_requerida: puesto.experiencia_requerida || "",
          formacion_requerida: puesto.formacion_requerida || "",
          estado_puesto: puesto.estado_puesto || "activo",
        });
      } else {
        setFormData({
          titulo_puesto: "",
          departamento_id: "",
          reporta_a_puesto_id: "",
          nivel: "",
          proposito_general: "",
          requisitos: "",
          competencias_necesarias: "",
          principales_responsabilidades: "",
          experiencia_requerida: "",
          formacion_requerida: "",
          estado_puesto: "activo"
        });
      }
    };

    if (isOpen) {
      console.log("[PuestoModal] Initializing modal. Puesto:", puesto ? puesto.titulo_puesto : 'new');
      initializeModal();
    }
  }, [isOpen, puesto]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-labelledby={titleId} aria-describedby={descriptionId} className="dark w-[70vw] max-w-[1200px] rounded-xl shadow-2xl border-border max-h-[90vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader className="bg-muted p-6 rounded-t-lg">
          <DialogTitle id={titleId}>{puesto ? "Editar Puesto" : "Nuevo Puesto"}</DialogTitle>
          <DialogDescription id={descriptionId}>
            Por favor, complete la información del puesto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="funciones">Funciones</TabsTrigger>
              <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
              <TabsTrigger value="competencias">Competencias</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo_puesto" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Nombre del Puesto
                  </Label>
                  <Input
                    id="titulo_puesto"
                    value={formData.titulo_puesto}
                    onChange={(e) => setFormData({ ...formData, titulo_puesto: e.target.value })}
                    required
                    placeholder="Ej: Gerente de Calidad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento_id" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Departamento
                  </Label>
                  <select
                    id="departamento_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.departamento_id} 
                    onChange={(e) => setFormData({ ...formData, departamento_id: e.target.value })} 
                    required
                    disabled={loadingDepartamentos}
                  >
                    <option value="">Seleccionar departamento...</option>
                    {loadingDepartamentos ? (
                      <option value="" disabled>Cargando departamentos...</option>
                    ) : (
                      departamentos.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.nombre}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reporta_a_puesto_id" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Reporta a (Supervisor)
                  </Label>
                  <select
                    id="reporta_a_puesto_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.reporta_a_puesto_id} 
                    onChange={(e) => setFormData({ ...formData, reporta_a_puesto_id: e.target.value })} 
                    // Considerar si este campo es 'required'. Si no, quitar el atributo.
                    // required 
                    disabled={loadingPuestos}
                  >
                    <option value="">Ninguno / Nivel más alto</option>
                    {loadingPuestos ? (
                      <option value="" disabled>Cargando puestos...</option>
                    ) : (
                      puestosParaSupervisor.map(p => (
                        <option key={p.id} value={p.id}>{p.titulo_puesto}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Nivel
                  </Label>
                  <select
                    id="nivel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.nivel}
                    onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un nivel</option>
                    <option value="Directivo">Directivo</option>
                    <option value="Gerencial">Gerencial</option>
                    <option value="Supervisión">Supervisión</option>
                    <option value="Operativo">Operativo</option>
                    <option value="Apoyo">Apoyo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Descripción del Puesto
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.proposito_general}
                  onChange={(e) => setFormData({ ...formData, proposito_general: e.target.value })}
                  required
                  className="min-h-[100px]"
                  placeholder="Describa las responsabilidades generales y el propósito del puesto..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="flex items-center gap-2">
                  Estado
                </Label>
                <select
                  id="estado"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.estado_puesto} 
                  onChange={(e) => setFormData({ ...formData, estado_puesto: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </TabsContent>
            
            <TabsContent value="funciones" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="funciones" className="text-lg font-semibold text-foreground mb-2">Funciones y Responsabilidades Principales</Label>
                <Textarea
                  id="funciones"
                  value={formData.principales_responsabilidades}
                  onChange={(e) => setFormData({ ...formData, principales_responsabilidades: e.target.value })}
                  required
                  className="min-h-[200px]"
                  placeholder="Lista las funciones y responsabilidades principales (una por línea)..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada responsabilidad en una línea separada.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="requisitos" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requisitos" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Requisitos
                </Label>
                <Textarea
                  id="requisitos"
                  value={formData.requisitos}
                  onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                  required
                  className="min-h-[150px]"
                  placeholder="Lista los requisitos necesarios para el puesto..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experiencia" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Experiencia Requerida
                  </Label>
                  <Input
                    id="experiencia"
                    value={formData.experiencia_requerida}
                    onChange={(e) => setFormData({ ...formData, experiencia_requerida: e.target.value })}
                    required
                    placeholder="Ej: 3 años en puestos similares"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formacion" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Formación Requerida
                  </Label>
                  <Input
                    id="formacion"
                    value={formData.formacion_requerida}
                    onChange={(e) => setFormData({ ...formData, formacion_requerida: e.target.value })}
                    required
                    placeholder="Ej: Licenciatura en Administración"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="competencias" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="competencias" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Competencias
                </Label>
                <Textarea
                  id="competencias"
                  value={formData.competencias_necesarias}
                  onChange={(e) => setFormData({ ...formData, competencias_necesarias: e.target.value })}
                  required
                  className="min-h-[200px]"
                  placeholder="Lista las competencias requeridas (una por línea)..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada competencia en una línea separada. Ejemplo:
                  <br />
                  Liderazgo
                  <br />
                  Pensamiento analítico
                  <br />
                  Orientación a resultados
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : (puesto ? "Guardar Cambios" : "Crear Puesto")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PuestoModal;
