import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  Users, 
  FileText, 
  Award, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Play
} from 'lucide-react';

const WebHome = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: "Sistema de Gestión de Calidad",
      description: "Implementación completa de ISO 9001:2015 con herramientas digitales avanzadas"
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      title: "Gestión de Recursos Humanos",
      description: "Administración integral del personal, capacitaciones y evaluaciones"
    },
    {
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      title: "Documentación Digital",
      description: "Control total de documentos, versiones y cumplimiento normativo"
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-500" />,
      title: "Auditorías y Mejoras",
      description: "Sistema de auditorías internas y gestión de hallazgos"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      title: "Procesos y Productos",
      description: "Diseño y control de procesos, productos y servicios"
    },
    {
      icon: <Building2 className="w-8 h-8 text-emerald-500" />,
      title: "Gestión Organizacional",
      description: "Administración multi-tenant para organizaciones"
    }
  ];

  const stats = [
    { number: "500+", label: "Organizaciones" },
    { number: "50K+", label: "Documentos" },
    { number: "10K+", label: "Auditorías" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 to-emerald-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Elementos decorativos discretos */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-slate-700 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-600 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ISO Flow
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Sistema de Gestión de Calidad integral para organizaciones que buscan la excelencia operativa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-300"
              >
                Solicitar Demo
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                Conocer Más
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Onda sutil entre secciones */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-white -mt-12 transform skew-y-1"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Solución Integral de Calidad
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nuestra plataforma combina tecnología avanzada con las mejores prácticas de gestión de calidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200 group"
              >
                <div className="mb-4 p-3 bg-emerald-50 rounded-full w-fit group-hover:bg-emerald-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900 text-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-slate-700 opacity-10 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Números que Hablan
            </h2>
            <p className="text-xl text-slate-300">
              Confianza de cientos de organizaciones
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-slate-800 p-8 rounded-xl shadow-lg text-center border border-slate-700 hover:border-emerald-500 transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-emerald-50 relative overflow-hidden">
        {/* Onda sutil */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-emerald-50 -mt-12 transform skew-y-1"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Ve ISO Flow en Acción
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Explora nuestro sistema con datos de ejemplo de "Los Señores del Agro", 
              una empresa modelo que demuestra todas las funcionalidades
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto shadow-lg transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Ver Demo Interactivo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Onda sutil */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-50 to-white -mt-12 transform skew-y-1"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              ¿Listo para Transformar tu Organización?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Contáctanos para una demostración personalizada y descubre cómo ISO Flow puede ayudarte
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <Phone className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Teléfono</h3>
              <p className="text-slate-600">+54 11 1234-5678</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <Mail className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600">info@isoflow.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <MapPin className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ubicación</h3>
              <p className="text-slate-600">Buenos Aires, Argentina</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ISO Flow</h3>
            <p className="text-slate-400 mb-6">
              Transformando la gestión de calidad con tecnología de vanguardia
            </p>
            <div className="border-t border-slate-700 pt-6">
              <p className="text-slate-400">
                © 2024 ISO Flow. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebHome; 