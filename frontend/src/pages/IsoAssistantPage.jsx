import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, FileText, Loader2, Bot } from "lucide-react";
import DocumentAnalyzer from '@/components/assistant/DocumentAnalyzer';
import ChatIsoAssistant from '@/components/assistant/ChatIsoAssistant';
import { motion } from "framer-motion";

const IsoAssistantPage = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState("assistant");
  const { toast } = useToast();

  // Inicializar el asistente y el servicio RAG al cargar la página
  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        const response = await fetch('/api/assistant/initialize');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al inicializar el asistente');
        }
        
        toast({
          title: "Asistente ISO inicializado",
          description: "El asistente de normas ISO 9001 está listo para ayudarte",
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "No se pudo inicializar el asistente ISO. Algunas funciones podrían no estar disponibles.",
          variant: "destructive"
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAssistant();
  }, [toast]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Iniciando Asistente ISO...</h2>
        <p className="text-muted-foreground mt-2">
          Estamos preparando la base de conocimiento sobre normas ISO 9001.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">Asistente de Normas ISO</CardTitle>
            <CardDescription>
              Herramientas de inteligencia artificial para asesorarte en la implementación y cumplimiento de normas ISO 9001
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="assistant" className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              Asistente Virtual
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Análisis de Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistant" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Asistente ISO 9001
                  </CardTitle>
                  <CardDescription>
                    Consulta dudas sobre la norma ISO 9001:2015 y recibe orientación personalizada.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChatIsoAssistant />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recursos de ayuda</CardTitle>
                </CardHeader>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Normas disponibles</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>ISO 9001:2015 - Sistema de gestión de calidad</li>
                      <li>ISO 14001:2015 - Gestión ambiental</li>
                      <li>ISO 45001:2018 - Seguridad y salud laboral</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Tutoriales</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Guía de implementación ISO 9001</li>
                      <li>Preparación de auditorías</li>
                      <li>Gestión de no conformidades</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analyzer" className="space-y-4">
            <DocumentAnalyzer />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default IsoAssistantPage;
