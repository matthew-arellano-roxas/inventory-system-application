import { RootLayout } from "@/components/layout/RootLayout";
import { LoginPage } from "@/components/auth/LoginPage";
import { AnnouncementPage } from "@/components/pages/AnnouncementPage";
import { Dashboard } from "@/components/pages/Dashboard";
import { InventoryPage } from "@/components/pages/InventoryPage";
import { PointOfSalePage } from "@/components/pages/PointOfSale/PointOfSalePage";
import { TransactionsPage } from "@/components/pages/TransactionsPage";
import { OpexPage } from "@/components/pages/OpexPage";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { ErrorHandler } from "@/components/ErrorHandler";
import { ProductStorePage } from "@/components/pages/PointOfSale/ProductStorePage";
import { ProductSelectionPage } from "@/components/pages/PointOfSale/ProductSelectionPage";
import { CheckoutPage } from "@/components/pages/PointOfSale/CheckoutPage";

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
        path: "/opex",
        element: <OpexPage />,
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
                element: <ProductSelectionPage />,
              },
              {
                path: "checkout",
                element: <CheckoutPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/product-selection",
        element: <ProductStorePage />,
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
