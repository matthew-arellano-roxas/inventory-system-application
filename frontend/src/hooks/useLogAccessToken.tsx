import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { environment } from "@/config";

export const useLogAccessToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const run = async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: environment.VITE_AUTH0_AUDIENCE,
        },
      });

      if (!cancelled) {
        // token is a STRING JWT
        console.log("ACCESS TOKEN:", token);
      }
    };

    run().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);
};
