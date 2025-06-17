import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  X,
  Loader2,
  HelpCircle,
  FileText,
  Upload,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Check
} from "lucide-react";

const IsoAssistant = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [documentContext, setDocumentContext] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [hasCopied, setHasCopied] = useState(false);
  
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message to conversation
    const userMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Convert conversation to history format
    const history = conversation.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      const response = await fetch("/api/assistant/iso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          documentContext: documentContext.trim() || null,
          history: history
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la consulta");
      }

      // Add assistant response to conversation
      setConversation(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: data.reply,
          usage: data.usage,
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Reset query field
      setQuery("");
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

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    toast({
      title: "Copiado al portapapeles",
      description: "El texto se ha copiado correctamente"
    });
  };

  const renderMessageContent = (content) => {
    // Función para formatear el contenido con Markdown simple
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg 
                overflow-hidden flex flex-col ${
                  isExpanded ? "w-4/5 md:w-1/2 lg:w-1/3 h-3/4" : "w-64 h-14"
                }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <HelpCircle size={16} />
          </Avatar>
          <h3 className="text-sm font-medium">Asistente ISO</h3>
        </div>
        <div className="flex items-center gap-1">
          {isExpanded ? (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-primary-foreground hover:text-white"
            >
              <ChevronDown size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-primary-foreground hover:text-white"
            >
              <ChevronUp size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-primary-foreground hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
            <TabsList className="w-full justify-start p-0 bg-muted/30">
              <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
              <TabsTrigger value="context" className="flex-1">Contexto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-grow flex flex-col m-0 p-0">
              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-3 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <h3 className="text-lg font-semibold">Asistente ISO 9001</h3>
                    <p className="text-sm mt-1">
                      Consulta cualquier duda sobre normas ISO, procedimientos de calidad o mejores prácticas.
                    </p>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="relative">
                          {msg.role === "assistant" && (
                            <button 
                              onClick={() => handleCopyToClipboard(msg.content)}
                              className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-foreground"
                              title="Copiar respuesta"
                            >
                              {hasCopied ? (
                                <Check size={14} />
                              ) : (
                                <Clipboard size={14} />
                              )}
                            </button>
                          )}
                          <div className="pr-6">
                            {renderMessageContent(msg.content)}
                          </div>
                        </div>
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Haz una consulta sobre ISO 9001..."
                    disabled={isLoading}
                    className="flex-grow"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !query.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="context" className="flex-grow flex flex-col m-0 p-3">
              <Card className="flex-grow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Contexto documental</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 text-sm text-muted-foreground">
                    Añade contexto específico como extractos de normas, documentos o procedimientos para que el asistente los considere al responder.
                  </div>
                  <Textarea
                    value={documentContext}
                    onChange={(e) => setDocumentContext(e.target.value)}
                    placeholder="Ejemplo: Procedimiento de Auditoría Interna v2.1, sección 4.3: 'Las no conformidades deben clasificarse según...'"
                    className="h-32"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDocumentContext("")}
                    >
                      Limpiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </motion.div>
  );
};

export default IsoAssistant;
