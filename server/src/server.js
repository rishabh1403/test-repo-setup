import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import http from 'http';
import socket from './gameEngine/socket';
import { serverPort } from './config';
import { connectDb, disconnectDb } from './config/db';
import setupRoutes from './routes';

export const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000/',
//   credentials: true,
// }));
app.disable('x-powered-by');
app.use(cors({ exposedHeaders: 'x-auth' }));
app.use(json());
app.use(urlencoded({ extended: true }));

setupRoutes(app);

export const server = http.createServer(app);
socket.init(server);

export const startServer = async ({ port = serverPort } = {}) => {
  try {
    await connectDb();
    const serverInstance = server.listen(port, () => {
      const originalClose = serverInstance.close.bind(serverInstance);
      serverInstance.close = async () => {
        disconnectDb();
        return originalClose();
      };
    });
    return serverInstance;
  } catch (error) {
    // eslint-disable-next-line
    return console.error(error);
  }
};
