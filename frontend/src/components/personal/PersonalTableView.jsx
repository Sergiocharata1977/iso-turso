import React from 'react';
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

function PersonalTableView({ personal, onView, onEdit, onDelete }) {
  const getInitials = (name) => {
    if (!name) return "SN";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="border rounded-lg w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Puesto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personal.map((person) => (
            <TableRow key={person.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={person.imagen} alt={person.nombre} />
                    <AvatarFallback>{getInitials(person.nombre)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <span className="font-medium">{person.nombre}</span>
                    <span className="text-xs text-muted-foreground">{person.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{person.departamento}</TableCell>
              <TableCell>{person.puesto}</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-200">
                  Activo
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(person)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(person)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(person.id)}
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
