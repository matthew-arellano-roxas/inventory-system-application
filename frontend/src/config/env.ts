/// <reference types="vite/client" />

const env = import.meta.env;

export const environment = {
  VITE_API_URL: env.VITE_API_URL,
  VITE_AUTH0_AUDIENCE: env.VITE_AUTH0_AUDIENCE,
  VITE_AUTH0_DOMAIN: env.VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID: env.VITE_AUTH0_CLIENT_ID,
  VITE_AUTH0_BACKEND_API_IDENTIFIER: env.VITE_AUTH0_BACKEND_API_IDENTIFIER,
} as const;
