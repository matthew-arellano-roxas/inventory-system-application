export interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_BACKEND_API_IDENTIFIER: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
