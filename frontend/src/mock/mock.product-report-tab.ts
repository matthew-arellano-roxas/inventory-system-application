// Mock data for Product Report Tab
export const MOCK_PRODUCT_REPORTS = [
  {
    id: 1,
    name: "Barako Coffee Beans",
    stock: 45,
    opex: 1200.0, // Shipping/Storage
    sales: 15000.0,
    profit: 6000.0, // Gross Profit
  },
  {
    id: 2,
    name: "Whole Milk (Case)",
    stock: 8, // This will trigger the red "Low Stock" warning
    opex: 500.0,
    sales: 8800.0,
    profit: 2000.0,
  },
  {
    id: 3,
    name: "Paper Cups 8oz",
    stock: 1200,
    opex: 100.0,
    sales: 2500.0,
    profit: 1750.0,
  },
  {
    id: 4,
    name: "Caramel Syrup",
    stock: 15,
    opex: 3000.0, // High opex example
    sales: 5500.0,
    profit: 2300.0, // Net Profit will be negative here: 2300 - 3000
  },
];
