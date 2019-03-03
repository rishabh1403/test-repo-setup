import mongoose from 'mongoose';
import User from '../models/user.model';

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

const createUser = async ({ _id, name, email, password }) => {
  const user = await new User({ _id, name, email, password });
  await user.validate();
  await user.hashPassword();
  await user.save();
  return user;
};

export const emptyUsers = async () => {
  await User.deleteMany({});
};

export const populateUsers = async () => {
  await emptyUsers();
  const [user1, user2] = await Promise.all([createUser(users[0]), createUser(users[1])]);
  return Promise.all([user1.generateToken(), user2.generateToken()]);
};

export const emptyCollection = async Model => {
  await Model.deleteMany();
};

export const populateCollection = async (Model, documentEntries) => {
  await emptyCollection(Model);
  return documentEntries.forEach(async entry => {
    const document = await new Model(entry);
    await document.save();
  });
};
