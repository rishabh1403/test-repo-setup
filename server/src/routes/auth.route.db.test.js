import fetch from 'node-fetch';
import { startServer } from '../server';
import User from '../models/user.model';
import { httpMethods, httpStatuses } from '../utils/constants';
import { getServerBaseUrlWith } from '../utils/functions';
import { users, populateUsers, emptyUsers } from '../utils/seed';

let server;
beforeAll(async () => {
  server = await startServer();
});
afterAll(() => server.close());

let User2SignupToken;
beforeEach(async () => {
  [, User2SignupToken] = await populateUsers();
});
afterEach(emptyUsers);

describe('POST /auth/signup', () => {
  it('should create a user', async () => {
    expect.assertions(4);
    const url = getServerBaseUrlWith('/auth/signup');
    const params = {
      name: 'Ravi Example',
      email: 'ravi@example.com',
      password: 'ravi1234!',
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.CREATED_201);
    const user = await User.findOne({ email: params.email });
    expect(user).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.active).toBe(false);
  });

  it('should return validation errors if email invalid', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/signup');
    const params = {
      name: 'Ravi Example',
      email: 'xyz',
      password: 'ravi1234!',
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });

  it('should return validation errors if password invalid', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/signup');
    const params = {
      name: 'Ravi Example',
      email: 'ravi@example.com',
      password: 'ravi1',
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });

  it('should not create user if email in use', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/signup');
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(users[0]),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });
});

describe('POST /auth/signin', () => {
  it('should not signin user if user account is inactive', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/signin');
    const params = {
      email: users[1].email,
      password: users[1].password,
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });
  it('should signin user and return correct auth token', async () => {
    expect.assertions(4);
    const urlActivateUser = getServerBaseUrlWith('/api/me/activateUser');
    await fetch(urlActivateUser, {
      method: httpMethods.put,
      headers: {
        'x-auth': User2SignupToken,
      },
    });
    const url = getServerBaseUrlWith('/auth/signin');
    const params = {
      email: users[1].email,
      password: users[1].password,
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.SUCCESS_OK_200);
    const token = res.headers.get('x-auth');
    expect(token).toBeDefined();
    const user = await User.findByToken(token);
    expect(user).toBeDefined();
    expect(user.email).toEqual(users[1].email);
  });

  it('should reject invalid signin', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/signin');
    const params = {
      email: users[1].email,
      password: `${users[1].password}1`,
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    expect(res.headers.get('x-auth')).toBeNull();
  });
});

describe('POST /auth/forgetPassword', () => {
  it('find user in database and send a mail to reset password', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/forgetPassword');
    const params = {
      email: users[1].email,
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(res.status).toBe(httpStatuses.SUCCESS_OK_200);
    const responseJson = await res.json();
    expect(responseJson.message).toBeDefined();
  });
  it('return error if no user exist with given email', async () => {
    expect.assertions(2);
    const url = getServerBaseUrlWith('/auth/forgetPassword');
    const params = {
      email: 'a@b.com',
    };
    const res = await fetch(url, {
      method: httpMethods.post,
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(res.status).toBe(httpStatuses.BAD_REQUEST_400);
    const responseJson = await res.json();
    expect(responseJson.error).toBeDefined();
  });
});
