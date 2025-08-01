import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, FileDown, Edit, Info, FileText, Tag, Calendar, Hash } from 'lucide-react';
import documentosService from '../../services/documentosService';
import { useTheme } from '../../context/ThemeContext';

const DocumentoSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [documento, setDocumento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocumento = async () => {
      setIsLoading(true);
      try {
        const data = await documentosService.getDocumento(id);
        setDocumento(data);
      } catch (error) {
        toast.error('Error al cargar el documento.');
        navigate('/documentos'); // Redirigir si no se encuentra
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumento();
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!documento) return;
    toast.info(`Descargando ${documento.archivo_nombre}...`);
    try {
      await documentosService.downloadDocumento(documento.id, documento.archivo_nombre);
    } catch (error) {
      toast.error('Error al descargar el archivo.');
    }
  };

  if (isLoading) {
    return <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen flex justify-center items-center`}><p className={`${isDark ? 'text-white' : 'text-gray-800'}`}>Cargando documento...</p></div>;
  }

  if (!documento) {
    return null; // O un mensaje de 'no encontrado' antes de la redirección
  }

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center mb-3">
      <Icon className={`mr-3 h-5 w-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
      <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{label}:</span>
      <span className={`ml-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/documentos" className={`flex items-center ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
            <ArrowLeft className="mr-2" />
            Volver al listado
          </Link>
          <h1 className="text-3xl font-bold mt-2">{documento.titulo}</h1>
        </div>
        <div className="flex space-x-2">
            <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <FileDown className="mr-2 h-5 w-5" />
                Descargar
            </button>
            {/* El botón de editar puede llevar al modal en el futuro */}
            <button onClick={() => {}} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <Edit className="mr-2 h-5 w-5" />
                Editar
            </button>
        </div>
      </div>

      {/* Contenido del Documento */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}">Detalles del Documento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <DetailItem icon={Tag} label="Título" value={documento.titulo} />
                <DetailItem icon={Hash} label="Versión" value={documento.version} />
                <DetailItem icon={Calendar} label="Fecha de Creación" value={new Date(documento.fecha_creacion).toLocaleDateString()} />
                <DetailItem icon={FileText} label="Nombre del Archivo" value={documento.archivo_nombre} />
            </div>
            <div>
                <DetailItem icon={Info} label="Descripción" value={documento.descripcion} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentoSingle;
