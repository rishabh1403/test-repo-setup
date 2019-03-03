import fetch from 'node-fetch';
import { startServer } from '../server';
import { httpStatuses } from '../utils/constants';
import { getServerBaseUrlWith } from '../utils/functions';
import { users, populateUsers, emptyUsers } from '../utils/seed';

let server;
beforeAll(async () => {
  server = await startServer();
});
afterAll(() => server.close());

let User1SignupToken;
beforeEach(async () => {
  [User1SignupToken] = await populateUsers();
});
afterEach(emptyUsers);

describe(`GET '/api/me'`, () => {
  it('should return user if authenticated', async () => {
    expect.assertions(3);
    const urlValidateUserEmailAccount = getServerBaseUrlWith(`/auth/token/${User1SignupToken}`);
    const resValidateUser = await fetch(urlValidateUserEmailAccount);
    const url = getServerBaseUrlWith('/api/me');
    const res = await fetch(url, {
      headers: {
        'x-auth': resValidateUser.headers.get('x-auth'),
      },
    });
    expect(res.status).toBe(httpStatuses.SUCCESS_OK_200);
    const responseJson = await res.json();
    expect(users[0].name).toEqual(responseJson.user.name);
    expect(users[0].email).toEqual(responseJson.user.email);
  });
  it('should return 401 if not authenticated', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/api/me');
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
