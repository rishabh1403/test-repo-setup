import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { secrets } from '../config';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

// instance methods
// determines what to send back when mongoose model is converted to JSON
UserSchema.methods.toJSON = function toJSON() {
  const user = this;
  const { _id, name, email } = user.toObject();
  return { _id, name, email };
};

// generates Authentication token
UserSchema.methods.generateToken = function generateToken() {
  const user = this;
  const { _id } = user;
  const token = jwt.sign({ _id }, secrets.jwt, { expiresIn: secrets.jwtExp }).toString();
  return token;
};

UserSchema.methods.hashPassword = async function hashPassword() {
  const user = this;
  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  } catch (error) {
    throw new Error('unsuccessful hashing password');
  }
};

// model methods
UserSchema.statics.createUser = async function createUser({ name, email, password }) {
  const User = this;
  const user = await new User({ name, email, password });
  await user.validate();
  await user.hashPassword();
  await user.save();
  return user;
};

UserSchema.statics.findByToken = async function findByToken(token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, secrets.jwt);
  } catch (error) {
    throw new Error('invalid token');
  }
  const { _id } = decoded;
  const user = await User.findOne({ _id });
  if (!user) {
    throw new Error('user not found');
  }
  return user;
};

UserSchema.statics.findByCredentials = async function findByCredentials(email, password) {
  const User = this;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('user not found');
  }
  const res = await bcrypt.compare(password, user.password);
  if (res) {
    return user;
  }
  throw new Error("user password didn't match");
};

const User = mongoose.model('User', UserSchema);

export default User;
