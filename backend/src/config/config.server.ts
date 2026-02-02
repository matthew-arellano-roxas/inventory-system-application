export const serverConfig = {
  PORT: process.env.PORT || 4000,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
};
