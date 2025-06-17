import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const DocumentAnalyzer = () => {
  const [documentText, setDocumentText] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const { toast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setDocumentFile(file);
    setDocumentName(file.name);
    
    // Para documentos de texto, podemos mostrar su contenido
    if (file.type === 'text/plain') {
      try {
        const text = await file.text();
        setDocumentText(text);
      } catch (error) {
        console.error("Error al leer el archivo:", error);
      }
    } else {
      setDocumentText(`Archivo seleccionado: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    }
  };

  const analyzeDocument = async () => {
    if (!documentText && !documentFile) {
      toast({
        title: "Error",
        description: "Por favor, ingrese texto o seleccione un archivo para analizar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let formData = new FormData();
      
      if (documentFile) {
        formData.append("document", documentFile);
      } else {
        // Si no hay archivo, enviamos el texto como un archivo temporal
        const blob = new Blob([documentText], { type: 'text/plain' });
        formData.append("document", blob, "documento.txt");
      }
      formData.append("documentName", documentName || "Documento sin nombre");

      // Llamada al backend para analizar el documento
      const response = await fetch("/api/assistant/analyze-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al analizar el documento");
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast({
        title: "Análisis completado",
        description: "El documento ha sido analizado correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDocumentText('');
    setDocumentFile(null);
    setDocumentName('');
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Análisis de Documentos ISO</CardTitle>
          <CardDescription>
            Sube un documento o ingresa texto para analizar su cumplimiento con las normas ISO 9001
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!analysisResult ? (
            <>
              <div className="border rounded-lg p-4 space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Nombre del documento (opcional)
                </label>
                <Input 
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Ejemplo: Procedimiento de Auditoría Interna"
                  disabled={isLoading}
                />
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Ingrese el contenido del documento a analizar
                </label>
                <Textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Pegue aquí el texto del documento que desea analizar..."
                  className="min-h-[200px]"
                  disabled={isLoading}
                />
              </div>

              <div className="border rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">
                  O suba un archivo (PDF, Word, texto)
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.md"
                    disabled={isLoading}
                    className="max-w-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Limpiar selección"
                    disabled={isLoading || (!documentFile && !documentText)}
                    onClick={resetForm}
                  >
                    <AlertCircle size={16} />
                  </Button>
                </div>
                {documentFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Archivo seleccionado: {documentFile.name} ({Math.round(documentFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  disabled={isLoading || (!documentFile && !documentText)}
                >
                  Limpiar
                </Button>
                <Button onClick={analyzeDocument} disabled={isLoading || (!documentText && !documentFile)}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Analizar Documento
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Análisis Completado</h3>
                </div>
                <p className="text-sm mb-2">
                  Documento: {analysisResult.documentName || "Documento sin nombre"}
                </p>
                <hr className="my-2" />
                <div className="space-y-4 mt-4">
                  <h4 className="font-medium">Aspectos destacados:</h4>
                  <div className="bg-card p-3 rounded border">
                    <pre className="whitespace-pre-wrap text-sm">
                      {analysisResult.highlights || "No se encontraron aspectos destacados."}
                    </pre>
                  </div>
                  
                  <h4 className="font-medium">Cumplimiento con ISO 9001:</h4>
                  <div className="bg-card p-3 rounded border">
                    <pre className="whitespace-pre-wrap text-sm">
                      {analysisResult.compliance || "No se pudo evaluar el cumplimiento."}
                    </pre>
                  </div>
                  
                  <h4 className="font-medium">Recomendaciones:</h4>
                  <div className="bg-card p-3 rounded border">
                    <pre className="whitespace-pre-wrap text-sm">
                      {analysisResult.recommendations || "No hay recomendaciones disponibles."}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Nuevo Análisis
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalyzer;
