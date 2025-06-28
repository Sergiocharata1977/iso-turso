import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MessageSquare,
  User,
  Calendar,
  Clock,
  Tag,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Paperclip
} from "lucide-react";

function TicketSingle({ ticket, onBack, onEdit, onDelete, onAddComment }) {
  if (!ticket) return null;
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(ticket.id, {
        // In a real app, user should be from auth context
        usuario: 'Usuario Actual', 
        texto: newComment,
        fecha: new Date().toISOString(),
      });
      setNewComment("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Abierto': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resuelto': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cerrado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'Urgente': return { icon: <AlertTriangle className="h-6 w-6 text-red-500" />, color: 'text-red-500' };
      case 'Alta': return { icon: <AlertTriangle className="h-6 w-6 text-orange-500" />, color: 'text-orange-500' };
      case 'Media': return { icon: <Info className="h-6 w-6 text-yellow-500" />, color: 'text-yellow-500' };
      case 'Baja': return { icon: <CheckCircle className="h-6 w-6 text-green-500" />, color: 'text-green-500' };
      default: return { icon: <Info className="h-6 w-6 text-gray-500" />, color: 'text-gray-500' };
    }
  };
  
  const priorityInfo = getPriorityInfo(ticket.prioridad);

  const InfoCard = ({ icon, title, value, className }) => (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50 min-h-full">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 truncate" title={ticket.titulo}>{ticket.titulo}</h1>
              <p className="text-sm text-gray-500">Ticket #{ticket.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(ticket)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(ticket.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <InfoCard icon={<Tag className="h-5 w-5 text-gray-400"/>} title="Estado" value={<Badge className={`${getStatusBadgeStyle(ticket.estado)}`}>{ticket.estado}</Badge>} />
            <InfoCard icon={priorityInfo.icon} title="Prioridad" value={<span className={priorityInfo.color}>{ticket.prioridad}</span>} />
            <InfoCard icon={<User className="h-5 w-5 text-gray-400"/>} title="Solicitante" value={ticket.solicitante} />
            <InfoCard icon={<User className="h-5 w-5 text-gray-400"/>} title="Asignado a" value={ticket.asignado || 'N/A'} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del Ticket</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 whitespace-pre-wrap">
                  {ticket.descripcion}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-teal-600" />
                    Comentarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticket.comentarios && ticket.comentarios.length > 0 ? (
                    <div className="space-y-4">
                      {ticket.comentarios.slice().reverse().map((comentario, index) => (
                        <div key={`comment-${index}`} className="flex items-start space-x-3">
                          <div className="bg-gray-100 rounded-full p-2">
                            <User className="h-5 w-5 text-gray-500"/>
                          </div>
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-semibold text-gray-800">{comentario.usuario}</p>
                              <p className="text-xs text-gray-500">{formatDate(comentario.fecha)}</p>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{comentario.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No hay comentarios aún.</p>
                  )}
                </CardContent>
                <Separator />
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-2">Añadir un comentario</h4>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="bg-white focus:border-teal-500"
                  />
                  <Button onClick={handleCommentSubmit} size="sm" className="mt-2 bg-teal-600 hover:bg-teal-700 text-white">
                    Enviar Comentario
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Categoría</span>
                    <span className="font-medium text-gray-800">{ticket.categoria}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Creado</span>
                    <span className="font-medium text-gray-800">{formatDate(ticket.fechaCreacion)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cerrado</span>
                    <span className="font-medium text-gray-800">{ticket.fechaCierre ? formatDate(ticket.fechaCierre) : 'Pendiente'}</span>
                  </div>
                </CardContent>
              </Card>
              
              {ticket.archivos && ticket.archivos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Paperclip className="mr-2 h-5 w-5 text-teal-600" />
                      Archivos Adjuntos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                    {ticket.archivos.map((archivo, index) => (
                      <div key={`file-${index}`} className="bg-gray-50 border p-2 rounded-lg flex items-center justify-between text-sm">
                        <div className="flex items-center truncate">
                          <FileText className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0"/>
                          <span className="text-gray-800 font-medium truncate" title={archivo.nombre}>{archivo.nombre}</span>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs ml-2">Descargar</Button>
                      </div>
                    ))}
                   </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default TicketSingle;
