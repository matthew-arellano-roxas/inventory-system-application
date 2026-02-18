// utils/permissions.ts
import { getAuth0Client } from "@/auth/authHelpers";
import type {
  Permission,
  Role,
  UserWithPermissions,
  Resource,
  Action,
} from "@/types/permission.types";
import { ROLE_PERMISSIONS } from "@/auth/roles";
import { environment } from "@/config";

// Get user from Auth0
export const getCurrentUser = (): UserWithPermissions | null => {
  const auth0 = getAuth0Client();

  if (!auth0?.user) {
    return null;
  }

  // Auth0 stores custom claims - adjust namespace based on your config
  const namespace = environment.VITE_AUTH0_BACKEND_API_IDENTIFIER;

  return {
    id: auth0.user.sub || "",
    email: auth0.user.email || "",
    name: auth0.user.name,
    roles: (auth0.user[`${namespace}/roles`] as Role[]) || [],
    permissions: (auth0.user.permissions as Permission[]) || [],
  };
};

// Check if user has a specific permission
export const hasPermission = (permission: Permission): boolean => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  // Check direct permissions from Auth0 (these take precedence)
  if (user.permissions?.includes(permission)) {
    return true;
  }

  // Check role-based permissions
  if (user.roles) {
    for (const role of user.roles) {
      if (ROLE_PERMISSIONS[role]?.includes(permission)) {
        return true;
      }
    }
  }

  return false;
};

// Check if user can perform an action on a resource
export const canAccess = (resource: Resource, action: Action): boolean => {
  const permission = `${action}:${resource}` as Permission;
  return hasPermission(permission);
};

// Check if user has ANY of the provided permissions
export const hasAnyPermission = (permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(permission));
};

// Check if user has ALL of the provided permissions
export const hasAllPermissions = (permissions: Permission[]): boolean => {
  return permissions.every((permission) => hasPermission(permission));
};

// Check if user has a specific role
export const hasRole = (role: Role): boolean => {
  const user = getCurrentUser();
  return user?.roles?.includes(role) || false;
};

// Check if user has ANY of the provided roles
export const hasAnyRole = (roles: Role[]): boolean => {
  return roles.some((role) => hasRole(role));
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole("admin");
};

// Check if user is cashier
export const isCashier = (): boolean => {
  return hasRole("cashier");
};

// Check if user has full CRUD access to a resource
export const hasFullAccess = (resource: Resource): boolean => {
  return hasAllPermissions([
    `create:${resource}` as Permission,
    `read:${resource}` as Permission,
    `update:${resource}` as Permission,
    `delete:${resource}` as Permission,
  ]);
};

// Check if user has read-only access to a resource
export const hasReadOnlyAccess = (resource: Resource): boolean => {
  const permission = `read:${resource}` as Permission;
  return (
    hasPermission(permission) &&
    !hasPermission(`update:${resource}` as Permission) &&
    !hasPermission(`delete:${resource}` as Permission)
  );
};

// Check if user can only read (useful for cashier role)
export const canOnlyRead = (resource: Resource): boolean => {
  return hasReadOnlyAccess(resource);
};

// Protected loader with permission check
export const requirePermission = async (
  permission: Permission | Permission[],
): Promise<UserWithPermissions> => {
  const user = getCurrentUser();

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasRequiredPermission = hasAllPermissions(permissions);

  if (!hasRequiredPermission) {
    throw new Response("Forbidden - Insufficient permissions", {
      status: 403,
      statusText: `Required permissions: ${permissions.join(", ")}`,
    });
  }

  return user;
};

// Protected loader with role check
export const requireRole = async (
  role: Role | Role[],
): Promise<UserWithPermissions> => {
  const user = getCurrentUser();

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const roles = Array.isArray(role) ? role : [role];
  const hasRequiredRole = hasAnyRole(roles);

  if (!hasRequiredRole) {
    throw new Response("Forbidden - Insufficient role", {
      status: 403,
      statusText: `Required roles: ${roles.join(", ")}`,
    });
  }

  return user;
};

// Protected loader with resource action check
export const requireAccess = async (
  resource: Resource,
  action: Action,
): Promise<UserWithPermissions> => {
  const permission = `${action}:${resource}` as Permission;
  return requirePermission(permission);
};

// Require admin role
export const requireAdmin = async (): Promise<UserWithPermissions> => {
  return requireRole("admin");
};
