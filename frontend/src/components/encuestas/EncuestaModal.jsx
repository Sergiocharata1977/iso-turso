import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';

const EncuestaModal = ({ isOpen, onClose, onSave, encuesta }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Borrador');
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    if (encuesta) {
      setTitulo(encuesta.titulo || '');
      setDescripcion(encuesta.descripcion || '');
      setEstado(encuesta.estado || 'Borrador');
      // Asegurarse de que las preguntas se parseen correctamente
      try {
        const parsedPreguntas = typeof encuesta.preguntas === 'string' ? JSON.parse(encuesta.preguntas) : (encuesta.preguntas || []);
        setPreguntas(Array.isArray(parsedPreguntas) ? parsedPreguntas : []);
      } catch (e) {
        console.error("Error al parsear preguntas:", e);
        setPreguntas([]);
      }
    } else {
      setTitulo('');
      setDescripcion('');
      setEstado('Borrador');
      setPreguntas([]);
    }
  }, [encuesta, isOpen]);

  const handleSave = () => {
    onSave({ id: encuesta?.id, titulo, descripcion, estado, preguntas });
  };

  const addPregunta = (tipo = 'texto') => {
    const nuevaPregunta = {
      id: Date.now(),
      texto: '',
      tipo,
      opciones: tipo === 'opcion_multiple' || tipo === 'escala_likert' ? [{ id: Date.now(), texto: '' }] : [],
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const updatePregunta = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const deletePregunta = (index) => {
    setPreguntas(preguntas.filter((_, i) => i !== index));
  };

  const addOpcion = (preguntaIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones.push({ id: Date.now(), texto: '' });
    setPreguntas(nuevasPreguntas);
  };

  const updateOpcion = (preguntaIndex, opcionIndex, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones[opcionIndex].texto = valor;
    setPreguntas(nuevasPreguntas);
  };

  const deleteOpcion = (preguntaIndex, opcionIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones = nuevasPreguntas[preguntaIndex].opciones.filter((_, i) => i !== opcionIndex);
    setPreguntas(nuevasPreguntas);
  };

  const renderPreguntaForm = (pregunta, index) => (
    <div key={pregunta.id} className="p-4 border rounded-lg mb-4 bg-gray-50/50 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-grow space-y-2">
          <Label>Pregunta {index + 1}</Label>
          <Textarea
            placeholder="Ej: ¿Qué tan satisfecho estás con nuestro servicio?"
            value={pregunta.texto}
            onChange={(e) => updatePregunta(index, 'texto', e.target.value)}
            className="bg-white"
          />
        </div>
        <div className="flex items-center ml-4">
          <Select value={pregunta.tipo} onValueChange={(value) => updatePregunta(index, 'tipo', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de pregunta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="texto">Texto Abierto</SelectItem>
              <SelectItem value="opcion_multiple">Opción Múltiple</SelectItem>
              <SelectItem value="escala_numerica">Escala Numérica (0-10)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => deletePregunta(index)} className="ml-2">
            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
          </Button>
        </div>
      </div>

      {(pregunta.tipo === 'opcion_multiple') && (
        <div className="pl-6 space-y-2">
          <Label className="text-sm font-medium text-gray-600">Opciones de respuesta</Label>
          {pregunta.opciones.map((opcion, opcionIndex) => (
            <div key={opcion.id} className="flex items-center gap-2">
              <Input
                placeholder={`Opción ${opcionIndex + 1}`}
                value={opcion.texto}
                onChange={(e) => updateOpcion(index, opcionIndex, e.target.value)}
                className="bg-white"
              />
              <Button variant="ghost" size="icon" onClick={() => deleteOpcion(index, opcionIndex)}>
                <Trash2 className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addOpcion(index)} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />Añadir Opción
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{encuesta?.id ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}</DialogTitle>
          <DialogDescription>Diseña tu encuesta añadiendo y configurando las preguntas a continuación.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="titulo" className="text-right">Título</Label>
            <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="col-span-3" placeholder="Ej: Encuesta de Satisfacción Cliente"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descripcion" className="text-right">Descripción</Label>
            <Textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="col-span-3" placeholder="Breve descripción del propósito de la encuesta"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Borrador">Borrador</SelectItem>
                <SelectItem value="Activa">Activa</SelectItem>
                <SelectItem value="Cerrada">Cerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-grow overflow-hidden flex flex-col mt-4 border-t pt-4">
            <h3 className="font-semibold mb-4 text-lg">Constructor de Preguntas</h3>
            <div className="flex-grow overflow-y-auto pr-4">
                {preguntas.length > 0 ? (
                    preguntas.map(renderPreguntaForm)
                ) : (
                    <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
                        <p>Aún no hay preguntas.</p>
                        <p>Comienza añadiendo una.</p>
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex-shrink-0 pt-4">
            <Button variant="outline" onClick={() => addPregunta('texto')} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Pregunta
            </Button>
        </div>

        <DialogFooter className="flex-shrink-0 pt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Encuesta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EncuestaModal;
