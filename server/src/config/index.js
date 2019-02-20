import dotenv from 'dotenv';

dotenv.config();

export const env = process.env.NODE_ENV || 'development';
export const isDev = env === 'development' || env === 'dev';
export const isTest = env === 'testing' || env === 'test';
export const serverPort = isTest ? process.env.TEST_ENV_PORT : process.env.DEV_ENV_PORT;
export const secrets = {
  jwt: process.env.JWT_SECRET,
  jwtExp: process.env.JWT_EXPIRY,
};
export const dbUrl = `${process.env.MONGODB_URI}${isTest ? 'Test' : ''}`;
