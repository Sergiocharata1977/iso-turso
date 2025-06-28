import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Ticket,
  AlertCircle
} from "lucide-react";
import TicketModal from "./TicketModal";
import TicketSingle from "./TicketSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import ticketsService from "@/services/ticketsService";

function TicketsListing() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);

  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ticketsService.getAll();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({ title: "Error de Carga", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleSave = async (ticketData) => {
    try {
      if (ticketToEdit) {
        await ticketsService.update(ticketToEdit.id, ticketData);
        toast({ title: "Ticket actualizado", className: "bg-teal-500 text-white" });
      } else {
        await ticketsService.create(ticketData);
        toast({ title: "Ticket Creado", className: "bg-teal-500 text-white" });
      }
      await loadTickets();
      setIsModalOpen(false);
      setTicketToEdit(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      toast({ title: 'Error al guardar', variant: 'destructive' });
    }
  };

  const handleAddComment = async (ticketId, commentData) => {
    const ticket = tickets.find(t => t.id === ticketId);
    const updatedTicket = { ...ticket, comentarios: [...(ticket.comentarios || []), commentData] };
    try {
      const saved = await ticketsService.update(ticketId, updatedTicket);
      setTickets(tickets.map(t => (t.id === ticketId ? saved : t)));
      setSelectedTicket(saved);
      toast({ title: 'Comentario añadido', className: 'bg-teal-500 text-white' });
    } catch (error) {
      toast({ title: 'Error al comentar', variant: 'destructive' });
    }
  };

  const handleEdit = (ticket) => {
    setTicketToEdit(ticket);
    setIsModalOpen(true);
    setIsDetailView(false);
  };

  const handleDeleteRequest = (id) => {
    setTicketToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      await ticketsService.remove(ticketToDelete);
      toast({ title: "Ticket eliminado" });
      await loadTickets();
      setDeleteDialogOpen(false);
      if (selectedTicket?.id === ticketToDelete) {
        setIsDetailView(false);
        setSelectedTicket(null);
      }
    } catch (error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailView(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Abierto': 'bg-blue-100 text-blue-800',
      'En Proceso': 'bg-yellow-100 text-yellow-800',
      'Resuelto': 'bg-green-100 text-green-800',
      'Cerrado': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredTickets = tickets.filter(t =>
    t.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isDetailView && selectedTicket) {
    return <TicketSingle ticket={selectedTicket} onBack={() => setIsDetailView(false)} onEdit={handleEdit} onDelete={() => handleDeleteRequest(selectedTicket.id)} onAddComment={handleAddComment} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tickets</h1>
            <p className="text-sm text-gray-500">Crea, gestiona y sigue el estado de los tickets.</p>
          </div>
          <Button onClick={() => { setTicketToEdit(null); setIsModalOpen(true); }} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Buscar por título o descripción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-5 shadow border animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div><div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div><div className="h-12 bg-gray-200 rounded mb-4"></div><div className="h-5 bg-gray-200 rounded w-1/2"></div></div>
              ))}
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <motion.div key={ticket.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg border shadow-sm hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.estado)}`}>{ticket.estado}</span>
                      <span className="text-xs text-gray-500">{new Date(ticket.fechaCreacion).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-teal-600 mb-2 line-clamp-2">{ticket.titulo}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{ticket.descripcion}</p>
                    <div className="flex items-center text-sm text-gray-500"><AlertCircle className="h-4 w-4 mr-2" />Prioridad: <span className="font-semibold ml-1 text-gray-700">{ticket.prioridad}</span></div>
                  </div>
                  <div className="bg-gray-50 p-3 flex justify-between items-center rounded-b-lg border-t">
                    <div className="text-xs text-gray-500"><p>Solicitante: <span className="font-semibold text-gray-700">{ticket.solicitante}</span></p><p>Asignado: <span className="font-semibold text-gray-700">{ticket.asignado || "N/A"}</span></p></div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(ticket); }} className="text-gray-500 hover:text-teal-600 hover:bg-teal-100"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteRequest(ticket.id); }} className="text-gray-500 hover:text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 col-span-full bg-white rounded-lg border">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-800">No se encontraron tickets</h3>
              <p className="mt-2 text-sm text-gray-500">Intenta ajustar tu búsqueda o crea un nuevo ticket.</p>
            </div>
          )}
        </div>
      </main>

      <TicketModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setTicketToEdit(null); }} onSave={handleSave} ticket={ticketToEdit} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará permanentemente el ticket.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TicketsListing;
