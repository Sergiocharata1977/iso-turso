import React from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SoportePage = () => {
  const faqItems = [
    {
      question: "¿Cómo puedo cambiar mi contraseña?",
      answer: "Ve a tu perfil de usuario en la esquina superior derecha, selecciona 'Configuración' y luego 'Cambiar Contraseña'. Ingresa tu contraseña actual y la nueva contraseña."
    },
    {
      question: "¿Cómo agrego un nuevo empleado al sistema?",
      answer: "Ve al módulo 'Recursos Humanos' → 'Personal' → 'Agregar Nuevo'. Completa todos los campos obligatorios y asigna el departamento y puesto correspondiente."
    },
    {
      question: "¿Cómo programo una auditoría?",
      answer: "Accede al módulo 'Sistema de Gestión' → 'Auditorías' → 'Nueva Auditoría'. Completa los datos del auditor, fechas y alcance de la auditoría."
    },
    {
      question: "¿Cómo registro un hallazgo?",
      answer: "Ve al módulo 'Mejora Continua' → 'Hallazgos' → 'Nuevo Hallazgo'. Describe el hallazgo, asigna responsable y define las acciones necesarias."
    },
    {
      question: "¿Cómo genero un reporte?",
      answer: "Cada módulo tiene su sección de reportes. Ve al módulo deseado y busca la opción 'Reportes' o 'Exportar'. Selecciona el período y formato deseado."
    },
    {
      question: "¿Cómo configuro notificaciones?",
      answer: "Ve a 'Configuración' → 'Notificaciones'. Aquí puedes activar/desactivar alertas por email y configurar recordatorios automáticos."
    },
    {
      question: "¿Qué hago si olvidé mi contraseña?",
      answer: "En la pantalla de login, haz clic en '¿Olvidaste tu contraseña?'. Ingresa tu email y recibirás un enlace para restablecer tu contraseña."
    },
    {
      question: "¿Cómo cambio el idioma del sistema?",
      answer: "Ve a 'Configuración' → 'Preferencias' → 'Idioma'. Selecciona el idioma deseado y guarda los cambios."
    }
  ];

  const problemasComunes = [
    {
      problema: "No puedo acceder al sistema",
      solucion: "Verifica tu conexión a internet y credenciales. Si persiste, contacta soporte técnico.",
      severidad: "alta",
      icon: XCircle
    },
    {
      problema: "Los datos no se guardan",
      solucion: "Verifica que todos los campos obligatorios estén completos. Revisa la conexión a internet.",
      severidad: "media",
      icon: AlertCircle
    },
    {
      problema: "El sistema está lento",
      solucion: "Cierra otras pestañas del navegador. Si persiste, contacta al administrador del sistema.",
      severidad: "baja",
      icon: AlertCircle
    },
    {
      problema: "No veo todos los módulos",
      solucion: "Verifica que tu rol tenga los permisos necesarios. Contacta al administrador si necesitas acceso adicional.",
      severidad: "media",
      icon: AlertCircle
    }
  ];

  const canalesSoporte = [
    {
      titulo: "Soporte Técnico",
      descripcion: "Para problemas técnicos y configuración",
      icon: Phone,
      contacto: "+1 (555) 123-4567",
      horario: "Lun-Vie 8:00-18:00",
      color: "bg-blue-500"
    },
    {
      titulo: "Soporte por Email",
      descripcion: "Para consultas generales y reportes",
      icon: Mail,
      contacto: "soporte@isoflow3.com",
      horario: "Respuesta en 24h",
      color: "bg-green-500"
    },
    {
      titulo: "Chat en Vivo",
      descripcion: "Soporte inmediato para usuarios premium",
      icon: MessageCircle,
      contacto: "Disponible en el sistema",
      horario: "Lun-Vie 9:00-17:00",
      color: "bg-purple-500"
    }
  ];

  const getSeveridadColor = (severidad) => {
    switch (severidad) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Soporte y Ayuda</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encuentra respuestas a tus preguntas, soluciones a problemas comunes y 
          diferentes formas de contactar nuestro equipo de soporte.
        </p>
      </div>

      {/* Canales de Soporte */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">📞 Canales de Soporte</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canalesSoporte.map((canal, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${canal.color} rounded-lg flex items-center justify-center`}>
                    <canal.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {canal.titulo}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{canal.descripcion}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Contacto:</span>
                    <span className="text-gray-600">{canal.contacto}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Horario:</span>
                    <span className="text-gray-600">{canal.horario}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Contactar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Problemas Comunes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">🔧 Problemas Comunes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problemasComunes.map((problema, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    {problema.problema}
                  </CardTitle>
                  <Badge className={getSeveridadColor(problema.severidad)}>
                    {problema.severidad.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">{problema.solucion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">❓ Preguntas Frecuentes</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Guías de Solución */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Guías de Solución</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Primeros Pasos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Configurar perfil de usuario</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Revisar permisos y roles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Explorar módulos disponibles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Configurar notificaciones</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Configuración Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Personalizar dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Configurar reportes automáticos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Establecer alertas personalizadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Configurar integraciones</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Horarios de Soporte</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Lunes a Viernes: 8:00 AM - 6:00 PM</li>
              <li>• Sábados: 9:00 AM - 2:00 PM</li>
              <li>• Emergencias: 24/7 por email</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Tiempos de Respuesta</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Críticas: 2 horas</li>
              <li>• Altas: 4 horas</li>
              <li>• Medias: 24 horas</li>
              <li>• Bajas: 48 horas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoportePage; 