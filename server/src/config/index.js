import dotenv from 'dotenv';

dotenv.config();

export const env = process.env.NODE_ENV || 'development';
export const isDev = env === 'development' || env === 'dev';
export const isTest = env === 'testing' || env === 'test';
export const isProd = !isTest && !isDev;
const getServerPort = () => {
  if (isTest) {
    return process.env.TEST_ENV_PORT;
  }
  if (isDev) {
    return process.env.DEV_ENV_PORT;
  }
  return process.env.PORT;
};
export const serverPort = getServerPort();
export const secrets = {
  jwt: process.env.JWT_SECRET,
  jwtExp: process.env.JWT_EXPIRY,
};
export const serverBaseUrl = `http://localhost:${serverPort}`;
export const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
export const dbUrl = `${process.env.MONGODB_URI}${isTest ? 'test' : ''}`;
export const sendGridApiKey = process.env.SEND_GRID_API_KEY;
