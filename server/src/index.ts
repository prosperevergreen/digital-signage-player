import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express';
import cors from 'cors';
import http from 'http';

import connectDB from './config/db';
import { PORT } from './common/contants';
import ApiRoutes from './api';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', ApiRoutes);
app.use('*', (_, res) => {
  res.status(404).json({ badRequest: 'The route does not exit' });
});

const server = http.createServer(app);

server.on('close', () => console.log('Server closed.'));

server.on('error', (err) => {
  console.error(err);
  server.close();
});

server.listen(PORT, async () => {
  await connectDB(
    server,
    process.env.MONGO_HOST || 'mongodb://localhost:27017/demo'
  );
  console.log(`⚡[server] Sierver listening at http://localhost:${PORT}`);
});
