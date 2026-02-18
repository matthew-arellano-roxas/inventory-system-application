// types/permissions.types.ts

// Product permissions
export type ProductPermission =
  | "create:product"
  | "read:product"
  | "update:product"
  | "delete:product";

// Branch permissions
export type BranchPermission =
  | "create:branch"
  | "read:branch"
  | "update:branch"
  | "delete:branch";

// Category permissions
export type CategoryPermission =
  | "create:category"
  | "read:category"
  | "update:category"
  | "delete:category";

// Stock permissions
export type StockPermission =
  | "create:stock"
  | "read:stock"
  | "update:stock"
  | "delete:stock";

// Transaction permissions
export type TransactionPermission =
  | "create:transaction"
  | "read:transaction"
  | "update:transaction"
  | "delete:transaction";

// Announcement permissions
export type AnnouncementPermission =
  | "create:announce"
  | "read:announce"
  | "update:announce"
  | "delete:announce";

// Report permissions
export type ReportPermission =
  | "create:report"
  | "read:report"
  | "update:report"
  | "delete:report";

// Expense permissions
export type ExpensePermission =
  | "create:expense"
  | "read:expense"
  | "update:expense"
  | "delete:expense";

// Combined permission type
export type Permission =
  | ProductPermission
  | BranchPermission
  | CategoryPermission
  | StockPermission
  | TransactionPermission
  | AnnouncementPermission
  | ReportPermission
  | ExpensePermission;

// Role definitions based on your Auth0 setup
export type Role =
  | "cashier" // Can create transactions and read all resources
  | "admin"; // Full CRUD access to all resources

export interface UserWithPermissions {
  id: string;
  email: string;
  name?: string;
  roles?: Role[];
  permissions?: Permission[];
}

// Resource type for grouping permissions
export type Resource =
  | "product"
  | "branch"
  | "category"
  | "stock"
  | "transaction"
  | "announce"
  | "report"
  | "expense";

export type Action = "create" | "read" | "update" | "delete";
