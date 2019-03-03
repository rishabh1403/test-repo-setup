import { serverBaseUrl, clientBaseUrl } from '../config/index';

const generateUrl = baseUrl => addUrl => `${baseUrl}${addUrl}`;

export const getServerBaseUrlWith = generateUrl(serverBaseUrl);
export const getClientBaseUrlWith = generateUrl(clientBaseUrl);
