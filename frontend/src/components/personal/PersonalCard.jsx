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
  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return "SN";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.imagen} alt={person.nombre} />
              <AvatarFallback>{getInitials(person.nombre)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
                <CardTitle className="text-base font-semibold">{person.nombre}</CardTitle>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm">
          <Building2 className="h-4 w-4 mr-3 text-violet-500 flex-shrink-0" />
          <span className="text-muted-foreground truncate">
            {person.departamento || "No especificado"}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Briefcase className="h-4 w-4 mr-3 text-orange-500 flex-shrink-0" />
          <span className="text-muted-foreground truncate">
            {person.puesto || "No especificado"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-200">
          Activo
        </Badge>
        <Button variant="outline" size="sm" onClick={() => onView(person)}>
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PersonalCard;
