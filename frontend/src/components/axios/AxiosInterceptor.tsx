import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { api } from "@/api";
import { environment } from "@/config";

export const AxiosInterceptor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [isInterceptorReady, setIsInterceptorReady] = useState(false);

  useEffect(() => {
    // If Auth0 is still figuring out if the user is logged in, wait.
    if (isLoading) return;

    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently({
            authorizationParams: { audience: environment.VITE_AUTH0_AUDIENCE },
          });
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // CRITICAL: Set this to true only AFTER the interceptor is attached
    Promise.resolve().then(() => {
      setIsInterceptorReady(true);
    });

    return () => api.interceptors.request.eject(requestInterceptor);
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  // If the interceptor isn't ready, don't render the children (the rest of the app)
  if (!isInterceptorReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading Secure Session...</p>
      </div>
    );
  }

  return <>{children}</>;
};
