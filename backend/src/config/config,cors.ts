import { CorsOptions } from 'cors';
import { serverConfig } from './config.server';

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin || serverConfig.ALLOWED_ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // cache preflight for 24h
};
