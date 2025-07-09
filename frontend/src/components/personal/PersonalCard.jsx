import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Building2,
  Briefcase,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function PersonalCard({ person, onView, onEdit, onDelete }) {
  if (!person || !person.id) {
    return null;
  }

  // Helper to get initials from name
  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : '';
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || 'SN';
  };

  const handleView = () => {
    if (person && person.id) {
      onView(person);
    }
  };

  const handleEdit = () => {
    if (person && person.id) {
      onEdit(person);
    }
  };

  const handleDelete = () => {
    if (person) {
      onDelete(person);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.imagen} alt={`${person.nombres} ${person.apellidos}`} />
              <AvatarFallback>{getInitials(person.nombres, person.apellidos)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
                <CardTitle className="text-base font-semibold">{`${person.nombres || ''} ${person.apellidos || ''}`.trim() || 'Sin nombre'}</CardTitle>
                <p className="text-xs text-muted-foreground">{person.email || 'Sin email'}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          {person.departamento || 'Sin departamento'}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          {person.puesto || 'Sin puesto'}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <Badge className={`${person.estado?.toLowerCase() === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} border hover:bg-opacity-75`}>
          {person.estado || 'Sin estado'}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleView}>
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PersonalCard;
