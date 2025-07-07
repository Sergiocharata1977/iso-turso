import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definición de permisos por rol (simplificado)
const ROLE_PERMISSIONS = {
  super_admin: {
    level: 'global',
    permissions: ['*'] // Acceso total
  },
  admin: {
    level: 'organization',
    permissions: ['*'] // Acceso total a su organización
  },
  manager: {
    level: 'department',
    permissions: ['*'] // Acceso total a su organización (por ahora)
  },
  employee: {
    level: 'personal',
    permissions: ['*'] // Acceso total a su organización (por ahora)
  }
};

const usePermissionsStore = create(
  persist(
    (set, get) => ({
      // Estado
      userRole: null,
      organizationId: null,
      organizationName: null,
      
      // Acciones
      setUserPermissions: (role, plan, maxUsers, organizationId, organizationName) => {
        set({ 
          userRole: role, 
          organizationId: organizationId,
          organizationName: organizationName
        });
      },
      
      clearPermissions: () => {
        set({ 
          userRole: null, 
          organizationId: null,
          organizationName: null
        });
      },
      
      // Verificar si el usuario puede acceder a un módulo (simplificado)
      canAccessModule: (moduleName) => {
        const { userRole } = get();
        
        if (!userRole) return false;
        
        // Por ahora todos los usuarios autenticados pueden acceder a todos los módulos
        return true;
      },
      
      // Verificar si el usuario puede realizar una acción específica
      canPerformAction: (moduleName, action = 'read') => {
        const { userRole } = get();
        
        if (!userRole) return false;
        
        // Super admin tiene acceso total
        if (userRole === 'super_admin') return true;
        
        // Por ahora todos los usuarios pueden hacer todas las acciones en su organización
        return true;
      },
      
      // Obtener información del usuario
      getUserInfo: () => {
        const { userRole, organizationId, organizationName } = get();
        return {
          role: userRole,
          organizationId,
          organizationName
        };
      },
      
      // Verificar si el usuario pertenece a una organización
      hasOrganization: () => {
        const { organizationId } = get();
        return !!organizationId;
      },
      
      // Verificar si es super admin
      isSuperAdmin: () => {
        const { userRole } = get();
        return userRole === 'super_admin';
      },
      
      // Verificar si es admin de organización
      isOrgAdmin: () => {
        const { userRole } = get();
        return userRole === 'admin';
      }
    }),
    {
      name: 'permissions-store',
      partialize: (state) => ({
        userRole: state.userRole,
        organizationId: state.organizationId,
        organizationName: state.organizationName
      })
    }
  )
);

export default usePermissionsStore; 