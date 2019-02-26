import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import User from '../../models/user';

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();

export const users = [
  {
    _id: userOneId,
    name: 'Andrew Linfoot',
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString(),
      },
    ],
  },
  {
    _id: userTwoId,
    name: 'Ayush Jaiswal',
    email: 'ayush@jaiswal.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString(),
      },
    ],
  },
];

export const populateUsers = async () => {
  await User.deleteMany({});
  const user1 = await new User(users[0]);
  await user1.hashPassword();
  await user1.save();
  const token1 = user1.generateAuthToken();
  const user2 = await new User(users[1]);
  await user2.hashPassword();
  await user2.save();
  const token2 = user2.generateAuthToken();
  return [token1, token2];
};

export const emptyUsers = async () => {
  await User.deleteMany({});
};
