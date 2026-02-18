import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { setAuth0Client } from "../../auth/authHelpers";

export const AuthWrapper = () => {
  const auth0 = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Store Auth0 client for use in loaders
    setAuth0Client(auth0);

    // Handle redirect after login
    if (auth0.isAuthenticated) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      }
    }
  }, [auth0, navigate]);

  return <Outlet />;
};
