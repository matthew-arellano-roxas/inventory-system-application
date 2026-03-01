import { useAuth0 } from "@auth0/auth0-react";
import { environment } from "@/config";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { ROLE_PERMISSIONS_MAP } from "@/auth/access-policy";

type AuthUserLike = Record<string, unknown> | null | undefined;

export type AccessClaims = {
  roles: string[];
  permissions: string[];
};

type AccessSnapshot = AccessClaims & {
  isAdmin: boolean;
  isUser: boolean;
  canAccessPos: boolean;
  canAccessTransactions: boolean;
};

const POS_REQUIRED_PERMISSIONS = [
  "create:transaction",
  "read:branch",
  "read:category",
  "read:product",
] as const;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function toStringArray(value: unknown): string[] {
  if (typeof value === "string") return [value];

  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (typeof entry === "string") return [entry];

    if (
      entry &&
      typeof entry === "object" &&
      "name" in entry &&
      typeof (entry as { name?: unknown }).name === "string"
    ) {
      return [(entry as { name: string }).name];
    }

    return [];
  });
}

function uniqueNormalized(values: string[]): string[] {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

function getPolicyPermissionsForRole(role: string): string[] {
  const normalizedRole = normalize(role);

  if (normalizedRole === "admin") {
    return ROLE_PERMISSIONS_MAP.Admin.map(normalize);
  }

  if (normalizedRole === "user") {
    return ROLE_PERMISSIONS_MAP.User.map(normalize);
  }

  return [];
}

function inferRolesFromPermissions(permissions: string[]): string[] {
  const normalizedPermissions = new Set(permissions.map(normalize));
  const hasAll = (required: string[]) =>
    required.every((permission) => normalizedPermissions.has(permission));

  const inferred: string[] = [];
  const adminPerms = ROLE_PERMISSIONS_MAP.Admin.map(normalize);
  const userPerms = ROLE_PERMISSIONS_MAP.User.map(normalize);

  if (hasAll(adminPerms)) {
    inferred.push("admin");
    return inferred;
  }

  if (hasAll(userPerms)) {
    inferred.push("user");
  }

  return inferred;
}

function collectUserClaims(
  user: AuthUserLike,
  namespace: string,
  keys: string[],
): string[] {
  const record = (user ?? {}) as Record<string, unknown>;

  const suffixMatches = Object.keys(record).filter((key) => {
    const lower = key.toLowerCase();
    return keys.some((claimKey) => lower.endsWith(`/${claimKey.toLowerCase()}`));
  });

  const values = [
    ...keys.flatMap((key) => toStringArray(record[key])),
    ...keys.flatMap((key) => toStringArray(record[`${namespace}/${key}`])),
    ...suffixMatches.flatMap((key) => toStringArray(record[key])),
  ];

  return uniqueNormalized(values);
}

function mergeClaims(...claims: AccessClaims[]): AccessClaims {
  return {
    roles: uniqueNormalized(claims.flatMap((claim) => claim.roles)),
    permissions: uniqueNormalized(claims.flatMap((claim) => claim.permissions)),
  };
}

export function extractAccessClaims(
  user: AuthUserLike,
  namespace = environment.VITE_AUTH0_BACKEND_API_IDENTIFIER,
): AccessClaims {
  return {
    roles: collectUserClaims(user, namespace, ["role", "roles"]),
    permissions: collectUserClaims(user, namespace, ["permission", "permissions"]),
  };
}

export function extractAccessClaimsFromSources(
  sources: AuthUserLike[],
  namespace = environment.VITE_AUTH0_BACKEND_API_IDENTIFIER,
): AccessClaims {
  return mergeClaims(...sources.map((source) => extractAccessClaims(source, namespace)));
}

export function hasRole(user: AuthUserLike, role: string): boolean {
  const claims = extractAccessClaims(user);
  const target = normalize(role);

  if (claims.roles.includes(target)) return true;

  // Fallback: infer role from permission set when role claims are not present.
  const policyPermissions = getPolicyPermissionsForRole(target);
  if (policyPermissions.length === 0) return false;

  const permissionSet = new Set(claims.permissions);
  return policyPermissions.every((permission) => permissionSet.has(permission));
}

export function hasAnyRole(user: AuthUserLike, rolesToCheck: string[]): boolean {
  return rolesToCheck.some((role) => hasRole(user, role));
}

export function hasPermission(user: AuthUserLike, permission: string): boolean {
  const { permissions } = extractAccessClaims(user);
  return permissions.includes(normalize(permission));
}

export function hasAnyPermission(
  user: AuthUserLike,
  permissionsToCheck: string[],
): boolean {
  const { permissions } = extractAccessClaims(user);
  const wanted = new Set(permissionsToCheck.map(normalize));
  return permissions.some((permission) => wanted.has(permission));
}

export function hasAllPermissions(
  user: AuthUserLike,
  permissionsToCheck: string[],
): boolean {
  const { permissions } = extractAccessClaims(user);
  const permissionSet = new Set(permissions);
  return permissionsToCheck.every((permission) => permissionSet.has(normalize(permission)));
}

export function isAdmin(user: AuthUserLike): boolean {
  return hasRole(user, "admin");
}

export function isUserRole(user: AuthUserLike): boolean {
  return hasRole(user, "user");
}

export function canAccessPos(user: AuthUserLike): boolean {
  if (isAdmin(user) || isUserRole(user)) return true;
  return hasAllPermissions(user, [...POS_REQUIRED_PERMISSIONS]);
}

export function canAccessTransactions(user: AuthUserLike): boolean {
  if (isAdmin(user) || isUserRole(user)) return true;
  return hasPermission(user, "read:transaction");
}

export function getAccessSnapshot(user: AuthUserLike): AccessSnapshot {
  const claims = extractAccessClaims(user);
  return getAccessSnapshotFromClaims(claims);
}

export function getAccessSnapshotFromClaims(claims: AccessClaims): AccessSnapshot {
  const inferredRoles = inferRolesFromPermissions(claims.permissions);
  const effectiveRoles = uniqueNormalized([...claims.roles, ...inferredRoles]);
  const admin = effectiveRoles.includes("admin");
  const userRole = effectiveRoles.includes("user");
  const permissionSet = new Set(claims.permissions);
  const posByPermission = POS_REQUIRED_PERMISSIONS.every((p) => permissionSet.has(p));
  const txByPermission = permissionSet.has("read:transaction");

  return {
    ...claims,
    roles: effectiveRoles,
    isAdmin: admin,
    isUser: userRole,
    canAccessPos: admin || userRole || posByPermission,
    canAccessTransactions: admin || userRole || txByPermission,
  };
}

export function useAccessControl() {
  const auth0 = useAuth0();
  const {
    user: auth0User,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
  } = auth0;
  const user = auth0User as AuthUserLike;
  const [decodedAccessToken, setDecodedAccessToken] = useState<AuthUserLike>(null);
  const [isTokenClaimsLoading, setIsTokenClaimsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isLoading || !isAuthenticated) {
      setDecodedAccessToken(null);
      setIsTokenClaimsLoading(false);
      return;
    }

    setIsTokenClaimsLoading(true);

    void (async () => {
      try {
        const token = await getAccessTokenSilently();
        const payload = jwtDecode<Record<string, unknown>>(token);
        if (isMounted) {
          setDecodedAccessToken(payload);
        }
      } catch {
        if (isMounted) {
          setDecodedAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsTokenClaimsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
  ]);

  const mergedClaims = extractAccessClaimsFromSources([user, decodedAccessToken]);
  const accessFromMergedClaims = getAccessSnapshotFromClaims(mergedClaims);

  return {
    ...auth0,
    user,
    decodedAccessToken,
    isAccessControlLoading: isLoading || isTokenClaimsLoading,
    access: accessFromMergedClaims,
    claims: {
      roles: accessFromMergedClaims.roles,
      permissions: accessFromMergedClaims.permissions,
    },
    isAdmin: accessFromMergedClaims.isAdmin,
    isUserRole: accessFromMergedClaims.isUser,
    canAccessPos: accessFromMergedClaims.canAccessPos,
    canAccessTransactions: accessFromMergedClaims.canAccessTransactions,
    hasRole: (role: string) => accessFromMergedClaims.roles.includes(normalize(role)),
    hasAnyRole: (roles: string[]) => {
      const wanted = new Set(roles.map(normalize));
      return accessFromMergedClaims.roles.some((role) => wanted.has(role));
    },
    hasPermission: (permission: string) =>
      accessFromMergedClaims.permissions.includes(normalize(permission)),
    hasAnyPermission: (permissions: string[]) => {
      const wanted = new Set(permissions.map(normalize));
      return accessFromMergedClaims.permissions.some((permission) =>
        wanted.has(permission),
      );
    },
    hasAllPermissions: (permissions: string[]) => {
      const current = new Set(accessFromMergedClaims.permissions);
      return permissions.every((permission) => current.has(normalize(permission)));
    },
  };
}
