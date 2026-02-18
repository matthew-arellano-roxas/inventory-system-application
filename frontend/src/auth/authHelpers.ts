import { useAuth0 } from "@auth0/auth0-react";
import { redirect } from "react-router";
import { api } from "@/api";
import type { HttpMethod } from "@/types/api/api.types";

// Store the Auth0 client instance globally
type Auth0Client = ReturnType<typeof useAuth0>;
let auth0Client: Auth0Client | null = null;

export const setAuth0Client = (client: Auth0Client) => {
  auth0Client = client;
};

export const getAuth0Client = () => {
  return auth0Client;
};

// Get access token for API calls
export const getAccessToken = async () => {
  if (!auth0Client) {
    throw new Error("Auth0 client not initialized");
  }

  try {
    const token = await auth0Client.getAccessTokenSilently();
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

// Protected loader - requires authentication
export const requireAuth = async () => {
  if (!auth0Client) {
    throw redirect("/");
  }

  const isAuthenticated = auth0Client.isAuthenticated;

  if (!isAuthenticated) {
    // Store the intended destination
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    throw redirect("/login");
  }

  // Fix: user is a direct property on auth0Client
  const user = auth0Client.user;
  return { user };
};

// API fetch with authentication
export const authenticatedFetch = async (
  path: string,
  httpMethod: HttpMethod,
  data?: unknown,
) => {
  const token = await getAccessToken();

  const response = await api.request({
    method: httpMethod,
    url: path,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
