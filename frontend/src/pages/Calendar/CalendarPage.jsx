import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import eventService from '../../services/eventService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CalendarPage = () => {
  const queryClient = useQueryClient();
  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getEvents,
  });
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventInfo, setNewEventInfo] = useState(null);

  const calendarRef = useRef(null);

  const createMutation = useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (eventData) => eventService.updateEvent(eventData.id, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setIsModalOpen(false);
    },
  });

  const handleDateSelect = (selectInfo) => {
    setNewEventInfo(selectInfo);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      allDay: clickInfo.event.allDay,
      type: clickInfo.event.extendedProps.type,
      description: clickInfo.event.extendedProps.description,
    });
    setNewEventInfo(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = {
      title: formData.get('title'),
      start: formData.get('start'),
      end: formData.get('end') || null,
      allDay: formData.get('allDay') === 'on',
      type: formData.get('type'),
      description: formData.get('description'),
    };

    if (selectedEvent) {
      updateMutation.mutate({ ...eventData, id: selectedEvent.id });
    } else {
      createMutation.mutate(eventData);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteMutation.mutate(selectedEvent.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error al cargar eventos: {error.message}</div>;
  }

  // Mapeamos los eventos para que FullCalendar los entienda
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    allDay: event.all_day,
    extendedProps: {
      description: event.description,
      type: event.type,
    },
    // Asignar colores según el tipo de evento
    className: `event-type-${event.type}`
  }));

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Calendario de Actividades</h1>
        <Card>
            <CardContent className="p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={formattedEvents}
                    locale={esLocale}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    // eventDrop={handleEventDrop} // A implementar en el futuro
                    ref={calendarRef}
                />
            </CardContent>
        </Card>

        {/* Estilos para los eventos (se pueden mover a un CSS global) */}
        <style jsx global>{`
            .event-type-auditoria {
                background-color: #ef4444 !important; /* red-500 */
                border-color: #dc2626 !important; /* red-600 */
            }
            .event-type-mejora {
                background-color: #3b82f6 !important; /* blue-500 */
                border-color: #2563eb !important; /* blue-600 */
            }
            .event-type-planificacion {
                background-color: #f97316 !important; /* orange-500 */
                border-color: #ea580c !important; /* orange-600 */
            }
            .event-type-producto {
                background-color: #10b981 !important; /* emerald-500 */
                border-color: #059669 !important; /* emerald-600 */
            }
             .event-type-otro {
                background-color: #6b7280 !important; /* gray-500 */
                border-color: #4b5563 !important; /* gray-600 */
            }
        `}</style>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveEvent}>
            <DialogHeader>
              <DialogTitle>{selectedEvent ? 'Editar Evento' : 'Crear Evento'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Título</Label>
                <Input id="title" name="title" defaultValue={selectedEvent?.title} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">Inicio</Label>
                <Input id="start" name="start" type="datetime-local" defaultValue={selectedEvent ? selectedEvent.start.substring(0, 16) : (newEventInfo?.startStr + 'T10:00')} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">Fin</Label>
                <Input id="end" name="end" type="datetime-local" defaultValue={selectedEvent?.end ? selectedEvent.end.substring(0, 16) : (newEventInfo?.endStr ? newEventInfo.endStr + 'T11:00' : '')} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Tipo</Label>
                <Select name="type" defaultValue={selectedEvent?.type || 'otro'}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mejora">Mejora</SelectItem>
                    <SelectItem value="planificacion">Planificación</SelectItem>
                    <SelectItem value="auditoria">Auditoría</SelectItem>
                    <SelectItem value="producto">Producto</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="allDay" className="text-right">Todo el día</Label>
                 <Checkbox id="allDay" name="allDay" defaultChecked={selectedEvent?.allDay || newEventInfo?.allDay} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Textarea id="description" name="description" defaultValue={selectedEvent?.description} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <div>
                {selectedEvent && (
                  <Button type="button" variant="destructive" onClick={handleDeleteEvent} disabled={deleteMutation.isLoading}>
                    {deleteMutation.isLoading ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                )}
              </div>
              <div className="flex-grow" />
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
                {createMutation.isLoading || updateMutation.isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
