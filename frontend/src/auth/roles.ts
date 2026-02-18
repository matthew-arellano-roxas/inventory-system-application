import type { Permission, Role } from "@/types/permission.types";

export const ROLE_HIERARCHY: Record<Role, number> = {
  cashier: 1,
  admin: 2,
};

// Default permissions per role (based on your Auth0 configuration)
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  cashier: [
    // Can create transactions
    "create:transaction",
    // Can read all resources
    "read:announce",
    "read:branch",
    "read:category",
    "read:expense",
    "read:product",
    "read:report",
    "read:stock",
    "read:transaction",
  ],
  admin: [
    // Full CRUD on all resources
    "create:announce",
    "create:branch",
    "create:category",
    "create:expense",
    "create:product",
    "create:report",
    "create:stock",
    "create:transaction",

    "read:announce",
    "read:branch",
    "read:category",
    "read:expense",
    "read:product",
    "read:report",
    "read:stock",
    "read:transaction",

    "update:announce",
    "update:branch",
    "update:category",
    "update:expense",
    "update:product",
    "update:report",
    "update:stock",
    "update:transaction",

    "delete:announce",
    "delete:branch",
    "delete:category",
    "delete:expense",
    "delete:product",
    "delete:report",
    "delete:stock",
    "delete:transaction",
  ],
};
