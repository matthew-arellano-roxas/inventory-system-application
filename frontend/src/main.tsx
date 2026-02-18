import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { environment } from "@/config";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/routes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AxiosInterceptor } from "@/components/axios/AxiosInterceptor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={environment.VITE_AUTH0_DOMAIN}
      clientId={environment.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: environment.VITE_AUTH0_AUDIENCE,
      }}
    >
      <AxiosInterceptor>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </QueryClientProvider>
      </AxiosInterceptor>
    </Auth0Provider>
  </StrictMode>,
);
