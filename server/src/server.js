import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { serverPort } from './config';
import { connectDb, disconnectDb } from './config/db';
import setupRoutes from './routes';

export const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

setupRoutes(app);

export const startServer = async ({ port = serverPort } = {}) => {
  try {
    await connectDb();
    const server = app.listen(port, () => {
      const originalClose = server.close.bind(server);
      server.close = async () => {
        disconnectDb();
        return originalClose();
      };
    });
    return server;
  } catch (error) {
    // eslint-disable-next-line
    return console.error(error);
  }
};
