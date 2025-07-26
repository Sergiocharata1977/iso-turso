import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

function PersonalTableView({ personal, onEdit, onDelete }) {
  const navigate = useNavigate();

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : '';
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || 'SN';
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'inactivo':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const handleRowClick = (person) => {
    console.log('📋 PersonalTableView handleRowClick llamado con:', person);
    console.log('🎯 Navegando a:', `/personal/${person.id}`);
    navigate(`/personal/${person.id}`);
  };

  return (
    <div className="border rounded-lg w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Personal</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Puesto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personal.map((person) => (
            <TableRow 
              key={person.id} 
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => handleRowClick(person)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={person.imagen} alt={`${person.nombres} ${person.apellidos}`} />
                    <AvatarFallback>{getInitials(person.nombres, person.apellidos)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <span className="font-medium">{person.nombres} {person.apellidos}</span>
                    <span className="text-xs text-muted-foreground">{person.email || 'Sin email'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{person.departamento || 'No asignado'}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{person.puesto || 'No asignado'}</span>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(person.estado)}>
                  {person.estado || 'Activo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRowClick(person); }}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(person); }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); onDelete(person.id); }}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PersonalTableView;
