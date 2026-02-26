export const APP_PERMISSIONS = {
  CREATE_PRODUCT: "create:product",
  READ_PRODUCT: "read:product",
  UPDATE_PRODUCT: "update:product",
  DELETE_PRODUCT: "delete:product",

  CREATE_BRANCH: "create:branch",
  READ_BRANCH: "read:branch",
  UPDATE_BRANCH: "update:branch",
  DELETE_BRANCH: "delete:branch",

  CREATE_CATEGORY: "create:category",
  READ_CATEGORY: "read:category",
  UPDATE_CATEGORY: "update:category",
  DELETE_CATEGORY: "delete:category",

  CREATE_STOCK: "create:stock",
  READ_STOCK: "read:stock",
  UPDATE_STOCK: "update:stock",
  DELETE_STOCK: "delete:stock",

  CREATE_TRANSACTION: "create:transaction",
  READ_TRANSACTION: "read:transaction",
  UPDATE_TRANSACTION: "update:transaction",
  DELETE_TRANSACTION: "delete:transaction",

  CREATE_ANNOUNCE: "create:announce",
  READ_ANNOUNCE: "read:announce",
  UPDATE_ANNOUNCE: "update:announce",
  DELETE_ANNOUNCE: "delete:announce",

  CREATE_REPORT: "create:report",
  READ_REPORT: "read:report",
  UPDATE_REPORT: "update:report",
  DELETE_REPORT: "delete:report",

  CREATE_EXPENSE: "create:expense",
  READ_EXPENSE: "read:expense",
  UPDATE_EXPENSE: "update:expense",
  DELETE_EXPENSE: "delete:expense",
} as const;


export type AppPermission =
  (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];

export const ALL_PERMISSIONS: AppPermission[] = Object.values(APP_PERMISSIONS);

export const ROLE_NAMES = {
  ADMIN: "Admin",
  USER: "User",
} as const;

export type AppRoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

export const ROLE_PERMISSIONS_MAP: Record<AppRoleName, AppPermission[]> = {
  Admin: [...ALL_PERMISSIONS],
  User: [
    APP_PERMISSIONS.CREATE_TRANSACTION,
    APP_PERMISSIONS.READ_BRANCH,
    APP_PERMISSIONS.READ_CATEGORY,
    APP_PERMISSIONS.READ_PRODUCT,
    APP_PERMISSIONS.READ_TRANSACTION,
  ],
};

export const USER_ALLOWED_ROUTES = ["/pos", "/transactions"] as const;

