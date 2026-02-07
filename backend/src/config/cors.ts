import { CorsOptions } from 'cors';
import { serverConfig } from '@/config';

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin || serverConfig.allowedOrigins.includes(origin)) {
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
