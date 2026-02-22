import { RootLayout } from "@/components/layout/RootLayout";
import { LoginPage } from "@/components/auth/LoginPage";
import { AnnouncementPage } from "@/components/pages/AnnouncementPage";
import { Dashboard } from "@/components/pages/Dashboard";
import { InventoryPage } from "@/components/pages/InventoryPage";
import { PointOfSalePage } from "@/components/pages/PointOfSale/PointOfSalePage";
import { TransactionsPage } from "@/components/pages/TransactionsPage";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { ErrorHandler } from "@/components/ErrorHandler";
import { ProductFormModal } from "@/components/forms/ProductFormModal";
import { ProductStorePage } from "@/components/pages/PointOfSale/ProductStorePage";
import { ProductSelectionPage } from "@/components/pages/PointOfSale/ProductSelectionPage";

export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorHandler />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/inventory",
        element: <InventoryPage />,
      },
      {
        path: "/announcement",
        element: <AnnouncementPage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
      },
      {
        path: "/pos",
        children: [
          {
            index: true,
            element: <PointOfSalePage />,
          },
          {
            path: ":branchId",
            children: [
              {
                index: true,
                element: <ProductStorePage />,
              },
            ],
          },
        ],
      },
      {
        path: "/product-selection",
        element: <ProductSelectionPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export default routes;
