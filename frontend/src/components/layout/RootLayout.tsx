import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AxiosInterceptor } from "../axios/AxiosInterceptor";

export function RootLayout() {
  return (
    <ProtectedRoute>
      <AxiosInterceptor>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <Toaster position="top-center" />
            <Sidebar />
            <main className="flex-1 p-6 space-y-6">
              <Header />
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </AxiosInterceptor>
    </ProtectedRoute>
  );
}
