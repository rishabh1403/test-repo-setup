import mongoose from 'mongoose';
import { dbUrl } from './index';

export const connectDb = (url = dbUrl, opts = {}) =>
  mongoose.connect(url, {
    ...opts,
    useCreateIndex: true,
    useNewUrlParser: true,
  });

export const disconnectDb = () => mongoose.connection.close();
