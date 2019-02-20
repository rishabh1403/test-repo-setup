import fetch from 'node-fetch';
import { startServer } from '../server';
import { users, populateUsers, emptyUsers } from '../utils/seed';
import { httpStatuses } from '../utils/contants';

let server;
let baseURL;
let generateUrl;
beforeAll(async () => {
  server = await startServer({ port: 8798 });
  baseURL = `http://localhost:${server.address().port}`;
  generateUrl = (baseUrl => addUrl => {
    const fullUrl = `${baseUrl}${addUrl}`;
    return fullUrl;
  })(baseURL);
});

let user1Token;
beforeEach(async () => {
  const result = await populateUsers();
  // eslint-disable-next-line prefer-destructuring
  user1Token = result[0];
});
afterAll(() => server.close());

beforeEach(populateUsers);
afterEach(emptyUsers);
describe(`GET '/api/me'`, () => {
  it('should return user if authenticated', async () => {
    expect.assertions(3);
    const url = generateUrl('/api/me');
    const res = await fetch(url, {
      headers: {
        'x-auth': user1Token,
      },
    });
    expect(res.status).toBe(httpStatuses.SUCCESS_OK_200);
    const responseJson = await res.json();
    expect(users[0].name).toEqual(responseJson.user.name);
    expect(users[0].email).toEqual(responseJson.user.email);
  });
  it('should return 401 if not authenticated', async () => {
    expect.assertions(2);
    const url = generateUrl('/api/me');
    const res = await fetch(url, {
      headers: {
        'x-auth': '',
      },
    });
    expect(res.status).toBe(httpStatuses.UNAUTHORIZED_401);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });
});
