import fetch from 'node-fetch';
import { startServer } from '../server';
import { httpMethods, httpStatuses } from '../utils/constants';
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
  // Todo: what if user inactive
  it('should return user if authenticated', async () => {
    expect.assertions(3);
    const url = getServerBaseUrlWith('/api/me');
    const res = await fetch(url, {
      headers: {
        'x-auth': User1SignupToken,
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

describe('PUT /api/me/resetPassword', () => {
  it('should reset password if password valid', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith(`/api/me/resetPassword`);
    const body = {
      password: '1234ABCD',
    };
    const res = await fetch(url, {
      method: httpMethods.put,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-auth': User1SignupToken,
      },
    });
    expect(res.status).toBe(httpStatuses.SUCCESS_OK_200);
    const responseJson = await res.json();
    expect(responseJson.message).toBeDefined();
  });
  it('should not reset password if password invalid', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith(`/api/me/resetPassword`);
    const body = {
      password: '1234A',
    };
    const res = await fetch(url, {
      method: httpMethods.put,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-auth': User1SignupToken,
      },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });
});
