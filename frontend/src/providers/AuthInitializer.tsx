import { setAuth0Client } from "@/auth/authHelpers";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const auth0 = useAuth0();
  console.log("Hello");
  useEffect(() => {
    setAuth0Client(auth0);
  }, [auth0]);

  return <>{children}</>;
}
