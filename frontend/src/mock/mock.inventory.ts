import type { Product } from "@/types/api/response";

export const MOCK_PRODUCT_INFO: Product[] = [
  {
    id: 1,
    name: "Barako Gold Coffee (1kg)",
    branchId: 101,
    categoryId: 1,
    costPerUnit: 350.0,
    soldBy: "PC",
    sellingPrice: 550.0,
    addedBy: "Admin_Juan",
    createdAt: "2026-01-15T08:30:00Z",
  },
  {
    id: 2,
    name: "Full Cream Milk (1L)",
    branchId: 101,
    categoryId: 2,
    costPerUnit: 75.0,
    soldBy: "PC",
    sellingPrice: 110.0,
    addedBy: "Admin_Juan",
    createdAt: "2026-01-16T09:45:00Z",
  },
  {
    id: 3,
    name: "Caramel Syrup (750ml)",
    branchId: 102,
    categoryId: 3,
    costPerUnit: 280.0,
    soldBy: "PC",
    sellingPrice: 450.0,
    addedBy: "Staff_Maria",
    createdAt: "2026-02-01T14:20:00Z",
  },
  {
    id: 4,
    name: "Paper Cups 8oz (Pack 50s)",
    branchId: 101,
    categoryId: 4,
    costPerUnit: 120.0,
    soldBy: "PC",
    sellingPrice: 200.0,
    addedBy: "Admin_Juan",
    createdAt: "2026-02-10T11:00:00Z",
  },
];


export const MOCK_PRODUCT_REPORTS = [
  {
    id: 1,
    name: "Barako Gold Coffee (1kg)",
    stock: 24,
    opex: 1500.0, // Logistics & Storage
    sales: 11000.0, // (20 units sold)
    profit: 4000.0, // Gross: (550-350) * 20
  },
  {
    id: 2,
    name: "Full Cream Milk (1L)",
    stock: 5, // Low Stock Example
    opex: 400.0,
    sales: 5500.0, // (50 units sold)
    profit: 1750.0, // Gross: (110-75) * 50
  },
  {
    id: 3,
    name: "Caramel Syrup (750ml)",
    stock: 12,
    opex: 2500.0, // High Opex Example (Marketing/Shipping)
    sales: 4500.0, // (10 units sold)
    profit: 1700.0, // Gross: (450-280) * 10
  },
  {
    id: 4,
    name: "Paper Cups 8oz (Pack 50s)",
    stock: 100,
    opex: 200.0,
    sales: 3000.0, // (15 units sold)
    profit: 1200.0, // Gross: (200-120) * 15
  },
];
