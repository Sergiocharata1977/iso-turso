import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  FileText,
  Play,
  RotateCcw,
  Download
} from 'lucide-react';
import { z } from 'zod';
import { schema } from '../../lib/schema';

const SchemaValidator = () => {
  const [selectedTable, setSelectedTable] = useState('users');
  const [testData, setTestData] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Generar esquemas Zod basados en el esquema de Drizzle
  const zodSchemas = useMemo(() => {
    const schemas = {};
    
    Object.entries(schema).forEach(([tableName, table]) => {
      const schemaFields = {};
      
      Object.entries(table).forEach(([columnName, column]) => {
        let fieldSchema = z.any();
        
        // Mapear tipos de Drizzle a Zod
        switch (column.dataType) {
          case 'text':
            fieldSchema = z.string();
            break;
          case 'integer':
            fieldSchema = z.number().int();
            break;
          case 'real':
            fieldSchema = z.number();
            break;
          case 'boolean':
            fieldSchema = z.boolean();
            break;
          default:
            fieldSchema = z.string();
        }
        
        // Aplicar validaciones adicionales
        if (column.notNull) {
          fieldSchema = fieldSchema.min(1, 'Este campo es requerido');
        }
        
        if (column.unique) {
          // Para campos únicos, podríamos agregar validación adicional
          fieldSchema = fieldSchema.refine(val => val && val.length > 0, {
            message: 'Este campo debe ser único'
          });
        }
        
        // Validaciones específicas por tipo de campo
        if (columnName === 'email') {
          fieldSchema = z.string().email('Formato de email inválido');
        }
        
        if (columnName === 'password') {
          fieldSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');
        }
        
        if (columnName.includes('fecha') || columnName.includes('date')) {
          fieldSchema = z.string().refine(val => {
            if (!val) return true; // Permitir vacío si no es required
            return !isNaN(Date.parse(val));
          }, 'Formato de fecha inválido');
        }
        
        if (columnName.includes('telefono') || columnName.includes('phone')) {
          fieldSchema = z.string().refine(val => {
            if (!val) return true;
            return /^[\d\s\-\+\(\)]+$/.test(val);
          }, 'Formato de teléfono inválido');
        }
        
        // Hacer opcional si no es required
        if (!column.notNull) {
          fieldSchema = fieldSchema.optional();
        }
        
        schemaFields[columnName] = fieldSchema;
      });
      
      schemas[tableName] = z.object(schemaFields);
    });
    
    return schemas;
  }, []);

  // Generar datos de ejemplo para la tabla seleccionada
  const generateSampleData = () => {
    const table = schema[selectedTable];
    const sampleData = {};
    
    Object.entries(table).forEach(([columnName, column]) => {
      if (column.primaryKey && column.dataType === 'integer') {
        sampleData[columnName] = Math.floor(Math.random() * 1000) + 1;
      } else if (columnName === 'email') {
        sampleData[columnName] = 'usuario@ejemplo.com';
      } else if (columnName === 'password') {
        sampleData[columnName] = 'password123';
      } else if (columnName === 'name' || columnName === 'nombre') {
        sampleData[columnName] = 'Juan Pérez';
      } else if (columnName === 'organization_id') {
        sampleData[columnName] = 1;
      } else if (columnName.includes('fecha') || columnName.includes('date')) {
        sampleData[columnName] = new Date().toISOString().split('T')[0];
      } else if (column.dataType === 'text') {
        sampleData[columnName] = `Ejemplo ${columnName}`;
      } else if (column.dataType === 'integer') {
        sampleData[columnName] = Math.floor(Math.random() * 100);
      } else if (column.dataType === 'boolean') {
        sampleData[columnName] = true;
      }
    });
    
    setTestData(sampleData);
  };

  // Validar datos
  const validateData = () => {
    setIsValidating(true);
    
    try {
      const tableSchema = zodSchemas[selectedTable];
      const result = tableSchema.safeParse(testData);
      
      setValidationResults({
        success: result.success,
        data: result.success ? result.data : null,
        errors: result.success ? null : result.error.errors
      });
    } catch (error) {
      setValidationResults({
        success: false,
        data: null,
        errors: [{ message: error.message }]
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Limpiar resultados
  const clearResults = () => {
    setValidationResults(null);
    setTestData({});
  };

  // Exportar esquema Zod
  const exportZodSchema = () => {
    const tableSchema = zodSchemas[selectedTable];
    const schemaCode = `// Esquema Zod para ${selectedTable}
import { z } from 'zod';

export const ${selectedTable}Schema = ${tableSchema.toString()};

// Ejemplo de uso:
// const result = ${selectedTable}Schema.safeParse(data);
// if (result.success) {
//   console.log('Datos válidos:', result.data);
// } else {
//   console.log('Errores:', result.error.errors);
// }`;

    const blob = new Blob([schemaCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}-schema.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Obtener información de la tabla seleccionada
  const selectedTableInfo = useMemo(() => {
    const table = schema[selectedTable];
    if (!table) return null;
    
    return {
      name: selectedTable,
      displayName: selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1),
      columns: Object.entries(table).map(([name, column]) => ({
        name,
        type: column.dataType,
        required: column.notNull,
        primary: column.primaryKey,
        unique: column.unique,
        hasDefault: column.hasDefault
      }))
    };
  }, [selectedTable]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Validador de Esquemas</h1>
            <p className="text-slate-600">Valida datos usando esquemas Zod generados automáticamente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Configuración</span>
              <Button variant="outline" size="sm" onClick={exportZodSchema}>
                <Download className="h-4 w-4" />
                <span className="ml-2">Exportar</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selector de tabla */}
            <div>
              <Label htmlFor="table-select">Tabla a validar</Label>
              <select
                id="table-select"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.keys(schema).map(tableName => (
                  <option key={tableName} value={tableName}>
                    {tableName.charAt(0).toUpperCase() + tableName.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Información de la tabla */}
            {selectedTableInfo && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedTableInfo.displayName}</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Columnas:</strong> {selectedTableInfo.columns.length}</p>
                  <p><strong>Requeridas:</strong> {selectedTableInfo.columns.filter(col => col.required).length}</p>
                  <p><strong>Claves primarias:</strong> {selectedTableInfo.columns.filter(col => col.primary).length}</p>
                </div>
              </div>
            )}

            {/* Controles */}
            <div className="flex space-x-2">
              <Button onClick={generateSampleData} variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generar datos de ejemplo
              </Button>
              <Button onClick={clearResults} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel de datos de prueba */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Prueba</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTableInfo && (
              <div className="space-y-3">
                {selectedTableInfo.columns.map(column => (
                  <div key={column.name}>
                    <Label htmlFor={column.name} className="flex items-center space-x-2">
                      <span>{column.name}</span>
                      <div className="flex space-x-1">
                        {column.required && (
                          <Badge variant="destructive" className="text-xs">Requerido</Badge>
                        )}
                        {column.primary && (
                          <Badge variant="default" className="text-xs">PK</Badge>
                        )}
                        {column.unique && (
                          <Badge variant="secondary" className="text-xs">Único</Badge>
                        )}
                      </div>
                    </Label>
                    {column.type === 'text' && column.name.includes('descripcion') ? (
                      <Textarea
                        id={column.name}
                        value={testData[column.name] || ''}
                        onChange={(e) => setTestData(prev => ({
                          ...prev,
                          [column.name]: e.target.value
                        }))}
                        placeholder={`Ingrese ${column.name}...`}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={column.name}
                        type={column.name === 'email' ? 'email' : 
                              column.name.includes('fecha') ? 'date' : 
                              column.type === 'integer' ? 'number' : 'text'}
                        value={testData[column.name] || ''}
                        onChange={(e) => setTestData(prev => ({
                          ...prev,
                          [column.name]: e.target.value
                        }))}
                        placeholder={`Ingrese ${column.name}...`}
                        className="mt-1"
                      />
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Tipo: {column.type} {column.hasDefault && '(con valor por defecto)'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={validateData} 
              disabled={isValidating}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isValidating ? 'Validando...' : 'Validar Datos'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resultados de validación */}
      {validationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {validationResults.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>
                {validationResults.success ? 'Validación Exitosa' : 'Errores de Validación'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResults.success ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Datos válidos</h4>
                  <p className="text-green-700">
                    Los datos cumplen con el esquema de validación para la tabla {selectedTable}.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Datos procesados:</h4>
                  <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(validationResults.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Errores encontrados</h4>
                  <p className="text-red-700">
                    Se encontraron {validationResults.errors.length} error(es) en la validación.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Detalles de errores:</h4>
                  <div className="space-y-2">
                    {validationResults.errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-800">
                              Campo: {error.path.join('.')}
                            </p>
                            <p className="text-red-700 text-sm">{error.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información del esquema Zod */}
      <Card>
        <CardHeader>
          <CardTitle>Esquema Zod Generado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto">
            <pre className="text-sm">
              {zodSchemas[selectedTable]?.toString() || 'Esquema no disponible'}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemaValidator; 