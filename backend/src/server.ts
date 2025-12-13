import 'dotenv/config';
import express from 'express';
import { auth } from 'express-openid-connect';

import { serverConfig } from '@root/config';
import { authConfig } from '@root/config/config.auth';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth0 middleware
app.use(auth(authConfig));

// Start server
app.listen(serverConfig.PORT, () => {
  console.log(`Server running at http://localhost:${serverConfig.PORT}`);
});
