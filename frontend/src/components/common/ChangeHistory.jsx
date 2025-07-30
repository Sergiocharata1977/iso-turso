import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  User, 
  Edit, 
  Plus, 
  Trash2, 
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ChangeHistory = ({ changes = [], title = "Historial de Cambios" }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'status_change':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'status_change':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'create':
        return 'Creado';
      case 'update':
        return 'Actualizado';
      case 'delete':
        return 'Eliminado';
      case 'status_change':
        return 'Estado cambiado';
      default:
        return 'Modificado';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  if (changes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay cambios registrados</p>
            <p className="text-sm">Los cambios aparecerán aquí cuando se realicen modificaciones</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {title} ({changes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {changes.map((change, index) => (
            <div
              key={change.id || index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500"
            >
              {/* Icono de acción */}
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(change.action)}
              </div>

              {/* Contenido principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getActionColor(change.action)}>
                    {getActionText(change.action)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(change.timestamp)}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Usuario que realizó el cambio */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {change.user_name || 'Usuario del sistema'}
                    </span>
                  </div>

                  {/* Descripción del cambio */}
                  <p className="text-sm text-gray-700">
                    {change.description}
                  </p>

                  {/* Detalles adicionales */}
                  {change.details && (
                    <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                      <strong>Detalles:</strong> {change.details}
                    </div>
                  )}

                  {/* Campos modificados */}
                  {change.changed_fields && change.changed_fields.length > 0 && (
                    <div className="text-xs">
                      <strong className="text-gray-600">Campos modificados:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {change.changed_fields.map((field, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp exacto */}
              <div className="flex-shrink-0 text-xs text-gray-400 text-right">
                {formatDate(change.timestamp)}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-800">Resumen de actividad</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total cambios:</span>
              <span className="font-medium ml-1">{changes.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Último cambio:</span>
              <span className="font-medium ml-1">
                {changes.length > 0 ? formatTimeAgo(changes[0].timestamp) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Creado:</span>
              <span className="font-medium ml-1">
                {changes.length > 0 ? formatDate(changes[changes.length - 1].timestamp) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Usuarios activos:</span>
              <span className="font-medium ml-1">
                {new Set(changes.map(c => c.user_name)).size}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeHistory; 