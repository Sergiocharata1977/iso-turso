import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2,
  Minimize2,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { schema, schemaRelations } from '../../lib/schema';

const ERDDiagram = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showColumnDetails, setShowColumnDetails] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const svgRef = useRef(null);

  // Configuración del diagrama
  const config = {
    tableWidth: 200,
    tableHeight: 120,
    columnHeight: 20,
    margin: 50,
    lineColor: '#6b7280',
    primaryKeyColor: '#059669',
    foreignKeyColor: '#dc2626',
    tableBgColor: '#ffffff',
    tableBorderColor: '#e2e8f0',
    textColor: '#1f2937',
    textColorSecondary: '#4b5563'
  };

  // Calcular posiciones de las tablas
  const tablePositions = useMemo(() => {
    const positions = {};
    let currentX = config.margin;
    let currentY = config.margin;
    const maxPerRow = 4;
    let rowCount = 0;

    Object.keys(schema).forEach((tableName, index) => {
      if (index > 0 && index % maxPerRow === 0) {
        rowCount++;
        currentX = config.margin;
        currentY = config.margin + rowCount * (config.tableHeight + config.margin);
      }

      positions[tableName] = {
        x: currentX,
        y: currentY,
        width: config.tableWidth,
        height: config.tableHeight
      };

      currentX += config.tableWidth + config.margin;
    });

    return positions;
  }, [config]);

  // Generar relaciones entre tablas
  const tableRelations = useMemo(() => {
    const relationsList = [];
    
    Object.entries(schemaRelations).forEach(([relationName, relationConfig]) => {
      Object.entries(relationConfig).forEach(([fieldName, relation]) => {
        if (relation.references) {
          const sourceTable = relationName.replace('Relations', '');
          const targetTable = relation.references[0].table;
          
          if (tablePositions[sourceTable] && tablePositions[targetTable]) {
            relationsList.push({
              source: sourceTable,
              target: targetTable,
              type: 'foreign',
              field: fieldName
            });
          }
        }
      });
    });

    return relationsList;
  }, [schemaRelations, tablePositions]);

  // Calcular puntos de conexión para las líneas
  const getConnectionPoints = (sourceTable, targetTable) => {
    const source = tablePositions[sourceTable];
    const target = tablePositions[targetTable];
    
    if (!source || !target) return null;

    // Calcular centro de las tablas
    const sourceCenter = {
      x: source.x + source.width / 2,
      y: source.y + source.height / 2
    };
    
    const targetCenter = {
      x: target.x + target.width / 2,
      y: target.y + target.height / 2
    };

    // Calcular puntos de conexión en los bordes
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    
    let sourcePoint, targetPoint;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Conexión horizontal
      sourcePoint = {
        x: dx > 0 ? source.x + source.width : source.x,
        y: sourceCenter.y
      };
      targetPoint = {
        x: dx > 0 ? target.x : target.x + target.width,
        y: targetCenter.y
      };
    } else {
      // Conexión vertical
      sourcePoint = {
        x: sourceCenter.x,
        y: dy > 0 ? source.y + source.height : source.y
      };
      targetPoint = {
        x: targetCenter.x,
        y: dy > 0 ? target.y : target.y + target.height
      };
    }

    return { sourcePoint, targetPoint };
  };

  // Manejar zoom
  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? Math.min(zoom * 1.2, 3) : Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
  };

  // Manejar pan
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Resetear vista
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Exportar como SVG
  const exportSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'isoflow3-erd-diagram.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Renderizar tabla individual
  const renderTable = (tableName, position) => {
    const table = schema[tableName];
    const isSelected = selectedTable === tableName;
    
    return (
      <g key={tableName}>
        {/* Fondo de la tabla */}
        <rect
          x={position.x}
          y={position.y}
          width={position.width}
          height={position.height}
          fill={isSelected ? '#dbeafe' : config.tableBgColor}
          stroke={isSelected ? '#3b82f6' : config.tableBorderColor}
          strokeWidth={isSelected ? 2 : 1}
          rx={4}
          className="cursor-pointer hover:stroke-blue-500"
          onClick={() => setSelectedTable(tableName)}
        />
        
        {/* Título de la tabla */}
        <rect
          x={position.x}
          y={position.y}
          width={position.width}
          height={25}
          fill="#1e293b"
          rx={4}
        />
        <text
          x={position.x + position.width / 2}
          y={position.y + 17}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          className="pointer-events-none"
        >
          {tableName.charAt(0).toUpperCase() + tableName.slice(1)}
        </text>
        
        {/* Columnas */}
        {(() => {
          const allColumns = Object.entries(table);
          const primaryAndForeignKeys = allColumns.filter(([columnName, column]) => 
            column.primaryKey || column.references !== undefined
          );
          
          // Mostrar siempre las claves principales y foráneas, y columnas adicionales si showColumnDetails está activo
          const columnsToShow = showColumnDetails 
            ? allColumns.slice(0, 4) 
            : primaryAndForeignKeys.slice(0, 3);
          
          return columnsToShow.map(([columnName, column], index) => {
            const isPrimary = column.primaryKey;
            const isForeignKey = column.references !== undefined;
            
            return (
              <g key={columnName}>
                <line
                  x1={position.x + 5}
                  y1={position.y + 30 + index * config.columnHeight}
                  x2={position.x + position.width - 5}
                  y2={position.y + 30 + index * config.columnHeight}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text
                  x={position.x + 8}
                  y={position.y + 25 + index * config.columnHeight}
                  fill={isPrimary ? config.primaryKeyColor : isForeignKey ? config.foreignKeyColor : config.textColor}
                  fontSize="10"
                  fontWeight={isPrimary || isForeignKey ? 'bold' : 'normal'}
                  className="pointer-events-none"
                >
                  {isPrimary && '🔑 '}
                  {isForeignKey && '🔗 '}
                  {columnName}
                </text>
                <text
                  x={position.x + position.width - 8}
                  y={position.y + 25 + index * config.columnHeight}
                  fill={config.textColorSecondary}
                  fontSize="8"
                  textAnchor="end"
                  className="pointer-events-none"
                >
                  {column.dataType}
                </text>
              </g>
            );
          });
        })()}
        
        {/* Indicador de más columnas */}
        {(() => {
          const allColumns = Object.keys(table);
          const primaryAndForeignKeys = Object.entries(table).filter(([columnName, column]) => 
            column.primaryKey || column.references !== undefined
          ).length;
          
          const remainingColumns = showColumnDetails 
            ? allColumns.length - 4 
            : allColumns.length - primaryAndForeignKeys;
          
          return remainingColumns > 0 && (
            <text
              x={position.x + position.width / 2}
              y={position.y + position.height - 5}
              textAnchor="middle"
              fill={config.textColorSecondary}
              fontSize="8"
              className="pointer-events-none"
            >
              +{remainingColumns} más
            </text>
          );
        })()}
      </g>
    );
  };

  // Renderizar relaciones
  const renderRelations = () => {
    return tableRelations.map((relation, index) => {
      const points = getConnectionPoints(relation.source, relation.target);
      if (!points) return null;

      return (
        <g key={`${relation.source}-${relation.target}-${index}`}>
          <line
            x1={points.sourcePoint.x}
            y1={points.sourcePoint.y}
            x2={points.targetPoint.x}
            y2={points.targetPoint.y}
            stroke={config.lineColor}
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
            opacity={0.6}
          />
          {/* Etiqueta de la relación */}
          <text
            x={(points.sourcePoint.x + points.targetPoint.x) / 2}
            y={(points.sourcePoint.y + points.targetPoint.y) / 2 - 5}
            textAnchor="middle"
            fill={config.lineColor}
            fontSize="10"
            className="pointer-events-none"
          >
            {relation.type === 'foreign' ? 'FK' : '1:N'}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Diagrama ERD - ISOFlow3</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnDetails(!showColumnDetails)}
              >
                {showColumnDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="ml-2">Columnas</span>
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportSVG}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Badge variant="secondary">{Math.round(zoom * 100)}%</Badge>
              <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-slate-600">
              {Object.keys(schema).length} tablas • {tableRelations.length} relaciones
            </div>
          </div>

          {/* Contenedor del diagrama */}
          <div 
            className="border border-slate-200 rounded-lg overflow-hidden bg-white"
            style={{ height: '600px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {/* Definiciones de marcadores */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={config.lineColor}
                  />
                </marker>
              </defs>

              {/* Renderizar relaciones primero (para que estén detrás) */}
              {renderRelations()}

              {/* Renderizar tablas */}
              {Object.entries(tablePositions).map(([tableName, position]) =>
                renderTable(tableName, position)
              )}
            </svg>
          </div>

          {/* Leyenda */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold mb-2">Leyenda</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-600 rounded"></div>
                <span>Clave Primaria</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span>Clave Foránea</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-400 rounded"></div>
                <span>Relación</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Seleccionada</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ERDDiagram; 