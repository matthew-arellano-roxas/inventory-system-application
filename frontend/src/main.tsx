import { environment } from "@/config";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/routes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  createRoot(rootElement).render(
    <Auth0Provider
      domain={environment.VITE_AUTH0_DOMAIN}
      clientId={environment.VITE_AUTH0_CLIENT_ID}
      useRefreshTokensFallback
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: environment.VITE_AUTH0_AUDIENCE,
        scope: environment.VITE_AUTH0_SCOPE,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryClientProvider>
    </Auth0Provider>,
  );
} catch (error) {
  console.error("Application bootstrap failed", error);
  rootElement.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f8fafc;font-family:system-ui,sans-serif;">
      <div style="max-width:480px;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 1px 2px rgba(15,23,42,.08);">
        <p style="margin:0;color:#64748b;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Startup Error</p>
        <h1 style="margin:8px 0 0;color:#0f172a;font-size:22px;line-height:1.3;">The application failed to start.</h1>
        <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">Reload this page. If the issue continues, the browser may need the updated deployment assets.</p>
      </div>
    </div>
  `;
}
