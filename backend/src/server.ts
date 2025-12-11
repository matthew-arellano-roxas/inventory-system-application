import 'dotenv/config';
import express from 'express';
import { serverConfig } from '@/config';

const app = express();

// Start server
app.listen(serverConfig.PORT, () => {
  console.log(`Server running at http://localhost:${serverConfig.PORT}`);
});
