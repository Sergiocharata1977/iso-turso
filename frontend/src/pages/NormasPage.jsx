import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import normasService from '../services/normasService';

const NormasPage = () => {
  const { user } = useAuth();
  const [normas, setNormas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNormas();
  }, []);

  const loadNormas = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔓 Cargando TODAS las normas...');
      const response = await normasService.getAll();
      
      console.log('📋 Respuesta:', response);
      
      if (response.success) {
        setNormas(response.data || []);
        console.log(`✅ ${response.data?.length || 0} normas cargadas`);
      } else {
        setError(response.message || 'Error al cargar normas');
      }
    } catch (err) {
      console.error('❌ Error cargando normas:', err);
      setError('Error al cargar normas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando normas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ISO</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Puntos de Norma</h1>
                <p className="text-gray-600">Sistema Ultra Simple - Acceso Total</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Usuario: {user?.name || 'N/A'} | Org: {user?.organization_name || 'N/A'}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-xl">✅</span>
            <h2 className="font-semibold text-green-900">Sistema Ultra Simple Activo</h2>
          </div>
          <p className="text-green-800 text-sm mt-1">
            Mostrando TODAS las normas del sistema sin restricciones de roles ni organizaciones
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 text-xl">❌</span>
              <h2 className="font-semibold text-red-900">Error</h2>
            </div>
            <p className="text-red-800 text-sm mt-1">{error}</p>
            <button
              onClick={loadNormas}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Normas List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Puntos de Norma ({normas.length})
              </h2>
              <button
                onClick={loadNormas}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>

          {normas.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay normas disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                No se encontraron normas en el sistema
              </p>
              <button
                onClick={loadNormas}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Cargar Normas
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {normas.map((norma, index) => (
                <div key={norma.id || index} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {norma.titulo || 'Sin título'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Código: {norma.codigo || 'N/A'} | 
                        Versión: {norma.version || 'N/A'} | 
                        Tipo: {norma.tipo || 'N/A'}
                      </p>
                      <p className="text-gray-700 mb-2">
                        {norma.descripcion || 'Sin descripción'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {norma.fecha_revision || 'N/A'}</span>
                        <span>👤 {norma.responsable || 'N/A'}</span>
                        <span>🏢 {norma.organization_name || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        norma.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {norma.estado || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NormasPage; 