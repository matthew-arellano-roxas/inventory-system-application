import type { ProductReportResponse } from "@/types/api/response/report.response";

export const MOCK_PRODUCT_REPORT: ProductReportResponse[] = [
  {
    id: 1,
    productId: 1001,
    productName: "Instant Noodles Pack",
    revenue: 78000,
    profit: 18500,
    stock: 120,
  },
  {
    id: 2,
    productId: 1002,
    productName: "Canned Sardines",
    revenue: 54000,
    profit: 12000,
    stock: 65,
  },
  {
    id: 3,
    productId: 1003,
    productName: "Bottled Water 500ml",
    revenue: 46000,
    profit: 9000,
    stock: 240,
  },
  {
    id: 4,
    productId: 1004,
    productName: "Coffee 3-in-1 Sachet",
    revenue: 62000,
    profit: 15500,
    stock: 90,
  },
  {
    id: 5,
    productId: 1005,
    productName: "Laundry Detergent 1kg",
    revenue: 88000,
    profit: 21000,
    stock: 40,
  },
];
