import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Info, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ChatIsoAssistant = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col w-full h-[600px] rounded-lg border bg-slate-50 dark:bg-slate-900 p-4">
      <div className="mx-auto max-w-3xl w-full h-full flex flex-col justify-center items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900">
          <Bot className="h-10 w-10 text-blue-600 dark:text-blue-300" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Asistente Especializado ISO 9001
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center px-4 max-w-xl">
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Servicio temporalmente no disponible</span>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            El Asistente ISO 9001 ha sido implementado con éxito en la interfaz de usuario, 
            pero actualmente está pausado debido a la necesidad de crédito en la API de OpenAI.
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Todas las funcionalidades tanto de backend como frontend están listas para ser activadas
            cuando se disponga de una clave API con crédito suficiente.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}>
          <Button 
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            {showDetails ? "Ocultar detalles técnicos" : "Ver detalles técnicos"}
          </Button>
        </motion.div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg text-left w-full max-w-2xl overflow-y-auto mt-4 border"
          >
            <h3 className="text-lg font-medium mb-3">Implementación técnica:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Backend: Sistema de conversaciones con contexto implementado en <code>isoAssistantService.js</code></li>
              <li>API: Endpoints para crear conversaciones y enviar mensajes configurados en <code>index.js</code></li>
              <li>Frontend: Componente de chat con soporte para Markdown y animaciones</li>
              <li>Integración: Analizador de documentos listo para verificar conformidad con ISO 9001</li>
              <li>Modelo: Configurado para usar <code>gpt-4o</code> cuando esté disponible</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-sm">
              <p className="font-medium">Próximos pasos:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Añadir crédito a la cuenta de OpenAI</li>
                <li>Actualizar la clave API en el archivo .env</li>
                <li>Reiniciar el servidor backend</li>
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatIsoAssistant;
