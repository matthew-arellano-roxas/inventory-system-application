// components/auth/Callback.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectTo =
        sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">
            Authentication Error
          </h2>
          <p className="text-gray-600">{error.message}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          Completing sign in...
        </h2>
        <p className="mt-2 text-gray-600">Please wait</p>
      </div>
    </div>
  );
}
