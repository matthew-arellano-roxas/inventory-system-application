import { auth } from 'express-oauth2-jwt-bearer';

const protectedRoute = auth({
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

export { protectedRoute };
