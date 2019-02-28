import mongoose from 'mongoose';
import User from '../models/user';

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();

export const users = [
  {
    _id: userOneId,
    name: 'Andrew Linfoot',
    email: 'andrew@example.com',
    password: 'userOnePass',
  },
  {
    _id: userTwoId,
    name: 'Ayush Jaiswal',
    email: 'ayush@jaiswal.com',
    password: 'userTwoPass',
  },
];

export const emptyUsers = async () => {
  await User.deleteMany({});
};

export const populateUsers = async () => {
  await emptyUsers();
  const [user1, user2] = await Promise.all([User.createUser(users[0]), User.createUser(users[1])]);
  return Promise.all([user1.generateToken(), user2.generateToken()]);
};
