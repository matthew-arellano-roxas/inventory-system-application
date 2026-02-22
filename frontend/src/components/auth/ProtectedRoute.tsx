// components/auth/protectedRoute.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  // 1. Critical: Wait for the SDK to finish checking the session
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
