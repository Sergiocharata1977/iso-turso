import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Shield, 
  Users, 
  FileText, 
  Award, 
  Building2,
  TrendingUp,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

const WebFeatures = () => {
  const mainFeatures = [
    {
      icon: <Shield className="w-12 h-12 text-emerald-500" />,
      title: "Sistema de Gestión de Calidad ISO 9001",
      description: "Implementación completa y certificación de sistemas de calidad según estándares internacionales",
      benefits: [
        "Cumplimiento normativo automático",
        "Auditorías internas programadas",
        "Gestión de no conformidades",
        "Indicadores de calidad en tiempo real"
      ]
    },
    {
      icon: <Users className="w-12 h-12 text-emerald-500" />,
      title: "Gestión Integral de Recursos Humanos",
      description: "Administración completa del capital humano con enfoque en desarrollo y competencias",
      benefits: [
        "Gestión de personal y puestos",
        "Planificación de capacitaciones",
        "Evaluaciones de competencias",
        "Seguimiento de formación continua"
      ]
    },
    {
      icon: <FileText className="w-12 h-12 text-emerald-500" />,
      title: "Documentación Digital Inteligente",
      description: "Control total de documentos con versionado automático y trazabilidad completa",
      benefits: [
        "Control de versiones automático",
        "Aprobaciones digitales",
        "Búsqueda inteligente",
        "Cumplimiento normativo"
      ]
    },
    {
      icon: <Award className="w-12 h-12 text-emerald-500" />,
      title: "Auditorías y Mejora Continua",
      description: "Sistema de auditorías internas y externas con gestión de hallazgos y acciones correctivas",
      benefits: [
        "Programación automática de auditorías",
        "Gestión de hallazgos",
        "Acciones correctivas y preventivas",
        "Seguimiento de mejoras"
      ]
    },
    {
      icon: <Building2 className="w-12 h-12 text-emerald-500" />,
      title: "Gestión de Procesos y Productos",
      description: "Diseño, control y mejora de procesos y productos con indicadores de rendimiento",
      benefits: [
        "Mapeo de procesos",
        "Indicadores de rendimiento",
        "Control de productos",
        "Optimización continua"
      ]
    },
    {
      icon: <Globe className="w-12 h-12 text-emerald-500" />,
      title: "Multi-Organización",
      description: "Soporte para múltiples organizaciones con separación completa de datos",
      benefits: [
        "Separación de datos por organización",
        "Roles y permisos granulares",
        "Configuración personalizada",
        "Escalabilidad empresarial"
      ]
    }
  ];

  const technicalFeatures = [
    {
      icon: <Zap className="w-8 h-8 text-emerald-500" />,
      title: "Rendimiento Optimizado",
      description: "Aplicación web rápida y responsiva con carga instantánea"
    },
    {
      icon: <Lock className="w-8 h-8 text-emerald-500" />,
      title: "Seguridad Avanzada",
      description: "Autenticación JWT, encriptación de datos y auditoría completa"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      title: "Escalabilidad",
      description: "Arquitectura preparada para crecimiento empresarial"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-emerald-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-6"
          >
            Características del Sistema
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-200 max-w-3xl mx-auto"
          >
            Descubre todas las funcionalidades que hacen de nuestro sistema la solución ideal para tu organización
          </motion.p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:w-1/2">
                  <div className="mb-6">{feature.icon}</div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-slate-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <div className="aspect-video bg-gradient-to-br from-emerald-50 to-slate-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-slate-600 font-medium">
                          Demo Interactivo
                        </p>
                        <p className="text-sm text-slate-500">
                          {feature.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Construido con las mejores tecnologías para garantizar rendimiento, seguridad y escalabilidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              ¿Listo para Comenzar?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Solicita una demostración personalizada y descubre cómo ISO Flow puede transformar tu organización
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Solicitar Demo Gratuita
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebFeatures; 