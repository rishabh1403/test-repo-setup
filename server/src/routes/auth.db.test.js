import fetch from 'node-fetch';
import { startServer } from '../server';
import { users, populateUsers, emptyUsers } from '../utils/seed';
import User from '../models/user';
import { httpMethods, httpStatuses } from '../utils/contants';

let server;
let baseURL;
let generateUrl;
beforeAll(async () => {
  server = await startServer({ port: 8788 });
  baseURL = `http://localhost:${server.address().port}`;
  generateUrl = (baseUrl => addUrl => {
    const fullUrl = `${baseUrl}${addUrl}`;
    return fullUrl;
  })(baseURL);
});

afterAll(() => server.close());

beforeEach(populateUsers);
afterEach(emptyUsers);

describe('POST /auth/signup', () => {
  it('should create a user', async () => {
    expect.assertions(6);
    const url = generateUrl('/auth/signup');
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
    expect(res.headers.get('x-auth')).toBeDefined();
    const responseJson = await res.json();
    expect(responseJson.user.name).toBe(params.name);
    expect(responseJson.user.email).toBe(params.email);

    const user = await User.findOne({ email: params.email });
    expect(user).toBeDefined();
    expect(user.password).toBeDefined();
  });

  it('should return validation errors if email invalid', async () => {
    expect.assertions(2);
    const url = generateUrl('/auth/signup');
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
    const url = generateUrl('/auth/signup');
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
    const url = generateUrl('/auth/signup');
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
  it('should signin user and return correct auth token', async () => {
    expect.assertions(4);
    const url = generateUrl('/auth/signin');
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
    const url = generateUrl('/auth/signin');
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
