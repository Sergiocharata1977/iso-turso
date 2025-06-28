
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  ClipboardCheck,
  Pencil,
  Trash2,
  Calendar,
  Users,
  Target,
  FileText,
  Star
} from "lucide-react";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

function AuditoriaSingle({ auditoria, onBack, onEdit, onDelete }) {
  const getCalificacionColor = (calificacion) => {
    switch (calificacion) {
      case 'Malo':
        return 'bg-red-100 text-red-800';
      case 'Regular':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bueno':
        return 'bg-green-100 text-green-800';
      case 'Muy Bueno':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Planificada':
        return 'bg-blue-100 text-blue-800';
      case 'En Ejecución':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminada':
        return 'bg-green-100 text-green-800';
      case 'Controlada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text(`Auditoría ${auditoria.numero}`, 20, 20);
    
    // Información general
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(auditoria.fecha_programada).toLocaleDateString()}`, 20, 35);
    doc.text(`Responsable: ${auditoria.responsable}`, 20, 45);
    doc.text(`Estado: ${auditoria.estado}`, 20, 55);
    
    // Objetivo
    doc.text('Objetivo:', 20, 70);
    const splitObjective = doc.splitTextToSize(auditoria.objetivo, 170);
    doc.text(splitObjective, 20, 80);
    
    // Procesos evaluados
    doc.text('Procesos Evaluados:', 20, 100);
    const splitProcesos = doc.splitTextToSize(auditoria.procesos_evaluar, 170);
    doc.text(splitProcesos, 20, 110);
    
    // Puntos evaluados
    doc.text('Puntos Evaluados:', 20, 140);
    
    const tableData = auditoria.puntos.map(punto => [
      punto.punto_norma,
      punto.calificacion,
      punto.comentarios
    ]);
    
    doc.autoTable({
      startY: 150,
      head: [['Punto de la Norma', 'Calificación', 'Comentarios']],
      body: tableData,
    });
    
    // Comentarios finales
    const finalCommentsY = doc.previousAutoTable.finalY + 20;
    doc.text('Comentarios Finales:', 20, finalCommentsY);
    const splitComments = doc.splitTextToSize(auditoria.comentarios_finales || '', 170);
    doc.text(splitComments, 20, finalCommentsY + 10);
    
    doc.save(`auditoria_${auditoria.numero}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <header className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Auditoría {auditoria.numero}</h1>
            <p className="text-sm text-gray-500">Detalles y resultados de la auditoría.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(auditoria)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => {
            onDelete(auditoria.id);
            onBack(); // Go back after delete confirmation
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border rounded-lg p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">{auditoria.numero}</h2>
                  <p className="text-sm text-muted-foreground">Responsable: {auditoria.responsable}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(auditoria.estado)}`}>
                  {auditoria.estado}
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(auditoria.fecha_programada).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Equipo: {auditoria.equipo_auditor}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border rounded-lg p-6 space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Objetivo de la Auditoría</h3>
                <p className="text-muted-foreground whitespace-pre-line">{auditoria.objetivo}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Procesos a Evaluar</h3>
                <p className="text-muted-foreground whitespace-pre-line">{auditoria.procesos_evaluar}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Puntos Evaluados</h3>
              <div className="space-y-4">
                {auditoria.puntos.map((punto, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">Punto #{index + 1}: {punto.punto_norma}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCalificacionColor(punto.calificacion)}`}>
                        {punto.calificacion}
                      </span>
                    </div>
                    <div className="mt-2 pl-8">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{punto.comentarios}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Resumen de Calificaciones
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Puntos Evaluados</p>
                  <p className="text-2xl font-bold">{auditoria.puntos.length}</p>
                </div>
                <div className="space-y-2 mt-2">
                  {['Muy Bueno', 'Bueno', 'Regular', 'Malo'].map(cal => {
                    const count = auditoria.puntos.filter(p => p.calificacion === cal).length;
                    if (count === 0) return null;
                    return (
                      <div key={cal} className="flex justify-between items-center text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCalificacionColor(cal)}`}>
                          {cal}
                        </span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2" />
                Comentarios Finales
              </h3>
              <p className="text-muted-foreground whitespace-pre-line text-sm">
                {auditoria.comentarios_finales || "Sin comentarios finales."}
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default AuditoriaSingle;
