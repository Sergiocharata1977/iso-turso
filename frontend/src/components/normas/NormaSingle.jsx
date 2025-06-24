import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, User, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import normasService from '../../services/normasService';
import { toast } from 'react-toastify';

const NormaSingle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [norma, setNorma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNorma = async () => {
      try {
        setLoading(true);
        const data = await normasService.getNormaById(id);
        setNorma(data);
      } catch (err) {
        console.error('Error al cargar norma:', err);
        setError('Error al cargar los datos de la norma');
        toast.error('Error al cargar la norma');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNorma();
    }
  }, [id]);

  const handleEdit = () => {
    // Aquí podrías abrir un modal de edición o navegar a una página de edición
    toast.info('Función de edición pendiente de implementar');
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta norma?')) {
      try {
        await normasService.deleteNorma(id);
        toast.success('Norma eliminada correctamente');
        navigate('/normas');
      } catch (err) {
        console.error('Error al eliminar norma:', err);
        toast.error('Error al eliminar la norma');
      }
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Vigente':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Obsoleta':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'En Revisión':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Vigente':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Obsoleta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En Revisión':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !norma) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto p-6">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar la norma</h2>
            <p className="text-slate-400 mb-4">{error || 'No se pudo encontrar la norma solicitada'}</p>
            <button
              onClick={() => navigate('/normas')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Normas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/normas')}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg mr-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {norma.codigo} - {norma.titulo || norma.nombre}
                </h1>
                <p className="text-slate-400">Detalle del punto de norma</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-teal-400" />
                Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Código</label>
                  <p className="text-white bg-slate-700 px-3 py-2 rounded border border-slate-600">
                    {norma.codigo}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Versión</label>
                  <p className="text-white bg-slate-700 px-3 py-2 rounded border border-slate-600">
                    {norma.version || 'No especificada'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                <p className="text-white bg-slate-700 px-3 py-2 rounded border border-slate-600">
                  {norma.titulo || norma.nombre}
                </p>
              </div>

              {norma.descripcion && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                  <p className="text-white bg-slate-700 px-3 py-2 rounded border border-slate-600 min-h-[100px]">
                    {norma.descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Observaciones */}
            {norma.observaciones && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-teal-400" />
                  Observaciones
                </h2>
                <p className="text-slate-300 bg-slate-700 px-3 py-2 rounded border border-slate-600">
                  {norma.observaciones}
                </p>
              </div>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estado */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Estado</h3>
              <div className="flex items-center space-x-3">
                {getStatusIcon(norma.estado)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(norma.estado)}`}>
                  {norma.estado || 'No especificado'}
                </span>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Información Adicional</h3>
              
              <div className="space-y-4">
                {norma.responsable && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-400">Responsable</p>
                      <p className="text-white font-medium">{norma.responsable}</p>
                    </div>
                  </div>
                )}

                {norma.fecha_vigencia && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-400">Fecha de Vigencia</p>
                      <p className="text-white font-medium">
                        {new Date(norma.fecha_vigencia).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}

                {norma.created_at && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-400">Fecha de Creación</p>
                      <p className="text-white font-medium">
                        {new Date(norma.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormaSingle;
